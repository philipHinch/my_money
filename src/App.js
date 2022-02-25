//router
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
//components
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import Menu from './components/Menu';
import EditModal from './components/EditModal';
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
//splide
import '@splidejs/splide/dist/css/splide.min.css';


function App() {

  const auth = getAuth()

  const [displayName, setDisplayName] = useState(null)
  const [photo, setPhoto] = useState(null)
  const [loading, setLoading] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)


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

  if (isEdit) {
    document.body.style.overflow = 'hidden'
  }

  if (!isEdit) {
    document.body.style.overflow = 'visible'
  }

  return (
    <UserProvider>
      <Router>
        {isEdit &&
          <EditModal setIsEdit={setIsEdit} setPhoto={setPhoto} setDisplayName={setDisplayName} />
        }
        <Menu menuOpen={menuOpen} setMenuOpen={setMenuOpen} displayName={displayName} setDisplayName={setDisplayName} photo={photo} setPhoto={setPhoto} test={test} />
        <Navbar displayName={displayName} setDisplayName={setDisplayName} photo={photo} setPhoto={setPhoto} test={test} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/sign-in' element={<SignIn loading={loading} setLoading={setLoading} />} />
          <Route path='/sign-up' element={<SignUp />} />
          <Route path='/profile/:userId' element={<PrivateRoute />} >
            <Route path='/profile/:userId' element={<Profile displayName={displayName} setDisplayName={setDisplayName} photo={photo} setPhoto={setPhoto} loading={loading} setLoading={setLoading} isEdit={isEdit} setIsEdit={setIsEdit} />} />
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
