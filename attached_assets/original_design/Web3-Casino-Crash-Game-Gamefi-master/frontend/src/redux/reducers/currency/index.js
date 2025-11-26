const preState = {
    currencies: []
};

const currencyReducer = (state = preState, action) => {
    switch (action.type) {
        case 'SET_CURRENCIES':
            return {
                ...state,
                currencies: action.data
            };
        default:
            state = { ...state };
            break;
    }
    return state;
};

export default currencyReducer;