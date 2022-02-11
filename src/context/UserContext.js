//hooks
import { createContext, useEffect, useReducer, useState } from "react";
//firebase
import { getAuth } from "firebase/auth";
//reducer
import UserReducer from "./UserReducer";

export const UserContext = createContext()

export const UserProvider = ({ children }) => {

    //initial user state
    const initialState = {
        user: null,
        authIsReady: false
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

    console.log(state);

    return (
        <UserContext.Provider value={{
            ...state, dispatch
        }}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContext