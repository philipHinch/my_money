import { createContext, useReducer, useState } from "react";
import UserReducer from "./UserReducer";

export const UserContext = createContext()

export const UserProvider = ({ children }) => {

    //initial user state
    const initialState = {
        user: null
    }
    const [state, dispatch] = useReducer(UserReducer, initialState)

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