//icons
import { ReactComponent as HomeImage } from '../assets/svg/home_image.svg';
//router
import { useNavigate } from 'react-router-dom';
//hooks
import { useAuthStatus } from '../hooks/useAuthStatus';


const Home = () => {

    // const { loggedIn, checkingStatus } = useAuthStatus()
    const navigate = useNavigate()


    return (
        <main className="homeContainer">
            <div className="homeTextContainer">
                <h1 className='homeMainText'>Track your expenses..</h1>
                <p className='homeParagraph'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsam rem repellat harum officiis molestias soluta veniam! Magnam dicta accusantium architecto.</p>
                <button className="btn" onClick={() => navigate('/sign-up')}>Sign Up</button>
            </div>
            <div className="homeImageContainer">
                <HomeImage className='homeImage' />
            </div>
        </main>
    );
}

export default Home;