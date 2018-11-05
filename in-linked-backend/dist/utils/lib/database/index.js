"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Main connection handler for interfacing with our MySQL database
 */
const async_1 = require("async");
const knex = require("knex");
const path = require("path");
class MySql {
    constructor(c) {
        this.config = c;
    }
    /**
     * Establishses conncetion to our database and retries if it fails
     *
     * @returns {Promise<knex>} - promise containing our knex object
     * @memberof MySql
     */
    getConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.connection) {
                this.connection = yield this.retryDbConnection(); // Await to get conenction to db
            }
            return this.connection;
        });
    }
    /**
     * Wrap a regular query request in knex with a transaction so that we can explicitly rollback in case of an error
     *
     * @returns {Promise<knex.Transaction>}
     * @memberof MySql
     */
    getTransaction() {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield this.getConnection(); // Establish connection
            return new Promise((resolve, reject) => {
                try {
                    connection.transaction((trx) => {
                        resolve(trx); // IF no errors, run the transaction to the db (could be multiple sql statements)
                    });
                }
                catch (err) {
                    reject(err);
                }
            });
        });
    }
    /**
     * Close connection to the database
     *
     * @returns {Promise<void>} - void promise
     * @memberof MySql
     */
    closeDatabase() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.connection) {
                yield this.connection.destroy();
                this.connection = undefined;
            }
        });
    }
    /**
     * Create migration file which allows for easier database upgrade and downgrades if entities change in the process
     *
     * @memberof MySql
     */
    schemaMigration() {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield this.getConnection(); // Establish connection first
            yield connection.migrate.latest({
                directory: path.resolve(__dirname, './migrations') // Update the queries that we have used to migration file
            });
        });
    }
    /**
     * Initializes connection with SQL server and tests for stable connection
     *
     * @private
     * @returns {Promise<knex>} - a promise containing the knex object
     * @memberof MySql
     */
    createConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            // Create knex config
            const knexConfig = {
                client: 'mysql2',
                connection: {
                    host: this.config.host,
                    port: this.config.port,
                    user: this.config.username,
                    password: this.config.password,
                    database: this.config.database
                },
                debug: this.config.debug,
                migrations: {
                    tableName: 'migrations' // Store create schema updates
                }
            };
            const db = knex(knexConfig); // Establish db connection
            yield db.raw('select 1').timeout(500); // Check connection, may or may not succeed
            return db;
        });
    }
    /**
     * Attempt to establish a connection to the database and return a promise containing the knex object
     *
     * @private
     * @returns {Promise<knex>} - wrapper containing the knex object to interface with the database
     * @memberof MySql
     */
    retryDbConnection() {
        // Return the promise if it is already defined (this was called in the middle of a request to get the mysql connection already running)
        if (this.retryDbConnectionPromise instanceof Promise) {
            return this.retryDbConnectionPromise;
        }
        // Create handler for callback
        const methodToRetry = (cb) => {
            this.createConnection().then((db) => {
                cb(undefined, db); // Call the callback passing in undefined for the error with the db (successful connection)
            }).catch((err) => {
                cb(err, undefined); // Error with callback, pass in error and undefined db
            });
        };
        // Add the wrapper we created above as teh callback for our promise
        this.retryDbConnectionPromise = new Promise((resolve, reject) => {
            async_1.retry({ times: 3, interval: 1000 }, // 3 tries, 1 second offset
            methodToRetry, // Wrapper to callback
            (err, db) => {
                // Check for error after being called
                if (err) {
                    reject(err);
                }
                else {
                    resolve(db);
                }
                this.retryDbConnectionPromise = undefined; // Remove handler after this finishes
            });
        });
        return this.retryDbConnectionPromise;
    }
}
exports.MySql = MySql;
//# sourceMappingURL=index.js.map