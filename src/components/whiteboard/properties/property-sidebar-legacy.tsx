import { FillStyle, HorzAlignEnum, Shape, VertAlignEnum, Line, LineEndTypeEnum, Box } from "@dgmjs/core";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  AlignStartVertical,
  AlignCenterVertical,
  AlignEndVertical,
  MoveRight,
  Triangle,
  Minus,
  TextAlignStart,
  TextAlignCenter,
  TextAlignEnd,
  Palette,
  PenLine,
  Type,
  Layers,
  ArrowLeftRight,
  Circle,
  Italic,
  Bold,
  Pencil,
  ChevronDown,
} from "lucide-react";
import { useWhiteboardStore } from "@/store/whiteboardStore";
import { useState } from "react";

const strokePatterns = {
  solid: [0, 0],
  dashed: [10, 10],
  dotted: [1, 5],
};

const fontFamilies = [
  "Gloria Hallelujah",
  "Inter",
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat",
  "Poppins",
  "Source Code Pro",
];

// Shared slider styling classes
const sliderClassName = "w-full **:data-[slot=slider-track]:bg-white/10 **:data-[slot=slider-range]:bg-white/60 **:data-[slot=slider-thumb]:border-white/60 **:data-[slot=slider-thumb]:bg-white/90";

// Shape type detection helpers
function isBoxShape(shapes: Shape[]): boolean {
  return shapes.some((shape) => shape instanceof Box);
}

function isLineShape(shapes: Shape[]): boolean {
  return shapes.some((shape) => shape instanceof Line);
}

// Check if shapes support alignment (Box-based shapes like Rectangle, Ellipse, Text)
function supportsAlignment(shapes: Shape[]): boolean {
  return isBoxShape(shapes);
}

// Check if shapes support corner radius (Rectangle shapes)
function supportsCornerRadius(shapes: Shape[]): boolean {
  return shapes.some((shape) => shape instanceof Box && shape.type === "Rectangle");
}

// Check if shapes support text properties (shapes with text content)
function supportsTextProperties(shapes: Shape[]): boolean {
  return shapes.some((shape) => shape instanceof Box);
}

// Check if shapes support fill properties (not lines)
function supportsFillProperties(shapes: Shape[]): boolean {
  return shapes.some((shape) => !(shape instanceof Line));
}



interface PropertySectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function PropertySection({ title, icon, children }: PropertySectionProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 text-white/60 text-xs font-medium uppercase tracking-wider">
        {icon}
        <span>{title}</span>
      </div>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

interface CollapsibleSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function CollapsibleSection({ title, defaultOpen = true, children }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-white/90 text-sm font-semibold hover:text-white transition-colors"
      >
        <span>{title}</span>
        <ChevronDown
          size={16}
          className={`text-white/40 transition-transform ${isOpen ? "" : "-rotate-90"}`}
        />
      </button>
      {isOpen && <div className="flex flex-col gap-3">{children}</div>}
    </div>
  );
}

const pageSizeOptions = [
  { value: "infinite", label: "Infinite" },
  { value: "a4", label: "A4 (210 × 297 mm)" },
  { value: "a3", label: "A3 (297 × 420 mm)" },
  { value: "letter", label: "Letter (8.5 × 11 in)" },
  { value: "1920x1080", label: "HD (1920 × 1080)" },
  { value: "1280x720", label: "720p (1280 × 720)" },
  { value: "custom", label: "Custom" },
];

