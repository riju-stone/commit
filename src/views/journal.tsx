import React from 'react'
import styles from "./styles/journal.module.css"
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
    <div className={styles.journalViewWrapper}>
      <motion.div layout className={styles.journalContent} variants={JOURNAL_VIEW_ANIMATION} initial="initial" animate="visible" exit="initial">JournalView</motion.div>
    </div>
  )
}

export default JournalView