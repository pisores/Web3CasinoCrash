const dataManager = require('../manager/DataManager');

module.exports = class ScissorsSocket {
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

            client.on('reconnect', (request) => {
                dataManager.addUserSocket(request.userId, client.id);
            });

            client.on('disconnect', () => {
                console.log(`### Socket ${client.id} disconnected ###`);
                dataManager.removeUserSocket(client.id);
            });

            client.on('join_bet', (data) => {
                dataManager.joinBet(data, client.id);
            });

            client.on('finish_bet', (data) => {
                dataManager.finishBet(data, client.id);
            });

            client.on('pick_cell', (data) => {
                dataManager.pickCell(data, client.id);
            });

            client.on('active_round', (data) => {
                dataManager.getActiveRound(data, client.id);
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