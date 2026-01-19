import { Editor, EditorContent, EditorContext, useEditor } from "@tiptap/react"
import { StarterKit } from "@tiptap/starter-kit";
import { TableKit } from "@tiptap/extension-table"
import { Image } from "@tiptap/extension-image"
import Math from "@tiptap/extension-mathematics"
import Typography from "@tiptap/extension-typography"
import TextAlign from "@tiptap/extension-text-align"
import TextStyle from "@tiptap/extension-text-style"
import { TaskList, TaskItem } from "@tiptap/extension-list"
import { BubbleMenu } from "@tiptap/react/menus"
import BubbleMenuComponent from "./menus/bubble"
import { useMemo } from "react"
import ToolbarComponent from "./menus/toolbar"

function NotesEditorComponent() {

  const customTaskItem = TaskItem.extend({
    content: "inline*",
  })

  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    extensions: [
      StarterKit,
      TableKit.configure({
        table: { resizable: true }
      }),
      Image,
      Math,
      Typography,
      TextAlign,
      TextStyle.configure({

      }),
      TaskList,
      customTaskItem.configure({
        nested: true,
      })
    ],
    content: ``,
    editorProps: {
      attributes: {
        class: 'text-white',
        spellcheck: 'false',
        autocapitalize: 'off',
        autocorrect: 'off',
      }
    },
    autofocus: true,
    editable: true,
    // injectCSS: false,
  });

  const editorState = useMemo(() => ({ editor }), [editor])

  return (
    <div className="w-[75%] min-w-[400px] max-w-[800px] h-screen mt-[100px] [&>textarea]:h-full [&>div.ProseMirror]:w-full">
      <EditorContext.Provider value={editorState}>
        <EditorContent editor={editor} />
        <BubbleMenu
          editor={editor as Editor}
          options={{
            offset: 10,
            autoPlacement: true,
            strategy: "absolute"
          }}
        >
          <BubbleMenuComponent />
        </BubbleMenu>
        <ToolbarComponent />
      </EditorContext.Provider>
    </div>
  )
}

export default NotesEditorComponent