import { motion } from 'motion/react'

function TextEditorComponent() {
  return (
    <motion.div className="flex-wrap w-full h-screen bg-black/80 flex items-center justify-center overflow-hidden text-white">
      <div>TextEditorComponent</div>
    </motion.div>
  )
}

export default TextEditorComponent