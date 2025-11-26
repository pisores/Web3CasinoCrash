import Config from "config/index";
import { io } from "socket.io-client";

export default class TurtleSocketManager {
    static _instance = null;

    socket;
    authData;

    static getInstance() {
        if (TurtleSocketManager._instance === null)
            TurtleSocketManager._instance = new TurtleSocketManager();

        return TurtleSocketManager._instance;
    }

    connect(authData) {
        this.socket = io(Config.Root.turtleraceSocketUrl, { transports: ['websocket'] });
        this.authData = authData;
        let self = this;

        this.socket.on('connect', function () {
            self.getCurrentRound();
            self.reconnect();
        });

        this.socket.on('countDown', function (response) {
            const message = { type: 'playzelo-countDown', data: response };
            self.postMessage(message);
        });

        this.socket.on('roundStart', function (response) {
            const message = { type: 'playzelo-roundStart', data: response };
            self.postMessage(message);
        });

        this.socket.on('roundStop', function (response) {
            const message = { type: 'playzelo-roundStop', data: response };
            self.postMessage(message);
        });

        this.socket.on('roundFinished', function (response) {
            const message = { type: 'playzelo-roundFinished', data: response };
            self.postMessage(message);
        });

        this.socket.on('currentRoundResult', function (response) {
            if (response.history.status) {
                const message = { type: 'playzelo-currentRoundResult', data: response.history.data };
                self.postMessage(message);
                const message1 = { type: 'playzelo-currentRoundState', data: response.stateData };
                self.postMessage(message1);
                const message2 = { type: 'playzelo-betHistory', data: response.betHistory };
                self.postMessage(message2);
            }
        });

        this.socket.on('joinBetResult', function (response) {
            const message = { type: 'playzelo-joinBetResult', data: response };
            self.postMessage(message);
        });

        this.socket.on('cancelBetResult', function (response) {
            const message = { type: 'playzelo-cancelBetResult', data: response };
            self.postMessage(message);
        });

        this.socket.on('balanceUpdated', function () {
            const message = { type: 'playzelo-balanceUpdated' };
            self.postMessage(message);
        });

        this.socket.on('newBetUser', function (response) {
            const message = { type: 'playzelo-turtle-newBetUser', data: response };
            self.postMessage(message);
        });

        this.socket.on('removeBetUser', function (response) {
            const message = { type: 'playzelo-turtle-removeBetUser', data: response };
            self.postMessage(message);
        });
    }

    postMessage(message) {
        window.postMessage(message, '*');
    }

    updateAuthData(data) {
        this.authData = data;
    }

    disconnect() {
        this.socket.disconnect();
    }

    reconnect() {
        if (this.authData.isAuth)
            this.socket.emit('reconnect', this.authData?.userData?._id);
    }

    joinBet(data) {
        this.socket.emit('join_bet', data)
    }

    cancelBet(data) {
        this.socket.emit('cancel_bet', data)
    }

    getCurrentRound() {
        this.socket.emit('current_round');
    }
}