const ManageController = require('../controller/ManageController');
const SocketManager = require('../manager/SocketManager');
const { getExchangeRateFromBinanceApi } = require('../../helper/mainHelper');

exports.newBetHistory = async (data) => {
    try {
        const response = await ManageController.saveBetHistory(data);
        if (response.status) {
            SocketManager.sendBetHistory(response.data);
        }
    }
    catch (err) {
        console.error({ title: 'Management => newBetHistory', message: err.message });
    }
};

exports.updateWargerAmount = async (data) => {
    try {
        const { userId, amount, coinType } = data;
        const rateResponse = await getExchangeRateFromBinanceApi(coinType.coinType);
        if (rateResponse.status) {
            const wargerAmount = amount * rateResponse.data;
            ManageController.updateWargerAmount({ wargerAmount, userId });
        }
    }
    catch (err) {
        console.error({ title: 'Management => updateWargerAmount', message: err.message });
    }
};