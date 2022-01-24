//hooks
import { useState } from 'react';
import { useAuthStatus } from '../hooks/useAuthStatus';
//router
import { Link, useNavigate } from 'react-router-dom';
//icons
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg';
import visibilityIcon from '../assets/svg/visibilityIcon.svg';
//firebase
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
//toast
import { toast } from 'react-toastify';
//components
import Spinner from '../components/Spinner';


const SignIn = () => {

    const navigate = useNavigate()

    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
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
        setLoading(true)

        try {
            const auth = getAuth();
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            if (userCredential.user) {
                setLoading(false)
                navigate('/profile')
            }
        } catch (error) {
            setLoading(false)
            toast.error('Could not sign in')
        }
    }

    if (loading) {
        return <Spinner />
    }

    return (
        <div className='signInContainer'>
            <h2 className="signInUpTitle">Sign In</h2>
            <form className='signInForm' onSubmit={handleSubmit}>
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
                <button type="submit" className='btn signInUpBtn'>Sign In</button>
                <Link to='/sign-up' className='signInUpInstead'>Sign Up Instead</Link>
            </form>
        </div>
    );
}

export default SignIn;