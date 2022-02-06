import { createContext, useReducer, useState } from "react";
import UserReducer from "./UserReducer";

export const UserContext = createContext()

export const UserProvider = ({ children }) => {

    const initialState = {
        user: null
    }

    const [state, dispatch] = useReducer(UserReducer, initialState)

    return (
        <UserContext.Provider value={{
            user: state.user,
            getUser
        }}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContext