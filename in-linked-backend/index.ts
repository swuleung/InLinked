// import 'babel-polyfill';

/* Libs */
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as helmet from 'helmet';
import * as morgan from 'morgan';
import * as path from 'path';

/* Import local libs */
// import routes from './routes';

const app = express();

/* Setup middlewhere */
app.use(cors()); // Authorization
app.use(helmet());
app.use(morgan('dev', { stream: logStream })); // HTTP request logger
app.use(bodyParser.json());

// API Routes
app.use('/', routes);

logger.info('Application Environment: ' + app.get('env'));
logger.debug('Debug logs are enabled');

app.listen(config.app.port, () =>
  logger.info(`Listening on port ${config.app.port}`)
);

export default app;