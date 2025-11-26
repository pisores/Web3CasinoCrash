import Config from "config/index";
import { io } from "socket.io-client";

export default class DiceSocketManager {
    static _instance = null;

    socket;
    authData;

    static getInstance() {
        if (DiceSocketManager._instance === null)
            DiceSocketManager._instance = new DiceSocketManager();

        return DiceSocketManager._instance;
    }

    connect(authData) {
        this.socket = io(Config.Root.diceSocketUrl, { transports: ['websocket'] });
        this.authData = authData;
        let self = this;

        this.socket.on('connect', function () {
            self.reconnect();
        });

        this.socket.on('betResult', function (response) {
            const message = { type: 'playzelo-Dice-BetResult', data: response };
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

    getHistoryData() {
        this.socket.emit('getHistory', { userId: this.authData?.userData?._id });
    }
}