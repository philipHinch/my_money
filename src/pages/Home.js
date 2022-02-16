//icons & images
import { ReactComponent as HomeImage } from '../assets/svg/home_image.svg';
import { ReactComponent as Finance1 } from '../assets/svg/finance1.svg';
import { ReactComponent as Finance2 } from '../assets/svg/finance2.svg';
import { ReactComponent as PiggyImage } from '../assets/svg/savings.svg';
import { Icon } from '@iconify/react';
//router
import { useNavigate } from 'react-router-dom';

const Home = () => {

    const navigate = useNavigate()

    return (
        //CREATE A MAIN CONTENT SLIDESHOW...
        <section className='home'>
            {/* <main className="homeContainer">
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
            </main> */}

            <main className="homeContainer secondaryHomeContainer">
                <div className="homeTextContainer secondaryTextContainer darkBack">
                    <h1 className='homeMainText secondaryHomeMainText'>Start tracking your expenses today</h1>
                    <p className='homeParagraph secondaryHomeParagraph'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsam rem repellat harum officiis molestias soluta veniam! Magnam dicta accusantium architecto.</p>
                    <div className="mobileIcons">
                        <span className='mobileIconsText'>Download here:</span>
                        <Icon icon="ant-design:apple-filled" className='mobileIcon' fontSize={'40px'} />
                        <Icon icon="ant-design:android-filled" className='mobileIcon' fontSize={'40px'} />
                    </div>
                    <button className="btn" onClick={() => navigate('/sign-up')}>Sign Up</button>
                </div>
                <div className="homeImageContainer secondaryHomeImageContainer">
                    <PiggyImage className='homeImage piggyImage' />
                </div>
            </main>

            <div className='devicesContainer homeContainer'>
                <div className="homeImageContainer mobileContainer">
                    <img src={require('../assets/png/mobilemock.png')} alt="tablet" className="homeImage deviceImg" />
                </div>
                <div className="homeImageContainer tabletContainer">
                    <img src={require('../assets/png/tabletmock.png')} alt="tablet" className="homeImage deviceImg" />
                </div>
                {/* <div className="homeImageContainer tabletContainer">
                    <img src={require('../assets/png/desktopmock.png')} alt="tablet" className="homeImage deviceImg" />
                </div> */}
                <div className="devicesTextContainer">
                    <h1 className='homeMainText devicesMainText'>Works on every device</h1>
                    <p className='homeParagraph secondaryHomeParagraph'>Smartphones, tablets, laptops, desktop computers and more!</p>
                </div>


            </div>

        </section>
    );
}

export default Home;