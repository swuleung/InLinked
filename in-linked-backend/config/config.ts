/**
 * Global app config file
 */
import * as pkg from '../package.json';

const PORT = process.env.PORT || 8080;

export default {
    app: {
        PORT,
        api_route: 'api',
        api_ver: 'v1'
    },
    database: {
        host: '',
        port: 3306,
        user: '',
        password: '',
        database: '',
        debug: false
    }
};