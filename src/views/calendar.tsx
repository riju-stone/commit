import { motion } from "motion/react"
import CalendarComponent from "@/components/calendar";

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
    <div className="grow w-full h-screen bg-black/70 flex items-center justify-center overflow-hidden text-white">
      <motion.div className="w-full h-[calc(100%-25px)] mt-[20px] p-4" layout variants={CALENDAR_VIEW_ANIMATION} initial="initial" animate="visible" exit="initial">
        <CalendarComponent />
      </motion.div>
    </div>
  )
}

export default CalendarView