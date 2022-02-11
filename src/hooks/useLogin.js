//firebase
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
//context
import { useContext, useEffect } from "react";
import UserContext from "../context/UserContext";
//hooks
import { useState } from "react";

export const useLogin = () => {

    const [isCancelled, setIsCancelled] = useState(false)
    const { dispatch } = useContext(UserContext)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const login = async (email, passoword) => {

        setError(null)
        setLoading(true)
        try {
            //login user
            const auth = getAuth()
            const userCredential = await signInWithEmailAndPassword(auth, email, passoword)
            const user = userCredential.user

            //dispatch login
            dispatch({
                type: 'LOGIN',
                payload: user
            })

            if (!isCancelled) {
                setLoading(false)
                setError(null)
            }

        } catch (error) {
            if (!isCancelled) {
                setError(error.message)
                setLoading(false)
                console.log('Oooops,', error);
            }
        }
    }

    //cleanup
    useEffect(() => {
        return () => setIsCancelled(true)
    }, [])

    return { loading, error, login }
}