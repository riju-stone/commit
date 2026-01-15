import styles from './text-editor.module.css'
import { motion } from 'motion/react'

function TextEditorComponent() {
  return (
    <motion.div className={styles.textEditorWrapper}>
      <div className={styles.textEditorContent}>TextEditorComponent</div>
    </motion.div>
  )
}

export default TextEditorComponent