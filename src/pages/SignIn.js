//hooks
import { useContext, useEffect, useState } from 'react';
import { useAuthStatus } from '../hooks/useAuthStatus';
import { useLogin } from '../hooks/useLogin';
//router
import { Link, useNavigate } from 'react-router-dom';
//icons
import visibilityIcon from '../assets/svg/visibilityIcon.svg';
//firebase
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
//toast
import { toast } from 'react-toastify';
//components
import Spinner from '../components/Spinner';

const SignIn = () => {

    const navigate = useNavigate()
    const auth = getAuth()
    const { login, error, loading } = useLogin()

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
        await login(email, password)
        if (auth.currentUser) {
            navigate(`/profile/${ auth.currentUser.uid }`)
        } else {
            toast.error('Could not sign up')
        }
    }

    useEffect(() => {
        if (auth.currentUser) {
            navigate(`/profile/${ auth.currentUser.uid }`)
        }
    }, [])

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
                        className="signInOutEmail"
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
                        className="signInOutPassword"
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