import useAppStore from '@/store/appStore'
import { motion } from 'motion/react'

const FILE_EXPLORER_CLOSED_WIDTH = "0px"
const FILE_EXPLORER_OPEN_WIDTH = "250px"

const FILE_EXPLORER_CONTENT_ANIMATION = {
  fileExplorerWrapper: {
    closed: {
      width: FILE_EXPLORER_CLOSED_WIDTH,
      minWidth: FILE_EXPLORER_CLOSED_WIDTH,
    },
    open: {
      width: FILE_EXPLORER_OPEN_WIDTH,
      minWidth: FILE_EXPLORER_OPEN_WIDTH,
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
    <motion.div layout className={`grow flex-wrap h-screen bg-black/30 flex flex-col items-start justify-between`}
      variants={FILE_EXPLORER_CONTENT_ANIMATION.fileExplorerWrapper}
      initial="closed"
      animate={fileExplorerOpen ? "open" : "closed"} >
      <div>
      </div>
    </motion.div>
  )
}

export default FileExplorerComponent