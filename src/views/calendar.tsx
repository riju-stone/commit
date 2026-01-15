import { motion } from "motion/react"

const CALENDAR_VIEW_ANIMATION = {
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

function CalendarView() {
  return (
    <div className="grow w-full h-screen bg-black/80 flex items-center justify-center overflow-hidden text-white">
      <motion.div layout variants={CALENDAR_VIEW_ANIMATION} initial="initial" animate="visible" exit="initial">Calendar</motion.div>
    </div>
  )
}

export default CalendarView