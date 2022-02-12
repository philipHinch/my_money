//router
import { useNavigate } from "react-router-dom";
//firebase
import { getAuth } from "firebase/auth";
//hooks
import { useEffect, useState } from "react";
import { useAuthStatus } from "../hooks/useAuthStatus";
import { useLogout } from "../hooks/useLogout";
//icons
import { Icon } from '@iconify/react';
//context
import { useContext } from "react";
import { UserContext } from '../context/UserContext'
//components
import Spinner from "./Spinner";

const Navbar = ({ displayName, setDisplayName, photo, setPhoto, test }) => {

    const { checkingStatus, loggedIn } = useAuthStatus()
    const auth = getAuth()
    const navigate = useNavigate()
    const { user } = useContext(UserContext)
    const { logout, error, loading } = useLogout()


    //takes care of setting displayname & photo on initial page load and after editing
    useEffect(() => {
        const setUserDetails = async () => {

            if (user) {
                // setDisplayName(user.displayName)
                // setPhoto(user.photoURL)

                //FIXED???: Uncaught (in promise) TypeError: Cannot read properties of null (reading 'displayName') at setUserDetails (Navbar.js:35:1)
                //this happens after logging out

                await setDisplayName(user.displayName)
                await setPhoto(user.photoURL)
            } else {
                await setDisplayName(null)
            }
        }
        setUserDetails()

        // if (user) {
        //     setDisplayName(user.displayName)
        //     setPhoto(user.photoURL)
        //     console.log('photo changed');
        // } else {
        //     setDisplayName(null)
        // }

    }, [checkingStatus, user, test])

    //auth.currentUser was a useEffect dependancy, it has been removed and the Uncaught (in promise) TypeError: Cannot read properties of null (reading 'displayName') at setUserDetails (Navbar.js:35:1) has been resolved

    const signOut = async () => {
        logout()
        await setDisplayName(null)
        await setPhoto(null)
        navigate('/')
    }

    if (checkingStatus) {
        return <Spinner />
    }

    return (
        <ul className="navbarContainer">
            <li className="mainLogoContainer" onClick={() => navigate('/')}>
                {/* <span>my</span> <Icon icon="mdi:alpha-m-box" className="mainLogoIcon" />
                <span>oney</span> */}
                {/* <div className="mainLogo">
                    <img src={require('../assets/png/main-logo-image-dark.png')} alt="profile picture" />
                </div> */}
                <img src={require('../assets/png/main-logo-image-footer.png')} alt="profile picture" className="logoImg" />
            </li>
            {displayName && (
                <li className="userNameAndPictureLi">
                    <div onClick={() => navigate(`/profile/${ auth.currentUser.uid }`)} className="navbarDisplayName">
                        <span className="profilePictureContainerNavbar">
                            <img src={photo ? photo : require('../assets/png/blank_profile.png')} alt="profile picture" />                        </span>
                        <span>{displayName}</span>
                    </div>
                </li>
            )}
            {!displayName && (
                <>
                    <li className="signInLink"><button onClick={() => navigate('/sign-in')} className="btn btn-green">Sign In</button></li>
                    <li className="signUpLink"><button onClick={() => navigate('/sign-up')} className="btn">Sign Up</button></li>
                </>
            )}
            {displayName && (
                <div className="logoutBtn" title='Logout' onClick={signOut}>
                    <Icon icon="mdi:logout-variant" className="logoutIcon" />
                </div>
            )}
        </ul>
    );
}

export default Navbar;