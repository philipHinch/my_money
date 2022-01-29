//hooks
import { useNavigate } from 'react-router-dom';


const Footer = () => {

    const navigate = useNavigate()

    return (
        <footer className='footerContainer'>
            <div className="footerLogoContainer" onClick={() => navigate('/')}>
                <img src={require('../assets/png/main-logo-image-footer.png')} alt="" />
            </div>
        </footer>
    );
}

export default Footer;