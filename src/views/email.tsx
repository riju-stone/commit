import { motion } from 'motion/react'

const EMAIL_VIEW_ANIMATION = {
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

function EmailView() {
  return (
    <div className="grow w-full h-screen bg-black/80 flex items-center justify-center overflow-hidden text-white">
      <motion.div layout variants={EMAIL_VIEW_ANIMATION} initial="initial" animate="visible" exit="initial">EmailView</motion.div>
    </div>
  )
}

export default EmailView