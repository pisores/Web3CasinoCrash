import Config from "config/index";
import { io } from "socket.io-client";

export default class CrashSocketManager {
    static _instance = null;

    socket;

    static getInstance() {
        if (CrashSocketManager._instance === null)
            CrashSocketManager._instance = new CrashSocketManager();

        return CrashSocketManager._instance;
    }

    connect() {
        this.socket = io(Config.Root.crashSocketUrl, { transports: ['websocket'] });
        let self = this;

        this.socket.on('connect', function () {
        });

        this.socket.on('joinBetResult', function (response) {
            const message = { type: 'playzelo-Crash-BetResult', data: response };
            self.postMessage(message);
        });

        this.socket.on('cancelBetResult', function (response) {
            const message = { type: 'playzelo-Crash-CancelResult', data: response };
            self.postMessage(message);
        });

        this.socket.on('cashoutBetResult', function (response) {
            const message = { type: 'playzelo-Crash-CashoutResult', data: response };
            self.postMessage(message);
        });

        this.socket.on('reportStatus', function (response) {
            const message = { type: 'playzelo-Crash-ReportStatus', data: response };
            self.postMessage(message);
        });

        this.socket.on('newBetUser', function (response) {
            const message = { type: 'playzelo-Crash-NewBetUser', data: response };
            self.postMessage(message);
        });

        this.socket.on('newCashout', function (response) {
            const message = { type: 'playzelo-Crash-NewCashout', data: response };
            self.postMessage(message);
        });

        this.socket.on('removeBetUser', function (response) {
            const message = { type: 'playzelo-Crash-RemoveBetUser', data: response };
            self.postMessage(message);
        });

        this.socket.on('getInitDataResponse', function (response) {
            const message = { type: 'playzelo-Crash-GetInitDataResponse', data: response };
            self.postMessage(message);
        });
    }

    postMessage(message) {
        window.postMessage(message, '*');
    }

    disconnect() {
        this.socket.disconnect();
    }

    getInitData(data) {
        this.socket.emit('getInitData', data);
    }

    joinBet(data) {
        this.socket.emit('joinBet', data);
    }

    cancelBet(data) {
        this.socket.emit('cancelBet', data);
    }

    cashoutBet(data) {
        this.socket.emit('cashoutBet', data);
    }
}