import { motion } from "motion/react"
import { Editor, FillStyle, Shape, Text, Box, HorzAlign, VertAlign } from "@dgmjs/core"
import { DGMEditor } from "@dgmjs/react"
import WhiteboardToolbarComponent from "../components/custom/whiteboard/toolbar"
import { useState, useRef, useEffect, useCallback } from "react"

const WHITEBOARD_VIEW_ANIMATION = {
  initial: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
  transition: {
    duration: 0.5,
    ease: "easeInOut",
  },
}

// Grid configuration
const GRID_SIZE = 20; // Base grid spacing in pixels
const DOT_RADIUS = 1; // Radius of each dot
const DOT_COLOR = "rgba(255, 255, 255, 0.12)"; // Subtle white dots

interface DottedGridOverlayProps {
  origin: number[];
  scale: number;
}

function DottedGridOverlay({ origin, scale }: DottedGridOverlayProps) {
  // Calculate the scaled grid size
  const scaledGridSize = GRID_SIZE * scale;

  // Calculate offset based on origin (pan position) and scale
  const offsetX = (origin[0] * scale) % scaledGridSize;
  const offsetY = (origin[1] * scale) % scaledGridSize;

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    >
      <defs>
        <pattern
          id="dotted-grid-pattern"
          x={offsetX}
          y={offsetY}
          width={scaledGridSize}
          height={scaledGridSize}
          patternUnits="userSpaceOnUse"
        >
          <circle
            cx={scaledGridSize / 2}
            cy={scaledGridSize / 2}
            r={DOT_RADIUS * Math.min(scale, 1.5)}
            fill={DOT_COLOR}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dotted-grid-pattern)" />
    </svg>
  );
}

function WhiteboardView() {
  const [editor, setEditor] = useState<Editor | null>(null);
  const [activeHandler, setActiveHandler] = useState<string>('Select');
  const [gridState, setGridState] = useState({ origin: [0, 0], scale: 1 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!editor || !containerRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      editor.fit();
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [editor]);

  const handleEditorMount = async (editor: Editor) => {
    editor.newDoc()
    setEditor(editor)
    editor.fitToScreen()

    // Initialize grid state from editor
    if (editor.canvas) {
      setGridState({
        origin: editor.canvas.origin,
        scale: editor.canvas.scale,
      });
    }
  }

  const handleShapeInitialize = (shape: Shape) => {
    shape.fillStyle =
      shape instanceof Text ? FillStyle.NONE : FillStyle.HACHURE;
    shape.fillColor = '$green6';
    shape.fontFamily = 'Gloria Hallelujah';
    shape.strokeColor = "#fff";
    shape.fontSize = 20;
    shape.fontColor = "#fff";
    shape.roughness = 1;

    // Center align text for Box-based shapes (Rectangle, Ellipse, etc.)
    if (shape instanceof Box) {
      shape.horzAlign = HorzAlign.CENTER;
      shape.vertAlign = VertAlign.MIDDLE;
    }
  };

  const handleScroll = useCallback((origin: number[]) => {
    setGridState(prev => ({ ...prev, origin }));
  }, []);

  const handleZoom = useCallback((scale: number) => {
    // Also get the current origin when zooming
    if (editor?.canvas) {
      setGridState({ origin: editor.canvas.origin, scale });
    }
  }, [editor]);

  return (
    <div className="grow w-full h-screen bg-transparent flex items-center justify-center overflow-hidden text-white" ref={containerRef}>
      <motion.div layout className="w-full h-screen relative" variants={WHITEBOARD_VIEW_ANIMATION} initial="initial" animate="visible" exit="initial">
        <DGMEditor
          className="w-full h-screen [&_canvas]:w-screen [&_canvas]:h-full"
          options={{ canvasColor: "rgba(34, 40, 49, 1)" }}
          onMount={handleEditorMount}
          onShapeInitialize={handleShapeInitialize}
          onActiveHandlerChange={(handler) => setActiveHandler(handler)}
          onScroll={handleScroll}
          onZoom={handleZoom}
        />
        <DottedGridOverlay
          origin={gridState.origin}
          scale={gridState.scale}
        />
        <WhiteboardToolbarComponent
          editor={editor}
          activeHandler={activeHandler}
          onActiveHandlerChange={(handler) => {
            setActiveHandler(handler)
            editor?.activateHandler(handler)
          }} />
      </motion.div>
    </div>
  )
}

export default WhiteboardView
