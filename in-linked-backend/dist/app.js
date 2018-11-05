"use strict";
// import 'babel-polyfill';
Object.defineProperty(exports, "__esModule", { value: true });
/* Libs */
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const ErrorMiddleware = require("./middleware/requesthandler");
const routes_1 = require("./routes/routes");
const service_module_1 = require("./utils/module/service-module");
const database_1 = require("./utils/lib/database");
const config = require("./config/config");
/* Import local libs */
class App {
    constructor() {
        this.app = express();
        /* Setup middlewhere */
        this.app.use(cors()); // Authorization
        this.app.use(helmet());
        this.app.use(morgan('dev')); // HTTP request logger
        this.app.use(bodyParser.urlencoded({
            extended: true
        }));
        this.app.use(bodyParser.json());
        // Establish MySql connection
        const db = new database_1.MySql({
            host: config.default.database.host,
            port: config.default.database.port || 3306,
            username: config.default.database.user,
            password: config.default.database.password,
            database: config.default.database.database,
            debug: config.default.database.debug
        });
        const module = service_module_1.buildModule(db);
        // Initialize and bind routes
        this.routes = new routes_1.Routes(this.app, module);
        /* Error middleware */
        this.app.use(ErrorMiddleware.genericErrorHandler);
        this.app.use(ErrorMiddleware.notFoundError);
    }
}
exports.default = new App().app;
//# sourceMappingURL=app.js.map