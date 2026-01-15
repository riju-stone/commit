import { motion } from "motion/react"
import styles from './styles/sidebar.module.css'
import useAppStore from '../../store/appStore'

const SIDEBAR_CLOSED_WIDTH = "0px"
const SIDEBAR_OPEN_WIDTH = "300px"

const SIDEBAR_CONTENT_ANIMATION = {
  sidebarWrapper: {
    closed: {
      width: SIDEBAR_CLOSED_WIDTH,
    },
    open: {
      width: SIDEBAR_OPEN_WIDTH,
    },
  },
  transition: {
    duration: 0.2,
    ease: "easeInOut",
  },
}

function SidebarComponent() {
  const { sidebarOpen } = useAppStore()
  return (
    <motion.div layout className={styles.sidebarWrapper}
      variants={SIDEBAR_CONTENT_ANIMATION.sidebarWrapper}
      initial="closed"
      animate={sidebarOpen ? "open" : "closed"}></motion.div>
  )
}

export default SidebarComponent