exports.createApp = (config) => {
    const express = require('express');
    const cors = require('cors');
    const compression = require('compression');
    const cookieParser = require('cookie-parser');
    const cookieSession = require('cookie-session');
    const errorHandler = require('errorhandler');
    const fileUpload = require('express-fileupload');
    const path = require('path');
    const adminController = require('./controllers/adminController');

    const app = express();
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(compression());
    app.use(cookieParser());
    app.use(fileUpload());
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
    const models = require('../models/index');
    models.mongoose.connect('mongodb+srv://victoryfox1116:kzBPFHRoRfxdDGVO@cluster0.iknukbk.mongodb.net/PlayZelo?authSource=admin&replicaSet=atlas-10v8gb-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true')
        .then(() => {
            console.log('Admin app connected to mongodb successfully');
            adminController.addAdminUser();
        })
        .catch((err) => {
            console.error({ title: 'mongdb connection error', message: err.message });
            process.exit();
        });
    app.use(express.static('admin/client/build'));
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(
            path.resolve(__dirname, 'client', 'build', 'index.html')
        );
    });
    app.use('', require('./middleware/index'), require('./routes/index'));

    app.use(cookieSession({
        name: 'session',
        keys: ['roostercookie'],
        maxAge: 24 * 60 * 60 * 1000 //24 hours
    }));

    if (app.get('env') === 'development')
        app.use(errorHandler({ dumpExceptions: true, showStack: true }));
    else if (app.get('env') === 'production')
        app.use(errorHandler());

    app.set('port', config.serverInfo.port);
    return app;
};

exports.createServer = (app) => {
    const server = require('http').createServer(app);
    return server;
};