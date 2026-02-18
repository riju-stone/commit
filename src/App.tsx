import "./App.css";
import ActivityBarComponent from "./components/core/activity-bar";
import StatusBarComponent from "./components/core/status-bar";
import { PropertySidebar } from "./components/whiteboard/properties";
import { APP_VIEW_CONFIG } from "@/constants/views";
import useAppStore from "./store/appStore";
import CalendarSidebarComponent from "./components/journal/calendar-sidebar";
import EmailSidebarComponent from "./components/email/email-sidebar";
import EmailViewerComponent from "./components/email/email-viewer";
import RightSidebarComponent from "./components/core/right-sidebar";
import LeftSidebarComponent from "./components/core/left-sidebar";
import FileExplorerComponent from "./components/core/file-explorer";
import OnboardingView from "./views/onboarding";

function App() {
  const { activeTab, rightSidebarOpen, onboardingCompleted } = useAppStore();
  const CurrentView = APP_VIEW_CONFIG[activeTab as keyof typeof APP_VIEW_CONFIG].view;

  const isWhiteboardView = activeTab === "whiteboard";
  const isJournalView = activeTab === "journal";
  const isEmailView = activeTab === "email";
  const isNoteView = activeTab === "notes";

  return (
    <main className="h-screen w-screen flex flex-col justify-center items-center">
      <StatusBarComponent />
      {!onboardingCompleted ? (
        <OnboardingView />
      ) : (
        <div className="editorWrapper">
          <ActivityBarComponent />
          <LeftSidebarComponent>
            {isJournalView && <CalendarSidebarComponent />}
            {isEmailView && <EmailSidebarComponent />}
            {isNoteView && <FileExplorerComponent path="/Users/rijustone/Documents/Commit-Vault/notes" />}
            {isWhiteboardView && <FileExplorerComponent path="/Users/rijustone/Documents/Commit-Vault/whiteboards" />}
          </LeftSidebarComponent>
          <CurrentView key={activeTab as keyof typeof APP_VIEW_CONFIG} />
          <RightSidebarComponent isOpen={rightSidebarOpen}>
            {isWhiteboardView && <PropertySidebar />}
            {isEmailView && <EmailViewerComponent />}
          </RightSidebarComponent>
        </div>
      )}
    </main>
  );
}

export default App;
