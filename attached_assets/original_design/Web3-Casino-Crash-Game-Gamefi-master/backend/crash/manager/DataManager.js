const CrashRound = require('../data/CrashRound');

var crashRound = null;

exports.createRound = (waitingBetUsers) => {
    if (crashRound !== null) {
        delete crashRound;
        crashRound = null;
    }

    crashRound = new CrashRound(waitingBetUsers);
}

exports.addBetUser = (data, socket) => {
    if (crashRound === null)
        return;

    crashRound.addBetUser(data, socket);
}

exports.removeBetUser = (data, socket) => {
    if (crashRound === null)
        return;

    crashRound.removeBetUser(data, socket);
}

exports.cashoutBet = (data, socket) => {
    if (crashRound === null)
        return;

    crashRound.cashoutBetUser(data, socket);
}

exports.getInitData = (data, socket) => {
    if (crashRound === null)
        return;

    crashRound.getInitData(data, socket);
}