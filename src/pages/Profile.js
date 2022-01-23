//hooks
import { useEffect, useState } from 'react';
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
    const [formData, setFormData] = useState({
        name: auth.currentUser.displayName,
        email: auth.currentUser.email
    })

    const { name, email } = formData


    if (checkingStatus) {
        return <Spinner />
    }

    return (
        <div className='profileContainer'>
            <h2 className="profileTitle">My Profile</h2>
            <div className="profileHeader">
                <Icon icon="mdi:cog" className='editProfileIcon' />
                <h2 className="profileName">
                    {name}
                </h2>
                <p className="profileEmail">
                    {email}
                </p>
            </div>
            <form className="profileForm">
                <div className="buttonContainer">
                    <button className="btn btn-secondary">Expense</button>
                    <button className="btn btn-secondary">Income</button>
                </div>
                <input type="text" id="expenseTitle" placeholder='Expense' required />
                <input type="number" id="expenseAmount" placeholder='Amount' required />
                <input type="date" id="expenseDate" />
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