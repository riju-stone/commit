import { create } from "zustand";
import { APP_VIEW_CONFIG } from "@/constants/views";

type AppViewType = keyof typeof APP_VIEW_CONFIG;

interface AppConnectedAccount {
  id: string;
  name: string;
  address: string;
  type: "metamask" | "walletconnect" | "coinbase";
}

interface VaultInfo {
  id: string;
  name: string;
  path: string;
}

interface AppStore {
  onboardingCompleted: boolean;
  vaultConnected: boolean;
  activeVaultId?: string;
  vaults: VaultInfo[];
  accounts: AppConnectedAccount[];
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
  setOnboardingCompleted: (completed: boolean) => void;
  setActiveVault: (vaultId: string) => void;
  setVaultConnected: (connected: boolean) => void;
  addVault: (vault: VaultInfo) => void;
  addAccount: (account: AppConnectedAccount) => void;
  removeAccount: (accountId: string) => void;
}

const useAppStore = create<AppStore & AppActions>((set) => ({
  onboardingCompleted: false,
  vaultConnected: false,
  activeVaultId: undefined,
  vaults: [
    // {
    //   id: "1",
    //   name: "My First Vault",
    //   path: "/Users/rijustone/Documents/commit/MyFirstVault",
    // },
  ] as VaultInfo[],
  accounts: [],
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
  setOnboardingCompleted: (completed: boolean) => set(() => ({ onboardingCompleted: completed })),
  setVaultConnected: (connected: boolean) => set(() => ({ vaultConnected: connected })),
  addVault: (vault: VaultInfo) => set((state) => ({ vaults: [...state.vaults, vault] })),
  setActiveVault: (vaultId: string) => set(() => ({ activeVaultId: vaultId })),
  addAccount: (account: AppConnectedAccount) => set((state) => ({ accounts: [...state.accounts, account] })),
  removeAccount: (accountId: string) =>
    set((state) => ({ accounts: state.accounts.filter((a) => a.id !== accountId) })),
}));

export default useAppStore;
