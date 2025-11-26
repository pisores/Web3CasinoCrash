const preState = {
    walletModal: false,
    levelModal: false,
    spinModal: false,
    settingModal: false,
    fairModal: false,
    privacyModal: false
};

const modalReducer = (state = preState, action) => {
    switch (action.type) {
        case 'SET_WALLET_MODAL':
            return {
                ...state,
                walletModal: action.data
            };
        case 'SET_LEVEL_MODAL':
            return {
                ...state,
                levelModal: action.data
            };
        case 'SET_SPIN_MODAL':
            return {
                ...state,
                spinModal: action.data
            };
        case 'SET_SETTING_MODAL':
            return {
                ...state,
                settingModal: action.data
            };
        case 'SET_FAIR_MODAL':
            return {
                ...state,
                fairModal: action.data
            };
        case 'SET_PRIVACY_MODAL':
            return {
                ...state,
                privacyModal: action.data
            };
        default:
            state = { ...state };
            break;
    }
    return state;
};

export default modalReducer;