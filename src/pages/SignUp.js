//hooks
import { useState, useContext, useEffect } from 'react';
import { useSignup } from '../hooks/useSignup';
//router
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
//firebase
import { getAuth } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from '../firebase.config';
//icons
import visibilityIcon from '../assets/svg/visibilityIcon.svg';
//components
import Spinner from '../components/Spinner';
//toast
import { toast } from 'react-toastify';
//context
import { UserContext } from '../context/UserContext';

const SignUp = () => {

    const { signUp, loading, error } = useSignup()
    const { user } = useContext(UserContext)
    const auth = getAuth()

    const navigate = useNavigate()

    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        photoURL: null
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
        await signUp(email, password, name)

        const auth = getAuth()

        //copy user auth details
        const userCopy = {
            displayName: auth.currentUser.displayName,
            email: auth.currentUser.email,
            expensesIncomes: [],
            timestamp: serverTimestamp(),
            uid: auth.currentUser.uid,
            photoURL: null
        }

        //add user copy to database
        await setDoc(doc(db, 'users', auth.currentUser.uid), userCopy)

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
    }, [auth.currentUser])

    if (loading) {
        return <Spinner />
    }

    return (
        <div className='signUpContainer'>
            <h2 className="signInUpTitle">Sign Up</h2>
            <form className='signInForm' onSubmit={handleSubmit}>
                <div className="nameDiv">
                    <input
                        type="text"
                        name="name"
                        required
                        autoFocus
                        id="name"
                        className="signInOutName"
                        placeholder='Name'
                        minLength='3'
                        maxLength='15'
                        value={name}
                        onChange={handleChange} />
                </div>
                <div className="emailDiv">
                    <input
                        type="email"
                        required
                        name="email"
                        id="email"
                        className="signInOutEmail"
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
                        className="signInOutPassword"
                        placeholder='Password'
                        minLength='6'
                        value={password}
                        onChange={handleChange} />
                    <img src={visibilityIcon} alt="show password" className='showPassword' title='Show Password' onClick={() => setShowPassword(!showPassword)} />
                </div>
                <button type="submit" className='btn signInUpBtn'>Sign Up</button>
                <Link to='/sign-in' className='signInUpInstead'>Sign In Instead</Link>
            </form>
        </div>
    );
}

export default SignUp;