import axios from 'axios';
import ApiConfig from './baseConfig';

export default class GamblingService {
    constructor() {
        axios.interceptors.request.use(
            config => {
                config.baseURL = ApiConfig.Root.apiUrl;
                config.headers = {
                    authorization: `Bearer ${this.getToken()}`
                };
                return config;
            },
            error => Promise.reject(error)
        )
        axios.interceptors.response.use(
            response => {
                if (!response.data.status && response.data.session) {
                    // eslint-disable-next-line
                    alert(response.data.message);
                    setTimeout(() => {
                        window.location.assign("/");
                    }, 500);
                }
                return response
            },
            error => Promise.reject(error)
        )
    }

    setToken = (data) => localStorage.setItem(ApiConfig.token, data);

    getToken = () => localStorage.getItem(ApiConfig.token);

    clearToken = () => localStorage.removeItem(ApiConfig.token);

    getAuthData = (...args) => axios.post(ApiConfig.request.getAuthData, ...args);

    getProfileData = (...args) => axios.post(ApiConfig.request.getProfileData, ...args);

    userGoogleLogin = (...args) => axios.post(ApiConfig.request.userGoogleLogin, ...args);

    metamaskLogin = (...args) => axios.post(ApiConfig.request.metamaskLogin, ...args);

    emailLogin = (...args) => axios.post(ApiConfig.request.emailLogin, ...args);
    
    verifyEmailCode = (...args) => axios.post(ApiConfig.request.verifyEmailCode, ...args);
    
    updateProfileSet = (...args) => axios.post(ApiConfig.request.updateProfileSet, ...args);

    getDepositAddress = (...args) => axios.post(ApiConfig.request.getDepositAddress, ...args);

    getMyBalance = (...args) => axios.post(ApiConfig.request.getMyBalance, ...args);

    getMyBalances = (...args) => axios.post(ApiConfig.request.getMyBalances, ...args);

    withdraw = (...args) => axios.post(ApiConfig.request.withdraw, ...args);

    getDailyReward = (...args) => axios.post(ApiConfig.request.getDailyReward, ...args);

    getDepositBonus = () => axios.post(ApiConfig.request.getDepositBonus);

    getBetHistoryData = (...args) => axios.post(ApiConfig.request.getBetHistoryData, ...args);

    updateCurrency = (...args) => axios.post(ApiConfig.request.updateCurrency, ...args);

    updateProfileHistory = (...args) => axios.post(ApiConfig.request.updateProfileHistory, ...args);

    updateUserGameSetting = (...args) => axios.post(ApiConfig.request.updateUserGameSetting, ...args);

    getSeedData = (...args) => axios.post(ApiConfig.request.getSeedData, ...args);

    updateClientSeed = (...args) => axios.post(ApiConfig.request.updateClientSeed, ...args);

    updateServerSeed = (...args) => axios.post(ApiConfig.request.updateServerSeed, ...args);

    getLevelData = (...args) => axios.post(ApiConfig.request.getLevelData, ...args);
    
    getCurrencies = (...args) => axios.post(ApiConfig.request.getCurrencies, ...args);
    
    getAvailableGames = (...args) => axios.post(ApiConfig.request.getAvailableGames, ...args);
    
    getBannerText = (...args) => axios.post(ApiConfig.request.getBannerText, ...args);
    
    getExchangeRate = (...args) => axios.post(ApiConfig.request.getExchangeRate, ...args);
 
    swapCoin = (...args) => axios.post(ApiConfig.request.swapCoin, ...args);
    
    getPrivacyData = (...args) => axios.post(ApiConfig.request.getPrivacyData, ...args);
    
    updatePrivacyData = (...args) => axios.post(ApiConfig.request.updatePrivacyData, ...args);
    
    getCampaignCode = (...args) => axios.post(ApiConfig.request.getCampaignCode, ...args);
    
    getCampaignData = (...args) => axios.post(ApiConfig.request.getCampaignData, ...args);
    
    claimCampaignAmount = (...args) => axios.post(ApiConfig.request.claimCampaignAmount, ...args);
    
    getUnlockBalance = (...args) => axios.post(ApiConfig.request.getUnlockBalance, ...args);
    
    getWargerBalance = (...args) => axios.post(ApiConfig.request.getWargerBalance, ...args);
    
    claimLockedBalance = (...args) => axios.post(ApiConfig.request.claimLockedBalance, ...args);
    
    getSpinCount = (...args) => axios.post(ApiConfig.request.getSpinCount, ...args);
    
    updateSpinCount = (...args) => axios.post(ApiConfig.request.updateSpinCount, ...args);
    
    getTournamentList = (...args) => axios.post(ApiConfig.request.getTournamentList, ...args);
    
    participateTournament = (...args) => axios.post(ApiConfig.request.participateTournament, ...args);
    
    getAffiliateUsersData = (...args) => axios.post(ApiConfig.request.getAffiliateUsersData, ...args);
    
    getAffiliateEarningData = (...args) => axios.post(ApiConfig.request.getAffiliateEarningData, ...args);
    
    getTournamentWargerDetail = (...args) => axios.post(ApiConfig.request.getTournamentWargerDetail, ...args);
    
    getCampaignList = (...args) => axios.post(ApiConfig.request.getCampaignList, ...args);
    
    addCampaignList = (...args) => axios.post(ApiConfig.request.addCampaignList, ...args);
    
    getCampaignDetail = (...args) => axios.post(ApiConfig.request.getCampaignDetail, ...args);
    
    getTransactionHistory = (...args) => axios.post(ApiConfig.request.getTransactionHistory, ...args);
}