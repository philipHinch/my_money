//firebase
import { doc, getDoc } from 'firebase/firestore';
import { db } from "../firebase.config";
//context
import { useContext, useEffect } from "react";
import UserContext from "../context/UserContext";
//hooks
import { useState } from "react";
//router
import { useParams } from "react-router-dom";
//toastify
import { toast } from 'react-toastify';

export const useExpensesIncomes = () => {

    const params = useParams()
    const [isCancelled, setIsCancelled] = useState(false)
    const { dispatch, user, authIsReady, data } = useContext(UserContext)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [firebaseExpensesIncomes, setFirebaseExpensesIncomes] = useState(null)


    const getData = async () => {

        let firebaseArr
        setError(null)
        setLoading(true)
        try {
            //get user expenses and incomes from firease
            const docRef = doc(db, 'users', params.userId)
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                firebaseArr = await docSnap.data().expensesIncomes
                //setFirebaseExpensesIncomes(firebaseArr)
            } else {
                console.log("No expenses or incomes in firebase");
            }
            //dispatch action
            dispatch({
                type: 'GET_EXPENSES_INCOMES',
                payload: firebaseArr
            })

            if (!isCancelled) {
                setLoading(false)
                setError(null)
            }


        } catch (error) {
            if (!isCancelled) {
                setError(error.message)
                setLoading(false)
                toast.error(error.message)
                console.log('Oooops,', error);
            }
        }
    }

    //cleanup
    useEffect(() => {
        return () => setIsCancelled(true)
    }, [])

    return { loading, error, getData }
}