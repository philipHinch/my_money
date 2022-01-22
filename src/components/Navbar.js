//router
import { useNavigate } from "react-router-dom";

const Navbar = () => {

    const navigate = useNavigate()

    return (
        <ul className="navbarContainer">
            <li className="mainLogo" onClick={() => navigate('/')}>myMoney</li>
            <li className="signInLink"><button onClick={() => navigate('/sign-in')} className="btn">Sign In</button></li>
            <li className="signUpLink"><button onClick={() => navigate('/sign-up')} className="btn">Sign Up</button></li>
        </ul>
    );
}

export default Navbar;