const config = require('./config');
const app = require('./app').createApp(config);
const socketManager = require('./manager/SocketManager');

process.env.NODE_ENV = 'dev';
const server = socketManager.createServer(app);
server.listen(config.serverInfo.port, function () {
    console.log(`Plinko Server started on ${config.serverInfo.port}`);
});