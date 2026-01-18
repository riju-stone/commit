import { EditorContent, EditorContext, useEditor } from "@tiptap/react"
import { StarterKit } from "@tiptap/starter-kit";
import { TableKit } from "@tiptap/extension-table"
import { Image } from "@tiptap/extension-image"
import Math from "@tiptap/extension-mathematics"
import Typography from "@tiptap/extension-typography"
import { BubbleMenu } from "@tiptap/react/menus"
import BubbleMenuComponent from "./menus/bubble"
import { useMemo } from "react"

function NotesEditorComponent() {

  const editor = useEditor({
    extensions: [
      StarterKit,
      TableKit,
      Image,
      Math,
      Typography
    ],
    content: ``,
    autofocus: true,
    editable: true,
    injectCSS: false,
  });

  const editorState = useMemo(() => ({ editor }), [editor])


  return (
    <div className="w-[75%] min-w-[400px] max-w-[800px] h-screen mt-[100px] [&>textarea]:h-full [&>div.ProseMirror]:w-full">
      {/* <NotesToolbarComponent /> */}
      <EditorContext.Provider value={editorState}>
        <EditorContent editor={editor} />
        <BubbleMenu
          editor={editor}
          options={{
            offset: 10,
            autoPlacement: true,
            strategy: "absolute"
          }}
        >
          <BubbleMenuComponent />
        </BubbleMenu>
      </EditorContext.Provider>
    </div>
  )
}

export default NotesEditorComponent