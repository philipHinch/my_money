//hooks
import { useState, useEffect, useContext } from "react";
import { useExpensesIncomes } from "../../hooks/useExpensesIncomes";
//router
import { useParams } from "react-router-dom";
//context
import UserContext from "../../context/UserContext";
//icons
import { Icon } from '@iconify/react';
//firebase
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from "../../firebase.config";
//toastify
import { toast } from "react-toastify";

const ProfileList = () => {

    // ******** STATES AND OTHERS ********//

    const params = useParams()
    const { getData, loading } = useExpensesIncomes()
    const { user, authIsReady, data } = useContext(UserContext)
    const [amountArr, setAmountArr] = useState([])
    const [balance, setBalance] = useState(0)
    const [incomes, setIncomes] = useState(0)
    const [expenses, setExpenses] = useState(0)
    const [deleted, setDeleted] = useState(false)
    const [firebaseExpensesIncomes, setFirebaseExpensesIncomes] = useState(null)

    // ********* MAIN LOGIC *********//

    //on page load get expenses and incomes: *****
    useEffect(() => {


        // //get expenses and incomes from firebase on page load
        // const getFirebaseExpensesIncomes = async () => {
        //     const docRef = doc(db, 'users', params.userId)
        //     const docSnap = await getDoc(docRef);
        //     if (docSnap.exists()) {
        //         let firebaseArr = docSnap.data().expensesIncomes
        //         setFirebaseExpensesIncomes(firebaseArr)

        //     } else {
        //         console.log("No expenses or incomes in firebase");
        //     }
        // }
        // getFirebaseExpensesIncomes()

        const getAllData = () => {
            //get expenses and incomes on page load
            getData()

        }
        getAllData()




    }, [])

    // get expenses total on page load
    useEffect(() => {
        let arr = []
        data.forEach(item => {
            arr.push(item.expenseIncomeAmount)
        })
        let num
        const initialValue = 0;
        num = arr.filter((v) => {
            return v < 0
        }).reduce((previousValue, currentValue) => previousValue + currentValue,
            initialValue)
        setExpenses(num)
    }, [data])


    // get incomes total on page load
    useEffect(() => {
        let arr = []
        data.forEach(item => {
            arr.push(item.expenseIncomeAmount)
        })
        let num
        const initialValue = 0;
        num = arr.filter((v) => {
            return v > 0
        }).reduce((previousValue, currentValue) => previousValue + currentValue,
            initialValue)
        setIncomes(num)
    }, [data])


    // get balance on page load
    useEffect(() => {
        let arr = []
        data.forEach(item => {
            arr.push(item.expenseIncomeAmount)
        })
        const initialValue = 0;
        const num = arr.reduce(
            (previousValue, currentValue) => previousValue + currentValue,
            initialValue
        );
        setBalance(num)
    }, [data])

    //clear all items ******* NOT FINISHED, updates only on page refresh  *********
    const handleClearAll = () => {
        if (window.confirm('Are you sure you want to delete all items?') === true) {
            const clearAllItemsInFirebase = async () => {
                const docRef = doc(db, 'users', params.userId)
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    await updateDoc(docRef, {
                        expensesIncomes: []
                    })
                    getData()
                    toast.success('Cleared all items')
                } else {
                    console.log("No such document!");
                }
            }
            clearAllItemsInFirebase()
            setDeleted(true)
        }

    }

    //handle expense/income delete
    const handleDelete = (e) => {
        //get item id
        let id = e.target.id ? e.target.id : e.target.parentElement.id
        //delete item in firebase using id
        const deleteItemInFirebase = async () => {
            const docRef = doc(db, 'users', params.userId)
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                let oldArr = docSnap.data().expensesIncomes
                let newArr = oldArr.filter((item) => {
                    return item.expenseIncomeId !== id
                })
                await updateDoc(docRef, {
                    expensesIncomes: newArr
                })
                //get context data again
                getData()
                //toast notification
                toast.success('Item Deleted')
            } else {
                console.log("No such document!");
            }
        }
        deleteItemInFirebase()

        setDeleted(true)
    }

    const getMonthString = (num) => {
        switch (num) {
            case 1:
                return 'Jan'
                break;
            case 2:
                return 'Feb'
                break;
            case 3:
                return 'Mar'
                break;
            case 4:
                return 'Apr'
                break;
            case 5:
                return 'May'
                break;
            case 6:
                return 'Jun'
                break;
            case 7:
                return 'Jul'
                break;
            case 8:
                return 'Aug'
                break;
            case 9:
                return 'Sept'
                break;
            case 10:
                return 'Oct'
                break;
            case 11:
                return 'Nov'
                break;
            case 12:
                return 'Dec'
                break;
            default:
                break;
        }
    }

    const capitalize = (s) => {
        if (typeof s !== 'string') return ''
        return s.charAt(0).toUpperCase() + s.slice(1)
    }

    return (
        <div className="profileExpenses">
            <Icon icon="mdi:delete-forever" className='clearAllIcon'
                onClick={handleClearAll}
                style={{ fontSize: '2rem' }}
            />
            <div className="totalsContainer">
                {/* dynamic values*/}
                <h4>Incomes: <span className="incomesAmount positiveColor">{incomes > 0 ? '+' : ''}{incomes.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '€'}</span></h4>
                {/* <h3>Balance: <span className="balanceAmount positiveColor">+1240,00€</span></h3> */}
                <h3>Balance: <span className={`balanceAmount ${ balance > 0 ? 'positiveColor' : 'negativeColor' }`}>{balance > 0 ? '+' : ''}{balance.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '€'}</span></h3>
                <h4>Expenses: <span className="expensesAmount negativeColor">{expenses.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '€'}</span></h4>
            </div>
            <ul className="expensesList">

                {data && data.map(item => (
                    <li key={item.expenseIncomeId} id='expenseItem' className='expenseItem' style={{ borderLeft: `6px solid ${ item.expenseIncomeAmount < 0 ? '#e76f51' : '#2a9d8f' }` }}>

                        <p className="expenseItemDate">
                            <span className="date-as-calendar">
                                {/* <span className="month">{item.expenseIncomeDate.getMonth()}</span> */}
                                <span className="month">{getMonthString(item.expenseIncomeDate.getMonth() + 1)}</span>
                                <span className="day">{
                                    item.expenseIncomeDate.getDate()
                                }</span>
                                <span className="year">{item.expenseIncomeDate.getFullYear()}</span>
                            </span>
                        </p>

                        <p className="expenseItemCategory" title={capitalize(item.expenseIncomeCategory)}>
                            <img src={require(`../../assets/category_icons/${ item.expenseIncomeCategory }.png`)} alt="" />
                        </p>

                        <p className="expenseItemTitle">
                            {item.expenseIncomeTitle}
                        </p>


                        <p className={`expenseItemAmount ${ item.expenseIncomeAmount < 0 ? 'negativeColor' : 'positiveColor' }`}>
                            {item.expenseIncomeAmount > 0 ? '+' : ''}{item.expenseIncomeAmount.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                + '€'}
                        </p>

                        <div className="deleteIconContainer">
                            <Icon icon="mdi:close-thick" className='deleteIcon' id={item.expenseIncomeId} onClick={handleDelete} />
                        </div>

                    </li>
                ))}

                {/* {firebaseExpensesIncomes && firebaseExpensesIncomes.map(item => (
                    <li key={item.expenseIncomeId} id='expenseItem' className='expenseItem' style={{ borderLeft: `6px solid ${ item.expenseIncomeAmount < 0 ? '#e76f51' : '#2a9d8f' }` }}>
                        <p className="expenseItemDate">{item.expenseIncomeDate}</p>
                        <p className="expenseItemTitle">{item.expenseIncomeTitle}</p>
                        <p className={`expenseItemAmount ${ item.expenseIncomeAmount < 0 ? 'negativeColor' : 'positiveColor' }`}>{item.expenseIncomeAmount.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                            + '€'}</p>
                        <div className="deleteIconContainer">
                            <Icon icon="mdi:close-thick" className='deleteIcon' id={item.expenseIncomeId} onClick={handleDelete} />
                        </div>

                    </li>
                ))} */}
            </ul>
        </div>
    );
}

export default ProfileList;