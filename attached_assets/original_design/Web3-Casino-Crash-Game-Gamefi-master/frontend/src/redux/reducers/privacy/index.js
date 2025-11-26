const preState = {
    privateProfile: true,
    showOnlineIndicator: true
};

const settingReducer = (state = preState, action) => {
    switch (action.type) {
        case 'INIT_PRIVACY':
            return {
                ...action.data
            };
        default:
            state = { ...state };
            break;
    }
    return state;
};

export default settingReducer;