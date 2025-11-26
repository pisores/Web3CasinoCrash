const ManageSocket = require('../socket/ManageSocket');

var manageSocket = null;

exports.createServer = (app) => {
    const server = require('http').createServer(app);
    manageSocket = new ManageSocket(server);
    return server;
}

// exports.createServer = (app) => {
//     const fs = require('fs');
//     const options = {
//         key: fs.readFileSync(`./config/ssl-certificate/memewarsx_key.pem`),
//         cert: fs.readFileSync(`./config/ssl-certificate/memewarsx_cert.pem`),
//     };

//     const server = require('https').createServer(options, app);
//     manageSocket = new ManageSocket(server);
//     return server;
// };


exports.sendBetHistory = (data) => {
    if (manageSocket !== null)
        manageSocket.broadCast('updateBetHistory', data);
}