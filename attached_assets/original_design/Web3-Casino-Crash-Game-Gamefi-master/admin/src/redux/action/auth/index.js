import Config from 'config/index';

export const userLogin = async (data) => {
    const response = await Config.Api.userLogin(data);
    return response.data;
}

export const confirmAuth = async (data, addToast) => {
    const response = await Config.Api.confirmAuth(data);
    if(response.data.status) {
        Config.Api.setToken(response.data.token);
        addToast('Login success', { appearance: 'success', autoDismiss: true });
        setTimeout(() => {
            window.location.assign('/')
        }, 500);
    }
    else {
        addToast(response.data.message, { appearance: 'error', autoDismiss: true });
    }
}

export const sessionCheck = async() => {
    const token = Config.Api.getToken()
    if (token) {
        const ScData = await Config.Api.sessionCheck()
        if (ScData.data.status) {
            return {
                userAuth: { isAuth: true, userData: ScData.data.data }
            }
        }
        return {
            userAuth: { isAuth: false }
        }
    }
}


export const changePassword = async (data) => {
    const response = await Config.Api.changePassword(data);
    return response.data;
}

export const getSetting = async (data) => {
    const response = await Config.Api.getSetting(data);
    return response.data;
}

export const updateAdminCommission = async (data) => {
    const response = await Config.Api.updateAdminCommission(data);
    return response.data;
}

export const updateMaintenanceMode = async (data) => {
    const response = await Config.Api.updateMaintenanceMode(data);
    return response.data;
}

export const addNewTournament = async (data) => {
    const response = await Config.Api.addNewTournament(data);
    return response.data;
}

export const getTournamentList = async (data) => {
    const response = await Config.Api.getTournamentList(data);
    return response.data;
}

export const updateTournament = async (data) => {
    const response = await Config.Api.updateTournament(data);
    return response.data;
}

export const deleteTournament = async (data) => {
    const response = await Config.Api.deleteTournament(data);
    return response.data;
}