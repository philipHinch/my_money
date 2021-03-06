//icons
import { Icon } from '@iconify/react';
//hooks
import { useEffect, useState, useContext } from 'react';
import { useExpensesIncomes } from '../../hooks/useExpensesIncomes';
import { useLogout } from '../../hooks/useLogout';
//router
import { useNavigate } from 'react-router-dom';
//context
import { UserContext } from '../../context/UserContext';
//firebase
import { getAuth, } from 'firebase/auth';

const ProfileHeader = ({ displayName, setIsEdit, photo }) => {

    // ******** STATES AND OTHERS ********//

    const { user, authIsReady } = useContext(UserContext)
    const auth = getAuth()
    const [userData, setUserData] = useState({
        displayName: '',
        email: '',
        photoURL: null,
        expensesIncomes: []
    })

    let { email } = userData

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

    return (
        <div className='profileHeader'>
            <Icon icon="mdi:cog" className='editProfileIcon'
                style={{ fontSize: '2rem' }}
                onClick={handleCogClick} />

            <div className="profilePictureContainerHeader">
                <label htmlFor="photoURL">
                    <img src={photo ? photo : require('../../assets/png/blank_profile.png')} alt="profile picture" />
                </label>
            </div>

            <p
                className='profileName'
                id='displayName'
            ><small>Hello,</small> {displayName}</p>

            {/* <p
                className='profileEmail'
                id='email'
            >{email}</p> */}

        </div>
    );
}

export default ProfileHeader;