function PageProperties() {
  const { editor } = useWhiteboardStore();
  const [pageSize, setPageSize] = useState("infinite");

  // Get the current page name from the editor
  const currentPage = editor?.getCurrentPage();
  const pageName = currentPage?.name || "Page 1";

  return (
    <div className="flex flex-col gap-4 p-3 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent  mt-[40px]">
      <CollapsibleSection title="Page Name">
        <Input
          type="text"
          value={pageName}
          onChange={(e) => {
            if (currentPage && editor) {
              editor.actions.update({ name: e.target.value }, [currentPage]);
            }
          }}
          placeholder="Page name"
          className="w-full h-9 px-3 text-sm bg-white/5 border-white/10 text-white/80 rounded-md focus:outline-none focus:ring-1 focus:ring-white/30"
        />
        {/* Page Size */}
        <div className="flex flex-col gap-1">
          <span className="text-white/40 text-[10px]">Size</span>
          <div className="relative">
            <select
              value={pageSize}
              onChange={(e) => setPageSize(e.target.value)}
              className="w-full h-9 px-3 pr-8 text-sm bg-white/5 border border-white/10 rounded-md text-white/80 focus:outline-none focus:ring-1 focus:ring-white/30 appearance-none cursor-pointer"
            >
              {pageSizeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none"
            />
          </div>
        </div>
      </CollapsibleSection>
    </div>
  );
}

function PropertySidebar() {
  const { editor, currentSelection, setCurrentSelection } = useWhiteboardStore();

  // Show page properties when no shape is selected
  if (currentSelection.length === 0) {
    return <PageProperties />;
  }

  // Determine which controls to show based on selected shape types
  const showAlignmentControls = supportsAlignment(currentSelection);
  const showLineEndControls = isLineShape(currentSelection);
  const showCornerRadius = supportsCornerRadius(currentSelection);
  const showFillControls = supportsFillProperties(currentSelection);
  const showTextControls = supportsTextProperties(currentSelection);

  // Get the shape type(s) for display
  const shapeTypes = [...new Set(currentSelection.map((s) => s.type))];
  const shapeTypeLabel =
    currentSelection.length === 1
      ? currentSelection[0].name || currentSelection[0].type
      : `${currentSelection.length} shapes selected`;

  return (
    <div className="flex flex-col gap-4 p-3 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent pt-[30px]">
      {/* Header */}
      <div className="flex flex-col gap-1 pb-2 border-b border-white/10">
        <h3 className="text-white/90 text-sm font-semibold truncate">{shapeTypeLabel}</h3>
        {currentSelection.length > 1 && (
          <span className="text-white/40 text-xs">{shapeTypes.join(", ")}</span>
        )}
      </div>

      {/* Stroke Section */}
      <PropertySection title="Stroke" icon={<PenLine size={12} />}>
        {/* Stroke Pattern */}
        <div className="flex flex-col gap-1">
          {/* <span className="text-white/40 text-[12px]">Shape Fill Style</span> */}
          <ToggleGroup
            value={
              currentSelection.length === 1
                ? Object.entries(strokePatterns).find(
                  ([, v]) => v[0] === currentSelection[0].strokePattern[0]
                )?.[0] || "solid"
                : "solid"
            }
            type="single"
            className="h-[25px] bg-white/5 border border-white/10 rounded-sm w-[50%] justify-start"
            onValueChange={(value: string) => {
              if (!value) return;
              currentSelection.forEach((shape: Shape) => {
                editor?.actions.update(
                  { strokePattern: [...strokePatterns[value as keyof typeof strokePatterns]] },
                  [shape]
                );
              });
              setCurrentSelection(editor?.selection.shapes as Shape[]);
            }}
          >
            <ToggleGroupItem value="solid" className="h-full flex-1 hover:bg-black/60 rounded-sm">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
                <path d="M4 12h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </ToggleGroupItem>
            <ToggleGroupItem value="dashed" className="h-full flex-1 hover:bg-black/60 rounded-sm">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
                <path
                  d="M4 12h16"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeDasharray="4 7"
                />
              </svg>
            </ToggleGroupItem>
            <ToggleGroupItem value="dotted" className="h-full flex-1 hover:bg-black/60 rounded-sm">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
                <path
                  d="M4 12h16"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeDasharray="1 4"
                />
              </svg>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {/* Stroke Width with Slider */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-white/40 text-[10px]">Width</span>
            <Input
              type="number"
              min={0.5}
              max={10}
              step={0.5}
              value={currentSelection.length === 1 ? currentSelection[0].strokeWidth : 2}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                if (isNaN(value)) return;
                currentSelection.forEach((shape: Shape) => {
                  editor?.actions.update({ strokeWidth: value }, [shape]);
                });
                setCurrentSelection(editor?.selection.shapes as Shape[]);
              }}
              className="w-16 h-6 text-xs bg-white/5 border-white/10 text-white/80"
            />
          </div>
          <Slider
            min={0.5}
            max={10}
            step={0.5}
            value={[currentSelection.length === 1 ? currentSelection[0].strokeWidth : 2]}
            onValueChange={(value) => {
              currentSelection.forEach((shape: Shape) => {
                editor?.actions.update({ strokeWidth: value[0] }, [shape]);
              });
              setCurrentSelection(editor?.selection.shapes as Shape[]);
            }}
            className={sliderClassName}
          />
        </div>
      </PropertySection>

      {/* Roughness Section */}
      <PropertySection title="Roughness" icon={<Pencil size={12} />}>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-white/40 text-[10px]">Amount</span>
            <Input
              type="number"
              min={0}
              max={3}
              step={0.1}
              value={currentSelection.length === 1 ? currentSelection[0].roughness : 1}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                if (isNaN(value)) return;
                currentSelection.forEach((shape: Shape) => {
                  editor?.actions.update({ roughness: value }, [shape]);
                });
                setCurrentSelection(editor?.selection.shapes as Shape[]);
              }}
              className="w-16 h-6 text-xs bg-white/5 border-white/10 text-white/80"
            />
          </div>
          <Slider
            min={0}
            max={3}
            step={0.1}
            value={[currentSelection.length === 1 ? currentSelection[0].roughness : 1]}
            onValueChange={(value) => {
              currentSelection.forEach((shape: Shape) => {
                editor?.actions.update({ roughness: value[0] }, [shape]);
              });
              setCurrentSelection(editor?.selection.shapes as Shape[]);
            }}
            className={sliderClassName}
          />
          <div className="flex justify-between text-[9px] text-white/30">
            <span>Smooth</span>
            <span>Sketchy</span>
          </div>
        </div>
      </PropertySection>

      {/* Fill Section - only for non-line shapes */}
      {showFillControls && (
        <PropertySection title="Fill" icon={<Layers size={12} />}>
          <div className="flex flex-col gap-1">
            <span className="text-white/40 text-[10px]">Style</span>
            <ToggleGroup
              type="single"
              value={
                currentSelection.length === 1
                  ? currentSelection[0].fillStyle.toUpperCase().split("-").join("_")
                  : "SOLID"
              }
              className="bg-white/5 border border-white/10 rounded-md w-full justify-start"
              onValueChange={(value: string) => {
                if (!value) return;
                currentSelection.forEach((shape: Shape) => {
                  editor?.actions.update(
                    { fillStyle: FillStyle[value as keyof typeof FillStyle] },
                    [shape]
                  );
                });
                setCurrentSelection(editor?.selection.shapes as Shape[]);
              }}
            >
              <ToggleGroupItem value="CROSS_HATCH" className="flex-1 hover:bg-black/60" title="Cross Hatch">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="none">
                  <rect x="5" y="5" width="14" height="14" rx="1" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M13 5L5 13" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                  <path d="M19 11L11 19" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                  <path d="M18 6L6 18" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                  <path d="M11 5L19 13" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                  <path d="M5 11L13 19" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                  <path d="M6 6L18 18" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                </svg>
              </ToggleGroupItem>
              <ToggleGroupItem value="HACHURE" className="flex-1 hover:bg-black/60" title="Hachure">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="none">
                  <rect x="5" y="5" width="14" height="14" rx="1" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M13 5L5 13" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                  <path d="M19 11L11 19" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                  <path d="M18 6L6 18" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                </svg>
              </ToggleGroupItem>
              <ToggleGroupItem value="SOLID" className="flex-1 hover:bg-black/60" title="Solid">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="none">
                  <rect x="5" y="5" width="14" height="14" rx="1" fill="currentColor" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </ToggleGroupItem>
              <ToggleGroupItem value="NONE" className="flex-1 hover:bg-black/60" title="None">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="none">
                  <rect x="5" y="5" width="14" height="14" rx="1" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* Opacity with Slider */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-white/40 text-[10px]">Opacity</span>
              <span className="text-white/60 text-[10px]">
                {Math.round((currentSelection.length === 1 ? currentSelection[0].opacity : 1) * 100)}%
              </span>
            </div>
            <Slider
              min={0}
              max={1}
              step={0.05}
              value={[currentSelection.length === 1 ? currentSelection[0].opacity : 1]}
              onValueChange={(value) => {
                currentSelection.forEach((shape: Shape) => {
                  editor?.actions.update({ opacity: value[0] }, [shape]);
                });
                setCurrentSelection(editor?.selection.shapes as Shape[]);
              }}
              className={sliderClassName}
            />
          </div>
        </PropertySection>
      )}

      {/* Corner Radius - only for Rectangle shapes */}
      {showCornerRadius && (
        <PropertySection title="Corner" icon={<Circle size={12} />}>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-white/40 text-[10px]">Radius</span>
              <Input
                type="number"
                min={0}
                max={100}
                step={1}
                value={
                  currentSelection.length === 1 && currentSelection[0] instanceof Box
                    ? (currentSelection[0] as any).corners?.[0] || 0
                    : 0
                }
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (isNaN(value)) return;
                  currentSelection.forEach((shape: Shape) => {
                    if (shape instanceof Box) {
                      editor?.actions.update(
                        { corners: [value, value, value, value] },
                        [shape]
                      );
                    }
                  });
                  setCurrentSelection(editor?.selection.shapes as Shape[]);
                }}
                className="w-16 h-6 text-xs bg-white/5 border-white/10 text-white/80"
              />
            </div>
            <Slider
              min={0}
              max={100}
              step={1}
              value={[
                currentSelection.length === 1 && currentSelection[0] instanceof Box
                  ? (currentSelection[0] as any).corners?.[0] || 0
                  : 0
              ]}
              onValueChange={(value) => {
                currentSelection.forEach((shape: Shape) => {
                  if (shape instanceof Box) {
                    editor?.actions.update(
                      { corners: [value[0], value[0], value[0], value[0]] },
                      [shape]
                    );
                  }
                });
                setCurrentSelection(editor?.selection.shapes as Shape[]);
              }}
              className={sliderClassName}
            />
          </div>
        </PropertySection>
      )}

      {/* Typography Section - only for shapes that support text */}
      {showTextControls && (
        <PropertySection title="Typography" icon={<Type size={12} />}>
          {/* Font Family */}
          <div className="flex flex-col gap-1">
            <span className="text-white/40 text-[10px]">Font Family</span>
            <select
              value={currentSelection.length === 1 ? currentSelection[0].fontFamily : "Gloria Hallelujah"}
              onChange={(e) => {
                currentSelection.forEach((shape: Shape) => {
                  editor?.actions.update({ fontFamily: e.target.value }, [shape]);
                });
                setCurrentSelection(editor?.selection.shapes as Shape[]);
              }}
              className="w-full h-8 px-2 text-xs bg-white/5 border border-white/10 rounded-md text-white/80 focus:outline-none focus:ring-1 focus:ring-white/30"
            >
              {fontFamilies.map((font) => (
                <option key={font} value={font} style={{ fontFamily: font }}>
                  {font}
                </option>
              ))}
            </select>
          </div>

          {/* Font Size with Input */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-white/40 text-[10px]">Size</span>
              <Input
                type="number"
                min={8}
                max={120}
                step={1}
                value={currentSelection.length === 1 ? currentSelection[0].fontSize : 20}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (isNaN(value)) return;
                  currentSelection.forEach((shape: Shape) => {
                    editor?.actions.update({ fontSize: value }, [shape]);
                  });
                  setCurrentSelection(editor?.selection.shapes as Shape[]);
                }}
                className="w-16 h-6 text-xs bg-white/5 border-white/10 text-white/80"
              />
            </div>
            <Slider
              min={8}
              max={120}
              step={1}
              value={[currentSelection.length === 1 ? currentSelection[0].fontSize : 20]}
              onValueChange={(value) => {
                currentSelection.forEach((shape: Shape) => {
                  editor?.actions.update({ fontSize: value[0] }, [shape]);
                });
                setCurrentSelection(editor?.selection.shapes as Shape[]);
              }}
              className={sliderClassName}
            />
          </div>

          {/* Font Style */}
          <div className="flex flex-col gap-1">
            <span className="text-white/40 text-[10px]">Style</span>
            <div className="flex gap-1">
              <ToggleGroup
                type="single"
                value={currentSelection.length === 1 ? currentSelection[0].fontStyle : "normal"}
                className="bg-white/5 border border-white/10 rounded-md"
                onValueChange={(value: string) => {
                  if (!value) return;
                  currentSelection.forEach((shape: Shape) => {
                    editor?.actions.update({ fontStyle: value }, [shape]);
                  });
                  setCurrentSelection(editor?.selection.shapes as Shape[]);
                }}
              >
                <ToggleGroupItem value="normal" className="px-3 hover:bg-black/60" title="Normal">
                  <span className="text-xs">Aa</span>
                </ToggleGroupItem>
                <ToggleGroupItem value="italic" className="px-3 hover:bg-black/60" title="Italic">
                  <Italic size={14} />
                </ToggleGroupItem>
              </ToggleGroup>

              {/* Font Weight */}
              <ToggleGroup
                type="single"
                value={String(currentSelection.length === 1 ? currentSelection[0].fontWeight : 400)}
                className="bg-white/5 border border-white/10 rounded-md"
                onValueChange={(value: string) => {
                  if (!value) return;
                  currentSelection.forEach((shape: Shape) => {
                    editor?.actions.update({ fontWeight: Number(value) }, [shape]);
                  });
                  setCurrentSelection(editor?.selection.shapes as Shape[]);
                }}
              >
                <ToggleGroupItem value="400" className="px-3 hover:bg-black/60" title="Normal">
                  <span className="text-xs font-normal">N</span>
                </ToggleGroupItem>
                <ToggleGroupItem value="700" className="px-3 hover:bg-black/60" title="Bold">
                  <Bold size={14} />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
        </PropertySection>
      )}

      {/* Alignment Section - only for Box-based shapes */}
      {showAlignmentControls && (
        <PropertySection title="Alignment" icon={<AlignCenterVertical size={12} />}>
          {/* Vertical Alignment */}
          <div className="flex flex-col gap-1">
            <span className="text-white/40 text-[10px]">Vertical</span>
            <ToggleGroup
              value={
                currentSelection.length === 1 && currentSelection[0] instanceof Box
                  ? ((currentSelection[0] as Box).vertAlign as string)
                  : "top"
              }
              className="bg-white/5 border border-white/10 rounded-md w-full justify-start"
              type="single"
              onValueChange={(value: string) => {
                if (!value) return;
                currentSelection.forEach((shape: Shape) => {
                  editor?.actions.update({ vertAlign: value as VertAlignEnum }, [shape]);
                });
                setCurrentSelection(editor?.selection.shapes as Shape[]);
              }}
            >
              <ToggleGroupItem value="top" className="flex-1 hover:bg-black/60">
                <AlignStartVertical size={14} />
              </ToggleGroupItem>
              <ToggleGroupItem value="middle" className="flex-1 hover:bg-black/60">
                <AlignCenterVertical size={14} />
              </ToggleGroupItem>
              <ToggleGroupItem value="bottom" className="flex-1 hover:bg-black/60">
                <AlignEndVertical size={14} />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* Horizontal Alignment */}
          <div className="flex flex-col gap-1">
            <span className="text-white/40 text-[10px]">Horizontal</span>
            <ToggleGroup
              value={
                currentSelection.length === 1 && currentSelection[0] instanceof Box
                  ? ((currentSelection[0] as Box).horzAlign as string)
                  : "left"
              }
              type="single"
              className="bg-white/5 border border-white/10 rounded-md w-full justify-start"
              onValueChange={(value: string) => {
                if (!value) return;
                currentSelection.forEach((shape: Shape) => {
                  editor?.actions.update({ horzAlign: value as HorzAlignEnum }, [shape]);
                });
                setCurrentSelection(editor?.selection.shapes as Shape[]);
              }}
            >
              <ToggleGroupItem value="left" className="flex-1 hover:bg-black/60">
                <TextAlignStart size={14} />
              </ToggleGroupItem>
              <ToggleGroupItem value="center" className="flex-1 hover:bg-black/60">
                <TextAlignCenter size={14} />
              </ToggleGroupItem>
              <ToggleGroupItem value="right" className="flex-1 hover:bg-black/60">
                <TextAlignEnd size={14} />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </PropertySection>
      )}

      {/* Line End Types - only for Line shapes */}
      {showLineEndControls && (
        <PropertySection title="Line Ends" icon={<ArrowLeftRight size={12} />}>
          {/* Tail End Type */}
          <div className="flex flex-col gap-1">
            <span className="text-white/40 text-[10px]">Start</span>
            <ToggleGroup
              value={
                currentSelection.length === 1
                  ? (currentSelection[0] as Line).tailEndType || "flat"
                  : "flat"
              }
              className="bg-white/5 border border-white/10 rounded-md w-full justify-start"
              type="single"
              onValueChange={(value: string) => {
                if (!value) return;
                currentSelection.forEach((shape: Shape) => {
                  if (shape instanceof Line) {
                    editor?.actions.update(
                      { tailEndType: value as LineEndTypeEnum },
                      [shape]
                    );
                  }
                });
                setCurrentSelection(editor?.selection.shapes as Shape[]);
              }}
            >
              <ToggleGroupItem value="flat" title="Flat" className="flex-1 hover:bg-black/60">
                <Minus size={14} />
              </ToggleGroupItem>
              <ToggleGroupItem value="arrow" title="Arrow" className="flex-1 hover:bg-black/60">
                <MoveRight size={14} className="rotate-180" />
              </ToggleGroupItem>
              <ToggleGroupItem value="triangle" title="Triangle" className="flex-1 hover:bg-black/60">
                <Triangle size={14} className="-rotate-90" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* Head End Type */}
          <div className="flex flex-col gap-1">
            <span className="text-white/40 text-[10px]">End</span>
            <ToggleGroup
              value={
                currentSelection.length === 1
                  ? (currentSelection[0] as Line).headEndType || "flat"
                  : "flat"
              }
              className="bg-white/5 border border-white/10 rounded-md w-full justify-start"
              type="single"
              onValueChange={(value: string) => {
                if (!value) return;
                currentSelection.forEach((shape: Shape) => {
                  if (shape instanceof Line) {
                    editor?.actions.update(
                      { headEndType: value as LineEndTypeEnum },
                      [shape]
                    );
                  }
                });
                setCurrentSelection(editor?.selection.shapes as Shape[]);
              }}
            >
              <ToggleGroupItem value="flat" title="Flat" className="flex-1 hover:bg-black/60">
                <Minus size={14} />
              </ToggleGroupItem>
              <ToggleGroupItem value="arrow" title="Arrow" className="flex-1 hover:bg-black/60">
                <MoveRight size={14} />
              </ToggleGroupItem>
              <ToggleGroupItem value="triangle" title="Triangle" className="flex-1">
                <Triangle size={14} className="rotate-90" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </PropertySection>
      )}
    </div>
  );
}

export default PropertySidebar;
