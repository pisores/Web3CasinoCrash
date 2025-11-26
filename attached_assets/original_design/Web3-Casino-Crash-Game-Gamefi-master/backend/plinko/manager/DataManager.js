const PlinkoRound = require('../data/PlinkoRound');

exports.joinBet = (data, socket) => {
    PlinkoRound.getPlinkoResult(data, socket);
};