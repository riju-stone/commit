import { motion } from "motion/react"
import { Editor, FillStyle, Shape, Text, Box, HorzAlign, VertAlign } from "@dgmjs/core"
import { DGMEditor, TiptapEditor } from "@dgmjs/react"
import WhiteboardToolbarComponent from "../components/custom/whiteboard/toolbar"
import { useState, useRef, useEffect, useCallback } from "react"
import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  ItalicIcon,
  ListIcon,
  ListOrderedIcon,
  PaletteIcon,
  StrikethroughIcon,
  UnderlineIcon,
} from "lucide-react";
import FloatingToolbar from "@/components/custom/whiteboard/floating-toolbar"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { ColorPalette, simplePalette } from "@/components/custom/whiteboard/color-pallete"
import { Toggle } from "@/components/ui/toggle"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const DEFAULT_FONT_SIZE = 16;

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

export function TextInplaceEditorToolbar({
  tiptapEditor,
  darkMode,
  shape,
}: {
  tiptapEditor: TiptapEditor;
  darkMode: boolean;
  shape: Box | null;
}) {
  const [state, setState] = useState({
    fontSize: DEFAULT_FONT_SIZE.toString(),
    bold: false,
    italic: false,
    underline: false,
    strike: false,
    bulletList: false,
    orderedList: false,
    textAlign: "left",
  });

  useEffect(() => {
    tiptapEditor.on("transaction", (tr) => {
      setState({
        fontSize:
          tr.editor.getAttributes("textStyle").fontSize?.trim().slice(0, -2) ??
          shape?.fontSize.toString() ??
          DEFAULT_FONT_SIZE.toString(),
        bold: tr.editor.isActive("bold"),
        italic: tr.editor.isActive("italic"),
        underline: tr.editor.isActive("underline"),
        strike: tr.editor.isActive("strike"),
        bulletList: tr.editor.isActive("bulletList"),
        orderedList: tr.editor.isActive("orderedList"),
        textAlign: tr.editor.getAttributes("paragraph").textAlign || "left",
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="h-8 rounded-md p-0 gap-0 flex items-center bg-[rgba(34, 40, 49, 0.8)] backdrop-blur-2xl drop-shadow-lg border-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost"
            className="h-8 w-8 px-2 rounded-r-none"
          >
            <PaletteIcon size={16} />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          sideOffset={8}
          className="w-fit bg-slate-950 z-10000"
        >
          <ColorPalette
            theme={darkMode ? "dark" : "light"}
            palette={simplePalette}
            onClick={(value: any) => {
              (tiptapEditor.chain().focus() as any).setColor(value).run();
            }}
          />
        </PopoverContent>
      </Popover>
      <Toggle
        className="w-8 h-8 px-2 border-y rounded-none"
        pressed={state.bold}
        onPressedChange={() =>
          (tiptapEditor.chain().focus() as any).toggleBold().run()
        }
      >
        <BoldIcon size={16} />
      </Toggle>
      <Toggle
        className="w-8 h-8 px-2 border-y rounded-none"
        pressed={state.italic}
        onPressedChange={() =>
          (tiptapEditor.chain().focus() as any).toggleItalic().run()
        }
      >
        <ItalicIcon size={16} />
      </Toggle>
      <Toggle
        className="w-8 h-8 px-2 border-y rounded-none"
        pressed={state.underline}
        onPressedChange={() =>
          (tiptapEditor.chain().focus() as any).toggleUnderline().run()
        }
      >
        <UnderlineIcon size={16} />
      </Toggle>
      <Toggle
        className="w-8 h-8 px-2 border-y rounded-none"
        pressed={state.strike}
        onPressedChange={() =>
          (tiptapEditor.chain().focus() as any).toggleStrike().run()
        }
      >
        <StrikethroughIcon size={16} />
      </Toggle>
      <Toggle
        className="w-8 h-8 px-2 border-l border-y rounded-none"
        pressed={state.bulletList}
        onPressedChange={() =>
          (tiptapEditor.chain().focus() as any).toggleBulletList().run()
        }
      >
        <ListIcon size={16} />
      </Toggle>
      <Toggle
        className="w-8 h-8 px-2 border-y rounded-none"
        pressed={state.orderedList}
        onPressedChange={() =>
          (tiptapEditor.chain().focus() as any).toggleOrderedList().run()
        }
      >
        <ListOrderedIcon size={16} />
      </Toggle>
      <ToggleGroup
        type="single"
        className="border-none h-8 gap-0"
        value={state.textAlign}
        onValueChange={(value) => {
          (tiptapEditor.chain().focus() as any).setTextAlign(value).run();
        }}
      >
        <ToggleGroupItem
          size="sm"
          value="left"
          className="w-8 h-8 px-2 border-l border-y rounded-none"
        >
          <AlignLeftIcon size={16} />
        </ToggleGroupItem>
        <ToggleGroupItem
          size="sm"
          value="center"
          className="w-8 h-8 px-2 border-y rounded-none"
        >
          <AlignCenterIcon size={16} />
        </ToggleGroupItem>
        <ToggleGroupItem
          size="sm"
          value="right"
          className="w-8 h-8 px-2 border-y rounded-none"
        >
          <AlignRightIcon size={16} />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}

function WhiteboardView() {
  const [editor, setEditor] = useState<Editor | null>(null);
  const [activeHandler, setActiveHandler] = useState<string>('Select');
  const [gridState, setGridState] = useState({ origin: [0, 0], scale: 1 });
  const [tiptapEditor, setTiptapEditor] = useState<any>(null);
  const [editingText, setEditingText] = useState<Box | null>(null);
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
          darkMode={true}
          className="w-full h-screen [&_canvas]:w-screen [&_canvas]:h-full"
          options={{ canvasColor: "rgba(34, 40, 49, 1)" }}
          onMount={handleEditorMount}
          onShapeInitialize={handleShapeInitialize}
          onActiveHandlerChange={(handler) => setActiveHandler(handler)}
          onScroll={handleScroll}
          onZoom={handleZoom}
          floatingToolbar={<FloatingToolbar />}
          textInplaceEditorToolbar={
            <TextInplaceEditorToolbar
              darkMode={true}
              tiptapEditor={tiptapEditor}
              shape={editingText}
            />
          }
          onTextInplaceEditorMount={(tiptapEditor) => {
            setTiptapEditor(tiptapEditor);
          }}
          onTextInplaceEditorOpen={(shape) => {
            setEditingText(shape as Box);
          }}
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
