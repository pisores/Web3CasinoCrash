const mongoose = require('mongoose');
const { generateSeed } = require('../../helper/mainHelper');
const models = require('../../models/index');
const SocketManager = require('../manager/SocketManager');

exports.getSeedData = async (userId) => {
    try {
        let clientSeedData = await models.seedModel.findOne({ userId: userId, type: 'client' }).sort({ date: -1 });
        if (!clientSeedData) {
            clientSeedData = await new models.seedModel({ userId: mongoose.Types.ObjectId(userId), type: 'client', seed: generateSeed(), date: new Date() }).save();
        }
        let serverSeedData = await models.seedModel.findOne({ type: 'server' }).sort({ date: -1 });
        if (!serverSeedData) {
            serverSeedData = await new models.seedModel({ type: 'server', seed: generateSeed(), date: new Date() }).save();
        }
        return { serverSeedData, clientSeedData };
    }
    catch (err) {
        console.error({ title: 'PlinkoController => getSeedData', message: err.message });
        return { status: false, message: err.message };
    }
}

exports.savePlinkoRound = async (data) => {
    try {
        const { serverSeed, clientSeed, roundNumber, userId, betAmount, rowCount, risk, payout } = data;
        const userData = await models.userModel.findOne({ _id: userId });

        const currencyIndex = userData.balance.data.findIndex(item => (item.coinType === userData.currency.coinType && item.type === userData.currency.type));
        if (userData.balance.data[currencyIndex].balance < Number(data.betAmount)) {
            return { status: false, message: 'Not enough balance' };
        }
        else {
            SocketManager.requestWargerAmountUpdate({ userId: userId, amount: betAmount, coinType: userData.currency });
            const roundData = await new models.plinkoRoundModel({
                roundNumber: roundNumber,
                userId: userId,
                betAmount: betAmount,
                coinType: userData.currency,
                payout: payout,
                rows: rowCount,
                risk: risk,
                serverSeed: serverSeed,
                clientSeed: clientSeed,
                roundDate: new Date()
            }).save();
            userData.balance.data[currencyIndex].balance = userData.balance.data[currencyIndex].balance + betAmount * (payout - 1);
            await models.userModel.findOneAndUpdate({ _id: data.userId }, { balance: userData.balance });
            return { status: true, data: userData, roundData: roundData };
        }
    }
    catch (err) {
        console.error({ title: 'PlinkoController => savePlinkoRound', message: err.message });
        return { status: false, message: err.message };
    }
}