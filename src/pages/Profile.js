//hooks
import { useEffect, useState, useContext } from 'react';
import { useAuthStatus } from '../hooks/useAuthStatus';
import { useDate } from '../hooks/useDate';
//components
import Spinner from '../components/Spinner';
import ProgressBar from '../components/ProgressBar';
//firebase
import { getAuth, updateProfile } from 'firebase/auth';
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
import { useParams } from 'react-router-dom';
//uuid
import { v4 as uuidv4 } from 'uuid';


const Profile = ({ setDisplayName, setPhoto, loading, setLoading }) => {

    //other
    const params = useParams()
    const { user } = useContext(UserContext)
    const { checkingStatus } = useAuthStatus()
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
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        expensesIncomes: user.expensesIncomes
    })

    const [firebaseExpensesIncomes, setFirebaseExpensesIncomes] = useState(null)

    //extract single data values from user and form
    let { name, email, photoURL } = userData
    const { expenseIncomeTitle, expenseIncomeAmount, expenseIncomeDate } = formData


    //------------  MAIN LOGIC  ---------------

    //on page load: *****
    useEffect(() => {
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

        //set balance state
        let balanceTOT = 0
        if (firebaseExpensesIncomes) {
            for (let i = 0; i < firebaseExpensesIncomes.length; i++) {
                balanceTOT += firebaseExpensesIncomes[i].expenseIncomeAmount
            }
        }
        setBalance(balanceTOT)

        //set income state
        let incomeTOT = 0
        if (firebaseExpensesIncomes) {
            for (let i = 0; i < firebaseExpensesIncomes.length; i++) {
                if (firebaseExpensesIncomes[i].expenseIncomeAmount > 0) {
                    incomeTOT += firebaseExpensesIncomes[i].expenseIncomeAmount
                }
            }
        }
        setIncomes(incomeTOT)

        //set expense state
        let expenseTOT = 0
        if (firebaseExpensesIncomes) {
            for (let i = 0; i < firebaseExpensesIncomes.length; i++) {
                if (firebaseExpensesIncomes[i].expenseIncomeAmount < 0) {
                    expenseTOT += firebaseExpensesIncomes[i].expenseIncomeAmount
                }
            }
        }
        setExpenses(expenseTOT)

    }, [formData, firebaseExpensesIncomes])

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

    //remove disable on profile inputs
    const handleCogClick = () => {
        setIsEdit(true)
    }

    //save edited info to firebase & firestore
    const handleTickClick = async () => {
        //update details in firebase
        try {
            if (auth.currentUser.displayName !== name || auth.currentUser.photoURL !== photoURL) {
                setLoading(true)
                await updateProfile(auth.currentUser, {
                    displayName: name,
                    photoURL
                })
                //update details in firestore
                const userRef = doc(db, 'users', auth.currentUser.uid)
                await updateDoc(userRef, {
                    name,
                    photoURL
                    // email
                })
                //add the storage photo url and display to state
                setPhoto(photoURL)
                setDisplayName(name)
                setLoading(false)
                toast.success('Profile updated')
            }
        } catch (error) {
            setLoading(false)
            toast.error('Could not update profile details')
            console.log(error);
        }
        setIsEdit(false)
    }

    //save edited info in state
    const handleEditChange = (e) => {
        setUserData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value.trim()
        }))
    }

    //handle photo change
    const handlePhotoChange = (e) => {
        //check image size, max 2mb
        if (e.target.files[0].size > 2000000) {
            toast.error('Sorry, image size must be 2MB or lower')
            e.target.value = ''
        }
        storeImage(e.target.files[0])
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

    //save expense/income form data in state
    const handleChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value
        }))
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
                expenseIncomeId: uuidv4()
            }, ...oldArr]
            console.log(newArr);

            await updateDoc(docRef, {
                expensesIncomes: newArr
            })
        } else {
            console.log("No such document!");
        }
        //reset form
        setFormData({
            expenseIncomeTitle: '',
            expenseIncomeAmount: '',
            expenseIncomeDate: ''
        })
    }

    //store image in firebase & get the download URL ---> https://firebase.google.com/docs/storage/web/upload-files
    const storeImage = async (image) => {
        setLoading(true)
        return new Promise((resolve, reject) => {
            const storage = getStorage()
            const fileName = `${ auth.currentUser.uid }-profile-picture`
            const storageRef = ref(storage, 'images/' + fileName)
            const uploadTask = uploadBytesResumable(storageRef, image);

            uploadTask.on('state_changed',
                (snapshot) => {
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(progress);
                    setProgressWidth(progress)
                    setTimeout(() => {
                        setProgressWidth(null)
                    }, 2000)
                    switch (snapshot.state) {
                        case 'paused':
                            console.log('Upload is paused');
                            break;
                        case 'running':
                            console.log('Upload is running');
                            break;
                    }
                },
                (error) => {
                    reject(error)
                },
                () => {

                    getDownloadURL(ref(storage, 'images/' + fileName))
                        .then((url) => setUserData((prevState) => ({
                            ...prevState,
                            photoURL: url
                        })))
                }
            );
            setLoading(false)
        })
    }

    if (checkingStatus || loading) {
        return <Spinner />
    }

    return (
        <div className='profileContainer'>
            <h2 className="profileTitle">My Profile</h2>
            <div className={`profileHeader ${ isEdit && 'editModeActive' }`}>
                0
                {progressWidth && <ProgressBar progress={progressWidth} />}
                {!isEdit && <Icon icon="mdi:cog" className='editProfileIcon' onClick={handleCogClick} />}
                {isEdit && <Icon icon="mdi:check-circle" className='editProfileIcon editProfileIconTick' onClick={handleTickClick} />
                }


                {!isEdit ?
                    <div className="profilePictureContainer">
                        <label htmlFor="photoURL">
                            <img src={photoURL ? photoURL : require('../assets/png/blank_profile.png')} alt="profile picture" />
                        </label>
                    </div>
                    :
                    <div className="profilePictureContainer" style={{ borderColor: '#2a9d8f' }}>
                        <label htmlFor="photoURL">
                            <img src={photoURL ? photoURL : require('../assets/png/blank_profile.png')} alt="profile picture" style={{ cursor: 'pointer' }} />
                        </label>

                        <input
                            id="photoURL"
                            type="file"
                            max='1'
                            accept='.jpg,.png,.jpeg'
                            onChange={handlePhotoChange}
                        />
                    </div>
                }

                {!isEdit
                    ?
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

                <input
                    type="text"
                    className='profileEmail'
                    id='email'
                    value={email}
                    disabled />

                {/* {!isEdit ?
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
                        style={{ border: '1px solid #2a9d8f' }} />} */}
            </div>
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
                <button type='submit' className="btn addBtn">Add</button>
            </form>

            {/* from here, all the expenses and incomes are named as expenses */}

            <div className="profileExpenses">
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