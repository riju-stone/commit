import styles from "./styles/home.module.css"
import { motion } from "motion/react"

const HOME_VIEW_ANIMATION = {
  initial: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
  transition: {
    duration: 0.5,
    ease: "easeInOut",
  }
}

function HomeView() {
  return (
    <div className={styles.homeViewWrapper}>
      <motion.div className={styles.homeContent} variants={HOME_VIEW_ANIMATION} initial="initial" animate="visible" exit="initial">Home</motion.div>
    </div>
  )
}

export default HomeView