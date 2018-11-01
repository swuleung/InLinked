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
                tableName: 'migrations'
            }
        }

        const db = knex(config); // Establish db connection
        await db.raw('select 1').timeout(500); // Check connection, may or may not succeed
        return db;
    }

    
    private retryDbConnection(): Promise<knex> {
        // Return the promise if it is already defined
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
                (err: Error | undefined, db: knex) => {
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