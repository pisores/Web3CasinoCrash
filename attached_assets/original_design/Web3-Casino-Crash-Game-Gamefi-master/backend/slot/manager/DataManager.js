const SlotRound = require('../data/SlotRound');
var userSockets = [];

exports.addUserSocket = (userId, socket) => {
    if (!userId || this.getUserById(userId) !== null)
        return;

    userSockets.push({ userId, socket });
};

exports.removeUserSocket = (socket) => {
    const index = userSockets.findIndex(user => user.socket === socket);
    if (index >= 0)
        userSockets.splice(index, 1);
};

exports.getUserById = (id) => {
    const userSocket = userSockets.find(item => item.userId === id);
    if (userSocket === undefined)
        return null;

    return userSocket;
}

exports.joinBet = (data, socket) => {
    SlotRound.getSlotResult(data, socket);
};