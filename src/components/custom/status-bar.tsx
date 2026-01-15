import styles from './styles/status-bar.module.css'
import { FolderTree, PanelLeftDashed, PanelRight } from 'lucide-react'
import useAppStore from '../../store/appStore'
import { APP_VIEW_CONFIG } from '../../utils/constants'

function StatusBarComponent() {
  const { activeTab, toggleActivityBar, toggleFileExplorer, toggleSidebar } = useAppStore()
  const { fileExplorer, sidebar } = APP_VIEW_CONFIG[activeTab]
  return (
    <div className={styles.statusBarWrapper} data-tauri-drag-region>
      <button className={styles.sidebarToggleButton} onClick={toggleActivityBar}>
        <PanelLeftDashed />
      </button>
      <button className={styles.sidebarToggleButton} onClick={toggleFileExplorer} disabled={!fileExplorer}>
        <FolderTree />
      </button>
      <button className={styles.sidebarToggleButton} onClick={toggleSidebar} disabled={!sidebar}>
        <PanelRight />
      </button>
    </div>
  )
}

export default StatusBarComponent