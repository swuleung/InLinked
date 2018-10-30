// import 'babel-polyfill';

/* Libs */
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as helmet from 'helmet';
import * as morgan from 'morgan';
import * as path from 'path';

import { Routes } from './routes/routes';

/* Import local libs */
// import routes from './routes';

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
    }
}

export default new App().app;