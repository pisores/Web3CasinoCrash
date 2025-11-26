const ManageSocket = require('./ManageSocket');

const manageSocket = new ManageSocket();

exports.requestBalanceUpdate = (data) => {
    manageSocket.userBalanceUpdated(data);
}

exports.userDepositSuccess = (data) => {
    manageSocket.userDepositSuccess(data);
}

exports.userWithdrawSuccess = (data) => {
    manageSocket.userWithdrawSuccess(data);
}