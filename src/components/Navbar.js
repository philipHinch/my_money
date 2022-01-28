//router
import { useNavigate } from "react-router-dom";
//firebase
import { getAuth } from "firebase/auth";
//hooks
import { useEffect, useState } from "react";
import { useAuthStatus } from "../hooks/useAuthStatus";
//icons
import { Icon } from '@iconify/react';
//context
import { useContext } from "react";
import { UserContext } from '../context/UserContext'
//components
import Spinner from "./Spinner";

const Navbar = ({ displayName, setDisplayName, photo, setPhoto }) => {

    const { checkingStatus, loggedIn } = useAuthStatus()
    const auth = getAuth()
    const navigate = useNavigate()
    const { user, getUser } = useContext(UserContext)

    //takes care of setting displayname & photo on initial page load and after editing
    useEffect(() => {
        const setUserDetails = async () => {
            await getUser()
            if (user) {
                // setDisplayName(user.displayName)
                // setPhoto(user.photoURL)
                setDisplayName(auth.currentUser.displayName)
                setPhoto(auth.currentUser.photoURL)
            } else {
                setDisplayName(null)
            }
        }
        setUserDetails()

    }, [checkingStatus, user, auth.currentUser])

    const signOut = async () => {
        const auth = getAuth();
        await auth.signOut()
        await setDisplayName(null)
        await setPhoto(null)
        navigate('/')
    }

    if (checkingStatus) {
        return <Spinner />
    }

    return (
        <ul className="navbarContainer">
            <li className="mainLogo" onClick={() => navigate('/')}> <span>my</span> <Icon icon="mdi:alpha-m-circle" className="mainLogoIcon"
            />
                <span>oney</span> </li>
            {displayName && (
                <li className="userNameAndPictureLi">
                    <div onClick={() => navigate('/profile')} className="navbarDisplayName">
                        <span className="profilePictureContainerNavbar">
                            <img src={photo ? photo : require('../assets/png/blank_profile.png')} alt="profile picture" />                        </span>
                        <span>{displayName}</span>
                    </div>
                </li>
            )}
            {!displayName && (
                <>
                    <li className="signInLink"><button onClick={() => navigate('/sign-in')} className="btn btn-secondary">Sign In</button></li>
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