import { useWhiteboardStore } from '@/store/whiteboardStore';
import { Box, Editor, FillStyle, HorzAlign, Shape, Text as TextShape, VertAlign } from '@dgmjs/core';
import { DGMEditor, TiptapEditor } from '@dgmjs/react';
import { useCallback, useEffect, useRef } from 'react'

function WhiteBoardEditorComponent() {
  // Use selective subscriptions to prevent unnecessary re-renders
  const editor = useWhiteboardStore((state) => state.editor);
  const darkMode = useWhiteboardStore((state) => state.darkMode);
  const setEditor = useWhiteboardStore((state) => state.setEditor);
  const setCurrentSelection = useWhiteboardStore((state) => state.setCurrentSelection);
  const setActiveHandler = useWhiteboardStore((state) => state.setActiveHandler);
  const setGridOrigin = useWhiteboardStore((state) => state.setGridOrigin);
  const setGridScale = useWhiteboardStore((state) => state.setGridScale);

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
      shape instanceof TextShape ? FillStyle.NONE : FillStyle.HACHURE;

    shape.fillColor = 'rgba(255, 255, 255, 0.2)';
    shape.fontFamily = 'Gloria Hallelujah';
    shape.strokeColor = "rgba(255, 255, 255, 1)";
    shape.fontSize = 20;
    shape.fontColor = "#fff";
    shape.roughness = 1;
  };

  const handleSelectionChange = (selection: Shape[]) => {
    setCurrentSelection(selection);
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

  return (

    <DGMEditor
      darkMode={darkMode}
      className="w-full h-screen [&_canvas]:w-screen [&_canvas]:h-full [&_canvas]:bg-background"
      options={{
        canvasColor: "#222831",
        showDOM: true,
        keymapEventTarget: window,
        imageResize: {
          quality: 1,
          maxWidth: 2800,
          maxHeight: 2800,
        },
      }}
      // snapToObjects={true}
      onMount={handleEditorMount}
      onShapeInitialize={handleShapeInitialize}
      onActiveHandlerChange={(handler) => setActiveHandler(handler)}
      onScroll={handleScroll}
      onZoom={handleZoom}
      onSelectionChange={handleSelectionChange}
    />
  )
}

export default WhiteBoardEditorComponent