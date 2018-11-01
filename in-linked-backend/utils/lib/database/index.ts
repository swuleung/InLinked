/**
 * Main connection handler for interfacing with our MySQL database
 */
import { AsyncResultCallback, retry } from 'async';

import * as knex from 'knex';
import * as path from 'path';
import config from '../../../config/config';

export class MySql {
    private connection: knex | undefined;
    private retryDbConnectionPromise: Promise<knex> | undefined; // Query builder for our application

    /**
     * Establishses conncetion to our database and retries if it fails
     * 
     * @returns {Promise<knex>} - promise containing our knex object
     * @memberof MySql
     */
    public async getConnection(): Promise<knex> {
        if (!this.connection) {
            this.connection = await this.retryDbConnection(); // Await to get conenction to db
        }

        return this.connection;
    }

    /**
     * Wrap a regular query request in knex with a transaction so that we can explicitly rollback in case of an error
     * 
     * @returns {Promise<knex.Transaction>} 
     * @memberof MySql
     */
    public async getTransaction(): Promise<knex.Transaction> {
        const connection = await this.getConnection(); // Establish connection

        return new Promise<knex.Transaction>((resolve, reject) => {
            try {
                connection.transaction((trx: knex.Transaction) => {
                    resolve(trx); // IF no errors, run the transaction to the db (could be multiple sql statements)
                });
            } catch(err) {
                reject(err);
            }
        });
    }

    /**
     * Close connection to the database
     * 
     * @returns {Promise<void>} - void promise
     * @memberof MySql
     */
    public async closeDatabase(): Promise<void> {
        if (this.connection) {
            await this.connection.destroy();
            this.connection = undefined;
        }
    }

    /**
     * Create migration file which allows for easier database upgrade and downgrades if entities change in the process
     * 
     * @memberof MySql
     */
    public async schemaMigration() {
        const connection = await this.getConnection(); // Establish connection first
        await connection.migrate.latest({
            directory: path.resolve(__dirname, './migrations'); // Update the queries that we have used to migration file
        });
    }

    /**
     * Initializes connection with SQL server and tests for stable connection
     * 
     * @private
     * @returns {Promise<knex>} - a promise containing the knex object
     * @memberof MySql
     */
    private async createConnection(): Promise<knex> {

        // Create knex config
        const knexConfig: knex.Config = {
            client: 'mysql2',
            connection: {
                host: config.database.host,
                port: config.database.port,
                user: config.database.user,
                password: config.database.password,
                database: config.database.database
            },
            debug: config.database.debug,
            migrations: {
                tableName: 'migrations' // Store create schema updates
            }
        }

        const db = knex(config); // Establish db connection
        await db.raw('select 1').timeout(500); // Check connection, may or may not succeed
        return db;
    }

    /**
     * Attempt to establish a connection to the database and return a promise containing the knex object
     * 
     * @private
     * @returns {Promise<knex>} - wrapper containing the knex object to interface with the database
     * @memberof MySql
     */
    private retryDbConnection(): Promise<knex> {
        // Return the promise if it is already defined (this was called in the middle of a request to get the mysql connection already running)
        if (this.retryDbConnectionPromise instanceof Promise) {
            return this.retryDbConnectionPromise;
        }

        // Create handler for callback
        const methodToRetry = (cb: AsyncResultCallback<knex, Error>) => {
            this.createConnection().then((db: knex) => {
                cb(undefined, db); // Call the callback passing in undefined for the error with the db (successful connection)
            }).catch((err: Error) => {
                cb(err, undefined); // Error with callback, pass in error and undefined db
            });
        }

        // Add the wrapper we created above as teh callback for our promise
        this.retryDbConnectionPromise = new Promise<knex>((resolve, reject) => {
            retry(
                { times: 3, interval: 1000 }, // 3 tries, 1 second offset
                methodToRetry, // Wrapper to callback
                (err: Error | undefined, db: knex) => { // Callback itself
                    // Check for error after being called
                    if (err) {
                        reject(err);
                    } else {
                        resolve(db);
                    }

                    this.retryDbConnectionPromise = undefined; // Remove handler after this finishes
                }
            )
        });

        return this.retryDbConnectionPromise;
    }
}