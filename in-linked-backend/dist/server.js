"use strict";
/**
 * Start the server for the app (MAIN ENTRY POINT)
 */
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const config_1 = require("./config/config");
// If we want HTTPS
// const httpsOptions = {
//     key: fs.readFileSync('./config/key.pem'),
//     cert: fs.readFileSync('./config/cert.pem')
// }
// https.createServer(httpsOptions, app).listen(PORT, () => {
//     console.log('Express server listening on port ' + PORT);
// })
app_1.default.listen(config_1.default.app.PORT, () => console.info(`Listening on port ${config_1.default.app.PORT}`));
//# sourceMappingURL=server.js.map