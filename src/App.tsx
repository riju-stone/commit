import "./App.css";
import { AnimatePresence } from "motion/react";
import ActivityBarComponent from "./components/custom/activity-bar";
import StatusBarComponent from "./components/custom/status-bar";
import FileExplorerComponent from "./components/custom/file-explorer";
import SidebarComponent from "./components/custom/sidebar";
import { APP_VIEW_CONFIG } from "./utils/constants";
import useAppStore from "./store/appStore";

function App() {
  const { activeTab } = useAppStore()
  const CurrentView = APP_VIEW_CONFIG[activeTab].view
  return (
    <main className="appWrapper">
      <StatusBarComponent />
      <div className="editorWrapper">
        <ActivityBarComponent />
        <FileExplorerComponent />
        <CurrentView key={activeTab} />
        <SidebarComponent />
      </div>
    </main>
  );
}

export default App;
