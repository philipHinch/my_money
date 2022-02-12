//hooks
import { useState, useEffect, useContext } from "react";
//context
import { UserContext } from '../context/UserContext';
//firebase
import { getAuth, signOut } from "firebase/auth";


export const useLogout = () => {

    // FIX THE MEMORY LEAK ERROR ON LOGGING OUT

    const [isCancelled, setIsCancelled] = useState(false)
    const { dispatch } = useContext(UserContext)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const logout = async () => {
        setLoading(true)
        setError(null)

        const auth = getAuth()
        try {
            await auth.signOut()

            dispatch({
                type: 'LOGOUT'
            })

            setError(null)
            setLoading(false)
        } catch (error) {
            console.log(error.message);
            setError(error.message)
        }
    }

    return { logout, loading, error }
}