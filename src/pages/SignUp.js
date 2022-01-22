//hooks
import { useState } from 'react';
//router
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
//firebase
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { db } from '../firebase.config';
//icons
import visibilityIcon from '../assets/svg/visibilityIcon.svg';
//components
import Spinner from '../components/Spinner';


const SignUp = () => {

    const navigate = useNavigate()

    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
        // photo?
    })
    const { email, password, name } = formData

    const handleChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const auth = getAuth();
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            const user = userCredential.user
            updateProfile(auth.currentUser, {
                displayName: name
            })
            console.log(auth.currentUser);
            navigate('/profile')
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <form className='signInForm' onSubmit={handleSubmit}>
            <h2 className="signInTitle">Sign Up</h2>
            <div className="nameDiv">
                <input
                    type="text"
                    name="name"
                    required
                    id="name"
                    placeholder='Name'
                    minLength='3'
                    maxLength='20'
                    value={name}
                    onChange={handleChange} />
            </div>
            <div className="emailDiv">
                <input
                    type="email"
                    required
                    name="email"
                    id="email"
                    placeholder='Email'
                    value={email}
                    onChange={handleChange} />
            </div>
            {/* add photo? */}
            <div className="passwordDiv">
                <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    name="password"
                    id="password"
                    placeholder='Password'
                    minLength='6'
                    value={password}
                    onChange={handleChange} />
                <img src={visibilityIcon} alt="show password" className='showPassword' title='Show Password' onClick={() => setShowPassword(!showPassword)} />
            </div>
            <Link to='/forgot-password' className='forgotPassword'>Forgot Password?</Link>
            <button type="submit" className='btn signInOutBtn'>Sign Up</button>
            <Link to='/sign-in' className='signInUpInstead'>Sign In Instead</Link>
        </form>
    );
}

export default SignUp;