//framer motion
import { motion } from 'framer-motion'


const ProgressBar = ({ progress }) => {
    return (
        <motion.div className="progress" initial={{ width: 0 }} animate={{ width: progress + '%' }}></motion.div>
    );
}

export default ProgressBar;