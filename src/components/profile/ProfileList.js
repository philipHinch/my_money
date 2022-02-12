//hooks
import { useState, useEffect, useContext } from "react";
//router
import { useParams } from "react-router-dom";
//context
import UserContext from "../../context/UserContext";
//icons
import { Icon } from '@iconify/react';
//firebase
import { doc, getDoc } from 'firebase/firestore';
import { db } from "../../firebase.config";
//toastify
import { toast } from "react-toastify";

const ProfileList = () => {

    // ******** STATES AND OTHERS ********//

    const params = useParams()
    const { user, authIsReady } = useContext(UserContext)
    const [balance, setBalance] = useState(0)
    const [incomes, setIncomes] = useState(0)
    const [expenses, setExpenses] = useState(0)
    const [firebaseExpensesIncomes, setFirebaseExpensesIncomes] = useState(null)

    // ********* MAIN LOGIC *********//

    //on page load get expenses and incomes: *****
    useEffect(() => {
        if (authIsReady) {

        }
        //get expenses and incomes from firebase on page load
        const getFirebaseExpensesIncomes = async () => {
            const docRef = doc(db, 'users', params.userId)
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                let firebaseArr = docSnap.data().expensesIncomes
                setFirebaseExpensesIncomes(firebaseArr)

            } else {
                console.log("No expenses or incomes in firebase");
            }
        }
        getFirebaseExpensesIncomes()
    }, [authIsReady])

    //clear all expenses and incomes
    const handleClearAll = () => {

    }

    //handle expense/income delete
    const handleDelete = () => {

    }


    return (
        <div className="profileExpenses">
            <Icon icon="mdi:delete-forever" className='clearAllIcon' onClick={handleClearAll} />
            <div className="totalsContainer">
                {/* dynamic values*/}
                <h4>Incomes: <span className="incomesAmount positiveColor">{incomes.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '€'}</span></h4>
                {/* <h3>Balance: <span className="balanceAmount positiveColor">+1240,00€</span></h3> */}
                <h3>Balance: <span className={`balanceAmount ${ balance > 0 ? 'positiveColor' : 'negativeColor' }`}>{balance.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '€'}</span></h3>
                <h4>Expenses: <span className="expensesAmount negativeColor">{expenses.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '€'}</span></h4>
            </div>
            <ul className="expensesList">

                {firebaseExpensesIncomes && firebaseExpensesIncomes.map(item => (
                    <li key={item.expenseIncomeId} id='expenseItem' className='expenseItem' style={{ borderLeft: `6px solid ${ item.expenseIncomeAmount < 0 ? '#e76f51' : '#2a9d8f' }` }}>
                        <p className="expenseItemDate">{item.expenseIncomeDate}</p>
                        <p className="expenseItemTitle">{item.expenseIncomeTitle}</p>
                        <p className={`expenseItemAmount ${ item.expenseIncomeAmount < 0 ? 'negativeColor' : 'positiveColor' }`}>{item.expenseIncomeAmount.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                            + '€'}</p>
                        <div className="deleteIconContainer">
                            <Icon icon="mdi:close-thick" className='deleteIcon' id={item.expenseIncomeId} onClick={handleDelete} />
                        </div>

                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ProfileList;