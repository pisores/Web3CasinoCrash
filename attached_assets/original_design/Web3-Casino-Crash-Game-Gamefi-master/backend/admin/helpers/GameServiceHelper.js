const axios = require('axios');
const Config = require('../config');

class GameServiceHelper {
    constructor() {
        axios.interceptors.request.use(
            config => {
                config.baseURL = `http://${Config.gameInfo.host}:${Config.gameInfo.port}/api`;
                config.headers = { 'Content-Type': 'application/json' }
                return config;
            },
            error => Promise.reject(error)
        )
        axios.interceptors.response.use(
            response => { return response; },
            error => Promise.reject(error)
        )
    }

    updateMaintenanceMode = async (mode) => {
        try {
            if (!mode)
                return false

            let request = { mode };
            let response = await axios.post('updateMaintenanceMode', request);
            return response.status;
        }
        catch (err) {
            console.error({ title: 'updateMaintenanceMode', message: err.message });
        }
    }
};

module.exports = GameServiceHelper;