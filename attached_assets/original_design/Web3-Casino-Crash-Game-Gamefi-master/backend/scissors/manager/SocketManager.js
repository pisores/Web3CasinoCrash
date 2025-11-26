const ScissorsSocket = require('../socket/ScissorsSocket');
const ManageSocket = require('../socket/ManageSocket');

var scissorsSocket = null;
var manageSocket = null;

exports.createServer = (app) => {
    const server = require('http').createServer(app);
    scissorsSocket = new ScissorsSocket(server);
    manageSocket = new ManageSocket();
    return server;
}

exports.sendNewRoundData = (data) => {
    if (scissorsSocket === null)
        return;

    scissorsSocket.broadCast('newRound', data);
}

exports.sendBetResult = (data, socket) => {
    if (scissorsSocket === null)
        return;

    scissorsSocket.sendTo(socket, 'betResult', data);
}

exports.sendHistoryData = (data, socket) => {
    if (scissorsSocket === null)
        return;

    scissorsSocket.sendTo(socket, 'historyResult', data);
}

exports.sendBetHistory = (data) => {
    if (manageSocket !== null)
        manageSocket.newBetHistory(data);
}