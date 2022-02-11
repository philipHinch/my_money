const UserReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                user: action.payload
            }
        case 'SIGNUP':
            return {
                ...state,
                user: action.payload
            }
        case 'LOGOUT':
            return {
                ...state,
                user: null
            }
        case 'AUTH_IS_READY':
            return {
                ...state,
                user: action.payload,
                authIsReady: true
            }
        default:
            return state
    }
}

export default UserReducer