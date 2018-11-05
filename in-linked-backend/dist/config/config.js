"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PORT = process.env.PORT || 8080;
exports.default = {
    app: {
        PORT,
        api_route: 'api',
        api_ver: 'v1'
    },
    database: {
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'password',
        database: 'InLinked_Db',
        debug: false
    }
};
//# sourceMappingURL=config.js.map