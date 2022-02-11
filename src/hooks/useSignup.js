//firebase
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

//context
import { useContext, useEffect } from "react";
import UserContext from "../context/UserContext";
//hooks
import { useState } from "react";

export const useSignup = () => {

    const [isCancelled, setIsCancelled] = useState(false)
    const { dispatch, user } = useContext(UserContext)
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

            // // //copy user auth details
            // // const formDataCopy = { ...formData }
            // // //delete password from copy
            // // delete formDataCopy.password
            // // //add timestamp
            // // formDataCopy.timestamp = serverTimestamp()
            // // //add user copy to database
            // // await setDoc(doc(db, 'users', user.uid), formDataCopy)

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

    //cleanup
    useEffect(() => {
        return () => setIsCancelled(true)
    }, [])

    return { loading, error, signUp }
}