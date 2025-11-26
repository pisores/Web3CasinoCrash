const models = require('../../models/index');
const mongoose = require('mongoose');

exports.saveNewChat = async (data) => {
    try {
        const { userId, text, type } = data;
        const result = await new models.userChatModel({
            userId: mongoose.Types.ObjectId(userId),
            chatText: text,
            chatType: type,
            date: new Date()
        }).save();
        const chatData = await models.userChatModel.aggregate([
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
                $match: {
                    _id: result._id
                }
            },
            {
                $project: {
                    name: '$userData.userNickName',
                    userId: '$userId',
                    text: '$chatText',
                    type: '$chatType',
                    date: '$date',
                    avatar: 'avatar1.png'
                }
            }
        ])
        return { status: true, data: chatData };
    }
    catch (err) {
        console.error({ title: 'ChatController => saveNewChat', message: err.message });
        return { status: false, message: err.message };
    }
}

exports.getChatData = async () => {
    try {
        const result = await models.userChatModel.aggregate([
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
                    date: -1
                }
            },
            {
                $limit: 50
            },
            {
                $project: {
                    name: '$userData.userNickName',
                    userId: '$userId',
                    text: '$chatText',
                    type: '$chatType',
                    date: '$date',
                    avatar: 'avatar1.png'
                }
            }
        ])
        return { status: true, data: result };
    }
    catch (err) {
        console.error({ title: 'ChatController => getChatData', message: err.message });
        return { status: false, message: err.message };
    }
}