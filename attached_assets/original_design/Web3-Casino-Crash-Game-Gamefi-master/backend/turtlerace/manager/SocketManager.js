const TurtleraceSocket = require('../socket/TurtleSocket');
const ManageSocket = require('../socket/ManageSocket');

var turtleSocket = null;
var manageSocket = null;

exports.createServer = (app) => {
    const server = require('http').createServer(app);
    turtleSocket = new TurtleraceSocket(server);
    manageSocket = new ManageSocket();
    return server;
}

exports.sendRoundCountDown = (data) => {
    if (turtleSocket === null)
        return;

    turtleSocket.broadCast('countDown', data);
}

exports.sendRoundStart = (data) => {
    if (turtleSocket === null)
        return;

    turtleSocket.broadCast('roundStart', data);
}

exports.sendRoundStop = (data) => {
    if (turtleSocket === null)
        return;

    turtleSocket.broadCast('roundStop', data);
}

exports.sendRoundFinished = (data) => {
    if (turtleSocket === null)
        return;

    turtleSocket.broadCast('roundFinished', data);
}

exports.joinBetResult = (data, socket) => {
    if (turtleSocket === null)
        return;

    turtleSocket.sendTo(socket, 'joinBetResult', data);
}

exports.newBetUser = (data) => {
    if (turtleSocket === null)
        return;

    turtleSocket.broadCast('newBetUser', data);
}

exports.removeBetUser = (data) => {
    if (turtleSocket === null)
        return;

    turtleSocket.broadCast('removeBetUser', data);
}

exports.cancelBetResult = (data, socket) => {
    if (turtleSocket === null)
        return;

    turtleSocket.sendTo(socket, 'cancelBetResult', data);
}

exports.currentRoundResult = (data, socket) => {
    if (turtleSocket === null)
        return;

    turtleSocket.sendTo(socket, 'currentRoundResult', data);
}

exports.balanceUpdated = () => {
    if (turtleSocket === null)
        return;

    turtleSocket.broadCast('balanceUpdated');
}

exports.sendBetHistory = (data) => {
    if (manageSocket !== null)
        manageSocket.newBetHistory(data);
}