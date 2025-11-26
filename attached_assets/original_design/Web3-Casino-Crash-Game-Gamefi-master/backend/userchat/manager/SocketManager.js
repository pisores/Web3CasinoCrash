const ChatSocket = require('../socket/ChatSocket');

var chatSocket = null;

exports.createServer = (app) => {
    const server = require('http').createServer(app);
    chatSocket = new ChatSocket(server);
    return server;
}

exports.newChatResponse = (data, socket) => {
    chatSocket.sendTo(socket, 'newChatResponse', data);
    if (data.status)
        chatSocket.broadCast('receiveNewChat', data.data);
}