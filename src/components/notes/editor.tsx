import { EditorContent, useEditor } from "@tiptap/react";
import { TableKit } from "@tiptap/extension-table";
import { Image } from "@tiptap/extension-image";
import { ImageUploadNode } from "@/lib/image-upload-node";
import Math from "@tiptap/extension-mathematics";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { BubbleMenu } from "@tiptap/react/menus";
import BubbleMenuComponent from "./menus/bubble";
import { useEffect, useRef } from "react";
import ToolbarComponent from "./menus/toolbar";
import { handleImageUpload } from "@/lib/tiptap-utils";
import { useNoteStore } from "@/store/noteStore";
import { StarterKit } from "@tiptap/starter-kit";

function NotesEditorComponent() {
  const setEditor = useNoteStore((state) => state.setEditor);
  const isDirtyRef = useRef(false);

  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    extensions: [
      StarterKit,
      TableKit.configure({
        table: { resizable: true },
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
        resize: {
          enabled: true,
          directions: ["top-left", "top-right", "bottom-left", "bottom-right"],
          minWidth: 50,
          minHeight: 50,
          alwaysPreserveAspectRatio: true,
        },
      }),
      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: 1024 * 1024 * 5, // 5MB
        limit: 1,
        upload: handleImageUpload,
        onError: (error) => console.error("Upload failed:", error),
      }),
      Math,
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
        defaultAlignment: "left",
      }),
      TextStyle,
    ],
    content: ``,
    editorProps: {
      attributes: {
        class: "text-white",
        spellcheck: "true",
        autocapitalize: "off",
        autocorrect: "off",
      },
    },
    autofocus: true,
    editable: true,
  });

  useEffect(() => {
    if (editor) {
      setEditor(editor);
    }
    return () => {
      setEditor(null);
    };
  }, [editor, setEditor]);

  useEffect(() => {
    const unsubscribe = useNoteStore.subscribe(
      (state) => state.isDirty,
      (isDirty) => {
        if (!isDirty) {
          isDirtyRef.current = false;
        }
      },
    );
    return unsubscribe;
  }, []);

  return (
    <>
      <EditorContent editor={editor} className="note-editor h-screen w-[75%]" />
      {editor && (
        <BubbleMenu
          editor={editor}
          options={{
            offset: 10,
            autoPlacement: true,
            strategy: "absolute",
          }}
        >
          <BubbleMenuComponent />
        </BubbleMenu>
      )}
      <ToolbarComponent />
    </>
  );
}

export default NotesEditorComponent;
