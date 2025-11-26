import Config from "config/index";
import { io } from "socket.io-client";

export default class PlinkoSocketManager {
    static _instance = null;

    socket;

    static getInstance() {
        if (PlinkoSocketManager._instance === null)
            PlinkoSocketManager._instance = new PlinkoSocketManager();

        return PlinkoSocketManager._instance;
    }

    connect() {
        this.socket = io(Config.Root.plinkoSocketUrl, { transports: ['websocket'] });
        let self = this;

        this.socket.on('connect', function () {
        });

        this.socket.on('betResult', function (response) {
            const message = { type: 'playzelo-Plinko-BetResult', data: response };
            self.postMessage(message);
        });
    }

    postMessage(message) {
        window.postMessage(message, '*');
    }

    disconnect() {
        this.socket.disconnect();
    }

    joinBet(data) {
        this.socket.emit('joinBet', data)
    }
}