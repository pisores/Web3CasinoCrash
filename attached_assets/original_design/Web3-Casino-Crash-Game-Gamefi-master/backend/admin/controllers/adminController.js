const models = require('../../models/index');
const JWT = require('jsonwebtoken');
const config = require('../config');
const speakeasy = require('speakeasy');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

exports.addAdminUser = async () => {
    try {
        let adminData = await models.adminUserModel.findOne({ customerId: config.admin.id });
        if (!adminData)
            await new models.adminUserModel({
                username: config.admin.name,
                customerId: config.admin.id,
                password: config.admin.pass,
                authKey: config.admin.authKey,
                website: 'Aperion',
                callbackUrl: 'Aperion',
                sitename: 'Aperion',
                type: 'admin',
            }).save();
    }
    catch (err) {
        console.error({ title: 'addAdminUser', message: err.message });
    }
}

exports.adminLogin = async (req, res) => {
    try {
        const { admin_id, admin_pwd } = req.body;
        if (!admin_id || !admin_pwd)
            return res.json({ status: false, message: 'Invalid Request' });

        let adminData = await models.adminUserModel.findOne({ customerId: admin_id });
        if (!adminData)
            return res.json({
                status: false,
                message: 'Authentication was failed',
                auth: null
            });

        let passwordStatus = adminData.comparePassword(admin_pwd);
        if (passwordStatus) {
            const generateToken = JWT.sign({ id: adminData._id, username: adminData.username, type: adminData.type }, config.jwt.secret, { expiresIn: config.jwt.expire });
            await adminData.updateToken(generateToken);
            if (adminData.OTP.active)
                return res.json({
                    status: true, id: generateToken, otp: true
                });
            else
                return res.json({
                    status: true, customer: adminData
                });
        }
        else {
            return res.json({
                status: false, message: 'Please input correct password.'
            });
        }
    }
    catch (err) {
        console.error({ title: 'adminLogin', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.confirmAuth = async (req, res) => {
    try {
        const { token, code } = req.body;
        if (!token || !code)
            return res.json({ status: false, message: 'Invalid Request' });

        const adminData = await models.adminUserModel.findOne({ token });
        if (adminData) {
            const verified = speakeasy.totp.verify({ secret: adminData.OTP.secret, encoding: 'base32', token: code });
            if (verified)
                return res.json({ status: true, token: token });
            else
                return res.json({ status: false, message: 'Incorrect Code' });
        }
        else {
            return res.json({ status: false, message: 'Incorrect Token' });
        }
    }
    catch (err) {
        console.error({ title: 'confirmAuth', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.sessionCheck = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token)
            return res.json({ status: false, message: 'Invalid Request' });

        const adminData = await models.adminUserModel.findOne({ token });
        if (adminData) {
            return res.json({ status: true, data: adminData });
        }
        else {
            return res.json({ status: false, message: 'Incorrect Token' });
        }
    }
    catch (err) {
        console.error({ title: 'sessionCheck', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.changePassword = async (req, res) => {
    try {
        const { id, old_pwd, new_pwd } = req.body;
        if (!id || !old_pwd || !new_pwd)
            return res.json({ status: false, message: 'Invalid Request' });

        const adminData = await models.adminUserModel.findOne({ _id: id });
        if (adminData) {
            let passwordStatus = adminData.comparePassword(old_pwd);
            if (!passwordStatus)
                return res.json({ status: false, message: 'Password is not correct', auth: null });

            let password = JWT.sign({ password: bcrypt.hashSync(new_pwd, bcrypt.genSaltSync(10)) }, config.jwt.secret);
            await models.adminUserModel.findOneAndUpdate({ _id: id }, { password });

            return res.json({ status: true, message: '' });
        }
        else {
            return res.json({ status: false, message: 'There is not admin data.' });
        }
    }
    catch (err) {
        console.error({ title: 'changePassword', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.countData = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id)
            return res.json({ status: false, message: 'Invalid Request' });

        let adminData = await models.adminUserModel.findOne({ _id: id });
        if (!adminData)
            return res.json({ status: false, message: 'Bad request from another user' });

        let userCount = await models.userModel.countDocuments();
        let walletCount = await models.walletModel.countDocuments();
        let turtleList = await models.turtleRoundModel.aggregate([
            {
                $sort: {
                    roundDate: -1
                }
            },
            {
                $lookup: {
                    from: 'turtlebethistories',
                    localField: '_id',
                    foreignField: 'turtleRoundId',
                    as: 'historyData'
                }
            },
            {
                $unwind: '$historyData'
            },
        ]);
        let scissorsCount = await models.scissorsRoundModel.countDocuments();
        let minesCount = await models.minesRoundModel.countDocuments();
        let diceCount = await models.diceRoundModel.countDocuments();
        let plinkoCount = await models.plinkoRoundModel.countDocuments();
        let crashCount = await models.crashRoundModel.countDocuments({ roundStatus: 3 });
        let slotCount = await models.slotRoundModel.countDocuments();

        return res.json({
            status: true,
            message: '',
            user_count: userCount,
            turtleCount: turtleList.length,
            scissorsCount: scissorsCount,
            minesCount: minesCount,
            walletCount: walletCount,
            diceCount: diceCount,
            plinkoCount: plinkoCount,
            crashCount: crashCount,
            slotCount: slotCount
        });
    }
    catch (err) {
        console.error({ title: 'countData', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.getGameUsers = async (req, res) => {
    try {
        const { id, offset, count } = req.body;
        if (!id)
            return res.json({ status: false, message: 'Invalid Request' });

        let adminData = await models.adminUserModel.findOne({ _id: id });
        if (!adminData)
            return res.json({ status: false, message: 'Bad request from another user' });

        let userList = await models.userModel.find();
        let userListLength = userList.length;
        let sendList = [];

        if (offset * count < userListLength) {
            let maxIndex = (offset + 1) * count;
            if (maxIndex > userListLength)
                maxIndex = userListLength;

            for (let index = offset * count; index < maxIndex; index++)
                sendList.push(userList[index]);
        }
        return res.json({
            status: true,
            offset: offset,
            count: count,
            user_data: sendList
        });
    }
    catch (err) {
        console.error({ title: 'userList', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.getPlayerDetail = async (req, res) => {
    try {
        const { id } = req.body;
        const userData = await models.userModel.findOne({ _id: id });
        const historyData = await models.betHistoryModel.find({ userId: mongoose.Types.ObjectId(userData._id), roundState: true }).limit(300);
        return res.json({ status: true, data: { historyData, userData } });
    }
    catch (err) {
        console.error({ title: 'getPlayerDetail', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.deleteGameUser = async (req, res) => {
    try {
        const { id, user_id } = req.body;
        if (!id || !user_id)
            return res.json({ status: false, message: 'Invalid Request' });

        let adminData = await models.adminUserModel.findOne({ _id: id });
        if (!adminData)
            return res.json({ status: false, message: 'Bad request from another user' });

        let userDetail = await models.userModel.findOne({ _id: user_id });
        if (!userDetail)
            return res.json({ status: false, message: 'That user deleted already.' });

        await models.userModel.findOneAndDelete({ _id: user_id })

        return res.json({
            status: true,
            message: 'Player successfully removed'
        });
    }
    catch (err) {
        console.error({ title: 'deleteGameUser', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.getTurtleData = async (req, res) => {
    try {
        const { id, offset, count } = req.body;
        if (!id)
            return res.json({ status: false, message: 'Invalid Request' });

        let adminData = await models.adminUserModel.findOne({ _id: id });
        if (!adminData)
            return res.json({ status: false, message: 'Bad request from another user' });

        let turtleList = await models.turtleRoundModel.aggregate([
            {
                $sort: {
                    roundDate: -1
                }
            },
            {
                $lookup: {
                    from: 'turtlebethistories',
                    localField: '_id',
                    foreignField: 'turtleRoundId',
                    as: 'historyData'
                }
            },
            {
                $unwind: '$historyData'
            },
        ]);
        let turtleListLength = turtleList.length;
        let sendList = [];

        if (offset * count < turtleListLength) {
            let maxIndex = (offset + 1) * count;
            if (maxIndex > turtleListLength)
                maxIndex = turtleListLength;

            for (let index = offset * count; index < maxIndex; index++)
                sendList.push(turtleList[index]);
        }
        return res.json({
            status: true,
            offset: offset,
            count: count,
            turtleData: sendList
        });
    }
    catch (err) {
        console.error({ title: 'getTurtleData', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.getTurtleDetail = async (req, res) => {
    try {
        const { id } = req.body;
        const roundData = await models.turtleRoundModel.findOne({ _id: id });
        const betHistory = await models.turtleBetHistoryModel.aggregate([
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
                $match: {
                    turtleRoundId: ObjectId(id)
                }
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
        return res.json({ status: true, data: { betHistory, roundData } });
    }
    catch (err) {
        console.error({ title: 'getTurtleDetail', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.getScissorsData = async (req, res) => {
    try {
        const { id, offset, count } = req.body;
        if (!id)
            return res.json({ status: false, message: 'Invalid Request' });

        let adminData = await models.adminUserModel.findOne({ _id: id });
        if (!adminData)
            return res.json({ status: false, message: 'Bad request from another user' });

        let scissorsList = await models.scissorsRoundModel.aggregate([
            {
                $sort: {
                    roundDate: -1
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userData'
                }
            },
            {
                $unwind: '$userData'
            }
        ]);
        let scissorsListLength = scissorsList.length;
        let sendList = [];

        if (offset * count < scissorsListLength) {
            let maxIndex = (offset + 1) * count;
            if (maxIndex > scissorsListLength)
                maxIndex = scissorsListLength;

            for (let index = offset * count; index < maxIndex; index++)
                sendList.push(scissorsList[index]);
        }
        return res.json({
            status: true,
            offset: offset,
            count: count,
            scissorsData: sendList
        });
    }
    catch (err) {
        console.error({ title: 'getScissorsData', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.getMinesData = async (req, res) => {
    try {
        const { id, offset, count } = req.body;
        if (!id)
            return res.json({ status: false, message: 'Invalid Request' });

        let adminData = await models.adminUserModel.findOne({ _id: id });
        if (!adminData)
            return res.json({ status: false, message: 'Bad request from another user' });

        let minesList = await models.minesRoundModel.aggregate([
            {
                $sort: {
                    roundDate: -1
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userData'
                }
            },
            {
                $unwind: '$userData'
            }
        ]);
        let minesListLength = minesList.length;
        let sendList = [];

        if (offset * count < minesListLength) {
            let maxIndex = (offset + 1) * count;
            if (maxIndex > minesListLength)
                maxIndex = minesListLength;

            for (let index = offset * count; index < maxIndex; index++)
                sendList.push(minesList[index]);
        }
        return res.json({
            status: true,
            offset: offset,
            count: count,
            minesData: sendList
        });
    }
    catch (err) {
        console.error({ title: 'getScissorsData', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.getDiceData = async (req, res) => {
    try {
        const { id, offset, count } = req.body;
        if (!id)
            return res.json({ status: false, message: 'Invalid Request' });

        let adminData = await models.adminUserModel.findOne({ _id: id });
        if (!adminData)
            return res.json({ status: false, message: 'Bad request from another user' });

        let diceList = await models.diceRoundModel.aggregate([
            {
                $sort: {
                    roundDate: -1
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userData'
                }
            },
            {
                $unwind: '$userData'
            },
            {
                $skip: count * offset
            },
            {
                $limit: count
            }
        ]);
        return res.json({
            status: true,
            offset: offset,
            count: count,
            diceData: diceList
        });
    }
    catch (err) {
        console.error({ title: 'getDiceData', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.getPlinkoData = async (req, res) => {
    try {
        const { id, offset, count } = req.body;
        if (!id)
            return res.json({ status: false, message: 'Invalid Request' });

        let adminData = await models.adminUserModel.findOne({ _id: id });
        if (!adminData)
            return res.json({ status: false, message: 'Bad request from another user' });

        let diceList = await models.plinkoRoundModel.aggregate([
            {
                $sort: {
                    roundDate: -1
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userData'
                }
            },
            {
                $unwind: '$userData'
            },
            {
                $skip: count * offset
            },
            {
                $limit: count
            }
        ]);
        return res.json({
            status: true,
            offset: offset,
            count: count,
            diceData: diceList
        });
    }
    catch (err) {
        console.error({ title: 'getPlinkoData', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.getCrashData = async (req, res) => {
    try {
        const { id, offset, count } = req.body;
        if (!id)
            return res.json({ status: false, message: 'Invalid Request' });

        let adminData = await models.adminUserModel.findOne({ _id: id });
        if (!adminData)
            return res.json({ status: false, message: 'Bad request from another user' });

        let crashList = await models.crashRoundModel.aggregate([
            {
                $sort: {
                    roundDate: -1
                }
            },
            {
                $match: {
                    roundStatus: 3
                }
            },
            {
                $skip: count * offset
            },
            {
                $limit: count
            }
        ]);
        return res.json({
            status: true,
            offset: offset,
            count: count,
            crashData: crashList
        });
    }
    catch (err) {
        console.error({ title: 'getCrashData', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.getCrashDetail = async (req, res) => {
    try {

        const { id } = req.body;
        const roundData = await models.crashRoundModel.findOne({ _id: id });
        const betHistory = await models.crashBetHistoryModel.aggregate([
            {
                $lookup: {
                    from: 'crashrounds',
                    localField: 'crashRoundId',
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
                $match: {
                    crashRoundId: ObjectId(id)
                }
            },
            {
                $project: {
                    userID: '$userData._id',
                    userName: '$userData.userNickName',
                    roundID: '$roundData.roundNumber',
                    betAmount: '$betAmount',
                    coinType: '$coinType',
                    winInfo: '$roundData.fairResult',
                    payout: '$payout'
                }
            }
        ]);
        return res.json({ status: true, data: { betHistory, roundData } });
    }
    catch (err) {
        console.error({ title: 'getCrashDetail', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.getSlotData = async (req, res) => {
    try {
        const { id, offset, count } = req.body;
        if (!id)
            return res.json({ status: false, message: 'Invalid Request' });

        let adminData = await models.adminUserModel.findOne({ _id: id });
        if (!adminData)
            return res.json({ status: false, message: 'Bad request from another user' });

        let slotList = await models.slotRoundModel.aggregate([
            {
                $sort: {
                    roundDate: -1
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userData'
                }
            },
            {
                $unwind: '$userData'
            },
            {
                $skip: count * offset
            },
            {
                $limit: count
            }
        ]);
        return res.json({
            status: true,
            offset: offset,
            count: count,
            slotData: slotList
        });
    }
    catch (err) {
        console.error({ title: 'getSlotData', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.getUserLevelList = async (req, res) => {
    try {
        let data = await models.userLevelModel.find();
        if (data.length === 0) {
            await initUserLevelData();
            data = await models.userLevelModel.find();
        }
        return res.json({ status: true, data: data });
    }
    catch (err) {
        console.error({ title: 'getUserLevelList', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.saveUserLevelData = async (req, res) => {
    try {
        const { data } = req.body;
        let bulkOption = [];
        data.map((item) => {
            let option = {
                updateOne: {
                    filter: { _id: item._id },
                    update: { label: item.label, data: item.data }
                }
            }
            bulkOption.push(option);
        });
        await models.userLevelModel.bulkWrite(bulkOption);
        return res.json({ status: true });
    }
    catch (err) {
        console.error({ title: 'saveUserLevelData', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

const initUserLevelData = async () => {
    const initLevels = [
        { label: 'Adventurer', data: new Array(10).fill(0) },
        { label: 'Champion', data: new Array(10).fill(0) },
        { label: 'Hero', data: new Array(10).fill(0) },
        { label: 'Master', data: new Array(10).fill(0) },
        { label: 'Legend', data: new Array(10).fill(0) },
        { label: 'King', data: new Array(10).fill(0) }
    ];
    await models.userLevelModel.insertMany(initLevels);
    return true;
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

exports.updateBannerText = async (req, res) => {
    try {
        const { type, text1, text2, text3 } = req.body;
        await models.bannerTextModel.findOneAndUpdate({ type }, { text1, text2, text3 });
        return res.json({ status: true });
    }
    catch (err) {
        console.error({ title: 'updateBannerText', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.getTournamentList = async (req, res) => {
    try {
        const response = await models.tournamentListModel.aggregate([
            {
                $lookup: {
                    from: 'tournamentusers',
                    foreignField: 'tournamentId',
                    localField: '_id',
                    as: 'users'
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

exports.addNewTournament = async (req, res) => {
    try {
        const {
            name,
            description,
            prizePoolAmount,
            prizePoolCoinType,
            winnerPercent1,
            winnerPercent2,
            winnerPercent3,
            winnerPercentN,
            startDate,
            endDate,
            finished,
            priceAmount
        } = req.body;

        if (new Date(startDate).getTime() <= new Date().getTime()) {
            return res.json({ status: false, message: 'Start date should be great than today!' });
        }
        else if (new Date(startDate).getTime() >= new Date(endDate).getTime()) {
            return res.json({ status: false, message: 'End date should be great than start date!' });
        }
        else if (name === '') {
            return res.json({ status: false, message: 'Please input tournament name!' });
        }
        else if (description === '') {
            return res.json({ status: false, message: 'Please input tournament description!' });
        }
        else if (prizePoolAmount <= 0) {
            return res.json({ status: false, message: 'Please input correct prize pool amount!' });
        }
        else if (winnerPercentN === 100) {
            return res.json({ status: false, message: 'Please input winner percent!' });
        }

        await new models.tournamentListModel({
            name,
            description,
            prizePoolAmount,
            prizePoolCoinType,
            winnerPercent1,
            winnerPercent2,
            winnerPercent3,
            winnerPercentN,
            startDate,
            endDate,
            finished,
            priceAmount
        }).save();
        return res.json({ status: true });
    }
    catch (err) {
        console.error({ title: 'addNewTournament', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.updateTournament = async (req, res) => {
    try {
        const {
            _id,
            name,
            description,
            prizePoolAmount,
            prizePoolCoinType,
            winnerPercent1,
            winnerPercent2,
            winnerPercent3,
            winnerPercentN,
            startDate,
            endDate,
            finished,
            priceAmount
        } = req.body;

        if (new Date(startDate).getTime() <= new Date().getTime()) {
            return res.json({ status: false, message: 'Start date should be great than today!' });
        }
        else if (new Date(startDate).getTime() >= new Date(endDate).getTime()) {
            return res.json({ status: false, message: 'End date should be great than start date!' });
        }
        else if (name === '') {
            return res.json({ status: false, message: 'Please input tournament name!' });
        }
        else if (description === '') {
            return res.json({ status: false, message: 'Please input tournament description!' });
        }
        else if (prizePoolAmount <= 0) {
            return res.json({ status: false, message: 'Please input correct prize pool amount!' });
        }
        else if (winnerPercentN === 100) {
            return res.json({ status: false, message: 'Please input winner percent!' });
        }

        await models.tournamentListModel.findOneAndUpdate({
            _id: _id
        }, {
            name,
            description,
            prizePoolAmount,
            prizePoolCoinType,
            winnerPercent1,
            winnerPercent2,
            winnerPercent3,
            winnerPercentN,
            startDate,
            endDate,
            finished,
            priceAmount
        });
        return res.json({ status: true });
    }
    catch (err) {
        console.error({ title: 'updateTournament', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.deleteTournament = async (req, res) => {
    try {
        const { id } = req.body;

        await models.tournamentListModel.findOneAndDelete({ _id: id });
        return res.json({ status: true });
    }
    catch (err) {
        console.error({ title: 'deleteTournament', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}