import Config from 'config/index';

export const loadDashBoardData = async (data) => {
	const response = await Config.Api.loadDashBoardData(data);
	return response.data;
}

export const getPlayerdata = async (data) => {
	const response = await Config.Api.getPlayerdata(data);
	return response.data;
}

export const deletePlayerData = async (data) => {
	const response = await Config.Api.deletePlayerData(data);
	return response.data;
}

export const getPlayerDetail = async (data) => {
	const response = await Config.Api.getPlayerDetail(data);
	return response.data;
}

export const getAuthCode = async () => {
	const response = await Config.Api.getAuthCode();
	return response.data;
}

export const getTurtleData = async (data) => {
	const response = await Config.Api.getTurtleData(data);
	return response.data;
}

export const getTurtleDetail = async (data) => {
	const response = await Config.Api.getTurtleDetail(data);
	return response.data;
}

export const getScissorsData = async (data) => {
	const response = await Config.Api.getScissorsData(data);
	return response.data;
}

export const getMinesData = async (data) => {
	const response = await Config.Api.getMinesData(data);
	return response.data;
}

export const getDiceData = async (data) => {
	const response = await Config.Api.getDiceData(data);
	return response.data;
}

export const getPlinkoData = async (data) => {
	const response = await Config.Api.getPlinkoData(data);
	return response.data;
}

export const getCrashData = async (data) => {
	const response = await Config.Api.getCrashData(data);
	return response.data;
}

export const getCrashDetail = async (data) => {
	const response = await Config.Api.getCrashDetail(data);
	return response.data;
}

export const getSlotData = async (data) => {
	const response = await Config.Api.getSlotData(data);
	return response.data;
}

export const getWalletList = async (data) => {
	const response = await Config.Api.getWalletList(data);
	return response.data;
}

export const getWalletDetail = async (data) => {
	const response = await Config.Api.getWalletDetail(data);
	return response.data;
}

export const withdrawFromAddress = async (data) => {
	const response = await Config.Api.withdrawFromAddress(data);
	return response.data;
}

export const getSeedData = async () => {
	const response = await Config.Api.getSeedData();
	return response.data;
}

export const newServerSeed = async (data) => {
	const response = await Config.Api.newServerSeed(data);
	return response.data;
}

export const checkCustomerData = async (customer, isNew) => {
	if (!customer.username) {
		return 'Please input username';
	}
	if (!customer.customerId) {
		return 'Please input customer ID';
	}
	if (!customer.sitename) {
		return 'Please input site name';
	}
	if (!customer.type) {
		return 'Please select type';
	}
	if (!customer.callbackUrl) {
		return 'Please input callback url';
	}
	if (!customer.website) {
		return 'Please input website link';
	}
	if (!customer.authKey) {
		return 'Please input authentication key';
	}
	if (isNew) {
		if (!customer.password) {
			return 'Please input password';
		}
		if (!customer.rpassword) {
			return 'Please input confirm password';
		}
		if (customer.password !== customer.rpassword) {
			return 'Confirm password is not same';
		}
	}
	return true;
}

export const getUserLevelList = async (data) => {
	const response = await Config.Api.getUserLevelList(data);
	return response.data;
}

export const saveUserLevelData = async (data) => {
	const response = await Config.Api.saveUserLevelData(data);
	return response.data;
}

export const getBannerText = async (data) => {
	const response = await Config.Api.getBannerText(data);
	return response.data;
}

export const updateBannerText = async (data) => {
	const response = await Config.Api.updateBannerText(data);
	return response.data;
}