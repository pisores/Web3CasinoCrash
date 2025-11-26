const preState = {
    chatVisible: false
};

const chatReducer = (state = preState, action) => {
    switch (action.type) {
        case 'SET_CAHTVISIBLE':
            return {
                ...state,
                chatVisible: action.data
            };
        default:
            state = { ...state };
            break;
    }
    return state;
};

export default chatReducer;