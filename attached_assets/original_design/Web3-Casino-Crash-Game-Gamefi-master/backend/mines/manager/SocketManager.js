const MinesSocket = require('../socket/MinesSocket');
const ManageSocket = require('../socket/ManageSocket');

var minesSocket = null;
var manageSocket = null;

exports.createServer = (app) => {
    const server = require('http').createServer(app);
    minesSocket = new MinesSocket(server);
    manageSocket = new ManageSocket();
    return server;
}

exports.sendBetResult = (data, socket) => {
    if (minesSocket === null)
        return;

    minesSocket.sendTo(socket, 'joinBetResult', data);
}

exports.sendPickCellResult = (data, socket) => {
    if (minesSocket === null)
        return;

    minesSocket.sendTo(socket, 'pickCellResult', data);
}

exports.sendRoundResult = (data, socket) => {
    if (minesSocket === null)
        return;

    minesSocket.sendTo(socket, 'roundResult', data);
}

exports.activeRoundResult = (data, socket) => {
    if (minesSocket === null)
        return;

    minesSocket.sendTo(socket, 'activeRoundResult', data);
}

exports.sendBetHistory = (data) => {
    if (manageSocket !== null)
        manageSocket.newBetHistory(data);
}