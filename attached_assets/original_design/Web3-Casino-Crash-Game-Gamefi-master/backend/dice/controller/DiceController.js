const mongoose = require('mongoose');
const { generateSeed } = require('../../helper/mainHelper');
const models = require('../../models/index');
const { requestWargerAmountUpdate } = require('../socket/Manager');

exports.saveDiceRound = async (data) => {
    try {
        const userData = await models.userModel.findOne({ _id: data.userId });

        const currencyIndex = userData.balance.data.findIndex(item => (item.coinType === userData.currency.coinType && item.type === userData.currency.type));
        if (userData.balance.data[currencyIndex].balance < Number(data.betAmount)) {
            return { status: false, message: 'Not enough balance' };
        }
        else {
            requestWargerAmountUpdate({ userId: data.userId, amount: data.betAmount, coinType: userData.currency });
            const roundData = await new models.diceRoundModel({
                roundNumber: data.roundNumber,
                userId: data.userId,
                betAmount: data.betAmount,
                coinType: data.coinType,
                difficulty: data.difficulty,
                isOver: data.isOver,
                payout: data.payout,
                fairData: data.fairData,
                roundResult: data.roundResult,
                serverSeed: data.serverSeed,
                clientSeed: data.clientSeed,
                roundDate: new Date()
            }).save();
            if (data.roundResult === 'win') {
                userData.balance.data[currencyIndex].balance = userData.balance.data[currencyIndex].balance + data.betAmount * (data.payout - 1);
                await models.userModel.findOneAndUpdate({ _id: data.userId }, { balance: userData.balance });
            }
            else if (data.roundResult === 'lost') {
                userData.balance.data[currencyIndex].balance = userData.balance.data[currencyIndex].balance - data.betAmount;
                await models.userModel.findOneAndUpdate({ _id: data.userId }, { balance: userData.balance });
            }
            return { status: true, data: userData, roundData: roundData };
        }
    }
    catch (err) {
        console.error({ title: 'diceController => saveDiceRound', message: err.message });
        return { status: false, message: err.message };
    }
}

exports.getHistory = async (data) => {
    try {
        const { userId } = data;
        const historyData = await models.diceRoundModel.find({ userId }).sort({ roundDate: '-1' }).limit(5);
        return historyData;
    }
    catch (err) {
        console.error({ title: 'diceController => getHistory', message: err.message });
        return { status: false, message: err.message };
    }
}

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
        console.error({ title: 'diceController => getSeedData', message: err.message });
        return { status: false, message: err.message };
    }
}