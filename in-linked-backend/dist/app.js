"use strict";
// import 'babel-polyfill';
Object.defineProperty(exports, "__esModule", { value: true });
/* Libs */
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const routes_1 = require("./routes/routes");
/* Import local libs */
// import routes from './routes';
class App {
    constructor() {
        this.app = express();
        /* Setup middlewhere */
        this.app.use(cors()); // Authorization
        this.app.use(helmet());
        this.app.use(morgan('dev')); // HTTP request logger
        this.app.use(bodyParser.json());
        // Initialize and bind routes
        this.routes = new routes_1.Routes(this.app);
    }
}
exports.default = new App().app;
//# sourceMappingURL=app.js.map