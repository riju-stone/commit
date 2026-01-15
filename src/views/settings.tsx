import React from 'react'
import styles from "./styles/settings.module.css"
import { motion } from "motion/react"

const SETTINGS_VIEW_ANIMATION = {
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

function SettingsView() {
  return (
    <div className={styles.settingsViewWrapper}>
      <motion.div layout className={styles.settingsContent} variants={SETTINGS_VIEW_ANIMATION} initial="initial" animate="visible" exit="initial">SettingsView</motion.div>
    </div>
  )
}

export default SettingsView