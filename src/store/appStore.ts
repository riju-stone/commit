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
  setActiveTab: (tab: AppViewType) => set((state) => {
    const viewConfig = APP_VIEW_CONFIG[tab]
    // Close sidebars if they're not allowed in the new view, but don't auto-open them
    return {
      activeTab: tab,
      fileExplorerOpen: viewConfig.fileExplorer ? state.fileExplorerOpen : false,
      sidebarOpen: viewConfig.sidebar ? state.sidebarOpen : false,
    }
  }),
}))

export default useAppStore
