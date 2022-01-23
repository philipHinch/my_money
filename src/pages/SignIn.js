//hooks
import { useState } from 'react';
//router
import { Link, useNavigate } from 'react-router-dom';
//icons
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg';
import visibilityIcon from '../assets/svg/visibilityIcon.svg';
//firebase
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
//toast
import { toast } from 'react-toastify';


const SignIn = () => {

    const navigate = useNavigate()

    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const { email, password } = formData

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
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            if (userCredential.user) {
                navigate('/profile')
            }
        } catch (error) {
            toast.error('Could not sign in')
        }
    }

    return (
        <form className='signInForm' onSubmit={handleSubmit}>
            <h2 className="signInTitle">Sign In</h2>
            <div className="emailDiv">
                <input
                    type="email"
                    required
                    autoFocus
                    name="email"
                    id="email"
                    placeholder='Email'
                    value={email}
                    onChange={handleChange} />
            </div>
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
            <button type="submit" className='btn signInOutBtn'>Sign In</button>
            <Link to='/sign-up' className='signInUpInstead'>Sign Up Instead</Link>
        </form>
    );
}

export default SignIn;