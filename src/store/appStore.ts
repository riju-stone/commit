import { create } from 'zustand'

interface AppStore {
  activeTab: string
  activityBarOpen: boolean
  fileExplorerOpen: boolean
  fileExplorerPath: string
}

interface AppActions {
  setActiveTab: (tab: string) => void
  toggleActivityBar: () => void
  toggleFileExplorer: () => void
  setFileExplorerPath: (path: string) => void
}

const useAppStore = create<AppStore & AppActions>((set) => ({
  activeTab: "home",
  activityBarOpen: false,
  fileExplorerOpen: false,
  fileExplorerPath: "/",
  toggleActivityBar: () => set((state) => ({ activityBarOpen: !state.activityBarOpen })),
  toggleFileExplorer: () => set((state) => ({ fileExplorerOpen: !state.fileExplorerOpen })),
  setFileExplorerPath: (path: string) => set(() => ({ fileExplorerPath: path })),
  setActiveTab: (tab: string) => set(() => ({ activeTab: tab })),
}))

export default useAppStore