const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const models = require('../../models/index');

exports.saveBetHistory = async (data) => {
    try {
        if (!Array.isArray(data)) {
            const { userId, gameType, roundNumber, betAmount, coinType, payout, roundResult, roundState } = data;
            const result = await new models.betHistoryModel({
                userId, gameType, roundNumber, betAmount, coinType, payout, roundResult, roundState, date: new Date()
            }).save();
            const historyData = await models.betHistoryModel.aggregate([
                {
                    $match: {
                        _id: result._id
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        foreignField: '_id',
                        localField: 'userId',
                        as: 'userData'
                    }
                },
                {
                    $unwind: '$userData'
                },
                {
                    $project: {
                        userName: '$userData.userNickName',
                        userLevel: '0',
                        betAmount: '$betAmount',
                        coinType: '$coinType',
                        payout: '$payout',
                        roundResult: '$roundResult',
                        gameType: '$gameType'
                    }
                }
            ]);
            return { status: true, data: historyData };
        }
        else {
            let bulkOption = [];
            data.map((item) => {
                const { userId, gameType, roundNumber, betAmount, coinType, payout, roundResult, roundState } = item;
                let option = {
                    insertOne: {
                        document: {
                            userId, gameType, roundNumber, betAmount, coinType, payout, roundResult, roundState, date: new Date()
                        }
                    }
                };
                bulkOption.push(option);
            });
            await models.betHistoryModel.bulkWrite(bulkOption);
            const historyData = await models.betHistoryModel.aggregate([
                {
                    $match: {
                        gameType: data[0].gameType,
                        roundNumber: data[0].roundNumber
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        foreignField: '_id',
                        localField: 'userId',
                        as: 'userData'
                    }
                },
                {
                    $unwind: '$userData'
                },
                {
                    $project: {
                        userName: '$userData.userNickName',
                        userLevel: '0',
                        betAmount: '$betAmount',
                        coinType: '$coinType',
                        payout: '$payout',
                        roundResult: '$roundResult',
                        gameType: '$gameType'
                    }
                }
            ]);
            return { status: true, data: historyData };
        }
    }
    catch (err) {
        console.error({ title: 'ManageController => saveBetHistory', message: err.message });
        return { status: false, message: err.message };
    }
};

exports.updateWargerAmount = async (data) => {
    try {
        const { wargerAmount, userId } = data;
        let wargerData = await models.userWargerModel.findOne({ userId: ObjectId(userId) });
        if (!wargerData) {
            await new models.userWargerModel({ userId: ObjectId(userId), totalWargerAmount: wargerAmount, claimedWargerAmount: 0 }).save();
        }
        else {
            wargerData.totalWargerAmount = Number(wargerData.totalWargerAmount) + wargerAmount;
            wargerData.save();
        }
        await new models.wargerHistoryModel({ userId, amount: wargerAmount }).save();
    }
    catch (err) {
        console.error({ title: 'ManageController => updateWargerAmount', message: err.message });
    }
}