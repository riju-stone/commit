import React from 'react'
import styles from "./styles/calendar.module.css"
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
    <div className={styles.calendarViewWrapper}>
      <motion.div layout className={styles.calendarContent} variants={CALENDAR_VIEW_ANIMATION} initial="initial" animate="visible" exit="initial">Calendar</motion.div>
    </div>
  )
}

export default CalendarView