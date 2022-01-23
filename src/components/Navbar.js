//router
import { useNavigate } from "react-router-dom";
//firebase
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
//hooks
import { useEffect, useState } from "react";
import { useAuthStatus } from "../hooks/useAuthStatus";


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

    }, [displayName])

    const signOut = async () => {
        auth.signOut()
        navigate('/')
    }

    return (
        <ul className="navbarContainer">
            <li className="mainLogo" onClick={() => navigate('/')}>myMoney</li>
            {displayName && (
                <li>Hello, <span onClick={() => navigate('/profile')} className="navbarDisplayName">{displayName}</span></li>
            )}
            {!displayName && (
                <>
                    <li className="signInLink"><button onClick={() => navigate('/sign-in')} className="btn">Sign In</button></li>
                    <li className="signUpLink"><button onClick={() => navigate('/sign-up')} className="btn">Sign Up</button></li>
                </>
            )}
            {loggedIn && (
                <button className="btn btn-secondary logoutBtn" onClick={signOut}>Logout</button>
            )}
        </ul>
    );
}

export default Navbar;