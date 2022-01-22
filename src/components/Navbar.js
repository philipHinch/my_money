//router
import { useNavigate } from "react-router-dom";
//firebase
import { getAuth, onAuthStateChanged } from "firebase/auth";
//hooks
import { useEffect, useState } from "react";


const Navbar = () => {

    const [displayName, setDisplayName] = useState(null)

    const navigate = useNavigate()

    useEffect(() => {
        const auth = getAuth();

        onAuthStateChanged(auth, (user) => {
            if (user) {
                setDisplayName(user.displayName)
            } else {
                console.log('no user');
            }
        });
    }, [])

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
        </ul>
    );
}

export default Navbar;