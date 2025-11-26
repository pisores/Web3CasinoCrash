const routerx = require('express-promise-router');
const adminController = require('../controllers/adminController');
const walletController = require('../controllers/walletController');
const rewardController = require('../controllers/rewardController');
const gameController = require('../controllers/gameController');

const Router = routerx();

Router.post('/adminlogin', adminController.adminLogin);
Router.post('/sessionCheck', adminController.sessionCheck);
Router.post('/confirmAuth', adminController.confirmAuth);
Router.post('/changepwd', adminController.changePassword);

Router.post('/countData', adminController.countData);

Router.post('/getGameUsers', adminController.getGameUsers);
Router.post('/getPlayerDetail', adminController.getPlayerDetail);
Router.post('/deleteGameUser', adminController.deleteGameUser);

Router.post('/getTurtleData', adminController.getTurtleData);
Router.post('/getTurtleDetail', adminController.getTurtleDetail);

Router.post('/getScissorsData', adminController.getScissorsData);

Router.post('/getMinesData', adminController.getMinesData);

Router.post('/getWalletList', walletController.getWalletList);
Router.post('/getWalletDetail', walletController.getWalletDetail);
Router.post('/withdrawFromAddress', walletController.withdrawFromAddress);

Router.post('/getSeedData', walletController.getSeedData);
Router.post('/newServerSeed', walletController.newServerSeed);

Router.post('/getEnabledData', rewardController.getEnabledData);
Router.post('/enableRewardSetting', rewardController.enableRewardSetting);
Router.post('/getDepositSettingData', rewardController.getDepositSettingData);
Router.post('/saveDepositRewardSetting', rewardController.saveDepositRewardSetting);
Router.post('/getRewardHistoryData', rewardController.getRewardHistoryData);
Router.post('/addAdminReward', rewardController.addAdminReward);

Router.post('/getFreeSpinSetting', rewardController.getFreeSpinSetting);
Router.post('/insertFreeSpinSetting', rewardController.insertFreeSpinSetting);
Router.post('/updateFreeSpinSetting', rewardController.updateFreeSpinSetting);
Router.post('/deleteFreeSpinSetting', rewardController.deleteFreeSpinSetting);
Router.post('/getSpinHistoryData', rewardController.getSpinHistoryData);
Router.post('/addAdminSpin', rewardController.addAdminSpin);

Router.post('/getUnlockSetting', rewardController.getUnlockSetting);
Router.post('/updateUnlockSetting', rewardController.updateUnlockSetting);

Router.post('/getDiceData', adminController.getDiceData);
Router.post('/getPlinkoData', adminController.getPlinkoData);

Router.post('/insertGame', gameController.insertGame);
Router.post('/removeGame', gameController.removeGame);
Router.post('/updateGame', gameController.updateGame);
Router.post('/readGame', gameController.readGame);

Router.post('/insertCurrency', walletController.insertCurrency);
Router.post('/removeCurrency', walletController.removeCurrency);
Router.post('/updateCurrency', walletController.updateCurrency);
Router.post('/readCurrency', walletController.readCurrency);

Router.post('/getUserLevelList', adminController.getUserLevelList);
Router.post('/saveUserLevelData', adminController.saveUserLevelData);

Router.post('/getBannerText', adminController.getBannerText);
Router.post('/updateBannerText', adminController.updateBannerText);

Router.post('/addNewTournament', adminController.addNewTournament);
Router.post('/getTournamentList', adminController.getTournamentList);
Router.post('/updateTournament', adminController.updateTournament);
Router.post('/deleteTournament', adminController.deleteTournament);

Router.post('/getCrashData', adminController.getCrashData);
Router.post('/getCrashDetail', adminController.getCrashDetail);

Router.post('/getSlotData', adminController.getSlotData);

module.exports = Router;