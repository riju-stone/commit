import { motion } from 'motion/react'
import NotesEditorComponent from '@/components/notes/editor'

const NOTES_VIEW_ANIMATION = {
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

function NotesView() {
  return (
    <div className="grow w-screen h-screen bg-black/70 flex items-center justify-center overflow-hidden text-white">
      <motion.div layout
        className="w-full h-full flex items-center justify-center"
        variants={NOTES_VIEW_ANIMATION} initial="initial"
        animate="visible" exit="initial">
        <NotesEditorComponent />
      </motion.div>
    </div>
  )
}

export default NotesView