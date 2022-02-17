//icons
import { Icon } from '@iconify/react';
//router
import { useNavigate } from 'react-router-dom';



const Menu = ({ menuOpen, setMenuOpen, displayName }) => {

    const navigate = useNavigate()

    const handleCloseClick = () => {
        setMenuOpen(false)
    }

    const handleLinkClick = (e) => {
        if (e.target.textContent === 'Sign In') {
            setMenuOpen(false)
            navigate('/sign-in')
        } else if (e.target.textContent === 'Sign Up') {
            setMenuOpen(false)
            navigate('/sign-up')
        } else if (e.target.textContent === 'Home') {
            setMenuOpen(false)
            navigate('/')
        }
    }

    return (
        <div className={`menu ${ menuOpen ? '' : 'hideMenu' }`}>
            <Icon icon="charm:cross" className='closeIcon' onClick={handleCloseClick} />
            <ul className="menuList">
                {!displayName && <li className="menuSignInUpLinks">
                    <p className="signInLinkMenu"><button onClick={handleLinkClick} className="btn btn-green">Sign In</button></p>
                    <p className="signUpLinkMenu"><button onClick={handleLinkClick} className="btn">Sign Up</button></p>
                </li>}
                <li className='menuLink' onClick={handleLinkClick}>Home</li>
                <li className='menuLink'>About</li>
                <li className='menuLink'>Contacts</li>
                <li className='menuLink'>FAQ</li>
            </ul>
        </div>
    );
}

export default Menu;