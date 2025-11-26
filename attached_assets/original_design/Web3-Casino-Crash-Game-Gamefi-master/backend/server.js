const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const app = express();
const server = http.Server(app);
const config = require('./config');
const path = require('path');
require('dotenv').config({ path: __dirname + '/.env' });

const initController = require('./controllers/initController');

app.use(cors('*'));
app.use(bodyParser.json({ limit: '1mb', type: 'application/json' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");
    next();
});

const models = require('./models/index');
models.mongoose.connect(config.DB)
    .then(() => {
        console.log('server connected to mongodb successfully');
        initController.initTatumBTC();
        initController.initTatumETH();
        initController.initTatumTRX();
        initController.initTatumBSC();
    })
    .catch((err) => {
        console.error({ title: 'mongodb connection error', message: err.message });
        process.exit();
    });
app.use(express.static('client'));

app.get('/', (req, res) => {
    res.send('TEST MODE IN HERE')
})

app.use('', require('./middleware/index'), require('./routes/index'));
server.listen(config.SERVER_PORT, () => { console.log(`server started on ${config.SERVER_PORT} port`) });