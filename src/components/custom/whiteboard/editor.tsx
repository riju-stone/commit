import { useWhiteboardStore } from '@/store/whiteboardStore';
import { Box, Editor, FillStyle, HorzAlign, Shape, VertAlign } from '@dgmjs/core';
import { DGMEditor, TiptapEditor } from '@dgmjs/react';
import { useCallback, useRef } from 'react'

function WhiteBoardEditorComponent() {
  const {
    editor,
    setEditor,
    setCurrentSelection,
    setActiveHandler,
    setGridOrigin,
    setGridScale,
  } = useWhiteboardStore();

  const tiptapEditorRef = useRef<TiptapEditor | null>(null);

  const handleEditorMount = async (editorInstance: Editor) => {
    editorInstance.newDoc()
    setEditor(editorInstance)
    editorInstance.fitToScreen()

    // Initialize grid state from editor
    if (editorInstance.canvas) {
      setGridOrigin(editorInstance.canvas.origin);
      setGridScale(editorInstance.canvas.scale);
    }
  }

  const handleShapeInitialize = (shape: Shape) => {
    shape.fillStyle =
      shape instanceof Text ? FillStyle.NONE : FillStyle.HACHURE;

    shape.fillColor = 'rgba(255, 255, 255, 0.2)';
    shape.fontFamily = 'Gloria Hallelujah';
    shape.strokeColor = "rgba(255, 255, 255, 1)";
    shape.fontSize = 20;
    shape.fontColor = "#fff";
    shape.roughness = 1;

    // Center align text in Box-based shapes (Rectangle, Ellipse, etc.)
    if (shape instanceof Box || shape.type === "Rectangle" || shape.type === "Ellipse") {
      const boxShape = shape as Box;
      boxShape.horzAlign = HorzAlign.CENTER;
      boxShape.vertAlign = VertAlign.MIDDLE;
    }
  };

  const handleScroll = useCallback((origin: number[]) => {
    setGridOrigin(origin);
  }, [setGridOrigin]);

  const handleZoom = useCallback((scale: number) => {
    // Also get the current origin when zooming
    if (editor?.canvas) {
      setGridOrigin(editor.canvas.origin);
      setGridScale(scale);
    }
  }, [editor, setGridOrigin, setGridScale]);

  const handleTextInplaceEditorMount = (tiptapEditor: TiptapEditor) => {
    tiptapEditorRef.current = tiptapEditor;
  };

  const handleTextInplaceEditorOpen = (shape: Box) => {
    // Set center alignment on the shape when text editing starts
    if (editor && (shape.horzAlign !== HorzAlign.CENTER || shape.vertAlign !== VertAlign.MIDDLE)) {
      editor.actions.update({
        horzAlign: HorzAlign.CENTER,
        vertAlign: VertAlign.MIDDLE,
      }, [shape]);
    }

    // Also set the Tiptap editor's text alignment to center
    if (tiptapEditorRef.current) {
      // Small delay to ensure the editor is ready
      setTimeout(() => {
        // Cast to any to access setTextAlign command which may not be in type definitions
        (tiptapEditorRef.current as any)?.commands?.setTextAlign?.('center');
      }, 0);
    }
  };

  return (

    <DGMEditor
      darkMode={true}
      className="w-full h-screen [&_canvas]:w-screen [&_canvas]:h-full"
      options={{
        canvasColor: "rgba(34, 40, 49, 1)",
        showDOM: true,
        keymapEventTarget: window,
        imageResize: {
          quality: 1,
          maxWidth: 2800,
          maxHeight: 2800,
        },
      }}
      snapToObjects={true}
      onMount={handleEditorMount}
      onShapeInitialize={handleShapeInitialize}
      onActiveHandlerChange={(handler) => setActiveHandler(handler)}
      onScroll={handleScroll}
      onZoom={handleZoom}
      onSelectionChange={setCurrentSelection}
      onTextInplaceEditorMount={handleTextInplaceEditorMount}
      onTextInplaceEditorOpen={handleTextInplaceEditorOpen}
    />
  )
}

export default WhiteBoardEditorComponent