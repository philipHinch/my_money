//hooks
import { useState } from 'react';
//router
import { Link } from 'react-router-dom';
//icons
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg';
import visibilityIcon from '../assets/svg/visibilityIcon.svg';


const SignIn = () => {

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

    const handleSubmit = (e) => {
        e.preventDefault()
    }

    return (
        <form className='signInForm'>
            <h2 className="signInTitle">Sign In</h2>
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