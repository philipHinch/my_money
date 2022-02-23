//framer motion
import { motion } from 'framer-motion'


const ProgressBar = ({ progress }) => {
    return (
        <div className="progressContainer">
            <p>{progress !== 0 && progress.toFixed(0) + '%'}</p>
            <div className="progress" style={{ width: progress + '%' }}></div>
        </div>
    );
}

export default ProgressBar;