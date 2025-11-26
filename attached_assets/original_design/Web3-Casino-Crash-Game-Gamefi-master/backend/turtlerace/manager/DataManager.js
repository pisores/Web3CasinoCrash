const TurtleRaceRound = require("../data/TurtleRound");

var userSockets = [];

var isReady = false;
var turtleRound = null;

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

exports.setGameReady = (value) => {
    isReady = value;
};

exports.isGameReady = () => {
    return isReady;
};

exports.createRound = () => {
    if (turtleRound !== null) {
        delete turtleRound;
        turtleRound = null;
    }

    turtleRound = new TurtleRaceRound();
};

exports.addBetUser = (data, socket) => {
    if (turtleRound === null) return;

    turtleRound.addBetUser(data, socket)
};

exports.removeBetUser = (data, socket) => {
    if (turtleRound === null) return;

    turtleRound.removeBetUser(data, socket);
};

exports.currentRound = (socket) => {
    if (turtleRound === null) return;

    turtleRound.currentRound(socket);
}