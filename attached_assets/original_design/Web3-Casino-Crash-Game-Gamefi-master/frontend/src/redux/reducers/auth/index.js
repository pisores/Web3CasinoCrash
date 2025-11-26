const preState = {
    isAuth: false,
    userData: null,
    balanceData: {}
};

const authReducer = (state = preState, action) => {
    switch (action.type) {
        case 'SET_AUTH':
            return {
                ...state,
                isAuth: true
            };
        case 'SET_USERDATA':
            return {
                ...state,
                userData: action.data
            };
        case 'SET_BALANCEDATA':
            return {
                ...state,
                balanceData: action.data
            };
        default:
            state = { ...state };
            break;
    }
    return state;
};

export default authReducer;