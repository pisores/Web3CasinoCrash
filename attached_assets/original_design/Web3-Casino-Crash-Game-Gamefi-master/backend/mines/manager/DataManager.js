const RoundsManager = require('../data/RoundsManager');

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
    RoundsManager.getMinesRound(data, socket);
};

exports.finishBet = (data, socket) => {
    RoundsManager.finishRound(data, socket);
};

exports.pickCell = (data, socket) => {
    RoundsManager.pickCell(data, socket);
};

exports.getActiveRound = (data, socket) => {
    RoundsManager.getActiveRound(data, socket);
};