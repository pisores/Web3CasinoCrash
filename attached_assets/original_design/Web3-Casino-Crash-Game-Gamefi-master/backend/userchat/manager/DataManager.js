const ChatRoom = require('../data/ChatRoom');

var userSockets = [];

exports.addUserSocket = (userId, socket) => {
    if (!userId || this.getUserById(userId) !== null) return;

    userSockets.push({ userId, socket });
};

exports.removeUserSocket = (socket) => {
    const index = userSockets.findIndex(user => user.socket === socket);
    if (index >= 0) userSockets.splice(index, 1);
};

exports.getUserById = (userId) => {
    const index = userSockets.findIndex(user => user.userId === userId);
    if (index < 0) return null;
    else userSockets[index];
};

exports.newChat = (data, socket) => {
    ChatRoom.newChat(data, socket);
};

exports.getChatData = (callback) => {
    ChatRoom.getChatData(callback);
};