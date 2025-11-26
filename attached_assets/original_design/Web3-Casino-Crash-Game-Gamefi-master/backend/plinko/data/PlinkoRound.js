const { generatePlinkoHash } = require('../../helper/mainHelper');
const socketManager = require('../manager/SocketManager');
const { v4: uuidv4 } = require('uuid');
const plinkoController = require('../controller/PlinkoController');

const payoutDefaultValue = [
    {
        "low": [5.6, 2.1, 1.1, 1, 0.5, 1, 1.1, 2.1, 5.6],
        "medium": [13, 3, 1.3, 0.7, 0.4, 0.7, 1.3, 3, 13],
        "high": [29, 4, 1.5, 0.3, 0.2, 0.3, 1.5, 4, 29],
    },
    {
        "low": [5.6, 2, 1.6, 1, 0.7, 0.7, 1, 1.6, 2, 5.6],
        "medium": [18, 4, 1.7, 0.9, 0.5, 0.5, 0.9, 1.7, 4, 18],
        "high": [43, 7, 2, 0.6, 0.2, 0.2, 0.6, 2, 7, 43],
    },
    {
        "low": [8.9, 3, 1.4, 1.1, 1, 0.5, 1, 1.1, 1.4, 3, 8.9],
        "medium": [22, 5, 2, 1.4, 0.6, 0.4, 0.6, 1.4, 2, 5, 22],
        "high": [76, 10, 3, 0.9, 0.3, 0.2, 0.3, 0.9, 3, 10, 76],
    },
    {
        "low": [8.4, 3, 1.9, 1.3, 1, 0.7, 0.7, 1, 1.3, 1.9, 3, 8.4],
        "medium": [24, 6, 3, 1.8, 0.7, 0.5, 0.5, 0.7, 1.8, 3, 6, 24],
        "high": [120, 14, 5.2, 1.4, 0.4, 0.2, 0.2, 0.4, 1.4, 5.2, 14, 120],
    },
    {
        "low": [10, 3, 1.6, 1.4, 1.1, 1, 0.5, 1, 1.1, 1.4, 1.6, 3, 10],
        "medium": [33, 11, 4, 2, 1.1, 0.6, 0.3, 0.6, 1.1, 2, 4, 11, 33],
        "high": [170, 24, 8.1, 2, 0.7, 0.2, 0.2, 0.2, 0.7, 2, 8.1, 24, 170],
    },
    {
        "low": [8.1, 4, 3, 1.9, 1.2, 0.9, 0.7, 0.7, 0.9, 1.2, 1.9, 3, 4, 8.1],
        "medium": [43, 13, 6, 3, 1.3, 0.7, 0.4, 0.4, 0.7, 1.3, 3, 6, 13, 43],
        "high": [260, 37, 11, 4, 1, 0.2, 0.2, 0.2, 0.2, 1, 4, 11, 37, 260],
    },
    {
        "low": [7.1, 4, 1.9, 1.4, 1.3, 1.1, 1, 0.5, 1, 1.1, 1.3, 1.4, 1.9, 4, 7.1],
        "medium": [58, 15, 7, 4, 1.9, 1, 0.5, 0.2, 0.5, 1, 1.9, 4, 7, 15, 58],
        "high": [420, 56, 18, 5, 1.9, 0.3, 0.2, 0.2, 0.2, 0.3, 1.9, 5, 18, 56, 420],
    },
    {
        "low": [15, 8, 3, 2, 1.5, 1.1, 1, 0.7, 0.7, 1, 1.1, 1.5, 2, 3, 8, 15],
        "medium": [88, 18, 11, 5, 3, 1.3, 0.5, 0.3, 0.3, 0.5, 1.3, 3, 5, 11, 18, 88],
        "high": [620, 83, 27, 8, 3, 0.5, 0.2, 0.2, 0.2, 0.2, 0.5, 3, 8, 27, 83, 620],
    },
    {
        "low": [16, 9, 2, 1.4, 1.4, 1.2, 1.1, 1, 0.5, 1, 1.1, 1.2, 1.4, 1.4, 2, 9, 16],
        "medium": [110, 41, 10, 5, 3, 1.5, 1, 0.5, 0.3, 0.5, 1, 1.5, 3, 5, 10, 41, 110],
        "high": [1000, 130, 26, 9, 4, 2, 0.2, 0.2, 0.2, 0.2, 0.2, 2, 4, 9, 26, 130, 1000],
    },
];
const pascalTriangleResult = [
    [1, 9, 37, 93, 163, 219, 247, 255, 256],
    [1, 10, 46, 130, 256, 382, 466, 502, 511, 512],
    [1, 11, 56, 176, 386, 638, 848, 968, 1013, 1023, 1024],
    [1, 12, 67, 232, 562, 1024, 1486, 1816, 1981, 2036, 2047, 2048],
    [1, 13, 79, 299, 794, 1586, 2510, 3302, 3797, 4017, 4083, 4095, 4096],
    [1, 14, 92, 378, 1093, 2380, 4096, 5812, 7099, 7814, 8100, 8178, 8191, 8192],
    [1, 15, 106, 470, 1471, 3473, 6476, 9908, 12911, 14913, 15914, 16278, 16369, 16383, 16384],
    [1, 16, 121, 576, 1941, 4944, 9949, 16384, 22819, 27824, 30827, 32192, 32647, 32752, 32767, 32768],
    [1, 17, 137, 697, 2517, 6885, 14893, 26333, 39203, 50643, 58651, 63019, 64839, 65399, 65519, 65535, 65536],
];

const ROWS = { min: 8, max: 16 };

exports.getPlinkoResult = async (data, socket) => {
    try {
        let { userId, betAmount, coinType, rowCount, risk } = data;
        const seedData = await plinkoController.getSeedData(userId);
        const roundNumber = uuidv4();
        const fairResult = plinkoFairResult(seedData.serverSeedData.seed, seedData.clientSeedData.seed, roundNumber, rowCount, risk);
        const payout = Number(payoutDefaultValue[rowCount - ROWS.min][risk][fairResult.index]);
        const roundResult = payout > 1 ? 'win' : payout === 1 ? 'draw' : 'lost';

        const response = await plinkoController.savePlinkoRound({
            serverSeed: seedData.serverSeedData.seed,
            clientSeed: seedData.clientSeedData.seed,
            roundNumber,
            userId,
            betAmount,
            rowCount,
            risk,
            payout
        });
        if (response.status) {
            socketManager.sendBetResult({ ...response, fairResult }, socket);
            socketManager.sendBetHistory({
                userId: userId,
                gameType: 'plinko',
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
        console.error({ title: 'Plinko Round => getPlinkoResult', message: err.message });
    }
}

const plinkoFairResult = (serverSeed, clientSeed, roundNumber, rowCount, risk) => {
    const hash = generatePlinkoHash(serverSeed, clientSeed, roundNumber, rowCount, risk);
    const dec = parseInt(hash.substring(0, 5), 16) % Math.pow(2, rowCount);
    let outComeData = { index: 0, value: 0 };
    pascalTriangleResult[rowCount - ROWS.min].map((item, index) => {
        if (index === 0) {
            if (item === dec) {
                outComeData = { index: index, value: item };
            }
        }
        else {
            if (dec > pascalTriangleResult[rowCount - ROWS.min][index - 1] && dec <= item) {
                outComeData = { index: index, value: item };
            }
        }
    });
    return outComeData;
}