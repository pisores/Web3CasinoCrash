const models = require('../../models/index');
const SocketManager = require('../manager/SocketManager');
const { generateSeed } = require('../../helper/mainHelper');
const mongoose = require('mongoose');
const { ROUND_STATUS } = require('../constant');

exports.createCrashRound = async (data) => {
    try {
        const { roundNumber, roundDate, serverSeed, roundStatus } = data;
        const exist = await models.crashRoundModel.findOne({ roundNumber });
        if (exist)
            return { status: false, message: 'Already exist' };

        const response = await new models.crashRoundModel({ roundNumber, roundDate, serverSeed, roundStatus }).save();
        return { status: true, data: response };
    }
    catch (err) {
        console.error({ title: 'CrashController - createCrashRound', message: err.message });
        return { status: false, message: 'Server Error' };
    }
}

exports.updateCrashRound = async (data) => {
    try {
        const { roundNumber, fairResult, roundStatus } = data;
        const exist = await models.crashRoundModel.findOne({ roundNumber });
        if (!exist)
            return { status: false, message: 'Not exist' };

        await models.crashRoundModel.findOneAndUpdate({ roundNumber }, { fairResult, roundStatus });
        return { status: true };
    }
    catch (err) {
        console.error({ title: 'CrashController - updateCrashRound', message: err.message });
        return { status: false, message: 'Server Error' };
    }
}

exports.updatePlayerBalance = async (data, warger = false) => {
    try {
        const { userId, amount } = data;
        if (!userId)
            return { status: false, message: 'Invalid Request' };

        let userData = await models.userModel.findOne({ _id: userId });
        if (!userData)
            return { status: false, message: 'User not found' };

        const currencyIndex = userData.balance.data.findIndex(item => (item.coinType === userData.currency.coinType && item.type === userData.currency.type));
        if (userData.balance.data[currencyIndex].balance < Number(amount))
            return { status: false, message: 'Not enough balance' };
        else {
            if (warger)
                SocketManager.requestWargerAmountUpdate({ userId: userId, amount: amount, coinType: userData.currency });

            userData.balance.data[currencyIndex].balance = userData.balance.data[currencyIndex].balance - Number(amount);
            await models.userModel.findOneAndUpdate({ _id: userId }, { balance: userData.balance });
            SocketManager.requestBalanceUpdate(userData);

            let clientSeedData = await models.seedModel.findOne({ userId: userId, type: 'client' }).sort({ date: -1 });
            if (!clientSeedData)
                clientSeedData = await new models.seedModel({ userId: mongoose.Types.ObjectId(userId), type: 'client', seed: generateSeed(), date: new Date() }).save();

            return { status: true, data: { userNickName: userData.userNickName, seed: clientSeedData.seed } };
        }
    }
    catch (err) {
        console.error({ title: 'CrashController - updatePlayerBalance', message: err.message });
        return { status: false, message: 'Server Error' };
    }
}

exports.createCrashBetHistory = async (data) => {
    try {
        const { userId, betAmount, coinType, roundId, seed } = data;
        const exist = await models.crashBetHistoryModel.findOne({ crashRoundId: roundId, betUserId: userId });
        if (exist)
            return { status: false, message: 'Already saved' };

        const response = await new models.crashBetHistoryModel({
            crashRoundId: roundId,
            betUserId: userId,
            payout: 0,
            betAmount,
            coinType,
            seed
        }).save();
        return { status: true, data: response };
    }
    catch (err) {
        console.error({ title: 'CrashController - insertCrashBetHistory', message: err.message });
        return { status: false, message: 'Server Error' };
    }
}

exports.removeCrashBetHistory = async (data) => {
    try {
        const { userId, roundId } = data;
        const exist = await models.crashBetHistoryModel.findOne({ crashRoundId: roundId, betUserId: userId });
        if (!exist)
            return { status: false, message: 'Not exist' };

        await models.crashBetHistoryModel.findOneAndDelete({ crashRoundId: roundId, betUserId: userId });
        return { status: true };
    }
    catch (err) {
        console.error({ title: 'CrashController - removeCrashBetHistory', message: err.message });
        return { status: false, message: 'Server Error' };
    }
}

exports.updateCrashBetHistory = async (data) => {
    try {
        const { userId, roundId, payout } = data;
        const exist = await models.crashBetHistoryModel.findOne({ crashRoundId: roundId, betUserId: userId });
        if (!exist)
            return { status: false, message: 'Not exist' };

        await models.crashBetHistoryModel.findOneAndUpdate({ crashRoundId: roundId, betUserId: userId }, { payout });
        return { status: true };
    }
    catch (err) {
        console.error({ title: 'CrashController - updateCrashBetHistory', message: err.message });
        return { status: false, message: 'Server Error' };
    }
}

exports.getCrashRoundHistory = async () => {
    try {
        const history = await models.crashRoundModel.find({ roundStatus: ROUND_STATUS.FINISHED }).sort({ roundDate: -1 }).limit(5);
        return { status: true, data: history };
    }
    catch (err) {
        console.error({ title: 'CrashController - getCrashRoundHistory', message: err.message });
        return { status: false, message: 'Server Error' };
    }
}