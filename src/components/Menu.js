//icons
import { Icon } from '@iconify/react';
//router
import { useNavigate } from 'react-router-dom';
//hooks
import { useEffect, useContext, useState } from 'react';
import { useAuthStatus } from '../hooks/useAuthStatus';
import { useLogout } from '../hooks/useLogout';
//context
import UserContext from '../context/UserContext';
//firebase
import { getAuth } from 'firebase/auth';



const Menu = ({ menuOpen, setMenuOpen, displayName, setDisplayName, setPhoto, photo, test }) => {

    const navigate = useNavigate()
    const auth = getAuth()
    const { logout } = useLogout()
    const { checkingStatus, loggedIn } = useAuthStatus()
    const { authIsReady, user } = useContext(UserContext)


    // ****** MAIN LOGIC **********

    const signOut = async () => {
        logout()
        await setDisplayName(null)
        await setPhoto(null)
        navigate('/')
    }

    const handleCloseClick = () => {
        setMenuOpen(false)
    }

    const handleLinkClick = (e) => {
        if (e.target.textContent === 'Sign In') {
            setMenuOpen(false)
            navigate('/sign-in')
        } else if (e.target.textContent === 'Sign Up') {
            setMenuOpen(false)
            navigate('/sign-up')
        } else if (e.target.textContent === 'Home') {
            setMenuOpen(false)
            navigate('/')
        } else if (e.target.id === 'menuDisplayName' || e.target.id === 'menuAvatar' || e.target.textContent === auth.currentUser.displayName) {
            setMenuOpen(false)
            navigate(`/profile/${ auth.currentUser.uid }`)
        }
    }

    return (
        <div className={`menu ${ menuOpen ? '' : 'hideMenu' }`}>
            <li className="mainLogoContainer" onClick={() => navigate('/')}>
                <img src={require('../assets/png/main-logo-image-light.png')} alt="profile picture" className="logoImg" />
            </li>
            <Icon icon="charm:cross" className='closeIcon' onClick={handleCloseClick} />
            <ul className="menuList">
                {!displayName && <li className="menuSignInUpLinks">
                    <p className="signInLinkMenu"><button onClick={handleLinkClick} className="btn btn-green">Sign In</button></p>
                    <p className="signUpLinkMenu"><button onClick={handleLinkClick} className="btn">Sign Up</button></p>
                </li>}
                {displayName && (
                    <>
                        <li className="menuUserNameAndPictureLi">
                            <div onClick={handleLinkClick} className="menuDisplayNameContainer" id='menuDisplayName'>
                                <div className="profilePictureContainerMenu">
                                    <img src={photo ? photo : require('../assets/png/blank_profile.png')} alt="profile picture" id='menuAvatar' />                        </div>
                                <div className='menuDisplayName'>{displayName}</div>

                            </div>
                        </li>
                        <li className="menuLogoutBtn" title='Logout' onClick={signOut}>
                            <Icon icon="mdi:logout-variant" className="menuLogoutIcon" />
                        </li>
                    </>
                )}
                <li className='menuLink' onClick={handleLinkClick}>Home</li>
                <li className='menuLink'>About</li>
                <li className='menuLink'>Contacts</li>
                <li className='menuLink'>FAQ</li>
            </ul>
        </div>
    );
}

export default Menu;