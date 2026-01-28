import { useWhiteboardStore } from '@/store/whiteboardStore';
import type { Transaction } from '@dgmjs/core';
import { AssignMutation, Box, Editor, FillStyle, HorzAlign, macro, Shape, Text as TextShape, VertAlign } from '@dgmjs/core';
import { DGMEditor } from '@dgmjs/react';
import { useCallback, useEffect } from 'react';
import { ensureTextAlignInDoc } from '@/utils/whiteboard';

let isApplyingTextAlignFixup = false;

function WhiteBoardEditorComponent() {
  // Use selective subscriptions to prevent unnecessary re-renders
  const editor = useWhiteboardStore((state) => state.editor);
  const darkMode = useWhiteboardStore((state) => state.darkMode);
  const setEditor = useWhiteboardStore((state) => state.setEditor);
  const setCurrentSelection = useWhiteboardStore((state) => state.setCurrentSelection);
  const setActiveHandler = useWhiteboardStore((state) => state.setActiveHandler);
  const setGridOrigin = useWhiteboardStore((state) => state.setGridOrigin);
  const setGridScale = useWhiteboardStore((state) => state.setGridScale);

  useEffect(() => {
    if (!editor) return;
    const handler = (tx: Transaction) => {
      if (isApplyingTextAlignFixup) return;
      const fixups: { shape: InstanceType<typeof Box>; patched: unknown }[] = [];
      for (const mut of tx.mutations) {
        if (!(mut instanceof AssignMutation) || mut.field !== 'text') continue;
        const obj = mut.obj;
        if (!(obj instanceof Box)) continue;
        const raw = obj.text;
        if (typeof raw !== 'object' || raw?.type !== 'doc') continue;
        const horzAlign = obj.horzAlign ?? HorzAlign.CENTER;
        const patched = ensureTextAlignInDoc(raw, horzAlign);
        if (JSON.stringify(patched) === JSON.stringify(raw)) continue;
        fixups.push({ shape: obj, patched });
      }
      if (fixups.length === 0) return;
      isApplyingTextAlignFixup = true;
      try {
        const page = editor.getCurrentPage();
        if (page && editor.canvas) {
          editor.transform.transact((t) => {
            for (const { shape, patched } of fixups) {
              t.assign(shape, 'text', patched);
            }
            macro.resolveAllConstraints(t, page, editor.canvas);
          });
        }
      } finally {
        isApplyingTextAlignFixup = false;
      }
    };
    const disposable = editor.transform.onTransaction.addListener(handler);
    return () => disposable.dispose();
  }, [editor]);

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

    shape.fillColor = '$gray10';
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
      className="w-full h-screen [&_canvas]:w-screen [&_canvas]:h-full"
      options={{
        canvasColor: "#28282B",
        allowCreateTextOnConnector: true,
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
      onSelectionChange={handleSelectionChange}
    />
  )
}

export default WhiteBoardEditorComponent