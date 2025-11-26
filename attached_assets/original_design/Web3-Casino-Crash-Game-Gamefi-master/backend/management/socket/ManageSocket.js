const dataManager = require('../manager/DataManager');

module.exports = class ManageSocket {
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

            client.on('balanceUpdated', (data) => {
                this.broadCast('balanceUpdated', data);
            });

            client.on('newBetHistory', (data) => {
                dataManager.newBetHistory(data);
            });

            client.on('updateWargerAmount', (data) => {
                dataManager.updateWargerAmount(data);
            });

            client.on('depositSuccess', (data) => {
                this.broadCast('depositSuccess', data);
            })

            client.on('withdrawSuccess', (data) => {
                this.broadCast('withdrawSuccess', data);
            })
        });
    }

    broadCast(packetName, packetData = null) {
        this.socket.emit(packetName, packetData);
    }

    sendTo(socket, packetName, packetData = null) {
        this.socket.to(socket).emit(packetName, packetData);
    }
}