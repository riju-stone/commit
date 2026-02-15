import { create } from "zustand";
import { APP_VIEW_CONFIG } from "@/constants/views";

type AppViewType = keyof typeof APP_VIEW_CONFIG;

interface AppStore {
  activeTab: AppViewType;
  activityBarOpen: boolean;
  leftSidebarOpen: boolean;
  rightSidebarOpen: boolean;
  fileExplorerPath: string;
}

interface AppActions {
  setActiveTab: (tab: AppViewType) => void;
  toggleActivityBar: () => void;
  toggleLeftSidebar: () => void;
  toggleRightSidebar: () => void;
  setFileExplorerPath: (path: string) => void;
}

const useAppStore = create<AppStore & AppActions>((set) => ({
  activeTab: "home" as const,
  activityBarOpen: true,
  leftSidebarOpen: false,
  rightSidebarOpen: false,
  fileExplorerPath: "/Users/rijustone/Documents/commit/",
  toggleActivityBar: () => set((state) => ({ activityBarOpen: !state.activityBarOpen })),
  toggleLeftSidebar: () => set((state) => ({ leftSidebarOpen: !state.leftSidebarOpen })),
  toggleRightSidebar: () => set((state) => ({ rightSidebarOpen: !state.rightSidebarOpen })),
  setFileExplorerPath: (path: string) => set(() => ({ fileExplorerPath: path })),
  setActiveTab: (tab: AppViewType) =>
    set((state) => {
      const viewConfig = APP_VIEW_CONFIG[tab];
      // Close sidebars if they're not allowed in the new view, but don't auto-open them
      return {
        activeTab: tab,
        leftSidebarOpen: viewConfig.fileExplorer ? state.leftSidebarOpen : false,
        rightSidebarOpen: viewConfig.sidebar ? state.rightSidebarOpen : false,
      };
    }),
}));

export default useAppStore;
