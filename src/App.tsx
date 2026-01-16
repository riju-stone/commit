import "./App.css";
import ActivityBarComponent from "./components/custom/core/activity-bar";
import StatusBarComponent from "./components/custom/core/status-bar";
import FileExplorerComponent from "./components/custom/core/file-explorer";
import SidebarComponent from "./components/custom/core/sidebar";
import PropertySidebar from "./components/custom/whiteboard/property-sidebar";
import { APP_VIEW_CONFIG } from "./utils/constants";
import useAppStore from "./store/appStore";

function App() {
  const { activeTab, sidebarOpen } = useAppStore()
  const CurrentView = APP_VIEW_CONFIG[activeTab].view

  const isWhiteboardView = activeTab === 'whiteboard'

  return (
    <main className="h-screen w-screen flex flex-col justify-center items-center">
      <StatusBarComponent />
      <div className="editorWrapper">
        <ActivityBarComponent />
        <FileExplorerComponent />
        <CurrentView key={activeTab} />
        <SidebarComponent isOpen={sidebarOpen}>
          {isWhiteboardView && <PropertySidebar />}
        </SidebarComponent>
      </div>
    </main>
  );
}

export default App;
