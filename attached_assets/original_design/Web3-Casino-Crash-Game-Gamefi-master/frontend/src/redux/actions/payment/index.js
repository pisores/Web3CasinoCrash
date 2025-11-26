import Config from 'config/index';

export const getDepositAddress = async (data) => {
    const response = await Config.Api.getDepositAddress(data);
    return response.data;
}

export const getMyBalance = async (data) => {
    const response = await Config.Api.getMyBalance(data);
    return response.data;
}

export const withdraw = async (data) => {
    const response = await Config.Api.withdraw(data);
    return response.data;
}

export const getDailyReward = async (data) => {
    const response = await Config.Api.getDailyReward(data);
    return response.data;
}

export const getCurrencies = async (data) => {
    const response = await Config.Api.getCurrencies(data);
    return response.data;
}

export const getExchangeRate = async (data) => {
    const response = await Config.Api.getExchangeRate(data);
    return response.data;
}

export const swapCoin = async (data) => {
    const response = await Config.Api.swapCoin(data);
    return response.data;
}