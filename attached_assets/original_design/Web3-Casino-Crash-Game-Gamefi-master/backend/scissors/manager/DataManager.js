const ScissorsRound = require('../data/ScissorsRound');

var userSockets = [];

exports.addUserSocket = (userId, socket) => {
    if (!userId || this.getUserById(userId) !== null) return;

    userSockets.push({ userId, socket });
};

exports.removeUserSocket = (socket) => {
    const index = userSockets.findIndex(user => user.socket === socket);
    if (index >= 0) userSockets.splice(index, 1);
};

exports.joinBet = (data, socket) => {
    ScissorsRound.getScissorsResult(data, socket);
};

exports.getHistory = (data, socket) => {
    ScissorsRound.getHistory(data, socket);
};