//icons & images
import { ReactComponent as HomeImage } from '../assets/svg/home_image.svg';
import { ReactComponent as Finance1 } from '../assets/svg/finance1.svg';
import { ReactComponent as Finance2 } from '../assets/svg/finance2.svg';
import { ReactComponent as PiggyImage } from '../assets/svg/savings.svg';
import { Icon } from '@iconify/react';
//router
import { useNavigate } from 'react-router-dom';
import Slider from '../components/Slider';

const testimonials = [
    {
        id: "aeotJH",
        firstName: "Belle",
        lastName: "Koss",
        jobTitle: "UI/UX Designer",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        age: 19,
        country: "Germany",
        content: 'Duis aute irure dolor in reprehenderit in lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolores, facere'
    },
    // {
    //     id: "JtcAuC",
    //     firstName: "Lewis",
    //     lastName: "Blick",
    //     jobTitle: "Product Division Manager",
    //     avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    //     age: 32,
    //     country: "USA",
    //     content: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolores, facere'
    // },
    // {
    //     id: "Wij5Uj",
    //     firstName: "Wendy",
    //     lastName: "Weimann",
    //     jobTitle: "HR Specialist",
    //     avatar: "https://images.generated.photos/G6NK_kvf-9T0IJEOnqmGNFeOYhFiZ4JTVuXP62USCSc/rs:fit:512:512/czM6Ly9pY29uczgu/Z3Bob3Rvcy1wcm9k/LnBob3Rvcy92M18w/Mjk1NjQ3LmpwZw.jpg",
    //     age: 38,
    //     country: "Belgium",
    //     content: 'Lorem ipsum dolor, sit amet consectetur    adipisicing elit. Dolores, facere'
    // },
    {
        id: "DMc1Mo",
        firstName: "Craig",
        lastName: "Welch",
        jobTitle: "Software Developer",
        avatar: "https://api.uifaces.co/our-content/donated/6MWH9Xi_.jpg",
        age: 33,
        country: "UK",
        content: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolores, facere'
    },
    {
        id: "MQ0uVV",
        firstName: "Piotr",
        lastName: "Macejkovic",
        jobTitle: "Financial Advisor",
        avatar: "https://api.uifaces.co/our-content/donated/N5PLzyan.jpg",
        age: 27,
        country: "Poland",
        content: 'Voluptate velit esse cillum lorem ipsum dolor, sit ut aliquip ex ea commodo consequat. Duis aute in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur amet consectetur adipisicing elit.'
    }
]

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
                    <p className='homeParagraph secondaryHomeParagraph'>
                        {/* Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsam rem repellat harum officiis molestias soluta veniam! Magnam dicta accusantium architecto. */}
                        Keep track of your expenses, incomes and balances.  Quickly add expenses on the go. <br /> "A fundamental app to manage your finances"
                    </p>
                    <div className="mobileIcons">
                        <small className='mobileIconsText'>Download here:</small>
                        <Icon icon="ant-design:apple-filled" className='mobileIcon' fontSize={'40px'} />
                        <Icon icon="ant-design:android-filled" className='mobileIcon' fontSize={'40px'} />
                    </div>
                    <button className="btn" onClick={() => navigate('/sign-up')}>Sign Up</button>
                </div>
                <div className="homeImageContainer secondaryHomeImageContainer">
                    <PiggyImage className='homeImage piggyImage' />
                </div>
            </main>

            {/* <Slider /> */}

            <div className='testimonialContainer homeContainer'>
                {testimonials.map(user => (
                    <div className="testimonial" key={user.id}>
                        <div className="testimonialImageContainer">
                            <img src={user.avatar} alt="" />
                        </div>
                        <div className="testimonialName">{user.firstName}</div>
                        <div className="testimonialJob">{user.jobTitle}</div>
                        <div className="testimonialContent">
                            <span className="quote1">“</span>
                            <p>{user.content}</p>
                            <span className="quote2">”</span>
                        </div>
                    </div>
                ))}
            </div>

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