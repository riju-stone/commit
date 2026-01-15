import "./App.css";
import ActivityBarComponent from "./components/activity-bar/activity-bar";
import TextEditorComponent from "./components/text-editor/text-editor";
import StatusBarComponent from "./components/status-bar/status-bar";
import FileExplorerComponent from "./components/file-explorer/file-explorer";

function App() {
  return (
    <main className="appWrapper">
      <StatusBarComponent />
      <div className="editorWrapper">
        <ActivityBarComponent />
        <FileExplorerComponent />
        <TextEditorComponent />
      </div>
    </main>
  );
}

export default App;
