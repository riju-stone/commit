import { motion } from "motion/react"

const JOURNAL_VIEW_ANIMATION = {
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
function JournalView() {
  return (
    <div className="grow w-full h-screen bg-black/80 flex items-center justify-center overflow-hidden text-white">
      <motion.div layout variants={JOURNAL_VIEW_ANIMATION} initial="initial" animate="visible" exit="initial">JournalView</motion.div>
    </div>
  )
}

export default JournalView