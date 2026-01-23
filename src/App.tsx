import "./App.css";
import ActivityBarComponent from "./components/core/activity-bar";
import StatusBarComponent from "./components/core/status-bar";
import FileExplorerComponent from "./components/core/file-explorer";
import SidebarComponent from "./components/core/sidebar";
import { PropertySidebar } from "./components/whiteboard/properties";
import { APP_VIEW_CONFIG } from "@/constants/views";
import useAppStore from "./store/appStore";
import CalendarSidebarComponent from "./components/journal/calendar-sidebar";

function App() {
  const { activeTab, sidebarOpen } = useAppStore()
  const CurrentView = APP_VIEW_CONFIG[activeTab as keyof typeof APP_VIEW_CONFIG].view

  const isWhiteboardView = activeTab === 'whiteboard'
  const isJournalView = activeTab === 'journal'

  return (
    <main className="h-screen w-screen flex flex-col justify-center items-center">
      <StatusBarComponent />
      <div className="editorWrapper">
        <ActivityBarComponent />
        <FileExplorerComponent>
          {isJournalView && <CalendarSidebarComponent />}
        </FileExplorerComponent>
        <CurrentView key={activeTab as keyof typeof APP_VIEW_CONFIG} />
        <SidebarComponent isOpen={sidebarOpen}>
          {isWhiteboardView && <PropertySidebar />}
        </SidebarComponent>
      </div>
    </main>
  );
}

export default App;
