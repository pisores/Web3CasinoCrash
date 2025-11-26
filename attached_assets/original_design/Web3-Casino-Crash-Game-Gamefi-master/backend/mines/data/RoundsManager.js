const MinesRound = require('./MinesRound');
const MinesController = require('../controller/MinesController');
const SocketManager = require('../manager/SocketManager');
const { RoundResult } = require('../constant');

var AllMines = [];

const getRoundData = (data) => {
    try {
        let { userId } = data;
        let round = null;
        AllMines.map((minesRound) => {
            if (minesRound.isOwner(userId) && !minesRound.getFinished()) {
                round = minesRound;
            }
        });
        return round;
    }
    catch (err) {
        console.error({ title: 'RoundManager => getRoundData', message: err.message });
    }
}

const removeRound = async (data) => {
    try {
        let { userId, type } = data;
        let index = AllMines.findIndex((minesRound) => minesRound.isOwner(userId));
        if (index >= 0) {
            const roundData = AllMines[index];
            const result = await MinesController.saveMinesRound(roundData);
            if (result.status) {
                SocketManager.sendBetHistory({
                    userId: result.data.userId,
                    gameType: 'mines',
                    roundNumber: result.data.roundNumber,
                    betAmount: result.data.betAmount,
                    coinType: result.data.coinType,
                    payout: result.data.payout,
                    roundResult: result.data.roundResult,
                    roundState: true
                });
            }

            let balanceData;
            if (roundData.roundResult === RoundResult.payout || roundData.roundResult === RoundResult.finish) {
                let amount = Number(Number(roundData.betAmount * roundData.currentPayout).toFixed(6));
                const response = await MinesController.updateMyBalance({ userId: roundData.userId, coinType: roundData.coinType, betAmount: -amount, type });
                if (response.status)
                    balanceData = response.data;
            }

            AllMines.splice(index, 1);
            return { status: true, balanceData };
        }
    }
    catch (err) {
        console.error({ title: 'RoundManager => removeRound', message: err.message });
        return { status: false };
    }
}

exports.getMinesRound = async (data, socket) => {
    try {
        let { userId, betAmount, coinType, minesCount } = data;
        const roundData = getRoundData({ userId });
        if (roundData !== null) {
            SocketManager.sendBetResult({ status: true, currentPayout: roundData.currentPayout, nextPayout: roundData.nextPayout }, socket);
        }
        else {
            let seedData = await MinesController.getSeedData(userId);
            const balanceResult = await MinesController.updateMyBalance(data);
            if (balanceResult.status) {
                let minesData = new MinesRound({ userId, betAmount, coinType, minesCount, clientSeed: seedData.clientSeedData.seed, serverSeed: seedData.serverSeedData.seed });
                AllMines.push(minesData);
                SocketManager.sendBetResult({ status: true, currentPayout: minesData.currentPayout, nextPayout: minesData.nextPayout, balanceData: balanceResult.data }, socket);
            }
            else {
                SocketManager.sendBetResult({ status: false, message: balanceResult.message }, socket);
            }
        }
    }
    catch (err) {
        console.error({ title: 'RoundManager => getMinesRound', message: err.message });
    }
}

exports.pickCell = async (data, socket) => {
    try {
        const { userId, i, j } = data;
        const round = getRoundData({ userId });
        if (round !== null && !round.getFinished()) {
            const response = round.pickCell(i, j);
            SocketManager.sendPickCellResult({ ...response, i, j, currentPayout: round.currentPayout, nextPayout: round.nextPayout, diamondCount: round.diamondCount }, socket);
            if (response.status && response.info) {
                round.lostRound();
                await removeRound({ userId });
                SocketManager.sendRoundResult(round, socket);
            }
        }
    }
    catch (err) {
        console.error({ title: 'RoundManager => pickCell', message: err.message });
    }
}

exports.getActiveRound = (data, socket) => {
    try {
        const { userId } = data;
        const roundData = getRoundData({ userId });
        if (roundData !== null) {
            SocketManager.activeRoundResult({ status: true, roundData }, socket);
        }
        else {
            SocketManager.activeRoundResult({ status: false }, socket);
        }
    }
    catch (err) {
        console.error({ title: 'RoundManager => getActiveRound', message: err.message });
    }
}

exports.finishRound = async (data, socket) => {
    try {
        const { userId } = data;
        const round = getRoundData({ userId });
        let response;
        if (round.getCellPicked()) {
            round.payoutRound();
            response = await removeRound({ userId });
        }
        else {
            round.finishRound();
            response = await removeRound({ userId, type: 'finish' });
        }
        if (response.status)
            SocketManager.sendRoundResult({ ...round, balanceData: response.balanceData }, socket);
        else
            SocketManager.sendRoundResult({ ...round }, socket);
    }
    catch (err) {
        console.error({ title: 'RoundManager => pickCell', message: err.message });
    }
}