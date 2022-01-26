import { createContext, useReducer, useState } from "react";
import UserReducer from "./UserReducer";
//firebase
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export const UserContext = createContext()

export const UserProvider = ({ children }) => {

    const initialState = {
        user: null
    }

    const [state, dispatch] = useReducer(UserReducer, initialState)

    //get user display name
    // const getUser = () => {
    //     try {
    //         const auth = getAuth()
    //         onAuthStateChanged(auth, (user) => {
    //             if (user) {
    //                 dispatch({
    //                     type: 'GET_USER',
    //                     payload: user
    //                 })
    //             } else {
    //                 return;
    //             }
    //         });
    //     } catch (err) {
    //         throw new Error(err)
    //     }
    // }

    const getUser = () => {
        try {
            const auth = getAuth()
            if (auth.currentUser) {
                dispatch({
                    type: 'GET_USER',
                    payload: auth.currentUser
                })
            } else {
                return
            }
        } catch (err) {
            throw new Error(err)
        }
    }

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