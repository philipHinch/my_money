//hooks
import { useAuthStatus } from '../hooks/useAuthStatus';
//router
import { useNavigate } from 'react-router-dom';
//icons
import { Icon } from '@iconify/react';
//firebase
import { getAuth } from 'firebase/auth';

const Footer = () => {

    const navigate = useNavigate()
    const { loggedIn } = useAuthStatus()
    const auth = getAuth()

    const handleSignInClick = () => {
        if (!auth.currentUser) {
            navigate('/sign-in')
        } else {
            navigate(`/profile/${ auth.currentUser.uid }`)
        }
    }

    const handleSignUpClick = () => {
        if (!auth.currentUser) {
            navigate('/sign-up')
        } else {
            navigate(`/profile/${ auth.currentUser.uid }`)
        }
    }

    return (

        <footer className='footerContainer'>
            <div className="footerLogoContainer" onClick={() => navigate('/')}>
                <img src={require('../assets/png/main-logo-image-footer.png')} alt="" />
                <div className="socialLinksContainer">
                    <Icon icon="brandico:facebook-rect"
                        className='socialLink'
                    />
                    <Icon icon="brandico:instagram-filled" className='socialLink' />
                    <Icon icon="brandico:twitter-bird"
                        className='socialLink' />
                </div>
            </div>

            <div className="footerLinksContainer">
                <ul className="footerPages">
                    <li className="footerPageHeader">Pages</li>
                    <li className="footerPage" onClick={() => navigate('/')}>Home</li>
                    <li className="footerPage" onClick={handleSignInClick}>Sign In</li>
                    <li className="footerPage" onClick={handleSignUpClick}>Sign Up</li>
                    <li className="footerPage"></li>
                </ul>
                <ul className="footerOtherPages">
                    <li className="footerPageHeader">Other</li>
                    <li className="footerPage">About</li>
                    <li className="footerPage">Contacts</li>
                    <li className="footerPage">FAQ</li>
                </ul>
            </div>

            <span className="copyrightContainer">&copy; 2022 - <a href="https://github.com/philipHinch" target='_blank'>https://github.com/philipHinch</a>
            </span>
        </footer>



    );
}

export default Footer;