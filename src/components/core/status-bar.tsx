import { FolderTree, PanelLeftDashed, PanelRight } from 'lucide-react'
import useAppStore from '@/store/appStore'
import { APP_VIEW_CONFIG } from '@/constants/views'
import { AnimatePresence, motion } from 'motion/react'

function StatusBarComponent() {
  const { activeTab, toggleActivityBar, toggleFileExplorer, toggleSidebar } = useAppStore()
  const { fileExplorer, sidebar } = APP_VIEW_CONFIG[activeTab]
  return (
    <div className="absolute top-0 left-0 h-[32px] w-screen flex flex-row justify-end items-center bg-transparent z-9999 text-white px-2 py-4" data-tauri-drag-region>
      <AnimatePresence>
        <motion.button
          layout
          key='activity-bar-button'
          className="bg-transparent border-none cursor-pointer h-[30px] w-[30px] flex items-center justify-center text-white/60 rounded-[5px] transition-all duration-200 ease-in-out p-1.5 hover:text-white disabled:text-[#3c3c3c] disabled:cursor-not-allowed"
          transition={{ duration: 0.2, ease: "easeInOut" }}
          onClick={toggleActivityBar}
          aria-label="Toggle Activity Bar">
          <PanelLeftDashed />
        </motion.button>
        {fileExplorer &&
          <motion.button
            layout
            key='file-explorer-button'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="bg-transparent border-none cursor-pointer h-[30px] w-[30px] flex items-center justify-center text-white/60 rounded-[5px] transition-all duration-200 ease-in-out p-1.5 hover:text-white disabled:text-[#3c3c3c] disabled:cursor-not-allowed"
            onClick={toggleFileExplorer}>
            <FolderTree />
          </motion.button>
        }
        {sidebar &&
          <motion.button
            layout
            key='sidebar-button'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="bg-transparent border-none cursor-pointer h-[30px] w-[30px] flex items-center justify-center text-white/60 rounded-[5px] transition-all duration-200 ease-in-out p-1.5 hover:text-white disabled:text-[#3c3c3c] disabled:cursor-not-allowed last:mr-[10px]"
            onClick={toggleSidebar}>
            <PanelRight />
          </motion.button>
        }
      </AnimatePresence>
    </div>
  )
}

export default StatusBarComponent