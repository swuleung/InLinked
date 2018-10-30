import app from './app';
const PORT = 3000;

// If we want HTTPS
// const httpsOptions = {
//     key: fs.readFileSync('./config/key.pem'),
//     cert: fs.readFileSync('./config/cert.pem')
// }

// https.createServer(httpsOptions, app).listen(PORT, () => {
//     console.log('Express server listening on port ' + PORT);
// })

app.listen(PORT, () =>
    console.info(`Listening on port ${PORT}`)
);