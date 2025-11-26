const model = require('../../models/index');
const config = require('../config');

module.exports = async (req, res, next) => {
    console.log(req.path)
    const whiteListUrls = [
        'adminlogin',
        'confirmAuth'
    ];
    const bearerHeader = req.headers['authorization'];
    // let urlIndex = whiteListUrls.findIndex(item => item === req.path);
    // if (urlIndex < 0) {
    //     if (bearerHeader) {
    //         let adminData = await model.adminUserModel.findOne({ token: bearerHeader.slice(7) });
    //         if (adminData && adminData.timestamp + config.session.time > Date.now()) {
    //             adminData.timestamp = Date.now();
    //             await adminData.save();
    //             return next();
    //         }
    //         else {
    //             return res.json({ status: false, message: 'Session has expired. Please login again', session: true });
    //         }
    //     }
    //     else {
    //         return res.json({ status: false, message: 'Session has expired. Please login again', session: true });
    //     }
    // }
    return next();
}