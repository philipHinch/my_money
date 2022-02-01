//router
import { useNavigate } from "react-router-dom";


const NotFound = () => {

    const navigate = useNavigate()

    return (
        <div className="notFoundContainer">
            <div className="notFoundBox">
                <h1 className="notFoundTitle">404 Page Not Found</h1>
                <button className="btn btn-primary notFoundBtn" onClick={() => navigate('/')}>Go to home</button>
            </div>
        </div>
    );
}

export default NotFound;