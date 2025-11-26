const dataManager = require('../manager/DataManager');

module.exports = class CrashSocket {
    socket = null;

    constructor(server) {
        this.socket = require('socket.io')({
            cors: {
                origin: '*',
                method: ['GET', 'POST']
            }
        }).listen(server);
        this.bind();
        dataManager.createRound([]);
    }

    bind() {
        this.socket.on('connection', (client) => {
            console.log(`*** Socket ${client.id} connected! ***`);

            client.on('disconnect', () => {
                console.log(`### Socket ${client.id} disconnected ###`);
            });

            client.on('joinBet', (request) => {
                dataManager.addBetUser(request, client.id);
            });

            client.on('cancelBet', (request) => {
                dataManager.removeBetUser(request, client.id);
            });

            client.on('cashoutBet', (request) => {
                dataManager.cashoutBet(request, client.id);
            });

            client.on('getInitData', (request) => {
                dataManager.getInitData(request, client.id);
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