//firebase
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
//context
import { useContext } from "react";
import UserContext from "../context/UserContext";
//hooks
import { useState } from "react";

export const useSignup = () => {

    const [isCancelled, setIsCancelled] = useState(false)
    const { dispatch } = useContext(UserContext)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const signUp = async (email, passoword, name) => {

        setError(null)
        setLoading(true)
        try {
            //sign up user
            const auth = getAuth()
            const userCredential = await createUserWithEmailAndPassword(auth, email, passoword)
            const user = userCredential.user

            //add displayname to user
            await updateProfile(auth.currentUser, {
                displayName: name
            })

            //dispatch signup
            dispatch({
                type: 'SIGNUP',
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

    return { loading, error, signUp }
}