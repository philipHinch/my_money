// //hooks
import { useEffect, useState, useRef } from 'react';
//firebase
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export const useAuthStatus = () => {

    const [loggedIn, setLoggedIn] = useState(false)
    const [checkingStatus, setCheckingStatus] = useState(true)
    const isMounted = useRef(true)

    //added cleanup function with useRef
    useEffect(() => {
        if (isMounted) {
            const auth = getAuth()
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    setLoggedIn(true)
                }
                setCheckingStatus(false)
            })
        }
        return () => {
            isMounted.current = false
        }
    }, [isMounted])

    return { loggedIn, checkingStatus }
}