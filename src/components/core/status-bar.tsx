import { FolderTree, PanelLeftDashed, PanelRight } from 'lucide-react'
import useAppStore from '@/store/appStore'
import { APP_VIEW_CONFIG } from '@/constants/views'

function StatusBarComponent() {
  const { activeTab, toggleActivityBar, toggleFileExplorer, toggleSidebar } = useAppStore()
  const { fileExplorer, sidebar } = APP_VIEW_CONFIG[activeTab]
  return (
    <div className="absolute top-0 left-0 h-[32px] w-screen flex flex-row justify-end items-center bg-transparent z-9999 text-white px-2 py-4" data-tauri-drag-region>
      <button className="bg-transparent border-none cursor-pointer h-[30px] w-[30px] flex items-center justify-center text-[#757575] rounded-[5px] transition-all duration-200 ease-in-out p-1.5 hover:text-[#343434] disabled:text-[#3c3c3c] disabled:cursor-not-allowed"
        onClick={toggleActivityBar}
        aria-label="Toggle Activity Bar">
        <PanelLeftDashed />
      </button>
      {fileExplorer &&
        <button
          className="bg-transparent border-none cursor-pointer h-[30px] w-[30px] flex items-center justify-center text-[#757575] rounded-[5px] transition-all duration-200 ease-in-out p-1.5 hover:text-[#343434] disabled:text-[#3c3c3c] disabled:cursor-not-allowed"
          onClick={toggleFileExplorer}>
          <FolderTree />
        </button>
      }
      {sidebar &&
        <button
          className="bg-transparent border-none cursor-pointer h-[30px] w-[30px] flex items-center justify-center text-[#757575] rounded-[5px] transition-all duration-200 ease-in-out p-1.5 hover:text-[#343434] disabled:text-[#3c3c3c] disabled:cursor-not-allowed last:mr-[10px]"
          onClick={toggleSidebar}>
          <PanelRight />
        </button>
      }
    </div>
  )
}

export default StatusBarComponent