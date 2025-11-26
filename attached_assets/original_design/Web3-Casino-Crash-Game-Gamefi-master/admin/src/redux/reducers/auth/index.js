const preState = {
    isAuth: false,
    userData: {},
    authToken: '',
};

const userAuth = (state = preState, action) => {
    switch(action.type) {
        case 'SET_AUTH':
            return {
                ...state,
                isAuth: action.data
            };
            
        case 'SET_TOKEN':
            return {
                ...state,
                authToken: action.data
            };

        case 'SET_USERDATA':
            return {
                ...state,
                userData: action.data
            };
        
        default:
            state = {...state};
            break;
    }
    return state;
};

export default userAuth;