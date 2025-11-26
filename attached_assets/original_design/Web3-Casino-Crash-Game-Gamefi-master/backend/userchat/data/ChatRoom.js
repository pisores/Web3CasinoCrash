const ChatController = require('../controller/ChatController');
const SocketManager = require('../manager/SocketManager');

exports.newChat = async (data, socket) => {
    try {
        const response = await ChatController.saveNewChat(data);
        SocketManager.newChatResponse(response, socket);
    }
    catch (err) {
        console.error({ title: 'ChatRoom => newChat', message: err.message });
        SocketManager.newChatResponse({ status: false, message: 'Server Error' }, socket);
    }
}

exports.getChatData = async (callback) => {
    try {
        const response = await ChatController.getChatData();
        callback(response);
    }
    catch (err) {
        console.error({ title: 'ChatRoom => getChatData', message: err.message });
        callback({ status: false, message: 'Server Error' });
    }
}