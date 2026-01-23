import { motion } from 'motion/react'

const FEED_VIEW_ANIMATION = {
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

function FeedView() {
  return (
    <div className="grow w-full h-screen bg-black/70 flex items-center justify-center overflow-hidden text-white">
      <motion.div layout variants={FEED_VIEW_ANIMATION} initial="initial" animate="visible" exit="initial">FeedView</motion.div>
    </div>
  )
}

export default FeedView