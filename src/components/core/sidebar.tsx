import { motion, type Transition } from "motion/react"
import type { ReactNode } from "react"

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
    ease: "easeInOut" as const,
  } satisfies Transition,
}

interface SidebarComponentProps {
  isOpen: boolean
  children?: ReactNode
}

function SidebarComponent({ isOpen, children }: SidebarComponentProps) {
  return (
    <motion.div
      layout
      className="h-screen bg-black/50 backdrop-blur-sm flex flex-col items-start justify-start"
      variants={SIDEBAR_CONTENT_ANIMATION.sidebarWrapper}
      initial="closed"
      animate={isOpen ? "open" : "closed"}
      transition={SIDEBAR_CONTENT_ANIMATION.transition}
    >
      {children && (
        <div className="w-full h-full overflow-x-hidden text-nowrap">
          {children}
        </div>
      )}
    </motion.div>
  )
}

export default SidebarComponent