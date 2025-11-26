const mongoose = require('mongoose');
const { generateSeed } = require('../../helper/mainHelper');
const models = require('../../models/index');
const { requestWargerAmountUpdate } = require('../socket/Manager');

exports.updateMyBalance = async (data) => {
    try {
        const { userId, balance } = data;
        if (!userId)
            return { status: false, message: 'Invalid Request' };

        const userData = await models.userModel.findOne({ _id: userId });
        if (!userData)
            return { status: false, message: 'User not found' };

        const currencyIndex = userData.balance.data.findIndex(item => (item.coinType === userData.currency.coinType && item.type === userData.currency.type));
        if (userData.balance.data[currencyIndex].balance < Number(balance)) {
            return { status: false, message: 'Not enough balance' };
        }
        else {
            requestWargerAmountUpdate({ userId: userId, amount: balance, coinType: userData.currency });
            if (userData.balance.data[currencyIndex].balance >= Number(balance)) {
                userData.balance.data[currencyIndex].balance = userData.balance.data[currencyIndex].balance - Number(balance);
                await models.userModel.findOneAndUpdate({ _id: userId }, { balance: userData.balance });
                return { status: true, data: userData.balance, userData: userData };
            }
            else
                return { status: false, message: 'Not enough balance' };
        }

    }
    catch (err) {
        console.error({ title: 'turtleController - updateMyBalance', message: err.message });
        return { status: false, message: 'Server Error' };
    }
}

exports.updateBalances = async (data) => {
    try {
        data.map(async (betUser) => {
            const userData = await models.userModel.findOne({ _id: betUser.userId });
            const currencyIndex = userData.balance.data.findIndex(item => (item.coinType === userData.currency.coinType && item.type === userData.currency.type));
            userData.balance.data[currencyIndex].balance = userData.balance.data[currencyIndex].balance + betUser.profit;
            await models.userModel.findOneAndUpdate({ _id: betUser.userId }, { balance: userData.balance });
        });
        return;
    }
    catch (err) {
        console.error({ title: 'turtleController - updateBalances', message: err.message });
    }
}

exports.saveTurtleRound = async (data) => {
    try {
        const turtleRoundData = await models.turtleRoundModel.findOne({ roundNumber: data.roundNumber });
        if (!turtleRoundData) {
            const savedData = await new models.turtleRoundModel({
                roundNumber: data.roundNumber,
                winnerInfo: data.winnerInfo,
                roundDate: data.roundDate,
                serverSeed: data.serverSeed
            }).save();

            if (data.betUsers.length > 0) {
                let bulkOptions = [];
                data.betUsers.map((betUser) => {
                    let bulkOption = {
                        insertOne: {
                            document: {
                                turtleRoundId: savedData._id,
                                betUserId: betUser.userId,
                                turtleNumber: betUser.turtleNum,
                                betAmount: betUser.betAmount,
                                coinType: betUser.coinType,
                                xFactor: betUser.xFactor,
                                isWin: betUser.isWin
                            }
                        }
                    }
                    bulkOptions.push(bulkOption);
                });
                await models.turtleBetHistoryModel.bulkWrite(bulkOptions);
                const result = await models.turtleBetHistoryModel.find({ turtleRoundId: savedData._id });
                return result;
            }
        }
    }
    catch (err) {
        console.error({ title: 'turtleController - saveTurtleRound', message: err.message });
        return { status: false, message: 'Server Error' };
    }
}

exports.getLastRounds = async () => {
    try {
        const turtleRoundData = await models.turtleRoundModel.find().sort({ roundDate: '-1' }).limit(100);
        return { status: true, data: turtleRoundData };
    }
    catch (err) {
        console.error({ title: 'turtleController - getLastRounds', message: err.message });
        return { status: false, message: 'Server Error' };
    }
}

exports.getBetHistory = async () => {
    try {
        const betHistoryData = await models.turtleBetHistoryModel.aggregate([
            {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $limit: 20
            },
            {
                $lookup: {
                    from: 'turtlerounds',
                    localField: 'turtleRoundId',
                    foreignField: '_id',
                    as: 'roundData'
                }
            },
            {
                $unwind: '$roundData'
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'betUserId',
                    foreignField: '_id',
                    as: 'userData'
                }
            },
            {
                $unwind: '$userData'
            },
            {
                $project: {
                    userID: '$userData._id',
                    userName: '$userData.userNickName',
                    roundID: '$roundData.roundNumber',
                    betAmount: '$betAmount',
                    coinType: '$coinType',
                    betTurtle: '$turtleNumber',
                    winInfo: '$roundData.winnerInfo',
                    isWin: '$isWin',
                    payout: '$xFactor'
                }
            }
        ]);
        return { status: true, data: betHistoryData };
    }
    catch (err) {
        console.error({ title: 'turtleController - getBetHistory', message: err.message });
        return { status: false, message: 'Server Error' };
    }
}

exports.getSeedData = async () => {
    try {
        let serverSeedData = await models.seedModel.findOne({ type: 'server' }).sort({ date: -1 });
        if (!serverSeedData) {
            serverSeedData = await new models.seedModel({ type: 'server', seed: generateSeed(), date: new Date() }).save();
        }
        return { serverSeedData };
    }
    catch (err) {
        console.error({ title: 'turtleController => getSeedData', message: err.message });
        return { status: false, message: err.message };
    }
}