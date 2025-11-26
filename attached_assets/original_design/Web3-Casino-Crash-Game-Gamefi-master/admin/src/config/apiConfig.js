import axios from 'axios';
import ApiConfig from './baseConfig';

export default class PlayerService {
    constructor() {
        axios.interceptors.request.use(
            config => {
                config.baseURL = ApiConfig.Root.apiUrl
                config.headers = {
                    authorization: `Bearer ${this.getToken()}`
                }
                return config
            },
            error => Promise.reject(error)
        )
        axios.interceptors.response.use(
            response => {
                if (response.data.status === 'fail' && response.data.session) {
                    // eslint-disable-next-line
                    alert(response.data.message)
                    this.clearToken()
                    setTimeout(() => {
                        window.location.assign("/")
                    }, 500);
                }
                return response
            },
            error => Promise.reject(error)
        )
    }

    /**
     * auth
     */
    setToken = data => localStorage.setItem(ApiConfig.token, data)

    getToken = () => localStorage.getItem(ApiConfig.token)

    clearToken = () => localStorage.removeItem(ApiConfig.token)

    userLogin = (...args) => axios.post(ApiConfig.request.userLogin, ...args)

    confirmAuth = (...args) => axios.post(ApiConfig.request.confirmAuth, ...args)

    sessionCheck = () => axios.post(ApiConfig.request.sessionCheck, { token: this.getToken() })

    changePassword = (...args) => axios.post(ApiConfig.request.changePassword, ...args)

    getSetting = (...args) => axios.post(ApiConfig.request.getSetting, ...args)

    updateAdminCommission = (...args) => axios.post(ApiConfig.request.updateAdminCommission, ...args)

    getMaintenanceMode = (...args) => axios.post(ApiConfig.request.getMaintenanceMode, ...args)

    updateMaintenanceMode = (...args) => axios.post(ApiConfig.request.updateMaintenanceMode, ...args)

    /**
    * report
    */
    loadDashBoardData = (...args) => axios.post(ApiConfig.request.loadDashBoardData, ...args);

    getPlayerdata = (...args) => axios.post(ApiConfig.request.getPlayerdata, ...args);

    deletePlayerData = (...args) => axios.post(ApiConfig.request.deletePlayerData, ...args);

    getTurtleData = (...args) => axios.post(ApiConfig.request.getTurtleData, ...args);

    getScissorsData = (...args) => axios.post(ApiConfig.request.getScissorsData, ...args);

    getWalletList = (...args) => axios.post(ApiConfig.request.getWalletList, ...args);

    getWalletDetail = (...args) => axios.post(ApiConfig.request.getWalletDetail, ...args);

    getPlayerDetail = (...args) => axios.post(ApiConfig.request.getPlayerDetail, ...args);

    getTurtleDetail = (...args) => axios.post(ApiConfig.request.getTurtleDetail, ...args);

    withdrawFromAddress = (...args) => axios.post(ApiConfig.request.withdrawFromAddress, ...args);

    getSeedData = () => axios.post(ApiConfig.request.getSeedData);

    newServerSeed = (...args) => axios.post(ApiConfig.request.newServerSeed, ...args);

    getMinesData = (...args) => axios.post(ApiConfig.request.getMinesData, ...args);

    getEnabledData = (...args) => axios.post(ApiConfig.request.getEnabledData, ...args);

    enableRewardSetting = (...args) => axios.post(ApiConfig.request.enableRewardSetting, ...args);

    getDepositSettingData = (...args) => axios.post(ApiConfig.request.getDepositSettingData, ...args);

    saveDepositRewardSetting = (...args) => axios.post(ApiConfig.request.saveDepositRewardSetting, ...args);

    getRewardHistoryData = (...args) => axios.post(ApiConfig.request.getRewardHistoryData, ...args);

    addAdminReward = (...args) => axios.post(ApiConfig.request.addAdminReward, ...args);

    getFreeSpinSetting = (...args) => axios.post(ApiConfig.request.getFreeSpinSetting, ...args);

    insertFreeSpinSetting = (...args) => axios.post(ApiConfig.request.insertFreeSpinSetting, ...args);

    updateFreeSpinSetting = (...args) => axios.post(ApiConfig.request.updateFreeSpinSetting, ...args);

    deleteFreeSpinSetting = (...args) => axios.post(ApiConfig.request.deleteFreeSpinSetting, ...args);

    getSpinHistoryData = (...args) => axios.post(ApiConfig.request.getSpinHistoryData, ...args);

    addAdminSpin = (...args) => axios.post(ApiConfig.request.addAdminSpin, ...args);

    getUnlockSetting = (...args) => axios.post(ApiConfig.request.getUnlockSetting, ...args);

    updateUnlockSetting = (...args) => axios.post(ApiConfig.request.updateUnlockSetting, ...args);

    getDiceData = (...args) => axios.post(ApiConfig.request.getDiceData, ...args);
    
    getPlinkoData = (...args) => axios.post(ApiConfig.request.getPlinkoData, ...args);

    insertGame = (...args) => axios.post(ApiConfig.request.insertGame, ...args);

    removeGame = (...args) => axios.post(ApiConfig.request.removeGame, ...args);

    updateGame = (...args) => axios.post(ApiConfig.request.updateGame, ...args);

    readGame = (...args) => axios.post(ApiConfig.request.readGame, ...args);

    insertCurrency = (...args) => axios.post(ApiConfig.request.insertCurrency, ...args);

    removeCurrency = (...args) => axios.post(ApiConfig.request.removeCurrency, ...args);

    updateCurrency = (...args) => axios.post(ApiConfig.request.updateCurrency, ...args);

    readCurrency = (...args) => axios.post(ApiConfig.request.readCurrency, ...args);
    
    getUserLevelList = (...args) => axios.post(ApiConfig.request.getUserLevelList, ...args);
    
    saveUserLevelData = (...args) => axios.post(ApiConfig.request.saveUserLevelData, ...args);
    
    getBannerText = (...args) => axios.post(ApiConfig.request.getBannerText, ...args);
    
    updateBannerText = (...args) => axios.post(ApiConfig.request.updateBannerText, ...args);
    
    addNewTournament = (...args) => axios.post(ApiConfig.request.addNewTournament, ...args);
    
    getTournamentList = (...args) => axios.post(ApiConfig.request.getTournamentList, ...args);
    
    updateTournament = (...args) => axios.post(ApiConfig.request.updateTournament, ...args);
    
    deleteTournament = (...args) => axios.post(ApiConfig.request.deleteTournament, ...args);
    
    getCrashData = (...args) => axios.post(ApiConfig.request.getCrashData, ...args);
    
    getCrashDetail = (...args) => axios.post(ApiConfig.request.getCrashDetail, ...args);
    
    getSlotData = (...args) => axios.post(ApiConfig.request.getSlotData, ...args);
}