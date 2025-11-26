const ManageSocket = require('./ManageSocket');

const manageSocket = new ManageSocket();

exports.requestBalanceUpdate = (data) => {
    manageSocket.userBalanceUpdated(data);
}

exports.requestWargerAmountUpdate = (data) => {
    manageSocket.updateWargerAmount(data);
}