//hooks
import { useState, useContext, useEffect } from "react";
import { useDate } from "../../hooks/useDate";
import { useExpensesIncomes } from "../../hooks/useExpensesIncomes";
//context
import UserContext from "../../context/UserContext";
//firebase
import { updateDoc, doc, getDoc, onSnapshot, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase.config';
//router
import { useParams } from "react-router-dom";
//uuid
import { v4 as uuidv4 } from 'uuid';
import { toast } from "react-toastify";

const expensesCategoriesArr = ['other', 'car', 'entertainment', 'food', 'grocery', 'health', 'house', 'insurance', 'miscellaneous', 'petrol', 'phone', 'restaurant', 'sport', 'transport', 'travel', 'taxes', 'utility']

const incomesCategoriesArr = ['other', 'business', 'gift', 'house', 'insurance', 'interest', 'miscellaneous', 'pension', 'salary',]

const ProfileForm = () => {

    // ******** STATES AND OTHERS ********//

    const { getData } = useExpensesIncomes()
    const date = useDate()
    const params = useParams()
    const { user } = useContext(UserContext)
    const [selectValue, setSelectValue] = useState('other')
    const [expense, setExpense] = useState(true)
    const [income, setIncome] = useState(false)
    const [formData, setFormData] = useState({
        expenseIncomeTitle: '',
        expenseIncomeAmount: '',
        expenseIncomeDate: '',
        expenseIncomeId: '',
        expenseIncomeCategory: selectValue
        //servertimestamp will replace expenseDate
    })
    const { expenseIncomeTitle, expenseIncomeAmount, expenseIncomeDate, expenseIncomeCategory } = formData

    // ********* MAIN LOGIC *********//

    const capitalize = (s) => {
        if (typeof s !== 'string') return ''
        return s.charAt(0).toUpperCase() + s.slice(1)
    }

    //handle select values
    const handleSelectChange = (e) => {
        setSelectValue(e.target.value)
    }

    //submit expense/income form data
    const handleSubmit = async (e) => {
        e.preventDefault()
        let num = expenseIncomeAmount
        //set number either to negative or positive
        expense ? (num = Math.abs(num) * -1) : num = Math.abs(num)
        let d = !expenseIncomeDate ? date : expenseIncomeDate
        //send data to firebase
        const docRef = doc(db, 'users', params.userId)
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            // console.log("Document data:", docSnap.data().expensesIncomes);
            let oldArr = docSnap.data().expensesIncomes
            let newArr = [{
                expenseIncomeTitle,
                expenseIncomeAmount: num,
                expenseIncomeDate: d,
                expenseIncomeId: uuidv4(),
                expenseIncomeCategory: selectValue
            }, ...oldArr]


            await updateDoc(docRef, {
                expensesIncomes: newArr
            })

            getData()

            toast.success('Item Added')
        } else {
            console.log("No such document!");
        }
        //reset form
        setFormData({
            expenseIncomeTitle: '',
            expenseIncomeAmount: '',
            expenseIncomeDate: '',
            expenseIncomeId: ''

        })
    }

    //save expense/income form data in state
    const handleChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value
        }))
    }

    //toggle between expense or income
    const handleExpenseButtonClick = () => {
        //add focus on input
        setExpense(true)
        setIncome(false)
    }

    const handleIncomeButtonClick = () => {
        //add focus on input
        setIncome(true)
        setExpense(false)
    }



    return (
        <form className="profileForm" onSubmit={handleSubmit}>
            <div className="buttonContainer">
                <div className={`btn ${ expense ? 'btn-secondary' : 'btn-not-active' }`} onClick={handleExpenseButtonClick}>Expense</div>
                <div className={`btn ${ income ? 'btn-secondary' : 'btn-not-active' }`} onClick={handleIncomeButtonClick}>Income</div>
            </div>
            <div className="expenseTitleDiv">
                <input
                    type="text"
                    id="expenseIncomeTitle"
                    placeholder={expense ? 'Expense Title' : 'Income Title'} required
                    minLength='3'
                    maxLength='15'
                    value={expenseIncomeTitle}
                    onChange={(e) => handleChange(e)}
                />
            </div>
            <div className="expenseIncomeAmountDiv">
                <input
                    type="number"
                    id="expenseIncomeAmount"
                    placeholder='Amount'
                    step=".01"
                    required
                    min='0'
                    max='999999999'
                    value={expenseIncomeAmount}
                    onChange={(e) => handleChange(e)}
                />
            </div>
            <input
                type="date"
                id="expenseIncomeDate"
                value={!expenseIncomeDate ? date : expenseIncomeDate}
                onChange={(e) => handleChange(e)}
                required
            />
            {expense && <select name='categories' id="selectInput" onChange={handleSelectChange}>
                {expensesCategoriesArr.map(cat => (
                    <option value={cat} key={cat}>{capitalize(cat)}</option>
                ))}
            </select>}

            {income && <select name='categories' id="selectInput" onChange={handleSelectChange}>
                {incomesCategoriesArr.map(cat => (
                    <option value={cat} key={cat}>{capitalize(cat)}</option>
                ))}
            </select>}

            <button type='submit' className="btn addBtn">Add</button>
        </form>
    );
}

export default ProfileForm;