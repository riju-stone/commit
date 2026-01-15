import styles from './activity-bar.module.css'
import { Bolt, Brain, Calendar, CircleCheckBig, Home, LineSquiggle } from 'lucide-react'
import useAppStore from '../../store/appStore'
import { motion } from 'motion/react'

const ACTIVITY_BAR_OPEN_WIDTH = "30px"
const ACTIVITY_BAR_CLOSED_WIDTH = "0px"

const ACTIVITY_BAR_CONTENT_ANIMATION = {
  activityBarWrapper: {
    closed: {
      width: ACTIVITY_BAR_CLOSED_WIDTH,
      paddingLeft: "0px",
      paddingRight: "0px",
    },
    open: {
      width: ACTIVITY_BAR_OPEN_WIDTH,
      paddingLeft: "10px",
      paddingRight: "10px",
    },
    transition: {
      duration: 0.2,
      ease: "easeInOut",
      delay: 0.2
    }
  },
  activityBarContent: {
    closed: {
      opacity: 0,
      x: -50,
    },
    open: {
      opacity: 1,
      x: 0,
    },
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    }
  }
}

function ActivityBarComponent() {
  const { activityBarOpen } = useAppStore()
  return (
    <motion.div
      className={styles.sidebarWrapper}
      variants={ACTIVITY_BAR_CONTENT_ANIMATION.activityBarWrapper}
      initial="closed"
      animate={activityBarOpen ? "open" : "closed"}>
      <motion.div className={styles.sidebarContent}
        variants={ACTIVITY_BAR_CONTENT_ANIMATION.activityBarContent}
        initial="closed"
        animate={activityBarOpen ? "open" : "closed"}>
        <button className={styles.sidebarButton}>
          <Home />
        </button>
        <button className={styles.sidebarButton}>
          <CircleCheckBig />
        </button>
        <button className={styles.sidebarButton}>
          <Calendar />
        </button>
        <button className={styles.sidebarButton}>
          <Brain />
        </button>
        <button className={styles.sidebarButton}>
          <LineSquiggle />
        </button>
      </motion.div>
      <motion.div className={styles.sidebarContent}
        variants={ACTIVITY_BAR_CONTENT_ANIMATION.activityBarContent}
        initial="closed"
        animate={activityBarOpen ? "open" : "closed"}>
        <button className={styles.sidebarButton}>
          <Bolt />
        </button>
      </motion.div>
    </motion.div>
  )
}

export default ActivityBarComponent