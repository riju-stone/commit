import { create } from 'zustand'
import { APP_VIEW_CONFIG } from '@/constants/views'

type AppViewType = keyof typeof APP_VIEW_CONFIG

interface AppStore {
  activeTab: AppViewType
  activityBarOpen: boolean
  fileExplorerOpen: boolean
  sidebarOpen: boolean
  fileExplorerPath: string
}

interface AppActions {
  setActiveTab: (tab: AppViewType) => void
  toggleActivityBar: () => void
  toggleFileExplorer: () => void
  toggleSidebar: () => void
  setFileExplorerPath: (path: string) => void
}

const useAppStore = create<AppStore & AppActions>((set) => ({
  activeTab: "home",
  activityBarOpen: true,
  fileExplorerOpen: false,
  sidebarOpen: false,
  fileExplorerPath: "/",
  toggleActivityBar: () => set((state) => ({ activityBarOpen: !state.activityBarOpen })),
  toggleFileExplorer: () => set((state) => ({ fileExplorerOpen: !state.fileExplorerOpen })),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setFileExplorerPath: (path: string) => set(() => ({ fileExplorerPath: path })),
  setActiveTab: (tab: AppViewType) => set(() => {
    const { fileExplorer, sidebar } = APP_VIEW_CONFIG[tab]
    return {
      activeTab: tab,
      fileExplorerOpen: fileExplorer,
      sidebarOpen: sidebar,
    }
  }),
}))

export default useAppStore
