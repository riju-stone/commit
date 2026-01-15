import useAppStore from '../../store/appStore'
import { motion } from 'motion/react'
import styles from './styles/file-explorer.module.css'

const FILE_EXPLORER_CLOSED_WIDTH = "0px"
const FILE_EXPLORER_OPEN_WIDTH = "300px"

const FILE_EXPLORER_CONTENT_ANIMATION = {
  fileExplorerWrapper: {
    closed: {
      width: FILE_EXPLORER_CLOSED_WIDTH,
    },
    open: {
      width: FILE_EXPLORER_OPEN_WIDTH,
    },
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
  fileExplorerContent: {
    closed: {
      opacity: 0,
      x: -50,
    },
    open: {
      opacity: 1,
      x: 0,
    },
  },
  transition: {
    duration: 0.2,
    ease: "easeInOut",
  },
}

function FileExplorerComponent() {
  const { fileExplorerOpen } = useAppStore()
  return (
    <motion.div layout className={styles.fileExplorerWrapper} variants={FILE_EXPLORER_CONTENT_ANIMATION.fileExplorerWrapper} initial="closed" animate={fileExplorerOpen ? "open" : "closed"}>
      <div className={styles.fileExplorerContent}>
      </div>
    </motion.div>
  )
}

export default FileExplorerComponent