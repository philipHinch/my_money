//hooks
import { useEffect, useState, useContext } from 'react';
import { useDate } from '../hooks/useDate';
import { useExpensesIncomes } from '../hooks/useExpensesIncomes';
//components
import Spinner from '../components/Spinner';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileForm from '../components/profile/ProfileForm';
import ProfileList from '../components/profile/ProfileList';
//firebase
import { getAuth } from 'firebase/auth';
import { updateDoc, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase.config';
//context
import { UserContext } from '../context/UserContext';
//router
import { useNavigate, useParams } from 'react-router-dom';


const Profile = ({ loading, setPhoto, setDisplayName }) => {

    //other
    const { getExpensesIncomes } = useExpensesIncomes()
    const params = useParams()
    const { user, authIsReady, data } = useContext(UserContext)
    //const { checkingStatus } = useAuthStatus()
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
    // useEffect(() => {

    //     if (authIsReady) {
    //         setUserData({
    //             name: user.displayName,
    //             email: user.email,
    //             photoURL: user.photoURL,
    //             expensesIncomes: user.expensesIncomes
    //         })
    //     }
    //     //check if user has photoURL in firestore
    //     if (auth.currentUser.photoURL) {
    //         photoURL = auth.currentUser.photoURL
    //     }
    //     //get expenses and incomes from firebase on page load
    //     const getFirebaseExpensesIncomes = async () => {
    //         const docRef = doc(db, 'users', params.userId)
    //         const docSnap = await getDoc(docRef);
    //         if (docSnap.exists()) {
    //             let firebaseArr = docSnap.data().expensesIncomes
    //             setFirebaseExpensesIncomes(firebaseArr)

    //         } else {
    //             console.log("No expenses or incomes in firebase");
    //         }
    //     }
    //     getFirebaseExpensesIncomes()

    // }, [authIsReady])

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

    if (loading) {
        return <Spinner />
    }

    return (
        <div className='profileContainer' >
            <h2 className="profileTitle">My Profile</h2>

            <ProfileHeader setPhoto={setPhoto} setDisplayName={setDisplayName} />
            <ProfileForm />

            {/* from here, all the expenses and incomes are named as expenses */}

            <ProfileList />

        </div>
    );
}


export default Profile;