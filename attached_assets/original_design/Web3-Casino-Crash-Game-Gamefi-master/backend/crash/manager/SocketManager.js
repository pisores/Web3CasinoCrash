const CrashSocket = require('../socket/CrashSocket');
const ManageSocket = require('../socket/ManageSocket');

var crashSocket = null;
var manageSocket = null;

exports.createServer = (app) => {
    const server = require('http').createServer(app);
    crashSocket = new CrashSocket(server);
    manageSocket = new ManageSocket();
    return server;
}

exports.sendBetHistory = (data) => {
    if (manageSocket !== null)
        manageSocket.newBetHistory(data);
}

exports.requestBalanceUpdate = (data) => {
    if (manageSocket !== null)
        manageSocket.userBalanceUpdated(data);
}

exports.requestWargerAmountUpdate = (data) => {
    if (manageSocket !== null)
        manageSocket.updateWargerAmount(data);
}

exports.reportRoundStatus = (data) => {
    if (crashSocket === null)
        return;

    crashSocket.broadCast('reportStatus', data);
}

exports.joinBetResult = (data, socket) => {
    if (crashSocket === null)
        return;

    crashSocket.sendTo(socket, 'joinBetResult', data);
}

exports.cancelBetResult = (data, socket) => {
    if (crashSocket === null)
        return;

    crashSocket.sendTo(socket, 'cancelBetResult', data);
}

exports.cashoutBetResult = (data, socket) => {
    if (crashSocket === null)
        return;

    crashSocket.sendTo(socket, 'cashoutBetResult', data);
}

exports.newBetUser = (data) => {
    if (crashSocket === null)
        return;

    crashSocket.broadCast('newBetUser', data);
}

exports.newCashout = (data) => {
    if (crashSocket === null)
        return;

    crashSocket.broadCast('newCashout', data);
}

exports.removeBetUser = (data) => {
    if (crashSocket === null)
        return;

    crashSocket.broadCast('removeBetUser', data);
}

exports.getInitDataResponse = (data, socket) => {
    if (crashSocket === null)
        return;

    crashSocket.sendTo(socket, 'getInitDataResponse', data);
}