//router
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
//components
import Footer from './components/Footer';
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
import UserContext from './context/UserContext';
//hooks
import { useState, useEffect, useContext } from 'react';
//firebase
import { getAuth, onAuthStateChanged } from "firebase/auth";

//toast custom styles
const contextClass = {
  success: "#2a9d8f",
  error: "bg-red-600",
  info: "bg-gray-600",
  warning: "bg-orange-400",
  default: "bg-indigo-600",
  dark: "bg-white-600 font-gray-300",
};



function App() {

  const auth = getAuth()

  const [displayName, setDisplayName] = useState(null)
  const [photo, setPhoto] = useState(null)
  const [loading, setLoading] = useState(false)

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
          <Route path='/sign-in' element={<SignIn loading={loading} setLoading={setLoading} />} />
          <Route path='/sign-up' element={<SignUp />} />
          <Route path='/profile/:userId' element={<PrivateRoute />} >
            <Route path='/profile/:userId' element={<Profile displayName={displayName} setDisplayName={setDisplayName} photo={photo} setPhoto={setPhoto} loading={loading} setLoading={setLoading} />} />
          </Route>
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/*' element={<NotFound />} />
        </Routes>
        {!loading && <Footer />}
      </Router>
      <ToastContainer position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme={'colored'} />
    </UserProvider>
  );
}

export default App;
