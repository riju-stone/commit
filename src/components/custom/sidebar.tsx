import { motion } from "motion/react"
import useAppStore from '../../store/appStore'

const SIDEBAR_CLOSED_WIDTH = "0px"
const SIDEBAR_OPEN_WIDTH = "250px"

const SIDEBAR_CONTENT_ANIMATION = {
  sidebarWrapper: {
    closed: {
      width: SIDEBAR_CLOSED_WIDTH,
      minWidth: SIDEBAR_CLOSED_WIDTH,
    },
    open: {
      width: SIDEBAR_OPEN_WIDTH,
      minWidth: SIDEBAR_OPEN_WIDTH,
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
    <motion.div layout className="grow flex-wrap h-screen w-[30px] bg-black/30 flex flex-col items-start justify-between origin-[-100%_0]"
      variants={SIDEBAR_CONTENT_ANIMATION.sidebarWrapper}
      initial="closed"
      animate={sidebarOpen ? "open" : "closed"}></motion.div>
  )
}

export default SidebarComponent