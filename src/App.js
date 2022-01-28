//router
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
//pages
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import PrivateRoute from './pages/PrivateRoute';
//toast
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//context
import { UserProvider } from './context/UserContext';
//hooks
import { useState } from 'react';
import { useEffect } from 'react/cjs/react.development';
//firebase
import { getAuth, onAuthStateChanged } from "firebase/auth";



function App() {

  const auth = getAuth()

  const [displayName, setDisplayName] = useState(null)
  const [photo, setPhoto] = useState(null)

  //this is a trick to trigger navbar re-render on signup
  const [test, setTest] = useState(false)


  //takes care of photo update on initial load and after editing picture
  useEffect(() => {
    const getUserDetails = () => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setPhoto(user.photoURL)
        }
      })
    }
    getUserDetails()
  }, [])

  return (
    <UserProvider>
      <Router>
        <Navbar displayName={displayName} setDisplayName={setDisplayName} photo={photo} setPhoto={setPhoto} test={test} />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/sign-in' element={<SignIn />} />
          <Route path='/sign-up' element={<SignUp setPhoto={setPhoto} setTest={setTest} />} />
          <Route path='/profile' element={<PrivateRoute />} >
            <Route path='/profile' element={<Profile displayName={displayName} setDisplayName={setDisplayName} photo={photo} setPhoto={setPhoto} />} />
          </Route>
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/*' element={<NotFound />} />
        </Routes>
      </Router>
      <ToastContainer position="top-center" />
    </UserProvider>
  );
}

export default App;
