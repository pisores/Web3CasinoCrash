const DiceSocket = require('../socket/DiceSocket');
const ManageSocket = require('../socket/ManageSocket');

var diceSocket = null;
var manageSocket = null;

exports.createServer = (app) => {
    const server = require('http').createServer(app);
    diceSocket = new DiceSocket(server);
    manageSocket = new ManageSocket();
    return server;
}

exports.sendNewRoundData = (data) => {
    if (diceSocket === null)
        return;

    diceSocket.broadCast('newRound', data);
}

exports.sendBetResult = (data, socket) => {
    if (diceSocket === null)
        return;

    diceSocket.sendTo(socket, 'betResult', data);
}

exports.sendHistoryData = (data, socket) => {
    if (diceSocket === null)
        return;

    diceSocket.sendTo(socket, 'historyResult', data);
}

exports.sendBetHistory = (data) => {
    if (manageSocket !== null)
        manageSocket.newBetHistory(data);
}