//splide
import { Splide, SplideSlide } from '@splidejs/react-splide';

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
    {
        id: "JtcAuC",
        firstName: "Lewis",
        lastName: "Blick",
        jobTitle: "Product Division Manager",
        avatar: "https://randomuser.me/api/portraits/men/22.jpg",
        age: 32,
        country: "USA",
        content: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolores, facere'
    },
    {
        id: "Wij5Uj",
        firstName: "Wendy",
        lastName: "Weimann",
        jobTitle: "HR Specialist",
        avatar: "https://images.generated.photos/G6NK_kvf-9T0IJEOnqmGNFeOYhFiZ4JTVuXP62USCSc/rs:fit:512:512/czM6Ly9pY29uczgu/Z3Bob3Rvcy1wcm9k/LnBob3Rvcy92M18w/Mjk1NjQ3LmpwZw.jpg",
        age: 38,
        country: "Belgium",
        content: 'Lorem ipsum dolor, sit amet consectetur    adipisicing elit. Dolores, facere'
    },
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
        content: 'Voluptate velit esse lorem ipsum, aliquip ex ea commodo consequat. Duis aute in voluptate velit esse cillum consectetur adipisicing elit.'
    }
]

const Slider = () => {

    var splide = new Splide('.splide', {
        type: 'loop',
        perPage: 3,
        autoplay: true,
    });

    return (

        <div className="wrapper">
            <h1 className='testimonialMainTitle'>User Testimonials</h1>
            <Splide
                options={{
                    type: 'loop',
                    perPage: 3,
                    autoplay: true,
                    pauseOnHover: false,
                    resetProgress: false,
                    arrows: false,
                    gap: '50px',
                    height: '400px',
                    pagination: false
                }}
                hasSliderWrapper
                className='center'
            >
                {testimonials.map(slide => (
                    <SplideSlide key={slide.id} className='slide '>
                        <div className="testimonialImageContainer">
                            <img src={slide.avatar} alt="" />
                        </div>
                        <div className="testimonialName">{slide.firstName}</div>
                        <div className="testimonialJob">{slide.jobTitle}</div>
                        <div className="testimonialContent">
                            <span className="quote1">“</span>
                            <p>{slide.content}</p>
                            <span className="quote2">”</span>
                        </div>

                    </SplideSlide>
                ))}
            </Splide>
        </div>
    );
}

export default Slider;