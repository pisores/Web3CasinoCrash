const preState = {
    menuVisible: false,
    menuRouter: '/home'
};

const menuReducer = (state = preState, action) => {
    switch (action.type) {
        case 'SET_MENUVISIBLE':
            return {
                ...state,
                menuVisible: action.data
            };
        case 'SET_MENUROUTER':
            return {
                ...state,
                menuRouter: action.data
            };
        default:
            state = { ...state };
            break;
    }
    return state;
};

export default menuReducer;