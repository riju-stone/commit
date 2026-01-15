import styles from './status-bar.module.css'
import { FolderTree, PanelLeft } from 'lucide-react'
import useAppStore from '../../store/appStore'

function StatusBarComponent() {
  const { toggleActivityBar, toggleFileExplorer } = useAppStore()
  return (
    <div className={styles.statusBarWrapper} data-tauri-drag-region>
      <button className={styles.sidebarToggleButton} onClick={toggleActivityBar}>
        <PanelLeft />
      </button>
      <button className={styles.sidebarToggleButton} onClick={toggleFileExplorer}>
        <FolderTree />
      </button>
    </div>
  )
}

export default StatusBarComponent