//router
import { useNavigate } from "react-router-dom";
//images
//icons
import { ReactComponent as NotFoundImage } from '../assets/svg/notfound.svg';


const NotFound = () => {

    const navigate = useNavigate()

    return (
        <div className="notFoundContainer">
            <div className="notFoundBox">
                <h1 className="notFoundTitle">Ooops! Page Not Found</h1>
                <div className="notFoundImgContainer">
                    <NotFoundImage className='notFoundImg' />
                </div>
                <button className="btn btn-primary notFoundBtn" onClick={() => navigate('/')}>Go to home</button>
            </div>
        </div>
    );
}

export default NotFound;