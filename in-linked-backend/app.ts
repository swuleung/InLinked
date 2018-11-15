// import 'babel-polyfill';

/* Libs */
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as helmet from 'helmet';
import * as morgan from 'morgan';
import * as ErrorMiddleware from './middleware/requesthandler';

import { Routes } from './routes/routes';
import { buildModule } from './utils/module/service-module';
import { MySql } from './utils/lib/database';
import * as config from './config/config';

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
        this.app.use(bodyParser.urlencoded({
            extended: true
        }));
        this.app.use(bodyParser.json());

        // Establish MySql connection
        const db = new MySql({
            host: config.default.database.host,
            port: config.default.database.port || 3306,
            username: config.default.database.user,
            password: config.default.database.password,
            database: config.default.database.database,
            debug: config.default.database.debug,
            insecureAuth: true
        });
        this.applyMigration(db); // TODO: Needs testing

        const module = buildModule(db);

        // Initialize and bind routes
        this.routes = new Routes(this.app, module);

        this.app._router.stack.forEach(function(r){
            if (r.route && r.route.path){
              console.log(r.route.path)
            }
          });

        /* Error middleware */
        this.app.use(ErrorMiddleware.genericErrorHandler);
        this.app.use(ErrorMiddleware.notFoundError);
    }

    public async applyMigration(db: MySql) {
        await db.schemaMigration();
    }
}

export default new App().app;
