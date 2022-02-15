//icons
import { Icon } from '@iconify/react';
//hooks
import { useEffect, useState, useContext } from 'react';
//router
import { useNavigate } from 'react-router-dom';
//context
import { UserContext } from '../../context/UserContext';
//firebase
import { getAuth, updateProfile, deleteUser, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { updateDoc, doc, onSnapshot } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db } from '../../firebase.config';
//toastify
import { toast } from 'react-toastify';
//components
import ProgressBar from '../ProgressBar';

const ProfileHeader = ({ setDisplayName, setPhoto }) => {

    // ******** STATES AND OTHERS ********//

    const { user, authIsReady } = useContext(UserContext)
    const auth = getAuth()
    const navigate = useNavigate()
    const [isEdit, setIsEdit] = useState(false)
    const [loading, setLoading] = useState(false)
    // const [photo, setPhoto] = useState(null)
    // const [displayName, setDisplayName] = useState(null)
    const [progressWidth, setProgressWidth] = useState(0)
    const [userData, setUserData] = useState({
        displayName: '',
        email: '',
        photoURL: null,
        expensesIncomes: []
    })

    let { displayName, email, photoURL } = userData

    // ********* MAIN LOGIC *********//

    useEffect(() => {
        if (authIsReady) {
            setUserData({
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                expensesIncomes: user.expensesIncomes
            })
        }
    }, [authIsReady])

    //activate edit mode: remove disable on profile header inputs
    const handleCogClick = () => {
        setIsEdit(true)
    }

    //deactivate edit mode: save edited info to firebase 
    const handleTickClick = async () => {
        const auth = getAuth()
        //update details in firebase
        try {
            if (auth.currentUser.displayName !== displayName || auth.currentUser.photoURL !== photoURL) {
                setLoading(true)
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
            setLoading(false)
            toast.error('Could not update profile details')
            console.log(error);
        }
        setIsEdit(false)
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

    //save edited info in state
    const handleEditChange = (e) => {
        setUserData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value.trim()
        }))
    }

    //store image in firebase & get the download URL
    //https://firebase.google.com/docs/storage/web/upload-files
    const storeImage = async (image) => {
        setLoading(true)
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
            setLoading(false)
        })
    }

    //delete profile [FIX NAVBAR PHOTO RERENDER] 
    //******** NOT FINISHED *********
    const handleProfileDelete = async () => {
        let email = window.prompt('Enter Email')
        let password = window.prompt('Enter Password')
        if (window.confirm('Are you sure you want to delete your profile?') === true) {

            const auth = getAuth();
            const user = auth.currentUser;
            const credential = EmailAuthProvider.credential(email, password);

            await reauthenticateWithCredential(user, credential).then(() => {
                // User re-authenticated.
                deleteUser(user).then(() => {
                    console.log('User deleted');
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

    return (
        <div className={`profileHeader ${ isEdit && 'editModeActive' }`}>
            <ProgressBar progress={progressWidth} />
            {!isEdit && <Icon icon="mdi:cog" className='editProfileIcon' onClick={handleCogClick} />}
            {isEdit && <Icon icon="mdi:check-circle" className='editProfileIcon editProfileIconTick' onClick={handleTickClick} />
            }

            {!isEdit ?
                <div className="profilePictureContainer">
                    <label htmlFor="photoURL">
                        <img src={photoURL ? photoURL : require('../../assets/png/blank_profile.png')} alt="profile picture" />
                    </label>
                </div>
                :
                <div className="profilePictureContainer" style={{ borderColor: '#2a9d8f' }}>
                    <label htmlFor="photoURL">
                        <img src={photoURL ? photoURL : require('../../assets/png/blank_profile.png')} alt="profile picture" style={{ cursor: 'pointer' }} />
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
                    id='displayName'
                    value={displayName}
                    disabled />
                :
                <input
                    type="text"
                    className='profileName'
                    id='displayName'
                    value={displayName}
                    onChange={handleEditChange}
                    style={{ border: '1px solid #2a9d8f' }} />}

            <input
                type="text"
                className='profileEmail'
                id='email'
                value={email}
                disabled />

            <p className="deleteProfile">Delete Profile</p>
        </div>
    );
}

export default ProfileHeader;