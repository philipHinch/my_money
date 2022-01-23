//hooks
import { useState } from "react";
//router
import { Link } from "react-router-dom";
//firebase
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
//toast
import { toast } from "react-toastify";

const ForgotPassword = () => {

    const [email, setEmail] = useState('')

    const handeChange = (e) => {

    }

    const handleSubmit = () => {

    }

    return (
        <main className="forgotPasswordContainer">
            <h2 className="forgotPasswordTitle">Forgot Password</h2>
            <div className="forgotPasswordForm">
                hello
            </div>
        </main>
    );
}

export default ForgotPassword;