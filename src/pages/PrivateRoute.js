//pages
import Profile from "./Profile";
import Spinner from "../components/Spinner";
//router
import { Outlet, Navigate } from "react-router-dom";
//hooks
import { useAuthStatus } from '../hooks/useAuthStatus';
import { useState } from "react/cjs/react.development";


const PrivateRoute = () => {

    const { loggedIn, checkingStatus } = useAuthStatus()

    if (checkingStatus) {
        return <Spinner />
    }

    return loggedIn ? <Outlet /> : <Navigate to='/sign-in' />
}

export default PrivateRoute;