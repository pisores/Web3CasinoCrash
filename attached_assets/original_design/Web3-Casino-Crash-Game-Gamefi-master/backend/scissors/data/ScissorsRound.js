const { generateScissorHash, randomNumber } = require('../../helper/mainHelper');
const socketManager = require('../manager/SocketManager');
const scissorsController = require('../controller/ScissorsController');
const { v4: uuidv4 } = require('uuid');

//0: rock, 1: scissors, 2: paper

exports.getScissorsResult = async (data, socket) => {
    try {
        let { playerNumber, userId, betAmount, coinType } = data;
        if (playerNumber === 3) {
            playerNumber = randomNumber(3);
        }
        const seedData = await scissorsController.getSeedData(userId);
        const roundNumber = uuidv4();
        const dealerNumber = scissorsWinner(seedData.serverSeedData.seed, seedData.clientSeedData.seed, roundNumber);
        const result = checkWinner(playerNumber, dealerNumber);
        const response = await scissorsController.saveScissorsRound({ userId, betAmount, playerNumber, dealerNumber, result, coinType, roundNumber, clientSeed: seedData.clientSeedData.seed, serverSeed: seedData.serverSeedData.seed });
        socketManager.sendBetResult({ playerNumber, dealerNumber, winResult: result, result: response }, socket);
        if (response.status) {
            setTimeout(() => {
                socketManager.sendBetHistory({
                    userId: response.roundData.userId,
                    gameType: 'scissor',
                    roundNumber: response.roundData.roundNumber,
                    betAmount: response.roundData.betAmount,
                    coinType: response.roundData.coinType,
                    payout: response.roundData.payout,
                    roundResult: response.roundData.roundResult,
                    roundState: true
                });
                socketManager.sendNewRoundData(response);
            }, 7000);
        }
    }
    catch (err) {
        console.error({ title: 'ScissorsRound => getScissorsResult', message: err.message });
    }
}

exports.getHistory = async (data, socket) => {
    try {
        const { userId } = data;
        const response = await scissorsController.getHistory({ userId });
        socketManager.sendHistoryData({ history: response }, socket);
    }
    catch (err) {
        console.error({ title: 'ScissorsRound => getHistory', message: err.message });
    }
}

const scissorsWinner = (serverSeed, clientSeed, roundNumber) => {
    const hash = generateScissorHash(serverSeed, clientSeed, roundNumber);
    const value = parseInt(hash[0], 16);
    let winScissors;
    if (value <= 5)
        winScissors = 0;
    else if (value > 5 && value <= 10)
        winScissors = 1;
    else
        winScissors = 2;
    return winScissors;
}

const checkWinner = (player, dealer) => {
    switch (player) {
        case 0:
            if (dealer === 1) return 'win';
            else if (dealer === 2) return 'lost';
            else return 'draw';
        case 1:
            if (dealer === 2) return 'win';
            else if (dealer === 0) return 'lost';
            else return 'draw';
        case 2:
            if (dealer === 0) return 'win';
            else if (dealer === 1) return 'lost';
            else return 'draw';
        default:
            return '';
    };
}