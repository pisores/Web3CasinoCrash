import Config from 'config/index';

export const getEnabledData = async (data) => {
	const response = await Config.Api.getEnabledData(data);
	return response.data;
}

export const enableRewardSetting = async (data) => {
	const response = await Config.Api.enableRewardSetting(data);
	return response.data;
}

export const getDepositSettingData = async (data) => {
	const response = await Config.Api.getDepositSettingData(data);
	return response.data;
}

export const saveDepositRewardSetting = async (data) => {
	const response = await Config.Api.saveDepositRewardSetting(data);
	return response.data;
}

export const getRewardHistoryData = async (data) => {
	const response = await Config.Api.getRewardHistoryData(data);
	return response.data;
}

export const addAdminReward = async (data) => {
	const response = await Config.Api.addAdminReward(data);
	return response.data;
}

export const getFreeSpinSetting = async (data) => {
	const response = await Config.Api.getFreeSpinSetting(data);
	return response.data;
}

export const insertFreeSpinSetting = async (data) => {
	const response = await Config.Api.insertFreeSpinSetting(data);
	return response.data;
}

export const updateFreeSpinSetting = async (data) => {
	const response = await Config.Api.updateFreeSpinSetting(data);
	return response.data;
}

export const deleteFreeSpinSetting = async (data) => {
	const response = await Config.Api.deleteFreeSpinSetting(data);
	return response.data;
}

export const getSpinHistoryData = async (data) => {
	const response = await Config.Api.getSpinHistoryData(data);
	return response.data;
}

export const addAdminSpin = async (data) => {
	const response = await Config.Api.addAdminSpin(data);
	return response.data;
}

export const getUnlockSetting = async (data) => {
	const response = await Config.Api.getUnlockSetting(data);
	return response.data;
}

export const updateUnlockSetting = async (data) => {
	const response = await Config.Api.updateUnlockSetting(data);
	return response.data;
}
