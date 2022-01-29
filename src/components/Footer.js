//hooks
import { useNavigate } from 'react-router-dom';
//icons
import { Icon } from '@iconify/react';


const Footer = () => {

    const navigate = useNavigate()

    return (
        <footer className='footerContainer'>
            <div className="footerLogoContainer" onClick={() => navigate('/')}>
                <img src={require('../assets/png/main-logo-image-footer.png')} alt="" />
                <div className="socialLinksContainer">
                    <Icon icon="mdi:facebook" className='socialLink' />
                    <Icon icon="mdi:instagram" className='socialLink' />
                </div>
            </div>



            <div className="footerLinksContainer">
                <ul className="footerPages">
                    <li className="footerPageHeader">Pages</li>
                    <li className="footerPage" onClick={() => navigate('/')}>Home</li>
                    <li className="footerPage" onClick={() => navigate('/sign-in')}>Sign In</li>
                    <li className="footerPage" onClick={() => navigate('/sign-up')}>Sign Up</li>
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