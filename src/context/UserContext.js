//hooks
import { createContext, useEffect, useReducer } from "react";
//firebase
import { getAuth } from "firebase/auth";
//reducer
import UserReducer from "./UserReducer";

export const UserContext = createContext()

export const UserProvider = ({ children }) => {

    //initial state
    const initialState = {
        user: null,
        authIsReady: false,
        data: []
    }
    const [state, dispatch] = useReducer(UserReducer, initialState)


    //check if user
    useEffect(() => {
        const auth = getAuth()
        const unsub = auth.onAuthStateChanged((user) => {
            dispatch({
                type: 'AUTH_IS_READY',
                payload: user
            })
            unsub()
        })
    }, [])


    return (
        <UserContext.Provider value={{
            ...state, dispatch
        }}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContext