import Config from 'config/index';

export const userGoogleLogin = async (data) => {
    const response = await Config.Api.userGoogleLogin(data);
    return response;
}

export const metamaskLogin = async (data) => {
    const response = await Config.Api.metamaskLogin(data);
    return response;
}

export const emailLogin = async (data) => {
    const response = await Config.Api.emailLogin(data);
    return response;
}

export const verifyEmailCode = async (data) => {
    const response = await Config.Api.verifyEmailCode(data);
    return response.data;
}

export const updateProfileSet = async (data) => {
    const response = await Config.Api.updateProfileSet(data);
    return response.data;
}

export const getMyBalances = async (data) => {
    const response = await Config.Api.getMyBalances(data);
    return response.data;
}

export const getAuthData = async (data) => {
    const response = await Config.Api.getAuthData(data);
    return response.data;
}

export const getProfileData = async (data) => {
    const response = await Config.Api.getProfileData(data);
    return response.data;
}

export const getDepositBonus = async () => {
    const response = await Config.Api.getDepositBonus();
    return response.data;
}

export const getBetHistoryData = async (data) => {
    const response = await Config.Api.getBetHistoryData(data);
    return response.data;
}

export const updateCurrency = async (data) => {
    const response = await Config.Api.updateCurrency(data);
    return response.data;
}

export const updateProfileHistory = async (data) => {
    const response = await Config.Api.updateProfileHistory(data);
    return response.data;
}

export const updateUserGameSetting = async (data) => {
    const response = await Config.Api.updateUserGameSetting(data);
    return response.data;
}

export const getSeedData = async (data) => {
    const response = await Config.Api.getSeedData(data);
    return response.data;
}

export const updateClientSeed = async (data) => {
    const response = await Config.Api.updateClientSeed(data);
    return response.data;
}

export const updateServerSeed = async (data) => {
    const response = await Config.Api.updateServerSeed(data);
    return response.data;
}

export const getLevelData = async (data) => {
    const response = await Config.Api.getLevelData(data);
    return response.data;
}

export const getAvailableGames = async (data) => {
    const response = await Config.Api.getAvailableGames(data);
    return response.data;
}

export const getBannerText = async (data) => {
    const response = await Config.Api.getBannerText(data);
    return response.data;
}

export const getPrivacyData = async (data) => {
    const response = await Config.Api.getPrivacyData(data);
    return response.data;
}

export const updatePrivacyData = async (data) => {
    const response = await Config.Api.updatePrivacyData(data);
    return response.data;
}

export const getCampaignCode = async (data) => {
    const response = await Config.Api.getCampaignCode(data);
    return response.data;
}

export const getCampaignData = async (data) => {
    const response = await Config.Api.getCampaignData(data);
    return response.data;
}

export const claimCampaignAmount = async (data) => {
    const response = await Config.Api.claimCampaignAmount(data);
    return response.data;
}

export const getUnlockBalance = async (data) => {
    const response = await Config.Api.getUnlockBalance(data);
    return response.data;
}

export const getWargerBalance = async (data) => {
    const response = await Config.Api.getWargerBalance(data);
    return response.data;
}

export const claimLockedBalance = async (data) => {
    const response = await Config.Api.claimLockedBalance(data);
    return response.data;
}

export const getSpinCount = async (data) => {
    const response = await Config.Api.getSpinCount(data);
    return response.data;
}

export const updateSpinCount = async (data) => {
    const response = await Config.Api.updateSpinCount(data);
    return response.data;
}

export const getTournamentList = async (data) => {
    const response = await Config.Api.getTournamentList(data);
    return response.data;
}

export const participateTournament = async (data) => {
    const response = await Config.Api.participateTournament(data);
    return response.data;
}

export const getAffiliateUsersData = async (data) => {
    const response = await Config.Api.getAffiliateUsersData(data);
    return response.data;
}

export const getAffiliateEarningData = async (data) => {
    const response = await Config.Api.getAffiliateEarningData(data);
    return response.data;
}

export const getTournamentWargerDetail = async (data) => {
    const response = await Config.Api.getTournamentWargerDetail(data);
    return response.data;
}

export const getCampaignList = async (data) => {
    const response = await Config.Api.getCampaignList(data);
    return response.data;
}

export const addCampaignList = async (data) => {
    const response = await Config.Api.addCampaignList(data);
    return response.data;
}

export const getCampaignDetail = async (data) => {
    const response = await Config.Api.getCampaignDetail(data);
    return response.data;
}

export const getTransactionHistory = async (data) => {
    const response = await Config.Api.getTransactionHistory(data);
    return response.data;
}