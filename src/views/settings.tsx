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
    <div className="grow w-full h-screen bg-black/80 flex items-center justify-center overflow-hidden text-white">
      <motion.div layout variants={SETTINGS_VIEW_ANIMATION} initial="initial" animate="visible" exit="initial">SettingsView</motion.div>
    </div>
  )
}

export default SettingsView