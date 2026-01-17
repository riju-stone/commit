import "./App.css";
import ActivityBarComponent from "./components/core/activity-bar";
import StatusBarComponent from "./components/core/status-bar";
import FileExplorerComponent from "./components/core/file-explorer";
import SidebarComponent from "./components/core/sidebar";
  import { PropertySidebar } from "./components/whiteboard/properties";
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
