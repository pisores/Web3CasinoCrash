const Management = require('../data/Management');

var userSockets = [];

exports.addUserSocket = (userId, socket) => {
    if (!userId || this.getUserById(userId) !== null) return;

    userSockets.push({ userId, socket });
};

exports.removeUserSocket = (socket) => {
    const index = userSockets.findIndex(user => user.socket === socket);
    if (index >= 0) userSockets.splice(index, 1);
};

exports.getUserById = (userId) => {
    const index = userSockets.findIndex(user => user.userId === userId);
    if (index < 0) return null;
    else userSockets[index];
};

exports.newBetHistory = (data) => {
    Management.newBetHistory(data);
};

exports.updateWargerAmount = (data) => {
    Management.updateWargerAmount(data);
};