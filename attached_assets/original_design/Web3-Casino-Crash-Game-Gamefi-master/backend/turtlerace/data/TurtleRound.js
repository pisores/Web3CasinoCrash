const constant = require('../constant');
const { v4: uuidv4 } = require('uuid');
const { randomNumber, generateTurtleHash } = require('../../helper/mainHelper');
const socketManager = require('../manager/SocketManager');
const dataManager = require('../manager/DataManager');
const turtleController = require('../controllers/TurtleController');

TURTLE_YELLOW = 0;
TURTLE_RED = 1;
TURTLE_BLUE = 2;

module.exports = class TurtleRaceRound {
    countDownTime
    countDownInterval

    roundNumber
    roundState
    roundDate
    roundStartTime

    winnerInfo
    betUsers
    serverSeed

    constructor() {
        this.countDownTime = constant.turtleraceInfo.countDown.time;

        this.roundState = constant.round.state.countDown;
        this.roundNumber = uuidv4();
        this.setServerSeed();
        this.roundDate = new Date();

        this.betUsers = new Array();

        let self = this;
        this.countDownInterval = setInterval(() => {
            this.countDown(response => {
                if (response.state === 'start') {
                    self.startRound();
                }
                else if (response.state === 'count') {
                    self.countDownRound(response.count);
                }
            });
        }, constant.turtleraceInfo.countDown.interval * 1000);
    }

    setServerSeed = async () => {
        let seedData = await turtleController.getSeedData();
        this.serverSeed = seedData.serverSeedData.seed;
    }

    currentRound = async (socket) => {
        const historyData = await turtleController.getLastRounds();
        const betHistoryData = await turtleController.getBetHistory();
        let response = { history: historyData, betHistory: betHistoryData };
        if (this.roundState === constant.round.state.started)
            response['stateData'] = {
                state: this.roundState,
                startTime: this.roundStartTime,
                winnerInfo: this.winnerInfo
            };
        else
            response['stateData'] = {
                state: this.roundState
            };
        socketManager.currentRoundResult(response, socket);
    }

    countDown = (callback) => {
        if (this.countDownTime < 0.0) {
            clearInterval(this.countDownInterval);
            this.roundState = constant.round.state.started;
            callback({ state: 'start' });
        }
        else {
            callback({ state: 'count', count: this.countDownTime.toFixed(2) });
            this.countDownTime -= constant.turtleraceInfo.countDown.interval;
        }
    }

    winnerLogic() {
        let betAmount = 0;
        this.betUsers.map((betUser) => {
            betAmount += betUser.betAmount
        });

        const hash = generateTurtleHash(this.serverSeed, this.roundNumber, betAmount);
        const value = parseInt(hash[0], 16);
        let winTurtle;
        if (value <= 5)
            winTurtle = 0;
        else if (value > 5 && value <= 10)
            winTurtle = 1;
        else
            winTurtle = 2;

        let resultTurtle = [];
        while (resultTurtle.length < constant.turtleraceInfo.turtleCount) {
            let number = randomNumber(constant.turtleraceInfo.turtleCount)
            let index = resultTurtle.findIndex((item) => item === number)
            if (index < 0) resultTurtle.push(number);
        }

        let topIndex = resultTurtle.findIndex((item) => item === 0);
        resultTurtle[topIndex] = resultTurtle[winTurtle];
        resultTurtle[winTurtle] = 0;
        return resultTurtle;
    }

    async addBetUser(data, socket) {
        if (this.roundState === constant.round.state.countDown) {
            if (!this.checkBetUser(data)) {
                let betUser = {
                    userId: data.userId,
                    betAmount: data.betAmount,
                    coinType: data.coinType,
                    xFactor: constant.turtleraceInfo.xFactor,
                    profit: 0,
                    turtleNum: data.turtleNum,
                    isWin: false,
                    userNickName: ''
                };
                const response = await turtleController.updateMyBalance({ userId: data.userId, balance: data.betAmount, coinType: data.coinType });
                if (response.status) {
                    betUser.userNickName = response.userData.userNickName;
                    this.betUsers.push(betUser);
                }
                socketManager.joinBetResult({ state: true, data: response }, socket);
                socketManager.newBetUser({ betUser });
            }
        }
        else {
            socketManager.joinBetResult({ state: false, data: data }, socket);
        }
    }

    async removeBetUser(data, socket) {
        let cancelUser;
        this.betUsers = this.betUsers.filter(item => {
            if (item.userId !== data.userId) {
                return true;
            }
            else {
                cancelUser = item;
                return false;
            }
        });
        const response = await turtleController.updateMyBalance({ userId: cancelUser.userId, balance: -cancelUser.betAmount, coinType: cancelUser.coinType });
        socketManager.cancelBetResult({ state: true, data: response }, socket);
        socketManager.removeBetUser({ cancelUser });
    }

    checkBetUser(data) {
        this.betUsers.map((item) => {
            if (item.userId === data.userId)
                return true
        });
        return false;
    }

    countDownRound(count) {
        socketManager.sendRoundCountDown(count);
    }

    startRound() {
        let self = this;
        this.winnerInfo = this.winnerLogic();
        socketManager.sendRoundStart(this.winnerInfo);
        this.roundStartTime = new Date();

        let topWinner = this.winnerInfo.findIndex((info) => info === 0);
        this.betUsers.map((betUser) => {
            if (betUser.turtleNum === topWinner) {
                betUser.isWin = true;
                betUser.profit = betUser.betAmount * betUser.xFactor;
            }
        });

        setTimeout(() => {
            turtleController.saveTurtleRound({ roundNumber: this.roundNumber, winnerInfo: this.winnerInfo, roundDate: this.roundDate, betUsers: this.betUsers, serverSeed: this.serverSeed })
                .then((result) => {
                    if (result) {
                        let historyData = [];
                        result.map((item) => {
                            const history = {
                                userId: item.betUserId,
                                gameType: 'turtle',
                                roundNumber: this.roundNumber,
                                betAmount: item.betAmount,
                                coinType: item.coinType,
                                payout: item.xFactor,
                                roundResult: item.isWin ? 'win' : 'lost',
                                roundState: true
                            };
                            historyData.push(history);
                        });
                        socketManager.sendBetHistory(historyData);
                    }

                    self.roundState = constant.round.state.finished;
                    socketManager.sendRoundStop(self.winnerInfo);
                    turtleController.updateBalances(self.betUsers)
                        .then(() => {
                            socketManager.balanceUpdated();
                        })
                        .catch((err) => {
                            console.error({ title: 'startRound => updateBalances', message: err.message });
                        });
                    setTimeout(() => {
                        socketManager.sendRoundFinished();
                        dataManager.createRound();
                    }, constant.turtleraceInfo.completeRound.time * 1000);
                })
                .catch((err) => {
                    console.error({ title: 'startRound => saveTurtleRound', message: err.message });
                });
        }, constant.turtleraceInfo.runRound.time * 1000);
    }
}