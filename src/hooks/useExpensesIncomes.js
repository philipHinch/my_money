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

    const getData = async () => {

        let firebaseArr
        setError(null)
        setLoading(true)
        try {
            let arr = []
            let sortedArr = []
            //get user expenses and incomes from firease
            const docRef = doc(db, 'users', params.userId)
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                firebaseArr = await docSnap.data().expensesIncomes

                //replace date with date object (in order to sort it in line:49)

                firebaseArr.map(item => {
                    arr.push({
                        expenseIncomeTitle: item.expenseIncomeTitle,
                        expenseIncomeAmount: item.expenseIncomeAmount,
                        expenseIncomeId: item.expenseIncomeId,
                        expenseIncomeDate: new Date(item.expenseIncomeDate),
                        expenseIncomeCategory: item.expenseIncomeCategory
                    })
                })

                //sort array by date
                arr.sort((a, b) => b.expenseIncomeDate - a.expenseIncomeDate)

            } else {

            }
            //dispatch action
            dispatch({
                type: 'GET_EXPENSES_INCOMES',
                payload: arr
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