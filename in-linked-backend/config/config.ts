/**
 * Global app config file
 */
import * as pkg from '../package.json';

const PORT = process.env.PORT || 8080;

export default {
    app: {
        PORT,
    }
}