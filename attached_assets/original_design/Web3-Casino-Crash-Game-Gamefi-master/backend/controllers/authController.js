const axios = require('axios');
const models = require('../models/index');
const { createRandomName, generateSeed, getHashedString, authenticationCode, generateCampaignCode } = require('../helper/mainHelper');
const JWT = require('jsonwebtoken');
const config = require('../config');
const mongoose = require('mongoose');
const { sendMsg, authenticationEmail } = require('../helper/emailHelper');
const { requestBalanceUpdate } = require('../socket/Manager');

exports.getAuthData = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token)
            return res.json({ status: false, message: 'Invalid Request' });

        const response = await models.userModel.findOne({ userToken: token });
        if (response) {
            const settingData = await models.gameSettingModel.findOne({ userId: response._id });
            if (!settingData) {
                let saveData = await models.gameSettingModel({ userId: response._id }).save();
                return res.json({ status: true, data: response, setting: saveData });
            }
            return res.json({ status: true, data: response, setting: settingData });
        }
    }
    catch (err) {
        console.error({ title: 'authController - getAuthData', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.userGoogleLogin = async (req, res) => {
    try {
        const { accessToken, campaignData } = req.body;
        if (!accessToken)
            return res.json({ status: false, message: 'Invalid Request' });

        const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', { headers: { Authorization: `Bearer ${accessToken}` } });
        if (response.data.email_verified) {
            let userData = await models.userModel.findOne({ userEmail: response.data.email });
            if (!userData) {
                const saveData = {
                    userName: response.data.name,
                    userEmail: response.data.email,
                    userPassword: '',
                    userToken: '',
                    loginType: 'Google',
                    userNickName: createRandomName(),
                    type: 'user',
                    address: {},
                    campaignCode: campaignData.exist ? campaignData.code : ''
                }
                let userToken = JWT.sign({ userName: saveData.userName, type: saveData.type, loginType: saveData.loginType }, config.JWT.secret, { expiresIn: config.JWT.expireIn });
                saveData.userToken = userToken;
                let data = await new models.userModel(saveData).save();

                let flag = false;
                do {
                    const campaignCode = generateCampaignCode();
                    let exist = await models.campaignCodeModel.findOne({ code: campaignCode });
                    if (!exist) {
                        flag = true;
                        await new models.campaignCodeModel({ userId: data._id, code: campaignCode }).save();
                    }
                } while (!flag);

                const settingData = await models.gameSettingModel.findOne({ userId: data._id });
                if (!settingData) {
                    let saveData = await models.gameSettingModel({ userId: data._id }).save();
                    return res.json({ status: true, userData: data, setting: saveData });
                }
                else {
                    return res.send({ status: true, userData: data, setting: settingData });
                }
            }
            else {
                let userToken = JWT.sign({ userName: userData.userName, type: userData.type, loginType: userData.loginType }, config.JWT.secret, { expiresIn: config.JWT.expireIn });
                userData.updateToken(userToken);

                const settingData = await models.gameSettingModel.findOne({ userId: userData._id });
                if (!settingData) {
                    let saveData = await models.gameSettingModel({ userId: userData._id }).save();
                    return res.json({ status: true, userData: userData, setting: saveData });
                }
                else {
                    return res.send({ status: true, userData: userData, setting: settingData });
                }
            }
        }
        else {
            return res.send({ status: false, message: 'Email Verification Failed' });
        }
    }
    catch (err) {
        console.error({ title: 'authController - userGoogleLogin', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.metamaskLogin = async (req, res) => {
    try {
        const { address, type, campaignData } = req.body;
        if (!address || !type)
            return res.json({ status: false, message: 'Invalid Request' });

        const userData = await models.userModel.findOne({ userName: address });
        if (!userData) {
            const saveData = {
                userName: address,
                userEmail: '',
                userPassword: '',
                userToken: '',
                loginType: 'Wallet',
                userNickName: createRandomName(),
                type: 'user',
                address: {},
                campaignCode: campaignData.exist ? campaignData.code : ''
            }
            let userToken = JWT.sign({ userName: saveData.userName, type: saveData.type, loginType: saveData.loginType }, config.JWT.secret, { expiresIn: config.JWT.expireIn });
            saveData.userToken = userToken;
            let data = await new models.userModel(saveData).save();

            let flag = false;
            do {
                const campaignCode = generateCampaignCode();
                let exist = await models.campaignCodeModel.findOne({ code: campaignCode });
                if (!exist) {
                    flag = true;
                    await new models.campaignCodeModel({ userId: data._id, code: campaignCode }).save();
                }
            } while (!flag);

            const settingData = await models.gameSettingModel.findOne({ userId: data._id });
            if (!settingData) {
                let saveData = await models.gameSettingModel({ userId: data._id }).save();
                return res.json({ status: true, userData: data, setting: saveData });
            }
            else {
                return res.send({ status: true, userData: data, setting: settingData });
            }
        }
        else {
            let userToken = JWT.sign({ userName: userData.userName, type: userData.type, loginType: userData.loginType }, config.JWT.secret, { expiresIn: config.JWT.expireIn });
            userData.updateToken(userToken);
            const settingData = await models.gameSettingModel.findOne({ userId: userData._id });
            if (!settingData) {
                let saveData = await models.gameSettingModel({ userId: userData._id }).save();
                return res.json({ status: true, userData: userData, setting: saveData });
            }
            else {
                return res.send({ status: true, userData: userData, setting: settingData });
            }
        }
    }
    catch (err) {
        console.error({ title: 'authController - metamaskLogin', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.emailLogin = async (req, res) => {
    try {
        const { emailAddress } = req.body;
        const code = authenticationCode();

        let oldData = await models.authenticationModel.findOne({ emailAddress });
        if (oldData) {
            oldData.code = code;
            oldData.save();
        }
        else {
            await new models.authenticationModel({ emailAddress, code }).save();
        }

        const response = await sendMsg(emailAddress, 'Authentication Code', authenticationEmail(code));
        if (response.status) {
            return res.json({ status: true });
        }
        else {
            return res.json({ status: false, message: 'Server Error' });
        }
    }
    catch (err) {
        console.error({ title: 'emailLogin', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.verifyEmailCode = async (req, res) => {
    try {
        const { emailAddress, code, campaignData } = req.body;
        const data = await models.authenticationModel.findOne({ emailAddress, code });
        if (data) {
            let userData = await models.userModel.findOne({ userEmail: emailAddress });
            if (!userData) {
                const saveData = {
                    userName: emailAddress,
                    userEmail: emailAddress,
                    userPassword: '',
                    userToken: '',
                    loginType: 'Email',
                    userNickName: createRandomName(),
                    type: 'user',
                    address: {},
                    campaignCode: campaignData.exist ? campaignData.code : ''
                }
                let userToken = JWT.sign({ userName: saveData.userName, type: saveData.type, loginType: saveData.loginType }, config.JWT.secret, { expiresIn: config.JWT.expireIn });
                saveData.userToken = userToken;
                let data = await new models.userModel(saveData).save();

                let flag = false;
                do {
                    const campaignCode = generateCampaignCode();
                    let exist = await models.campaignCodeModel.findOne({ code: campaignCode });
                    if (!exist) {
                        flag = true;
                        await new models.campaignCodeModel({ userId: data._id, code: campaignCode }).save();
                    }
                } while (!flag);

                const settingData = await models.gameSettingModel.findOne({ userId: data._id });
                if (!settingData) {
                    let saveData = await models.gameSettingModel({ userId: data._id }).save();
                    return res.json({ status: true, userData: data, setting: saveData });
                }
                else {
                    return res.send({ status: true, userData: data, setting: settingData });
                }
            }
            else {
                let userToken = JWT.sign({ userName: userData.userName, type: userData.type, loginType: userData.loginType }, config.JWT.secret, { expiresIn: config.JWT.expireIn });
                userData.updateToken(userToken);

                const settingData = await models.gameSettingModel.findOne({ userId: userData._id });
                if (!settingData) {
                    let saveData = await models.gameSettingModel({ userId: userData._id }).save();
                    return res.json({ status: true, userData: userData, setting: saveData });
                }
                else {
                    return res.send({ status: true, userData: userData, setting: settingData });
                }
            }
        }
        else {
            return res.json({ status: false, message: 'That’s not your login code.' });
        }
    }
    catch (err) {
        console.error({ title: 'verifyEmailCode', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.updateProfileSet = async (req, res) => {
    try {
        const { profileSet, userNickName, promotionCode, userId } = req.body;
        await models.userModel.findOneAndUpdate({ _id: userId }, { profileSet, userNickName, campaignCode: promotionCode });
        return res.json({ status: true });
    }
    catch (err) {
        console.error({ title: 'updateProfileSet', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.getMyBalance = async (req, res) => {
    try {
        const { userId, coinType } = req.body;
        if (!userId || !coinType)
            return res.json({ status: false, message: 'Invalid Request' });

        const userData = await models.userModel.findOne({ _id: userId });
        if (!userData)
            return res.json({ status: false, message: 'User not found' });

        if (!userData.balance)
            return res.json({ status: true, data: 0 });

        return res.json({ status: true, data: userData.balance[coinType] });
    }
    catch (err) {
        console.error({ title: 'authController - getMyBalance', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.getMyBalances = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId)
            return res.json({ status: false, message: 'Invalid Request' });

        const userData = await models.userModel.findOne({ _id: userId });
        if (!userData)
            return res.json({ status: false, message: 'User not found' });

        if (!userData.balance)
            return res.json({ status: true, data: {} });
        else
            return res.json({ status: true, data: userData.balance });
    }
    catch (err) {
        console.error({ title: 'authController - getMyBalances', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.getProfileData = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId)
            return res.json({ status: false, message: 'Invalid Request' });

        const userData = await models.userModel.findOne({ _id: userId });
        const followers = await models.followingModel.countDocuments({ toUserId: userId });
        const following = await models.followingModel.countDocuments({ fromUserId: userId });
        const betHistoryData = await models.betHistoryModel.find({ userId: mongoose.Types.ObjectId(userId), roundState: true }).limit(10).sort({ createdAt: -1 });
        const wargerData = await models.userWargerModel.findOne({ userId: mongoose.Types.ObjectId(userId) });
        let betAmount = 0;
        if (wargerData) {
            betAmount = wargerData.totalWargerAmount;
        }
        const betCount = await models.betHistoryModel.countDocuments({ userId: mongoose.Types.ObjectId(userId), roundState: true });

        return res.json({ status: true, data: { userData, followData: { followers, following }, betHistoryData, countData: { betAmount, betCount } } });
    }
    catch (err) {
        console.error({ title: 'authController - getProfileData', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.followUser = async (req, res) => {
    try {
        const { fromUserId, toUserId } = req.body;
        if (!fromUserId || !toUserId)
            return res.json({ status: false, message: 'Invalid Request' });

        const followingData = await models.followingModel.findOne({ fromUserId, toUserId });
        if (!followingData) {
            await new models.followingModel({ fromUserId, toUserId });
            return res.json({ status: true });
        }
        else {
            return res.json({ status: false, message: 'You already followed this user' });
        }
    }
    catch (err) {
        console.error({ title: 'authController - following', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.unFollowUser = async (req, res) => {
    try {
        const { fromUserId, toUserId } = req.body;
        if (!fromUserId || !toUserId)
            return res.json({ status: false, message: 'Invalid Request' });

        const followingData = await models.followingModel.findOne({ fromUserId, toUserId });
        if (followingData) {
            await new models.followingModel.findOneAndDelete({ fromUserId, toUserId });
            return res.json({ status: true });
        }
        else {
            return res.json({ status: false, message: 'You already followed this user' });
        }
    }
    catch (err) {
        console.error({ title: 'authController - following', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.getDepositBonus = async (req, res) => {
    try {
        const depositBonusData = await models.depositRewardSettingModel.find();
        return res.json({ status: true, data: depositBonusData });
    }
    catch (err) {
        console.error({ title: 'authController => getDepositBonus', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.getSpinCount = async (req, res) => {
    try {
        const { userId } = req.body;
        const countData = await models.spinHistoryModel.aggregate([
            {
                $match: {
                    userId: mongoose.Types.ObjectId(userId)
                }
            },
            {
                $group: {
                    _id: userId,
                    totalCount: { $sum: "$count" }
                }
            }
        ]);
        return res.json({ status: true, data: countData });
    }
    catch (err) {
        console.error({ title: 'authController => getSpinCount', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.getBetHistoryData = async (req, res) => {
    try {
        const { historyType } = req.body;
        const historyData = await models.betHistoryModel.aggregate([
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
                $sort: {
                    createdAt: -1
                }
            },
            {
                $limit: 10
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
        return res.json({ status: true, data: historyData });
    }
    catch (err) {
        console.error({ title: 'authController => getBetHistoryData', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.updateCurrency = async (req, res) => {
    try {
        const { userId, currency } = req.body;
        if (!userId || !currency)
            return res.json({ status: false, message: 'Invalid Request' });

        let userData = await models.userModel.findOne({ _id: userId });
        if (userData) {
            userData.currency = currency;
            userData.save();
            return res.json({ status: true, data: userData });
        }
        else
            return res.json({ status: false, message: 'Invalid Request' });
    }
    catch (err) {
        console.error({ title: 'authController => updateCurrency', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.updateProfileHistory = async (req, res) => {
    try {
        const { step, userId } = req.body;
        const betHistoryData = await models.betHistoryModel.find({ userId: mongoose.Types.ObjectId(userId), roundState: true }).sort({ createdAt: -1 }).skip(10 * step).limit(10);
        return res.json({ status: true, data: betHistoryData });
    }
    catch (err) {
        console.error({ title: 'authController => updateProfileHistory', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.updateUserGameSetting = async (req, res) => {
    try {
        const { settingData, userId } = req.body;
        let saveData = {
            animation: settingData.animation,
            sound: settingData.sound,
            backgroundSound: settingData.backgroundSound,
            effectSound: settingData.effectSound,
            hotkey: settingData.hotkey,
            maxBet: settingData.maxBet
        }
        await models.gameSettingModel.findOneAndUpdate({ userId }, saveData);
        return res.json({ status: true, data: saveData });
    }
    catch (err) {
        console.error({ title: 'authController => updateUserGameSetting', message: err.message });
        return res.json({ stauts: false, message: 'Server Error' });
    }
}

exports.updateSeed = async (req, res) => {
    try {
        const { userId, seed, type } = req.body;
        let response = await new models.seedModel({ userId, type, seed, date: new Date() }).save();
        return res.json({ stauts: true, data: response });
    }
    catch (err) {
        console.error({ title: 'authController => updateSeed', message: err.message });
        return res.json({ stauts: false, message: 'Server Error' });
    }
}

exports.getSeedData = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId)
            return res.json({ status: false, message: 'Something went wrong!' });

        let clientSeedData = await models.seedModel.findOne({ userId: userId, type: 'client' }).sort({ date: -1 });
        if (!clientSeedData) {
            clientSeedData = await new models.seedModel({ userId: mongoose.Types.ObjectId(userId), type: 'client', seed: generateSeed(), date: new Date() }).save();
        }
        let serverSeedData = await models.seedModel.findOne({ type: 'server' }).sort({ date: -1 });
        if (!serverSeedData) {
            serverSeedData = await new models.seedModel({ type: 'server', seed: generateSeed(), date: new Date() }).save();
        }

        return res.json({ status: true, data: { clientSeed: clientSeedData.seed, serverSeed: getHashedString(serverSeedData.seed) } })
    }
    catch (err) {
        console.error({ title: 'authController => getSeedData', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.updateClientSeed = async (req, res) => {
    try {
        const { userId, seed } = req.body;
        if (!userId)
            return res.json({ status: false, message: 'Something went wrong!' });

        await new models.seedModel({ type: 'client', seed, userId, date: new Date() }).save();
        return res.json({ status: true });
    }
    catch (err) {
        console.error({ title: 'authController => updateClientSeed', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.updateServerSeed = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId)
            return res.json({ status: false, message: 'Something went wrong!' });

        const response = await new models.seedModel({ type: 'server', seed: generateSeed(), date: new Date() }).save();
        return res.json({ status: true, serverSeed: getHashedString(response.seed) });
    }
    catch (err) {
        console.error({ title: 'authController => updateClientSeed', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.getLevelData = async (req, res) => {
    try {
        let data = await models.userLevelModel.find();
        return res.json({ status: true, data: data });
    }
    catch (err) {
        console.error({ title: 'authController => getLevelData', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.getAvailableGames = async (req, res) => {
    try {
        const response = await models.gameListModel.find({ available: true });
        return res.json({ status: true, data: response });
    }
    catch (err) {
        console.error({ title: 'getAvailableGames', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.getBannerText = async (req, res) => {
    try {
        let response = await models.bannerTextModel.find();
        if (response.length === 0) {
            await initBannerText();
            response = await models.bannerTextModel.find();
        }
        return res.json({ status: true, data: response });
    }
    catch (err) {
        console.error({ title: 'getBannerText', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

const initBannerText = async () => {
    const insertData = [
        { type: 'top', text1: 'Sign up bonus!', text2: 'Hurry up!', text3: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam' },
        { type: 'bottom', text1: 'More than $100', text2: 'A mount in bonuses!', text3: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam' }
    ];
    await models.bannerTextModel.insertMany(insertData);
    return true;
}

exports.getPrivacyData = async (req, res) => {
    try {
        const { userId } = req.body;
        let response = await models.privacySettingModel.findOne({ userId: mongoose.Types.ObjectId(userId) });
        if (!response) await new models.privacySettingModel({ userId }).save();

        response = await models.privacySettingModel.findOne({ userId });
        return res.json({ status: true, data: response });
    }
    catch (err) {
        console.error({ title: 'getPrivacyData', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.updatePrivacyData = async (req, res) => {
    try {
        const { userId, privateProfile, showOnlineIndicator } = req.body;
        await models.privacySettingModel.findOneAndUpdate({ userId: mongoose.Types.ObjectId(userId) }, { privateProfile, showOnlineIndicator });
        return res.json({ status: true, data: { privateProfile, showOnlineIndicator } });
    }
    catch (err) {
        console.error({ title: 'updatePrivacyData', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.getCampaignCode = async (req, res) => {
    try {
        const { userId, type } = req.body;
        const response = await models.campaignCodeModel.findOne({ userId: mongoose.Types.ObjectId(userId), type });
        return res.json({ status: true, data: response });
    }
    catch (err) {
        console.error({ title: 'getCampaignCode', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.getCampaignData = async (req, res) => {
    try {
        const { userId, type } = req.body;
        const campaignCode = await models.campaignCodeModel.findOne({ userId: mongoose.Types.ObjectId(userId), type });
        const response = await models.userModel.aggregate([
            {
                $match: {
                    campaignCode: campaignCode.code
                }
            },
            {
                $lookup: {
                    from: 'userwargers',
                    localField: '_id',
                    foreignField: 'userId',
                    as: 'wargerData'
                }
            }
        ]);
        return res.json({ status: true, data: response });
    }
    catch (err) {
        console.error({ title: 'getCampaignData', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.claimCampaignAmount = async (req, res) => {
    try {
        const { userId, type } = req.body;
        const campaignCode = await models.campaignCodeModel.findOne({ userId: mongoose.Types.ObjectId(userId), type });
        const wargerData = await models.userModel.aggregate([
            {
                $match: {
                    campaignCode: campaignCode.code
                }
            },
            {
                $lookup: {
                    from: 'userwargers',
                    localField: '_id',
                    foreignField: 'userId',
                    as: 'wargerData'
                }
            }
        ]);

        let amount = 0;
        let claimCommission = 0.3;
        wargerData.map((data) => {
            if (data.wargerData.length > 0) {
                let totalWarger = data.wargerData[0].totalWargerAmount;
                let claimedAmount = Number(data.wargerData[0].campaignClaimAmount ? data.wargerData[0].campaignClaimAmount : 0);
                let availableAmount = (totalWarger - claimedAmount) / 100 * claimCommission;
                if (availableAmount > 0) amount += availableAmount;
            }
        });

        let userData = await models.userModel.findOne({ _id: mongoose.Types.ObjectId(userId) });
        let coinIndex = userData.balance.data.findIndex((item) => item.coinType === 'ZELO');
        userData.balance.data[coinIndex].balance = userData.balance.data[coinIndex].balance + amount;
        await models.userModel.findOneAndUpdate({ _id: userId }, { balance: userData.balance });
        requestBalanceUpdate(userData);

        let bulkOption = [];
        wargerData.map((data) => {
            if (data.wargerData.length > 0) {
                let option = {
                    updateOne: {
                        filter: { _id: data.wargerData[0]._id },
                        update: { campaignClaimAmount: data.wargerData[0].totalWargerAmount }
                    }
                }
                bulkOption.push(option);
            }
        });
        await models.userWargerModel.bulkWrite(bulkOption);
        return res.json({ status: true });
    }
    catch (err) {
        console.error({ title: 'claimCampaignAmount', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.getUnlockBalance = async (req, res) => {
    try {
        const { userId } = req.body;
        let response = await models.unlockBalanceModel.findOne({ userId: mongoose.Types.ObjectId(userId) });
        if (!response) {
            await new models.unlockBalanceModel({ userId }).save();
            response = await models.unlockBalanceModel.findOne({ userId: mongoose.Types.ObjectId(userId) });
        }
        return res.json({ status: true, data: response });
    }
    catch (err) {
        console.error({ title: 'getUnlockBalance', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.getWargerBalance = async (req, res) => {
    try {
        const { userId } = req.body;
        const wargerData = await models.userWargerModel.findOne({ userId: mongoose.Types.ObjectId(userId) });
        let response = { wargeredAmount: 0, claimedAmount: 0 };
        if (wargerData) {
            response.wargeredAmount = wargerData.totalWargerAmount;
            response.claimedAmount = wargerData.claimedWargerAmount;
        }
        return res.json({ status: true, data: response });
    }
    catch (err) {
        console.error({ title: 'getWargerBalance', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.claimLockedBalance = async (req, res) => {
    try {
        const { userId, claimAmount } = req.body;
        let wargerData = await models.userWargerModel.findOne({ userId: mongoose.Types.ObjectId(userId) });
        if (wargerData) {
            if (claimAmount > Number(wargerData.totalWargerAmount - wargerData.claimedWargerAmount)) {
                return res.json({ status: false, message: 'Not valid amount' });
            }
            wargerData.claimedWargerAmount = Number(wargerData.claimedWargerAmount) + Number(claimAmount);
            await wargerData.save();
            let lockedData = await models.unlockBalanceModel.findOne({ userId: mongoose.Types.ObjectId(userId) });
            lockedData.lockedAmount = Number(lockedData.lockedAmount) - Number(claimAmount);
            await lockedData.save();

            let userData = await models.userModel.findOne({ _id: mongoose.Types.ObjectId(userId) });
            let coinIndex = userData.balance.data.findIndex((item) => item.coinType === 'ZELO');
            userData.balance.data[coinIndex].balance = userData.balance.data[coinIndex].balance + claimAmount;
            userData.save();
            requestBalanceUpdate(userData);
        }
        return res.json({ status: true });
    }
    catch (err) {
        console.error({ title: 'claimLockedBalance', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.getTournamentList = async (req, res) => {
    try {
        const response = await models.tournamentListModel.aggregate([
            {
                $match: {
                    finished: false
                }
            },
            {
                $lookup: {
                    from: 'tournamentusers',
                    foreignField: 'tournamentId',
                    localField: '_id',
                    as: 'users'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    foreignField: '_id',
                    localField: 'users.userId',
                    as: 'userData'
                }
            }
        ]);
        return res.json({ status: true, data: response });
    }
    catch (err) {
        console.error({ title: 'getTournamentList', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.getTournamentWargerDetail = async (req, res) => {
    try {
        let { userIds, startDate, endDate } = req.body;
        userIds = userIds.map((item) => { return mongoose.Types.ObjectId(item) });

        startDate = new Date(startDate);
        endDate = new Date(endDate);
        const startTimestamp = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()).valueOf();
        const endTimestamp = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()).valueOf();

        startDate = new Date(`${new Date(startTimestamp).toISOString().slice(0, 10)}T21:00:00.000Z`);
        endDate = new Date(`${new Date(endTimestamp + (1000 * 60 * 180)).toISOString().slice(0, 10)}T20:59:59.999Z`);

        const response = await models.wargerHistoryModel.aggregate([
            {
                $match: {
                    userId: {
                        $in: userIds
                    },
                    createdAt: {
                        $gte: startDate,
                        $lte: endDate
                    }
                }
            },
            {
                $group: {
                    _id: "$userId",
                    totalWarger: { $sum: '$amount' }
                }
            }
        ]);
        return res.json({ status: true, data: response });
    }
    catch (err) {
        console.error({ title: 'getTournamentWargerDetail', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.participateTournament = async (req, res) => {
    try {
        const { userId, tournamentId } = req.body;
        const data = await models.tournamentUsersModel.findOne({ userId, tournamentId });
        if (!data) {
            const tournamentData = await models.tournamentListModel.findOne({ _id: tournamentId });
            if (!tournamentData) {
                return res.json({ status: false, message: 'Invalid request' });
            }

            let userData = await models.userModel.findOne({ _id: userId });
            if (!userData) {
                return res.json({ status: false, message: 'Invalid request' });
            }

            let currencyIndex = userData.balance.data.findIndex((item) => item.coinType === 'ZELO');
            if (userData.balance.data[currencyIndex].balance < Number(tournamentData.priceAmount)) {
                return res.json({ status: false, message: 'Not enough balance' });
            }
            userData.balance.data[currencyIndex].balance -= Number(tournamentData.priceAmount);
            await models.userModel.findOneAndUpdate({ _id: userId }, { balance: userData.balance });

            await new models.tournamentUsersModel({
                tournamentId,
                userId,
                regDate: new Date(),
                wargerAmount: 0,
                participateAmount: tournamentData.priceAmount,
                coinType: 'ZELO',
                rating: 0,
                prizeAmountL: 0
            }).save();
            requestBalanceUpdate(userData);
            return res.json({ status: true });
        }
        else {
            return res.json({ status: false, message: 'Already participated' });
        }
    }
    catch (err) {
        console.error({ title: 'participateTournament', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.getAffiliateUsersData = async (req, res) => {
    try {
        let { userId, type, campaignCode } = req.body;
        if (!campaignCode)
            campaignCode = await models.campaignCodeModel.findOne({ userId: mongoose.Types.ObjectId(userId), type });

        const endDate = new Date();
        const startDate = new Date(new Date().setDate(endDate.getDate() - 30));
        const data = await models.userModel.find({
            campaignCode: campaignCode.code,
            createdAt: {
                $lte: endDate,
                $gte: startDate
            }
        });

        let response = new Array(30).fill(0);
        data.map((item) => {
            let curDate = new Date(item.createdAt);
            let index = Math.floor((new Date(curDate).getTime() - new Date(startDate).getTime()) / (1000 * 3600 * 24));
            response[index]++;
        });
        return res.json({ status: true, data: response });
    }
    catch (err) {
        console.error({ title: 'getAffiliateUsersData', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.getAffiliateEarningData = async (req, res) => {
    try {
        let { userId, type, campaignCode } = req.body;
        if (!campaignCode)
            campaignCode = await models.campaignCodeModel.findOne({ userId: mongoose.Types.ObjectId(userId), type });

        const endDate = new Date();
        const startDate = new Date(new Date().setDate(endDate.getDate() - 30));
        const data = await models.userModel.aggregate([
            {
                $match: {
                    campaignCode: campaignCode.code
                }
            },
            {
                $lookup: {
                    from: 'wargerhistories',
                    foreignField: 'userId',
                    localField: '_id',
                    as: 'wargerHistory'
                }
            }
        ]);

        let response = new Array(30).fill(0);
        data.map((history) => {
            history.wargerHistory.map((item) => {
                if (item.createdAt.getTime() <= startDate.getTime())
                    return;

                let curDate = new Date(item.createdAt);
                let index = Math.floor((new Date(curDate).getTime() - new Date(startDate).getTime()) / (1000 * 3600 * 24));
                response[index] = response[index] + item.amount;
            });
        });
        return res.json({ status: true, data: response });
    }
    catch (err) {
        console.error({ title: 'getAffiliateEarningData', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.getCampaignList = async (req, res) => {
    try {
        const { userId } = req.body;
        let campaignData = await models.campaignCodeModel.aggregate([
            {
                $match: {
                    userId: mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: 'users',
                    foreignField: 'campaignCode',
                    localField: 'code',
                    as: 'userData'
                }
            },
            {
                $project: {
                    code: '$code',
                    name: '$name',
                    count: { $size: '$userData' }
                }
            }
        ]);

        const codes = campaignData.map((item) => { return item.code });
        const wagerData = await models.userModel.aggregate([
            {
                $match: {
                    campaignCode: { $in: codes }
                }
            },
            {
                $lookup: {
                    from: 'wargerhistories',
                    foreignField: 'userId',
                    localField: '_id',
                    as: 'wargerHistory'
                }
            },
            {
                $project: {
                    campaignCode: '$campaignCode',
                    totalWager: { $sum: "$wargerHistory.amount" }
                }
            },
            {
                $group: {
                    _id: '$campaignCode',
                    total: {
                        $sum: '$totalWager'
                    }
                }
            }
        ]);

        let response = campaignData.map((item) => {
            let wager = wagerData.find((w) => w._id === item.code);
            return {
                ...item,
                wargerAmount: wager ? wager.total : 0
            }
        });
        return res.json({ status: true, data: response });
    }
    catch (err) {
        console.error({ title: 'getCampaignList', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.addCampaignList = async (req, res) => {
    try {
        const { name, userId } = req.body;
        const exist = await models.campaignCodeModel.findOne({ userId, name });
        if (!exist) {
            let flag = false;
            do {
                const campaignCode = generateCampaignCode();
                let exist = await models.campaignCodeModel.findOne({ code: campaignCode });
                if (!exist) {
                    flag = true;
                    await new models.campaignCodeModel({ userId, code: campaignCode, name, type: 'custom' }).save();
                }
            } while (!flag);
            return res.json({ status: true });
        }
        else {
            return res.json({ status: false, message: 'Same Data is already exist' });
        }
    }
    catch (err) {
        console.error({ title: 'addCampaignList', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.getCampaignDetail = async (req, res) => {
    try {
        const { campaignCode } = req.body;
        const response = await models.userModel.aggregate([
            {
                $match: {
                    campaignCode: campaignCode
                }
            },
            {
                $lookup: {
                    from: 'userwargers',
                    localField: '_id',
                    foreignField: 'userId',
                    as: 'wargerData'
                }
            }
        ]);
        return res.json({ status: true, data: response });
    }
    catch (err) {
        console.error({ title: 'getCampaignDetail', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.getTransactionHistory = async (req, res) => {
    try {
        const { userId } = req.body;
        const response = await models.walletModel.aggregate([
            {
                $match: {
                    userId: mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: 'transactions',
                    foreignField: 'to',
                    localField: 'address',
                    as: 'transactionData'
                }
            }
        ]);
        return res.json({ status: true, data: response });
    }
    catch (err) {
        console.error({ title: 'getTransactionHistory', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}