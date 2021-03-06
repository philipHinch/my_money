//icons & images
import { ReactComponent as HomeImage } from '../assets/svg/home_image.svg';
import { ReactComponent as Finance1 } from '../assets/svg/finance1.svg';
import { ReactComponent as Finance2 } from '../assets/svg/finance2.svg';
import { ReactComponent as PiggyImage } from '../assets/svg/savings.svg';
import { Icon } from '@iconify/react';
//router
import { useNavigate } from 'react-router-dom';
//context
import UserContext from '../context/UserContext';
//hooks
import { useContext } from 'react';


const testimonials = [
    {
        id: "aeotJH",
        firstName: "Belle",
        lastName: "Koss",
        jobTitle: "UI/UX Designer",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        age: 19,
        country: "Germany",
        content: 'Duis aute irure dolor in reprehenderit in lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolores, facere',
        rating: 5
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
        content: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolores, facere',
        rating: 5
    },
    {
        id: "MQ0uVV",
        firstName: "Piotr",
        lastName: "Macejkovic",
        jobTitle: "Financial Advisor",
        avatar: "https://api.uifaces.co/our-content/donated/N5PLzyan.jpg",
        age: 27,
        country: "Poland",
        content: 'Voluptate velit esse cillum lorem ipsum, sit ut aliquip ex commodo consequat. Duis aute in voluptate eu fugiat nulla pariatur consectetur',
        rating: 4.5
    }
]

const Home = () => {

    const { user } = useContext(UserContext)
    const navigate = useNavigate()

    return (
        //CREATE A MAIN CONTENT SLIDESHOW???...
        <section className='home'>
            <main className="homeContainer secondaryHomeContainer">
                <div className="homeTextContainer secondaryTextContainer darkBack">
                    <h1 className='homeMainText secondaryHomeMainText'>Start tracking your expenses today</h1>
                    <p className='homeParagraph secondaryHomeParagraph'>
                        {/* Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsam rem repellat harum officiis molestias soluta veniam! Magnam dicta accusantium architecto. */}
                        Keep track of your own personal expenses, incomes and balances.  Quickly add expenses on the go. <br /> "A fundamental app to manage your finances"
                    </p>
                    <div className="mobileIcons">
                        <small className='mobileIconsText'>Download here:</small>
                        <Icon icon="ant-design:apple-filled" className='mobileIcon' fontSize={'40px'} />
                        <Icon icon="ant-design:android-filled" className='mobileIcon' fontSize={'40px'} />
                    </div>
                    <button className="btn" onClick={() => navigate('/sign-up')}>{user ? 'My Profile' : 'Sign Up'}</button>
                </div>
                <div className="homeImageContainer secondaryHomeImageContainer">
                    <PiggyImage className='homeImage piggyImage' />
                </div>
            </main>

            <div className='testimonialContainer homeContainer'>
                {testimonials.map(user => (
                    <div className="testimonial" key={user.id}>
                        <div className="ratingContainer">
                            <Icon icon="mdi:star" className='star' />
                            <Icon icon="mdi:star" className='star' />
                            <Icon icon="mdi:star" className='star' />
                            <Icon icon="mdi:star" className='star' />
                            <Icon icon="mdi:star" className='star' />
                        </div>
                        <div className="testimonialImageContainer">
                            <img src={user.avatar} alt="user avatar" />
                        </div>
                        <div className="testimonialName">{user.firstName}</div>
                        <div className="testimonialJob">{user.jobTitle}</div>
                        <div className="testimonialContent">
                            <span className="quote1">???</span>
                            <p>{user.content}</p>
                            <span className="quote2">???</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className='devicesContainer homeContainer'>
                <div className="homeImageContainer multiDeviceContainer">
                    <img src={require('../assets/png/multidevicemock.png')} alt="tablet" className="homeImage deviceImg" />
                </div>
                <div className="devicesTextContainer">
                    <h1 className='homeMainText devicesMainText'>Works on every device</h1>
                    <p className='homeParagraph secondaryHomeParagraph'>Smartphones, tablets, laptops, desktop computers and more!</p>
                </div>
            </div>
        </section>
    );
}

export default Home;