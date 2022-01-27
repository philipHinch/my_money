//hooks
import { useEffect, useState } from 'react';
import { useIcon } from '../hooks/useIcon';
//hooks
import { useAuthStatus } from '../hooks/useAuthStatus';
//components
import Spinner from '../components/Spinner';
//firebase
import { getAuth } from 'firebase/auth';
//icons
import { Icon } from '@iconify/react';

const Profile = () => {

    const { loggedIn, checkingStatus } = useAuthStatus()
    const auth = getAuth()

    const [isEdit, setIsEdit] = useState(false)
    const [expense, setExpense] = useState(true)
    const [income, setIncome] = useState(false)
    const [expenseFormData, setExpenseFormData] = useState({
        expenseTitle: '',
        expenseAmount: '',
        expenseDate: ''
        //servertimestamp will replace expenseDate
    })

    const [formData, setFormData] = useState({
        name: auth.currentUser.displayName,
        email: auth.currentUser.email
    })

    const { name, email } = formData
    const { expenseTitle, expenseAmount, expenseDate } = expenseFormData


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

    const handleCogClick = () => {
        setIsEdit(!isEdit)
        console.log(isEdit);
    }

    const handleEditChange = (e) => {
        console.log(e.target.value);
    }

    const handleChange = (e) => {
        setExpenseFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        //convert amount to a number
        let num = +expenseAmount
        //add - if amount is an expense
        if (expense) {
            num = -Math.abs(num)
        }
        if (income) {
            num = Math.abs(num)
        }
        console.log(expenseTitle, num.toFixed(2), expenseDate);
        setExpenseFormData({
            expenseTitle: '',
            expenseAmount: '',
            expenseDate: ''
        })
    }

    if (checkingStatus) {
        return <Spinner />
    }

    return (
        <div className='profileContainer'>
            <h2 className="profileTitle">My Profile</h2>
            <div className="profileHeader">
                <Icon icon="mdi:cog" className='editProfileIcon' onClick={handleCogClick} />

                {!isEdit ? <div className="profilePictureContainer" >
                </div> : <div className="profilePictureContainer" style={{ border: '1px solid #2a9d8f' }}>
                </div>}

                {!isEdit ?
                    <input
                        type="text"
                        className='profileName'
                        id='name'
                        value={name}
                        disabled />
                    :
                    <input
                        type="text"
                        className='profileName'
                        id='name'
                        value={name}
                        onChange={handleEditChange}
                        style={{ border: '1px solid #2a9d8f' }} />}
                {!isEdit ?
                    <input
                        type="text"
                        className='profileEmail'
                        id='email'
                        value={email}
                        disabled />
                    : <input
                        type="text"
                        className='profileEmail'
                        id='email'
                        value={email}
                        onChange={handleEditChange}
                        style={{ border: '1px solid #2a9d8f' }} />}
            </div>
            <form className="profileForm" onSubmit={handleSubmit}>
                <div className="buttonContainer">
                    <div className={`btn ${ expense ? 'btn-secondary' : 'btn-not-active' }`} onClick={handleExpenseButtonClick}>Expense</div>
                    <div className={`btn ${ income ? 'btn-secondary' : 'btn-not-active' }`} onClick={handleIncomeButtonClick}>Income</div>
                </div>
                <div className="expenseTitleDiv">
                    <input
                        type="text"
                        id="expenseTitle"
                        placeholder={expense ? 'Expense Title' : 'Income Title'} required
                        minLength='3'
                        maxLength='15'
                        value={expenseTitle}
                        onChange={(e) => handleChange(e)}
                    />
                </div>
                <div className="expenseAmountDiv">
                    <input
                        type="number"
                        id="expenseAmount"
                        placeholder='Amount'
                        required
                        min='0'
                        max='999999999'
                        value={expenseAmount}
                        onChange={(e) => handleChange(e)}
                    />
                </div>
                <input
                    type="date"
                    id="expenseDate"
                    value={expenseDate}
                    onChange={(e) => handleChange(e)}
                />
                <button type='submit' className="btn addBtn">Add</button>
            </form>
            <div className="profileExpenses">
                <div className="balanceContainer">
                    <h3>Balance: 1200,00€</h3>
                </div>
                <ul className="expensesList">
                    <li className="expenseItem">
                        <p className="expenseItemDate">02/10/2022</p>
                        <p className="expenseItemTitle">Pizza</p>
                        <p className="expenseItemAmount">-10,00€</p>
                        <Icon icon="mdi:close-thick" className='deleteIcon' />
                    </li>
                    <li className="expenseItem">
                        <p className="expenseItemDate">25/09/2022</p>
                        <p className="expenseItemTitle">Rent</p>
                        <p className="expenseItemAmount">-950,00€</p>
                        <Icon icon="mdi:close-thick" className='deleteIcon' />

                    </li>
                    <li className="expenseItem">
                        <p className="expenseItemDate">01/09/2022</p>
                        <p className="expenseItemTitle">Salary</p>
                        <p className="expenseItemAmount">+2200,00€</p>
                        <Icon icon="mdi:close-thick" className='deleteIcon' />

                    </li>
                    {/* <li className="expenseItem">Rent -950,00€</li>
                    <li className="expenseItem">Salary +2300,00€</li>
                    <li className="expenseItem">Coffee -2,50€</li> */}
                </ul>
            </div>
        </div>
    );
}

export default Profile;