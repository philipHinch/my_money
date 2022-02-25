//hooks
import { useState, useEffect, useContext, useRef } from 'react';
import { useLogout } from '../hooks/useLogout';
import { useExpensesIncomes } from '../hooks/useExpensesIncomes';
//context
import { UserContext } from '../context/UserContext';
//icons
import { Icon } from '@iconify/react';
//toast
import { toast } from 'react-toastify';
//firebase
import { getAuth, updateProfile, deleteUser, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db } from '../firebase.config';
import { updateDoc, doc } from 'firebase/firestore';
//router
import { useNavigate } from 'react-router-dom';
//components
import ProgressBar from './ProgressBar';


const EditModal = ({ setIsEdit, setPhoto, setDisplayName }) => {

    // ******** STATES AND OTHERS ********//

    const navigate = useNavigate()
    const { logout } = useLogout()
    const { getData } = useExpensesIncomes()
    const auth = getAuth()
    const { user, authIsReady } = useContext(UserContext)
    const inputRef = useRef()
    const [progressWidth, setProgressWidth] = useState(0)
    const [userData, setUserData] = useState({
        displayName: '',
        email: '',
        photoURL: null,
        expensesIncomes: []
    })
    let { displayName, email, photoURL } = userData

    // ********* MAIN LOGIC *********//

    //on page load get user data
    useEffect(() => {
        if (authIsReady) {
            setUserData({
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
            })
        }
    }, [authIsReady])

    //set focus to displayName input
    const handlePencilClick = () => {
        inputRef.current.focus()
    }

    //handle the displayName change, update state
    const handleEditChange = (e) => {
        setUserData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value
        }))
    }

    //handle the photo change
    const handlePhotoChange = (e) => {
        //check image size, max 2mb
        if (e.target.files[0].size > 2000000) {
            toast.error('Sorry, image size must be 2MB or lower')
            e.target.value = ''
        }
        storeImage(e.target.files[0])
    }

    //handle delete profile
    const handleProfileDelete = async () => {
        if (window.confirm('Are you sure you want to delete your profile?') === true) {

            let email = window.prompt('Enter Email')
            let password = window.prompt('Enter Password')

            const auth = getAuth();
            const user = auth.currentUser;
            const credential = EmailAuthProvider.credential(email, password);

            await reauthenticateWithCredential(user, credential).then(() => {
                // User re-authenticated.
                deleteUser(user).then(() => {
                    //getData()
                    logout()
                    setIsEdit(false)
                    toast.success('Account deleted succesfully')
                }).catch((error) => {
                    toast.error('Could not delete user profile')
                    console.log(error);
                });
            }).catch((error) => {
                toast.error('Could not delete user profile')
            });
            navigate('/')
        }
    }

    //save profile info to firebase and context
    const handleSaveClick = async () => {
        const auth = getAuth()
        //update details in firebase
        try {
            if (auth.currentUser.displayName !== displayName || auth.currentUser.photoURL !== photoURL) {
                //setLoading(true)
                await updateProfile(auth.currentUser, {
                    displayName,
                    photoURL
                })
                //update details in firestore
                const userRef = doc(db, 'users', auth.currentUser.uid)
                await updateDoc(userRef, {
                    displayName,
                    photoURL
                    // email
                })
                //add the storage photo url and display to state
                setPhoto(photoURL)
                setDisplayName(displayName)
                //setLoading(false)
                toast.success('Profile updated')
            }
        } catch (error) {
            //setLoading(false)
            toast.error('Could not update account details')
            console.log(error);
        }
        setIsEdit(false)
        //enable scrolling
    }

    //handle closing modal
    const handleCloseClick = () => {
        setIsEdit(false)
        //enable scrolling
    }

    //handle clicking outside modal
    const handleModalBackgroundClick = (e) => {
        if (e.target.id === 'editModalContainer') {
            setIsEdit(false)
        }
    }

    //store image in firebase & get the download URL
    //https://firebase.google.com/docs/storage/web/upload-files
    const storeImage = async (image) => {
        //setLoading(true)
        const auth = getAuth()
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
                        setProgressWidth(0)
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
            //setLoading(false)
        })
    }

    return (
        <div className="editModalContainer" id='editModalContainer' onClick={handleModalBackgroundClick}>
            <div className="editModal">
                <h1>Edit Account</h1>

                <Icon icon="charm:cross" className='closeIcon' onClick={handleCloseClick} />

                <div className="profilePictureWrapper">

                    <div className="plusIconContainer" >
                        <Icon icon="mdi:plus" className='plusIcon' />
                    </div>
                    <div className="profilePictureContainer" onChange={handlePhotoChange}>
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
                </div>


                <ProgressBar progress={progressWidth} />

                <div className="editNameContainer">
                    <label>
                        <h5>Account username:</h5>
                        <input
                            type="text"
                            className='profileName backgroundMint'
                            id='displayName'
                            minLength='3'
                            maxLength='15'
                            value={displayName}
                            onChange={handleEditChange}
                            ref={inputRef}
                        />
                    </label>


                    <div className="pencilIconContainer" onClick={handlePencilClick}>
                        <Icon icon="mdi:pencil" className='pencilIcon' />
                    </div>

                </div>

                <label>
                    <h5>Account email:</h5>
                    <input
                        type="text"
                        className='profileEmail'
                        id='email'
                        value={email}
                        disabled />
                </label>

                <p className="deleteProfile" onClick={handleProfileDelete}><Icon icon="mdi:close-octagon" className='deleteAccountIcon' />
                    Delete Account</p>

                <div className="buttonContainer">
                    <div className='btn' onClick={handleSaveClick}>Save</div>
                    <div className='btn btn-secondary' onClick={handleCloseClick}>Cancel</div>
                </div>

            </div>
        </div>
    );
}

export default EditModal;