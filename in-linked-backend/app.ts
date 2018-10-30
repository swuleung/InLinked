// import 'babel-polyfill';

/* Libs */
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as helmet from 'helmet';
import * as morgan from 'morgan';
import * as path from 'path';

import * as ErrorMiddleware from './middleware/requesthandler';
import { Routes } from './routes/routes';

/* Import local libs */

class App {
    public app: express.Application;
    public routes: Routes;

    constructor() {
        this.app = express();

        /* Setup middlewhere */
        this.app.use(cors()); // Authorization
        this.app.use(helmet());
        this.app.use(morgan('dev')); // HTTP request logger
        this.app.use(bodyParser.json());

        // Initialize and bind routes
        this.routes = new Routes(this.app);

        /* Error middleware */
        this.app.use(ErrorMiddleware.genericErrorHandler);
        this.app.use(ErrorMiddleware.notFoundError);
    }
}

export default new App().app;
