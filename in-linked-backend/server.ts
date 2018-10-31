import app from './app';
import config from './config/config';

// If we want HTTPS
// const httpsOptions = {
//     key: fs.readFileSync('./config/key.pem'),
//     cert: fs.readFileSync('./config/cert.pem')
// }

// https.createServer(httpsOptions, app).listen(PORT, () => {
//     console.log('Express server listening on port ' + PORT);
// })

app.listen(config.app.PORT, () =>
    console.info(`Listening on port ${config.app.PORT}`)
);