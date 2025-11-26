const routerx = require('express-promise-router');
const cryptoController = require('../controllers/cryptoController');

const Router = routerx();

Router.post('/webhook-handler', cryptoController.tatumWebhook);
Router.post('/deposit-address', cryptoController.getDepositAddressFromAccount);
Router.post('/get-balance', cryptoController.getBalanceFromAccount);
Router.post('/withdraw', cryptoController.withdrawFromAccount);
Router.post('/btc-withdraw', cryptoController.withdrawBTCFromAccount);
Router.post('/eth-withdraw', cryptoController.withdrawETHFromAccount);
Router.post('/tron-withdraw', cryptoController.withdrawTRONFromAccount);
Router.post('/get-daily-reward', cryptoController.getDailyReward);
Router.post('/getCurrencies', cryptoController.getCurrencies);
Router.post('/getExchangeRate', cryptoController.getExchangeRate);
Router.post('/swapCoin', cryptoController.swapCoin);

module.exports = Router;