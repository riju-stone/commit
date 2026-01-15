import "./App.css";
import ActivityBarComponent from "./components/custom/activity-bar";
import TextEditorComponent from "./components/custom/text-editor";
import StatusBarComponent from "./components/custom/status-bar";
import FileExplorerComponent from "./components/custom/file-explorer";
import SidebarComponent from "./components/custom/sidebar";

function App() {
  return (
    <main className="appWrapper">
      <StatusBarComponent />
      <div className="editorWrapper">
        <ActivityBarComponent />
        <FileExplorerComponent />
        <TextEditorComponent />
        <SidebarComponent />
      </div>
    </main>
  );
}

export default App;
