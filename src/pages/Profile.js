//hooks
import { useEffect, useState, useContext } from 'react';
//hooks
import { useAuthStatus } from '../hooks/useAuthStatus';
//components
import Spinner from '../components/Spinner';
import ProgressBar from '../components/ProgressBar';
//firebase
import { getAuth, updateProfile, updateEmail } from 'firebase/auth';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
//icons
import { Icon } from '@iconify/react';
//toastify
import { toast } from 'react-toastify';
//context
import { UserContext } from '../context/UserContext';

const Profile = ({ setDisplayName, setPhoto }) => {

    const { user } = useContext(UserContext)
    const { checkingStatus } = useAuthStatus()
    const auth = getAuth()

    const [loading, setLoading] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [expense, setExpense] = useState(true)
    const [income, setIncome] = useState(false)
    const [progressWidth, setProgressWidth] = useState(null)
    const [expenseFormData, setExpenseFormData] = useState({
        expenseTitle: '',
        expenseAmount: '',
        expenseDate: ''
        //servertimestamp will replace expenseDate
    })

    const [formData, setFormData] = useState({
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL
    })

    let { name, email, photoURL } = formData
    const { expenseTitle, expenseAmount, expenseDate } = expenseFormData

    useEffect(() => {
        //check if user has photoURL in firestore
        if (auth.currentUser.photoURL) {
            photoURL = auth.currentUser.photoURL
        }
    }, [])

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

                // await updateEmail(auth.currentUser, {
                //     email: email
                // })

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
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value.trim()
        }))
    }

    //save expense/income in state
    const handleChange = (e) => {
        setExpenseFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value
        }))
    }

    const handlePhotoChange = (e) => {
        console.log(e.target.files);
        //check image size, max 2mb
        if (e.target.files[0].size > 2000000) {
            toast.error('Sorry, image size must be 2MB or lower')
            e.target.value = ''
            console.log(e.target.files);
        }
        storeImage(e.target.files[0])
    }

    //submit expense/income
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
                    // console.log('Upload is ' + progress + '% done');
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

                    // setFormData((prevState) => ({
                    //     ...prevState,
                    //     photoURL: url
                    // }))
                    getDownloadURL(ref(storage, 'images/' + fileName))
                        .then((url) => setFormData((prevState) => ({
                            ...prevState,
                            photoURL: url
                        })))
                }
            );
            setLoading(false)
        })
    }

    //call storeImage for all images
    // const imgUrls = Promise.all(
    //     storeImage(photoURL)
    // ).catch(() => {
    //     setLoading(false)
    //     toast.error('Images not uploaded')
    //     return
    // })

    if (checkingStatus || loading) {
        return <Spinner />
    }

    return (
        <div className='profileContainer'>
            <h2 className="profileTitle">My Profile</h2>
            <div className={`profileHeader ${ isEdit && 'editModeActive' }`}>
                0
                {/* {progressWidth && <p className='progress' style={{ width: `${}` }}></p>} */}
                {progressWidth && <ProgressBar progress={progressWidth} />}
                {!isEdit && <Icon icon="mdi:cog" className='editProfileIcon' onClick={handleCogClick} />}
                {isEdit && <Icon icon="mdi:check-circle" className='editProfileIcon editProfileIconTick' onClick={handleTickClick} />
                }

                {/* {!isEdit
                    ?
                    <div className="profilePictureContainer" >
                        <img src={photoURL ? photoURL : require('../assets/png/blank_profile.png')} alt="profile picture" />
                    </div>
                    :
                    <div className="profilePictureContainer" style={{ borderColor: '#2a9d8f' }}>
                        <img src={photoURL ? photoURL : require('../assets/png/blank_profile.png')} alt="profile picture" />
                    </div>} */}

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