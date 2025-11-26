const dataManager = require('../manager/DataManager');

module.exports = class TurtleraceSocket {
    socket = null;

    constructor(server) {
        this.socket = require('socket.io')({
            cors: {
                origin: '*',
                method: ['GET', 'POST']
            }
        }).listen(server);
        this.bind();
        dataManager.createRound();
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

            client.on('join_bet', (request) => {
                dataManager.addBetUser(request, client.id);
            });

            client.on('cancel_bet', (request) => {
                dataManager.removeBetUser(request, client.id);
            });

            client.on('current_round', () => {
                dataManager.currentRound(client.id);
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