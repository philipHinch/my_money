//hooks
import { useEffect, useState, useContext } from 'react';
import { useAuthStatus } from '../hooks/useAuthStatus';
import { useDate } from '../hooks/useDate';
//components
import Spinner from '../components/Spinner';
import ProgressBar from '../components/ProgressBar';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileForm from '../components/profile/ProfileForm';
//firebase
import { getAuth, updateProfile, deleteUser, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { updateDoc, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase.config';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
//icons
import { Icon } from '@iconify/react';
//toastify
import { toast } from 'react-toastify';
//context
import { UserContext } from '../context/UserContext';
//router
import { useNavigate, useParams } from 'react-router-dom';
//uuid
import { v4 as uuidv4 } from 'uuid';


const Profile = ({ loading, setPhoto, setDisplayName }) => {

    //other
    const params = useParams()
    const { user, authIsReady } = useContext(UserContext)
    const { checkingStatus } = useAuthStatus()
    const navigate = useNavigate()
    const auth = getAuth()

    //states
    const [isEdit, setIsEdit] = useState(false)
    const [expense, setExpense] = useState(true)
    const [income, setIncome] = useState(false)
    const [progressWidth, setProgressWidth] = useState(null)
    const [deleted, setDeleted] = useState(false)
    const [balance, setBalance] = useState(0)
    const [incomes, setIncomes] = useState(0)
    const [expenses, setExpenses] = useState(0)

    //hooks
    const date = useDate()

    const [formData, setFormData] = useState({
        expenseIncomeTitle: '',
        expenseIncomeAmount: '',
        expenseIncomeDate: ''
        //servertimestamp will replace expenseDate
    })
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        photoURL: null,
        expensesIncomes: []
    })

    const [firebaseExpensesIncomes, setFirebaseExpensesIncomes] = useState(null)

    //extract single data values from user and form
    let { name, email, photoURL } = userData
    const { expenseIncomeTitle, expenseIncomeAmount, expenseIncomeDate } = formData


    //------------  MAIN LOGIC  ---------------

    // WAIT FOR USER DETAILS BEFORE SHOWING PAGE..



    //on page load: *****
    useEffect(() => {
        if (authIsReady) {
            setUserData({
                name: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                expensesIncomes: user.expensesIncomes
            })
        }
        //check if user has photoURL in firestore
        if (auth.currentUser.photoURL) {
            photoURL = auth.currentUser.photoURL
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

    // *****
    // useEffect(() => {
    //     //get the balance amount
    //     let balanceTOT = 0

    //     if (firebaseExpensesIncomes) {
    //         for (let i = 0; i < firebaseExpensesIncomes.length; i++) {
    //             balanceTOT += firebaseExpensesIncomes[i].expenseIncomeAmount
    //         }
    //     }
    //     console.log(balanceTOT);
    //     setBalance(balanceTOT)
    //     setDeleted(false)
    //     console.log('balance re-render');
    //     //get incomes total
    //     //get expenses total
    // }, [firebaseExpensesIncomes, deleted, balance])

    //clear all items
    const handleClearAll = () => {
        if (window.confirm('Are you sure you want to delete all items?') === true) {
            const clearAllItemsInFirebase = async () => {
                const docRef = doc(db, 'users', params.userId)
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    await updateDoc(docRef, {
                        expensesIncomes: []
                    })
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
                console.log(newArr);
                await updateDoc(docRef, {
                    expensesIncomes: newArr
                })
            } else {
                console.log("No such document!");
            }
        }
        deleteItemInFirebase()

        setDeleted(true)

    }

    if (checkingStatus || loading) {
        return <Spinner />
    }

    return (
        <div className='profileContainer' >
            <h2 className="profileTitle">My Profile</h2>

            <ProfileHeader setPhoto={setPhoto} setDisplayName={setDisplayName} />
            <ProfileForm />

            {/* from here, all the expenses and incomes are named as expenses */}

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

                    {/* <li className="expenseItem">
                        <p className="expenseItemDate">02/10/2022</p>
                        <p className="expenseItemTitle">Pizza</p>
                        <p className="expenseItemAmount negativeColor">-10,00€</p>
                        <Icon icon="mdi:close-thick" className='deleteIcon' />
                    </li>

                    <li className="expenseItem">
                        <p className="expenseItemDate">25/09/2022</p>
                        <p className="expenseItemTitle">Rent</p>
                        <p className="expenseItemAmount negativeColor">-950,00€</p>
                        <Icon icon="mdi:close-thick" className='deleteIcon' />

                    </li>

                    <li className="expenseItem" style={{ borderLeft: '6px solid #2a9d8f' }}>
                        <p className="expenseItemDate">01/09/2022</p>
                        <p className="expenseItemTitle">Salary</p>
                        <p className="expenseItemAmount incomeColor" >+2200,00€</p>
                        <Icon icon="mdi:close-thick" className='deleteIcon' />
                    </li> */}

                </ul>
            </div>
        </div>
    );
}


export default Profile;