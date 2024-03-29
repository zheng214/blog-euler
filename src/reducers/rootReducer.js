const initState = {
    darkMode: false,
};

const rootReducer = (state = initState, action) => {
    if (action.type === 'TOGGLE_DARK') {
        const newState = { ...state };
        newState.darkMode = !state.darkMode;
        state = newState;
    }
    return state;
}

export default rootReducer;