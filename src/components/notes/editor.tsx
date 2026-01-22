import { Editor, EditorContent, useEditor } from "@tiptap/react"
import { StarterKit } from "@tiptap/starter-kit";
import { TableKit } from "@tiptap/extension-table"
import { Image } from "@tiptap/extension-image"
import { ImageUploadNode } from '@/lib/image-upload-node'
import Math from "@tiptap/extension-mathematics"
import Typography from "@tiptap/extension-typography"
import TextAlign from "@tiptap/extension-text-align"
import { TextStyle } from "@tiptap/extension-text-style"
import TaskList from "@tiptap/extension-task-list"
import TaskItem from "@tiptap/extension-task-item"
import { BubbleMenu } from "@tiptap/react/menus"
import BubbleMenuComponent from "./menus/bubble"
import { useEffect, useRef } from "react"
import ToolbarComponent from "./menus/toolbar"
import { handleImageUpload } from "@/lib/tiptap-utils";
import { useNoteStore } from "@/store/noteStore";

// Define custom TaskItem extension outside component to prevent recreation on each render
const CustomTaskItem = TaskItem.extend({
  content: "inline*",
})

function NotesEditorComponent() {
  const setEditor = useNoteStore((state) => state.setEditor)
  const isDirtyRef = useRef(false)

  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    extensions: [
      StarterKit,
      TableKit.configure({
        table: { resizable: true }
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
        resize: {
          enabled: true,
          directions: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
          minWidth: 50,
          minHeight: 50,
          alwaysPreserveAspectRatio: true,
        }
      }),
      ImageUploadNode.configure({
        accept: 'image/*',
        maxSize: 1024 * 1024 * 5, // 5MB
        limit: 1,
        upload: handleImageUpload,
        onError: (error) => console.error('Upload failed:', error),
      }),
      Math,
      Typography,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
        defaultAlignment: 'left',
      }),
      TextStyle,
      TaskList.configure({
        HTMLAttributes: {
          class: 'task-list',
        },
      }),
      CustomTaskItem.configure({
        nested: true,
        HTMLAttributes: {
          class: 'task-item',
        },
      }),
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
  });

  // Sync editor instance with the store
  useEffect(() => {
    if (editor) {
      setEditor(editor)
    }
    return () => {
      setEditor(null)
    }
  }, [editor, setEditor])

  // Reset dirty ref when document is saved
  useEffect(() => {
    const unsubscribe = useNoteStore.subscribe(
      (state) => state.isDirty,
      (isDirty) => {
        if (!isDirty) {
          isDirtyRef.current = false
        }
      }
    )
    return unsubscribe
  }, [])

  return (
    <div className="w-[75%] min-w-[400px] max-w-[800px] h-screen mt-[100px] [&>textarea]:h-full [&>div.ProseMirror]:w-full">
      <EditorContent editor={editor} />
      <BubbleMenu
        editor={editor as unknown as Editor}
        options={{
          offset: 10,
          autoPlacement: true,
          strategy: "absolute"
        }}
      >
        <BubbleMenuComponent />
      </BubbleMenu>
      <ToolbarComponent />
    </div>
  )
}

export default NotesEditorComponent