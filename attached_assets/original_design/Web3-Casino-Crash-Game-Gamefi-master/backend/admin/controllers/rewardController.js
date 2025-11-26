const models = require('../../models/index');
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');

exports.getEnabledData = async (req, res) => {
    try {

        let enabledData = await models.rewardEnabledModel.findOne();
        if (!enabledData) {
            enabledData = await new models.rewardEnabledModel({ enabled: true }).save();
        }
        return res.json({ status: true, data: enabledData });
    }
    catch (err) {
        console.error({ title: 'rewardController => getEnabledData', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.enableRewardSetting = async (req, res) => {
    try {
        const { enabled } = req.body;
        await models.rewardEnabledModel.findOneAndUpdate({}, { enabled });
        return res.json({ status: true });
    }
    catch (err) {
        console.error({ title: 'rewardController => enableRewardSetting', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.getDepositSettingData = async (req, res) => {
    try {
        const { depositCount } = req.body;
        let depositRewardSettingData = await models.depositRewardSettingModel.find({ depositCount });
        if (depositRewardSettingData.length === 0) {
            let bulkOptions = [];
            ['Low', 'Medium', 'High'].map((key) => {
                let bulkOption = {
                    insertOne: {
                        document: {
                            depositCount: depositCount,
                            amountLevel: key,
                            startAmount: 0,
                            endAmount: 0,
                            percent: 0,
                            date: new Date()
                        }
                    }
                };
                bulkOptions.push(bulkOption);
            });
            await models.depositRewardSettingModel.bulkWrite(bulkOptions);
            depositRewardSettingData = await models.depositRewardSettingModel.find({ depositCount });
        }
        return res.json({ status: true, data: depositRewardSettingData });
    }
    catch (err) {
        console.error({ title: 'rewardController => getDepositSettingData', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.saveDepositRewardSetting = async (req, res) => {
    try {
        const { depositCount, data } = req.body;
        let bulkOptions = [];
        Object.keys(data).map((key) => {
            let bulkOption = {
                updateOne: {
                    filter: { depositCount: depositCount, amountLevel: key },
                    update: { startAmount: data[key]['startAmount'], endAmount: data[key]['endAmount'], percent: data[key]['percent'] }
                }
            };
            bulkOptions.push(bulkOption);
        });
        await models.depositRewardSettingModel.bulkWrite(bulkOptions);
        return res.json({ status: true });
    }
    catch (err) {
        console.error({ title: 'rewardController => saveDepositRewardSetting', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.getRewardHistoryData = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) return res.json({ status: false, message: 'Invalid Request' });

        const historyData = await models.rewardHistoryModel.find({ userId: mongoose.Types.ObjectId(userId) });
        return res.json({ status: true, data: historyData });
    }
    catch (err) {
        console.error({ title: 'rewardController => getRewardHistoryData', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.addAdminReward = async (req, res) => {
    try {
        const { rewardAmount, rewardReason, rewardPlayer } = req.body;
        if (rewardAmount <= 0)
            return res.json({ status: false, message: 'Reward Amount should be greater than 0' });

        const data = await new models.rewardHistoryModel({
            historyId: uuidv4(),
            userId: mongoose.Types.ObjectId(rewardPlayer),
            rewardType: 'admin',
            rewardAmount: rewardAmount,
            rewardReason: rewardReason,
            date: new Date()
        }).save();
        return res.json({ status: true, data: data });
    }
    catch (err) {
        console.error({ title: 'rewardController => addAdminReward', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.getFreeSpinSetting = async (req, res) => {
    try {
        const settingData = await models.freespinSettingModel.find();
        return res.json({ status: true, data: settingData });
    }
    catch (err) {
        console.error({ title: 'rewardController => getFreeSpinSetting', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.insertFreeSpinSetting = async (req, res) => {
    try {
        const { startLevel, endLevel, count } = req.body;
        await new models.freespinSettingModel({ startLevel, endLevel, count, date: new Date() }).save();
        return res.json({ status: true });
    }
    catch (err) {
        console.error({ title: 'rewardController => insertFreeSpinSetting', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.updateFreeSpinSetting = async (req, res) => {
    try {
        const { startLevel, endLevel, count, id } = req.body;
        await models.freespinSettingModel.findOneAndUpdate({ _id: id }, { startLevel, endLevel, count });
        return res.json({ status: true });
    }
    catch (err) {
        console.error({ title: 'rewardController => updateFreeSpinSetting', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.deleteFreeSpinSetting = async (req, res) => {
    try {
        const { id } = req.body;
        await models.freespinSettingModel.findOneAndDelete({ _id: id });
        return res.json({ status: true });
    }
    catch (err) {
        console.error({ title: 'rewardController => deleteFreeSpinSetting', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.getSpinHistoryData = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) return res.json({ status: false, message: 'Invalid Request' });

        const historyData = await models.spinHistoryModel.find({ userId: mongoose.Types.ObjectId(userId) });
        return res.json({ status: true, data: historyData });
    }
    catch (err) {
        console.error({ title: 'rewardController => getSpinHistoryData', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.addAdminSpin = async (req, res) => {
    try {
        const { spinCount, spinReason, spinPlayer } = req.body;
        if (spinCount <= 0)
            return res.json({ status: false, message: 'Spin count should be greater than 0' });

        const data = await new models.spinHistoryModel({
            historyId: uuidv4(),
            userId: mongoose.Types.ObjectId(spinPlayer),
            type: 'admin',
            count: spinCount,
            reason: spinReason,
            date: new Date()
        }).save();
        return res.json({ status: true, data: data });
    }
    catch (err) {
        console.error({ title: 'rewardController => addAdminSpin', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.getUnlockSetting = async (req, res) => {
    try {
        let settingData = await models.unlockSettingModel.findOne();
        if (settingData === null) {
            settingData = await new models.unlockSettingModel({
                enable: true,
                percent: 2
            }).save();
        }
        return res.json({ status: true, data: settingData });
    }
    catch (err) {
        console.error({ title: 'rewardController => getUnlockSetting', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.updateUnlockSetting = async (req, res) => {
    try {
        const { enable, percent, id } = req.body;
        await models.unlockSettingModel.findOneAndUpdate({ _id: id }, { enable, percent });
        return res.json({ status: true });
    }
    catch (err) {
        console.error({ title: 'rewardController => updateUnlockSetting', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}