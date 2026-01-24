import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PageBlock } from "./blocks/page-block";
import { FillColorBlock } from "./blocks/fillcolor-block";
import { StrokeColorBlock } from "./blocks/strokecolor-block";
import { AlignmentBlock } from "./blocks/alignment-block";
import { FreehandBlock } from "./blocks/freehand-block";
import { TextBlock } from "./blocks/text-block";
import { Line, Freehand, Shape, Box, Text as TextShape } from "@dgmjs/core";
import { useWhiteboardStore } from "@/store/whiteboardStore";
import { LineBlock } from "./blocks/line-block";
import {
  Palette,
  PenLine,
  Type,
  Layers,
  Pencil,
  SquareRoundCorner,
} from "lucide-react";
import CornerRadiusBlock from "./blocks/radius-block";
import { ShapeBlock } from "./blocks/shape-block";
import { ControlBlock } from "./blocks/control-block";

// Shape type detection helpers
function isLineShape(shapes: Shape[]): boolean {
  return shapes.some((shape) => shape instanceof Line);
}

function isFreehandShape(shapes: Shape[]): boolean {
  return shapes.some((shape) => shape instanceof Freehand);
}

// Check if shapes support text properties (shapes with text content)
function supportsTextProperties(shapes: Shape[]): boolean {
  return shapes.some((shape) => shape instanceof Box || shape instanceof TextShape);
}

// Check if shapes support fill properties (not lines)
function supportsFillProperties(shapes: Shape[]): boolean {
  return shapes.some((shape) => !(shape instanceof Line));
}

// Check if shapes support corner radius (Rectangle shapes)
function supportsCornerRadius(shapes: Shape[]): boolean {
  return shapes.some((shape) => shape instanceof Box && shape.type === "Rectangle");
}

interface PropertySectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function PropertySection({ title, icon, children }: PropertySectionProps) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center gap-2 text-white text-[10px] font-semibold uppercase tracking-widest">
        {icon}
        <span>{title}</span>
      </div>
      <div className="flex flex-col gap-2.5">{children}</div>
    </div>
  );
}

function PageProperties() {
  return (
    <div className="flex flex-col gap-4 p-3 h-full overflow-y-auto">
      <div className="flex flex-col gap-1 pb-2 border-b border-foreground/10">
        <h3 className="text-sm font-semibold text-white">Page</h3>
      </div>
      <PageBlock />
    </div>
  );
}

function ShapeProperties() {
  const currentSelection = useWhiteboardStore((state) => state.currentSelection);

  // Determine which controls to show based on selected shape types
  const showLineControls = isLineShape(currentSelection);
  const showFreehandControls = isFreehandShape(currentSelection);
  const showFillControls = supportsFillProperties(currentSelection);
  const showTextControls = supportsTextProperties(currentSelection);
  const showCornerRadiusControls = supportsCornerRadius(currentSelection);

  // Get the shape type(s) for display
  const shapeTypes = [...new Set(currentSelection.map((s) => s.type))];
  const shapeTypeLabel =
    currentSelection.length === 1
      ? currentSelection[0].name || currentSelection[0].type
      : `${currentSelection.length} shapes selected`;

  return (
    <div className="flex flex-col gap-5 p-3 h-full overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col gap-1 pb-2 border-b border-foreground/10">
        <h3 className="text-sm font-semibold truncate dark text-white">{shapeTypeLabel}</h3>
        {currentSelection.length > 1 && (
          <span className="text-xs dark text-white">{shapeTypes.join(", ")}</span>
        )}
      </div>

      <ControlBlock />
      <ShapeBlock />

      {/* Fill Color Section - only for non-line shapes */}
      {showFillControls && (
        <PropertySection title="Fill" icon={<Palette size={12} />}>
          <FillColorBlock />
        </PropertySection>
      )}

      {/* Stroke Section */}
      <PropertySection title="Stroke" icon={<PenLine size={12} />}>
        <StrokeColorBlock />
      </PropertySection>

      {/* Alignment / Arrangement Section */}
      <PropertySection title="Arrange" icon={<Layers size={12} />}>
        <AlignmentBlock />
      </PropertySection>

      {/* Text Section - only for shapes that support text */}
      {showTextControls && (
        <PropertySection title="Typography" icon={<Type size={12} />}>
          <TextBlock />
        </PropertySection>
      )}

      {/* Line Section - only for Line shapes */}
      {showLineControls && (
        <PropertySection title="Line" icon={<PenLine size={12} />}>
          <LineBlock />
        </PropertySection>
      )}

      {/* Freehand Section - only for Freehand shapes */}
      {showFreehandControls && (
        <PropertySection title="Freehand" icon={<Pencil size={12} />}>
          <FreehandBlock />
        </PropertySection>
      )}

      {/* Corner Radius Section - only for Rectangle shapes */}
      {showCornerRadiusControls && (
        <PropertySection title="Corner Radius" icon={<SquareRoundCorner size={12} />}>
          <CornerRadiusBlock />
        </PropertySection>
      )}
    </div>
  );
}

export const PropertySidebar: React.FC = () => {
  const editor = useWhiteboardStore((state) => state.editor);
  const currentSelection = useWhiteboardStore((state) => state.currentSelection);

  const currentPage = editor?.getCurrentPage();
  const shapes = currentSelection;

  return (
    <div className="bg-none h-full">
      {currentPage && shapes && shapes.length === 0 ? (
        <PageProperties />
      ) : shapes && shapes.length > 0 ? (
        <ScrollArea className="h-full w-full">
          <ShapeProperties />
        </ScrollArea>
      ) : (
        <div className="p-3 text-xs text-white">No shapes selected</div>
      )}
    </div>
  );
};
