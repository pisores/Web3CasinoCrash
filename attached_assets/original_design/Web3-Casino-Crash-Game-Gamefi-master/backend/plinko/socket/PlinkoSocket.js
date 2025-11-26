const dataManager = require('../manager/DataManager');

module.exports = class PlinkoSocket {
    socket = null;

    constructor(server) {
        this.socket = require('socket.io')({
            cors: {
                origin: '*',
                method: ['GET', 'POST']
            }
        }).listen(server);
        this.bind();
    }

    bind() {
        this.socket.on('connection', (client) => {
            console.log(`*** Socket ${client.id} connected! ***`);

            client.on('disconnect', () => {
                console.log(`### Socket ${client.id} disconnected ###`);
            });

            client.on('joinBet', (data) => {
                dataManager.joinBet(data, client.id);
            });

            client.on('getHistory', (data) => {
                dataManager.getHistory(data, client.id);
            });
        });
    }

    broadCast(packetName, packetData = null) {
        this.socket.emit(packetName, packetData);
    }

    sendTo(socket, packetName, packetData = null) {
        this.socket.to(socket).emit(packetName, packetData);
    }
}