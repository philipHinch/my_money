//icons
import { ReactComponent as HomeImage } from '../assets/svg/home_image.svg';
import { Icon } from '@iconify/react';
//router
import { useNavigate } from 'react-router-dom';

const Home = () => {

    const navigate = useNavigate()

    return (
        <section className='home'>
            <main className="homeContainer">
                <div className="homeTextContainer">
                    <h1 className='homeMainText'>Track your expenses</h1>
                    <p className='homeParagraph'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsam rem repellat harum officiis molestias soluta veniam! Magnam dicta accusantium architecto.</p>
                    <div className="mobileIcons">
                        <Icon icon="ant-design:apple-filled" className='mobileIcon' fontSize={'40px'} />
                        <Icon icon="ant-design:android-filled" className='mobileIcon' fontSize={'40px'} />
                    </div>
                    <button className="btn" onClick={() => navigate('/sign-up')}>Sign Up</button>
                </div>
                <div className="homeImageContainer">
                    <HomeImage className='homeImage' />
                </div>
            </main>
        </section>
    );
}

export default Home;