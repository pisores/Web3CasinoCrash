const { generateDiceHash } = require('../../helper/mainHelper');
const socketManager = require('../manager/SocketManager');
const diceController = require('../controller/DiceController');
const { v4: uuidv4 } = require('uuid');

const ChanceData = [
    { over: 3, under: 11, payout: 1.03, percent: [20, 40, 60, 80, 100, 120] },
    { over: 4, under: 10, payout: 1.14, percent: [20, 40, 60, 80, 100, 120] },
    { over: 5, under: 9, payout: 1.31, percent: [20, 40, 60, 80, 100, 120] },
    { over: 6, under: 8, payout: 1.62, percent: [15, 30, 60, 90, 105, 120] },
    { over: 7, under: 7, payout: 2.28, percent: [15, 30, 60, 90, 105, 120] },
    { over: 8, under: 6, payout: 3.42, percent: [15, 30, 60, 90, 105, 120] },
    { over: 9, under: 5, payout: 5.70, percent: [10, 30, 60, 90, 110, 120] },
    { over: 10, under: 4, payout: 11.40, percent: [10, 30, 60, 90, 110, 120] },
    { over: 11, under: 3, payout: 34.20, percent: [10, 30, 60, 90, 110, 120] }
];

exports.getDiceResult = async (data, socket) => {
    try {
        let { userId, betAmount, coinType, isOver, difficulty } = data;
        const seedData = await diceController.getSeedData(userId);
        const roundNumber = uuidv4();

        const payout = ChanceData[difficulty].payout;
        const fairData = diceFairResult(seedData.serverSeedData.seed, seedData.clientSeedData.seed, roundNumber, difficulty);
        const roundResult = calcRoundResult(isOver, difficulty, fairData);

        const response = await diceController.saveDiceRound({ roundNumber, userId, betAmount, coinType, difficulty, isOver, payout, fairData, roundResult, serverSeed: seedData.serverSeedData.seed, clientSeed: seedData.clientSeedData.seed });
        if (response.status) {
            socketManager.sendBetResult(response, socket);
            socketManager.sendBetHistory({
                userId: userId,
                gameType: 'dice',
                roundNumber: roundNumber,
                betAmount: betAmount,
                coinType: coinType,
                payout: payout,
                roundResult: roundResult,
                roundState: true
            });
        }
        else {
            socketManager.sendBetResult(response, socket);
        }
    }
    catch (err) {
        console.error({ title: 'DiceRound => getDiceResult', message: err.message });
    }
}

exports.getHistory = async (data, socket) => {
    try {
        const { userId } = data;
        const response = await diceController.getHistory({ userId });
        socketManager.sendHistoryData({ history: response }, socket);
    }
    catch (err) {
        console.error({ title: 'ScissorsRound => getHistory', message: err.message });
    }
}

const diceFairResult = (serverSeed, clientSeed, roundNumber, difficulty) => {
    try {
        const hash = {
            l: generateDiceHash(serverSeed, clientSeed, roundNumber, 1),
            r: generateDiceHash(serverSeed, clientSeed, roundNumber, 2)
        };
        const decValue = {
            l: parseInt(hash.l.substring(0, 5), 16) % 120,
            r: parseInt(hash.r.substring(0, 5), 16) % 120
        };
        let value = {
            l: 0,
            r: 0
        };
        if (decValue.l > 0 && decValue.r < 10) {
            value.l = 1;
        }
        ChanceData[difficulty].percent.map((data, index) => {
            let over = index === 0 ? 0 : ChanceData[difficulty].percent[index - 1];
            let under = data;
            if (decValue.l >= over && decValue.l < under) {
                value.l = index + 1;
            }
            if (decValue.r >= over && decValue.r < under) {
                value.r = index + 1;
            }
        });

        return value;
    }
    catch (err) {
        console.error({ title: 'DiceRound => diceFairResult', message: err.message });
    }
}

const calcRoundResult = (isOver, difficulty, fairData) => {
    try {
        let fairSum = fairData.l + fairData.r;
        if (isOver) {
            let overData = ChanceData[difficulty].over;
            if (fairSum > overData)
                return 'win';
            else
                return 'lost';
        }
        else {
            let underData = ChanceData[difficulty].under;
            if (fairSum < underData)
                return 'win';
            else
                return 'lost';
        }
    }
    catch (err) {
        console.error({ title: 'DiceRound => calcRoundResult', message: err.message });
    }
}