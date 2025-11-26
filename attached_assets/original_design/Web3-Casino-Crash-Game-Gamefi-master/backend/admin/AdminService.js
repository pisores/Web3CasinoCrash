const config = require('./config');
const app = require('./app').createApp(config);
const dbBackup = require('./mongodump/index');

process.env.NODE_ENV = 'dev';

const server = require('./app').createServer(app);
server.listen(config.serverInfo.port, function () {
    console.log(`Admin Server starting on ${config.serverInfo.port}`);
    dbBackup.dbDumpProc();
});