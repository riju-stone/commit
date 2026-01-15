import styles from './styles/status-bar.module.css'
import { FolderTree, PanelLeft, PanelRight } from 'lucide-react'
import useAppStore from '../../store/appStore'

function StatusBarComponent() {
  const { toggleActivityBar, toggleFileExplorer, toggleSidebar } = useAppStore()
  return (
    <div className={styles.statusBarWrapper} data-tauri-drag-region>
      <button className={styles.sidebarToggleButton} onClick={toggleActivityBar}>
        <PanelLeft />
      </button>
      <button className={styles.sidebarToggleButton} onClick={toggleFileExplorer}>
        <FolderTree />
      </button>
      <button className={styles.sidebarToggleButton} onClick={toggleSidebar}>
        <PanelRight />
      </button>
    </div>
  )
}

export default StatusBarComponent