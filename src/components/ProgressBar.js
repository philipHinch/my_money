//framer motion
import { motion } from 'framer-motion'


const ProgressBar = ({ progress }) => {
    return (
        <div className="progressContainer">
            <div className="progress" style={{ width: progress + '%' }}></div>
        </div>
    );
}

export default ProgressBar;