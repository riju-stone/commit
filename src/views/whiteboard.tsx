import styles from "./styles/whiteboard.module.css"
import { motion } from "motion/react"

const WHITEBOARD_VIEW_ANIMATION = {
  initial: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
  transition: {
    duration: 0.5,
    ease: "easeInOut",
  },
}

function WhiteboardView() {

  return (
    <div className={styles.whiteboardViewWrapper}>
      <motion.div layout className={styles.whiteboardContent} variants={WHITEBOARD_VIEW_ANIMATION} initial="initial" animate="visible" exit="initial">
        Whiteboard
      </motion.div>
    </div>
  )
}

export default WhiteboardView
