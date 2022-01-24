//router
import { useNavigate } from "react-router-dom";
//firebase
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
//hooks
import { useEffect, useState } from "react";
import { useAuthStatus } from "../hooks/useAuthStatus";
//icons
import { Icon } from '@iconify/react';



const Navbar = () => {

    const { loggedIn } = useAuthStatus()
    const [displayName, setDisplayName] = useState(null)

    const navigate = useNavigate()
    const auth = getAuth();

    //fix displayName on page load, displayname does not show after signup (context?)
    useEffect(() => {

        onAuthStateChanged(auth, (user) => {
            if (user) {
                setDisplayName(auth.currentUser.displayName)
                console.log(displayName);
            } else {
                console.log('no user');
            }
        });

    }, [auth.currentUser])

    const signOut = async () => {
        auth.signOut()
        navigate('/')
    }

    return (
        <ul className="navbarContainer">
            <li className="mainLogo" onClick={() => navigate('/')}>my<Icon icon="mdi:alpha-m-circle" fontSize={'60px'} />
                <span>oney</span> </li>
            {displayName && (
                <li className="userNameAndPictureLi">
                    <div onClick={() => navigate('/profile')} className="navbarDisplayName">
                        <span className="profilePictureContainerNavbar"></span>
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
            {loggedIn && (
                <div className="logoutBtn" title='Logout' onClick={signOut}><Icon icon="oi:account-logout" className="logoutIcon" />
                </div>
            )}
        </ul>
    );
}

export default Navbar;