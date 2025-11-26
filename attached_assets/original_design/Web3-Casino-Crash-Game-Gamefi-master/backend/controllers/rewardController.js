const models = require('../models/index');
const mongoose = require('mongoose');

exports.getSpinCount = async (req, res) => {
    try {
        const { userId } = req.body;
        let response = await models.userFreeSpin.findOne({ userId: mongoose.Types.ObjectId(userId) });
        if (!response) {
            await new models.userFreeSpin({ userId: mongoose.Types.ObjectId(userId), count: 1, availableDate: new Date() }).save();
            response = await models.userFreeSpin.findOne({ userId: mongoose.Types.ObjectId(userId) });
        }
        if (response.availableDate <= new Date()) {
            return res.json({ status: true, data: { count: response.count } });
        }
        else {
            return res.json({ status: true, data: { count: 0, availableDate: response.availableDate } });
        }
    }
    catch (err) {
        console.error({ title: 'rewardController => getSpinCount', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.updateSpinCount = async (req, res) => {
    try {
        const { userId, winAmount } = req.body;
        let response = await models.userFreeSpin.findOne({ userId: mongoose.Types.ObjectId(userId) });
        if (response.availableDate <= new Date() && response.count > 0) {
            response.count = response.count - 1;
            let lockedData = await models.unlockBalanceModel.findOne({ userId: mongoose.Types.ObjectId(userId) });
            if (lockedData) {
                lockedData.lockedAmount = Number(lockedData.lockedAmount) + Number(winAmount);
                lockedData.save();
            }
            if (response.count === 0) {
                response.count = response.count + 1;
                let cureDate = new Date();
                let nextDate = new Date(cureDate);
                nextDate.setDate(cureDate.getDate() + 1);
                response.availableDate = nextDate;
                await response.save();
                return res.json({ status: true, data: { count: 0, availableDate: response.availableDate } });
            }
            else {
                await response.save();
                return res.json({ status: true, data: { count: response.count, availableDate: response.availableDate } });
            }
        }
        else {
            return res.json({ status: false, message: 'No free spin' });
        }
    }
    catch (err) {
        console.error({ title: 'rewardController => updateSpinCount', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}