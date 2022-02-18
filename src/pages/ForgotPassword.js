//hooks
import { useState } from "react";
//router
import { Link } from "react-router-dom";
//firebase
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
//toast
import { toast } from "react-toastify";
//components
import Spinner from "../components/Spinner";

const ForgotPassword = () => {

    // ****** ADD USER ICON IN THE EMAIL INPUT ********

    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setEmail(e.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const auth = getAuth();
            await sendPasswordResetEmail(auth, email)
            setEmail('')
            setLoading(false)
            toast.success('Email sent, check inbox')
        } catch (error) {
            setLoading(false)
            toast.error('Could not send reset email')
        }
    }

    if (loading) {
        return <Spinner />
    }

    return (
        <main className="forgotPasswordContainer">
            <h2 className="forgotPasswordTitle">Forgot Password</h2>
            <form className="forgotPasswordForm" onSubmit={handleSubmit}>
                <div className="emailDiv">
                    <input
                        type="email"
                        required
                        autoFocus
                        name="email"
                        id="email"
                        className="forgotPasswordInput"
                        placeholder='Email'
                        value={email}
                        onChange={(e) => handleChange(e)} />
                </div>
                <Link to='/sign-in' className='forgotPassword'>Go to Sign In</Link>
                <button type="submit" className='btn forgotPasswordBtn'>Reset Password</button>
            </form>
        </main >
    );
}

export default ForgotPassword;