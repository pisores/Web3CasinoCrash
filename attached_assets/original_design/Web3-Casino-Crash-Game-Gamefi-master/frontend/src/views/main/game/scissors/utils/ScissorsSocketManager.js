import Config from "config/index";
import { io } from "socket.io-client";

export default class ScissorsSocketManager {
    static _instance = null;

    socket;
    authData;

    static getInstance() {
        if (ScissorsSocketManager._instance === null)
            ScissorsSocketManager._instance = new ScissorsSocketManager();

        return ScissorsSocketManager._instance;
    }

    connect(authData) {
        this.socket = io(Config.Root.scissorSocketUrl, { transports: ['websocket'] });
        this.authData = authData;
        let self = this;

        this.socket.on('connect', function () {
            self.reconnect();
        });

        this.socket.on('betResult', function (response) {
            const message = { type: 'playzelo-Scissors-BetResult', data: response };
            self.postMessage(message);
        });

        this.socket.on('historyResult', function (response) {
            const message = { type: 'playzelo-Scissors-HistoryResult', data: response };
            self.postMessage(message);
        });

        this.socket.on('newRound', function (response) {
            const message = { type: 'playzelo-Scissors-NewRound', data: response };
            self.postMessage(message);
        })
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

    getHistoryData() {
        this.socket.emit('getHistory', { userId: this.authData?.userData?._id });
    }
}