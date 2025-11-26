const { ROUND_DATA, ROUND_STATUS } = require('../constant');
const { v4: uuidv4 } = require('uuid');
const socketManager = require('../manager/SocketManager');
const dataManager = require('../manager/DataManager');
const crashController = require('../controller/CrashController');
const { generateCrashHash, generateSeed } = require('../../helper/mainHelper');

module.exports = class CrashRound {
    countDownTime
    countDownInterval
    payout
    payoutInterval
    runningTime

    roundId
    roundNumber
    roundStatus
    roundDate

    serverSeed
    fairResult

    betUsers
    waitingBetUsers

    constructor(waitingBetUsers) {
        this.roundStatus = ROUND_STATUS.COUNTDOWN;
        this.roundNumber = uuidv4();
        this.roundDate = new Date();
        this.serverSeed = generateSeed();

        this.betUsers = [];
        this.waitingBetUsers = [];
        this.countDownTime = ROUND_DATA.TIME_COUNTDOWN;

        this.createCrashRound();
        this.procWaitingBetUser(waitingBetUsers);
    }

    async createCrashRound() {
        const response = await crashController.createCrashRound({
            roundNumber: this.roundNumber,
            roundDate: this.roundDate,
            serverSeed: this.serverSeed,
            roundStatus: this.roundStatus
        });

        if (response.status) {
            this.roundId = response.data._id;
            let self = this;
            this.countDownInterval = setInterval(() => {
                self.roundCountDown(response => {
                    if (response.status === ROUND_STATUS.WAITING) {
                        self.waitingRound();
                    }
                    else if (response.status === ROUND_STATUS.COUNTDOWN) {
                        self.reportRoundStatus(response);
                    }
                })
            }, ROUND_DATA.INTERVAL_COUNTDOWN);
        }
        else {
            dataManager.createRound([]);
        }
    }

    async updateCrashRound() {
        let historyData = [];
        this.betUsers.map((item) => {
            const history = {
                userId: item.userId,
                gameType: 'crash',
                roundNumber: this.roundNumber,
                betAmount: item.betAmount,
                coinType: item.coinType,
                payout: item.payout,
                roundResult: item.profit > 0 ? 'win' : 'lost',
                roundState: true
            };
            historyData.push(history);
        });
        if (historyData.length > 0)
            socketManager.sendBetHistory(historyData);

        const response = await crashController.updateCrashRound({
            roundNumber: this.roundNumber,
            fairResult: this.fairResult,
            roundStatus: this.roundStatus
        });

        if (response.status) {
            this.completeRound();
        }
        else {
            dataManager.createRound([]);
        }
    }

    roundCountDown(callback) {
        if (this.countDownTime < 0) {
            clearInterval(this.countDownInterval);
            callback({ status: ROUND_STATUS.WAITING });
        }
        else {
            callback({ status: ROUND_STATUS.COUNTDOWN, count: this.countDownTime.toFixed(2) });
            this.countDownTime -= ROUND_DATA.INTERVAL_COUNTDOWN / 1000;
        }
    }

    waitingRound() {
        let self = this;
        this.roundStatus = ROUND_STATUS.WAITING;
        this.reportRoundStatus({ status: this.roundStatus });

        let confirmingTime = 0;
        let confirmInterval = setInterval(function () {
            if (self.checkStartable()) {
                clearInterval(confirmInterval);
                self.fairResult = self.calculateFairResult();
                self.startRound();
            }
            else {
                confirmingTime += ROUND_DATA.INTERVAL_CONFIRMING;
            }
        }, ROUND_DATA.INTERVAL_CONFIRMING);
    }

    startRound() {
        let self = this;
        this.roundStatus = ROUND_STATUS.STARTED;

        this.runningTime = 0;
        self.payout = ROUND_DATA.INITIAL_PAYOUT;
        this.payoutInterval = setInterval(() => {
            if (self.payout >= self.fairResult) {
                clearInterval(self.payoutInterval);
                self.finishRound();
            }
            else {
                self.betUsers.map(item => {
                    if (self.payout >= item.payout && !item.isCashouted) {
                        self.winningProc(item.userId, item.payout, item.socket);
                    }
                });

                self.runningTime += ROUND_DATA.INTERVAL_RUNNING / 1000;
                self.reportRoundStatus({ status: self.roundStatus, payout: self.payout.toFixed(2), time: self.runningTime });
                self.payout = ROUND_DATA.INITIAL_PAYOUT * Math.pow(ROUND_DATA.GROWTH_FACTOR, self.runningTime);
            }
        }, ROUND_DATA.INTERVAL_RUNNING);
    }

    finishRound() {
        let self = this;
        this.roundStatus = ROUND_STATUS.FINISHED;
        this.reportRoundStatus({ status: this.roundStatus, fairResult: this.fairResult });

        let confirmInterval = setInterval(() => {
            if (self.checkCompletable()) {
                clearInterval(confirmInterval);
                self.updateCrashRound();
            }
        }, ROUND_DATA.INTERVAL_CONFIRMING);
    }

    completeRound() {
        this.roundStatus = ROUND_STATUS.COMPLETED;
        this.reportRoundStatus({ status: this.roundStatus });
        setTimeout(() => {
            dataManager.createRound(this.waitingBetUsers);
        }, ROUND_DATA.TIME_NEWROUND * 1000);
    }

    async addBetUser(data, socket) {
        if (this.checkBetable(data)) {
            let betUser = {
                userId: data.userId,
                betAmount: data.betAmount,
                coinType: data.coinType,
                payout: data.payout,
                profit: 0,
                userNickName: '',
                betConfirmed: false,
                isCashouted: false,
                cashoutConfirmed: false,
                seed: '',
                socket: socket
            };
            let index = this.betUsers.length;
            this.betUsers.push(betUser);

            const response = await crashController.updatePlayerBalance({ userId: data.userId, amount: data.betAmount }, true);
            if (response.status) {
                this.betUsers[index].betConfirmed = true;
                this.betUsers[index].seed = response.data.seed;
                this.betUsers[index].userNickName = response.data.userNickName;

                await crashController.createCrashBetHistory({
                    userId: this.betUsers[index].userId,
                    betAmount: this.betUsers[index].betAmount,
                    coinType: this.betUsers[index].coinType,
                    roundId: this.roundId,
                    seed: this.betUsers[index].seed
                });

                socketManager.joinBetResult({ status: true, data: { joinType: 'direct' } }, socket);
                socketManager.newBetUser(betUser);
            }
            else {
                this.betUsers.splice(index, 1);
                socketManager.joinBetResult({ status: false, message: 'You can not join because of some reason.' }, socket);
            }
        }
        else if (this.checkWaitingBetable(data)) {
            let waitingBetUser = {
                userId: data.userId,
                betAmount: data.betAmount,
                coinType: data.coinType,
                payout: data.payout,
                socket
            };
            this.waitingBetUsers.push(waitingBetUser);
            socketManager.joinBetResult({ status: true, data: { joinType: 'waiting' } }, socket);
        }
        else {
            socketManager.joinBetResult({ status: false, message: 'You can not join because of some reason.' }, socket);
        }
    }

    async procWaitingBetUser(waitingList) {
        if (this.roundStatus === ROUND_STATUS.COUNTDOWN || this.roundStatus === ROUND_STATUS.WAITING) {
            waitingList.map(async (data) => {
                let betUser = {
                    userId: data.userId,
                    betAmount: data.betAmount,
                    coinType: data.coinType,
                    payout: data.payout,
                    profit: 0,
                    userNickName: '',
                    betConfirmed: false,
                    isCashouted: false,
                    cashoutConfirmed: false,
                    seed: '',
                    socket: data.socket
                };
                let index = this.betUsers.length;
                this.betUsers.push(betUser);

                const response = await crashController.updatePlayerBalance({ userId: data.userId, amount: data.betAmount }, true);
                if (response.status) {
                    this.betUsers[index].betConfirmed = true;
                    this.betUsers[index].seed = response.data.seed;
                    this.betUsers[index].userNickName = response.data.userNickName;

                    await crashController.createCrashBetHistory({
                        userId: this.betUsers[index].userId,
                        betAmount: this.betUsers[index].betAmount,
                        coinType: this.betUsers[index].coinType,
                        roundId: this.roundId,
                        seed: this.betUsers[index].seed
                    });

                    socketManager.joinBetResult({ status: true, data: { joinType: 'direct' } }, data.socket);
                    socketManager.newBetUser(betUser);
                }
                else {
                    this.betUsers.splice(index, 1);
                    socketManager.joinBetResult({ status: false, message: 'You can not join because of some reason.' }, data.socket);
                }
            });
        }
    }

    async removeBetUser(data, socket) {
        if (this.checkCancelable(data)) {
            let cancelUser;
            this.betUsers = this.betUsers.filter(item => {
                if (item.userId === data.userId) {
                    cancelUser = item;
                    return false;
                }
                else
                    return true;
            });
            const response = await crashController.updatePlayerBalance({ userId: cancelUser.userId, amount: -cancelUser.betAmount }, true);
            await crashController.removeCrashBetHistory({ userId: cancelUser.userId, roundId: this.roundId });
            socketManager.cancelBetResult({ status: true, data: cancelUser }, socket);
            socketManager.removeBetUser(cancelUser);
        }
        else if (this.checkWaitingCancelable(data)) {
            let cancelUser;
            this.waitingBetUsers = this.waitingBetUsers.filter(item => {
                if (item.userId === data.userId) {
                    cancelUser = item;
                    return false;
                }
                else
                    return true;
            });
            socketManager.cancelBetResult({ status: true, data: cancelUser }, socket);
        }
    }

    async cashoutBetUser(data, socket) {
        if (this.roundStatus === ROUND_STATUS.STARTED) {
            this.winningProc(data.userId, this.payout, socket);
        }
        else {
            socketManager.cashoutBetResult({ status: false, message: 'Round is not ready' }, socket);
        }
    }

    async winningProc(userId, payout, socket) {
        let userIndex = this.betUsers.findIndex(item => item.userId === userId);
        if (userIndex >= 0 && this.betUsers[userIndex].betConfirmed && !this.betUsers[userIndex].isCashouted) {
            this.betUsers[userIndex].isCashouted = true;

            await crashController.updateCrashBetHistory({
                roundId: this.roundId,
                userId,
                payout
            });

            let profit = this.betUsers[userIndex].betAmount * payout;
            await crashController.updatePlayerBalance({ userId: this.betUsers[userIndex].userId, amount: profit });
            socketManager.cashoutBetResult({ status: true, data: { payout, profit } }, socket);

            this.betUsers[userIndex].cashoutConfirmed = true;
            this.betUsers[userIndex].profit = profit;
            this.betUsers[userIndex].payout = payout;
            socketManager.newCashout(this.betUsers[userIndex]);
        }
        else {
            socketManager.cashoutBetResult({ status: false, message: 'Invalid Request' }, socket);
        }
    }

    reportRoundStatus(data) {
        // console.log(data);
        socketManager.reportRoundStatus(data);
    }

    async getInitData(data, socket) {
        let { userId } = data;
        let isMyBet = false;
        const roundData = await crashController.getCrashRoundHistory();
        let roundHistory = [];
        if (roundData.status)
            roundHistory = roundData.data;

        this.betUsers.map((item) => {
            if (item.userId === userId) {
                item.socket = socket;
                isMyBet = true;
            }
        });
        this.waitingBetUsers.map((item) => {
            if (item.userId === userId)
                item.socket = socket;
        });

        socketManager.getInitDataResponse({ status: true, data: { history: roundHistory, betList: this.betUsers, isMyBet } }, socket);
    }

    checkStartable() {
        for (let item of this.betUsers) {
            if (!item.betConfirmed)
                return false;
        }
        return true;
    }

    checkCompletable() {
        for (let item of this.betUsers) {
            if (item.isCashouted && !item.cashoutConfirmed)
                return false;
        }
        return true;
    }

    checkBetable(data) {
        if (this.roundStatus !== ROUND_STATUS.COUNTDOWN)
            return false;

        for (let item of this.betUsers) {
            if (item.userId === data.userId)
                return false;
        }
        return true;
    }

    checkWaitingBetable(data) {
        if (this.roundStatus === ROUND_STATUS.COUNTDOWN || this.roundStatus === ROUND_STATUS.WAITING)
            return false;

        for (let item of this.waitingBetUsers) {
            if (item.userId === data.userId)
                return false;
        }
        return true;
    }

    checkCancelable(data) {
        let index = this.betUsers.findIndex((item) => item.userId === data.userId);
        if (index >= 0) return true;
        else return false;
    }

    checkWaitingCancelable(data) {
        let index = this.waitingBetUsers.findIndex((item) => item.userId === data.userId);
        if (index >= 0) return true;
        else return false;
    }

    calculateFairResult() {
        let clientSeeds = [];
        clientSeeds.push(this.betUsers[0] ? this.betUsers[0].seed : '');
        clientSeeds.push(this.betUsers[1] ? this.betUsers[1].seed : '');
        clientSeeds.push(this.betUsers[2] ? this.betUsers[2].seed : '');

        const hash = generateCrashHash(this.serverSeed, clientSeeds);
        const hex = parseInt(hash.substr(0, 8), 16);
        const result = Math.max(1, (Math.pow(2, 32) / (hex + 1)) * (1 - 0.01));
        return result;
    }
}