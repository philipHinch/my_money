//icons
import { Icon } from '@iconify/react';
//hooks
import { useEffect, useState, useContext } from 'react';
//context
import { UserContext } from '../../context/UserContext';
//firebase
import { getAuth, updateProfile, deleteUser, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";


const ProfileHeader = () => {

    // ******** STATES AND OTHERS ********//

    const { user } = useContext(UserContext)
    const [isEdit, setIsEdit] = useState(false)
    const [loading, setLoading] = useState(false)
    const [progressWidth, setProgressWidth] = useState(null)
    const [userData, setUserData] = useState({
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        expensesIncomes: user.expensesIncomes
    })

    let { name, email, photoURL } = userData

    // ********* MAIN LOGIC *********//

    //deactivate edit mode: save edited info to firebase 
    const handleTickClick = () => {

    }

    //activate edit mode: remove disable on profile header inputs
    const handleCogClick = () => {

    }

    //handle photo change
    const handlePhotoChange = () => {

    }

    //save edited info in state
    const handleEditChange = () => {

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

    return (
        <div className={`profileHeader ${ isEdit && 'editModeActive' }`}>
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

            <p className="deleteProfile">Delete Profile</p>
        </div>
    );
}

export default ProfileHeader;