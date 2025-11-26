exports.createApp = (config) => {
    const express = require('express');
    const cors = require('cors');
    const compression = require('compression');
    const cookieParser = require('cookie-parser');
    const cookieSession = require('cookie-session');
    const errorHandler = require('errorhandler');
    const fileUpload = require('express-fileupload');

    const app = express();
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(compression());
    app.use(cookieParser());
    app.use(fileUpload());
    app.use(cookieSession({
        name: 'session',
        keys: ['roostercookie'],
        maxAge: 24 * 60 * 60 * 1000
    }));

    const models = require('../models/index');
    models.mongoose.connect(config.DB)
        .then(() => {
            console.log('server connected to mongodb successfully');
        })
        .catch((err) => {
            console.error({ title: 'mongodb connection error', message: err.message });
            process.exit();
        });

    if (app.get('env') === 'development')
        app.use(errorHandler({ dumpExceptions: true, showStack: true }));
    else
        app.use(errorHandler());

    app.set('port', config.serverInfo.port);
    return app;
};