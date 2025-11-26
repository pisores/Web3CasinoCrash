import Config from "config/index";
import { io } from "socket.io-client";

export default class MinesSocketManager {
    static _instance = null;

    socket;
    authData;

    static getInstance() {
        if (MinesSocketManager._instance === null)
            MinesSocketManager._instance = new MinesSocketManager();

        return MinesSocketManager._instance;
    }

    connect(authData) {
        this.socket = io(Config.Root.minesSocketUrl, { transports: ['websocket'] });
        this.authData = authData;
        let self = this;

        this.socket.on('connect', function () {
            self.reconnect();
        });

        this.socket.on('joinBetResult', function (response) {
            const message = { type: 'playzelo-mines-joinBetResult', data: response };
            self.postMessage(message);
        });

        this.socket.on('pickCellResult', function (response) {
            const message = { type: 'playzelo-mines-pickCellResult', data: response };
            self.postMessage(message);
        });

        this.socket.on('roundResult', function (response) {
            const message = { type: 'playzelo-mines-roundResult', data: response };
            self.postMessage(message);
        });

        this.socket.on('activeRoundResult', function (response) {
            const message = { type: 'playzelo-mines-activeRoundResult', data: response };
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

    finishBet(data) {
        this.socket.emit('finish_bet', data)
    }

    pickCell(data) {
        this.socket.emit('pick_cell', data);
    }

    getActiveRound(data) {
        this.socket.emit('active_round', data);
    }
}