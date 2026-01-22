import React from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { FillStyle, FillStyleEnum, Shape } from "@dgmjs/core";
import {
  FillCrossHatchIcon,
  FillHachureIcon,
  FillNoneIcon,
  FillSolidIcon,
} from "@/assets/icons";
import { merge, batchUpdateShapes } from "@/utils/whiteboard";
import ColorFieldComponent from "../fields/color-field";
import { useWhiteboardStore } from "@/store/whiteboardStore";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const FillColorBlock: React.FC = () => {
  const editor = useWhiteboardStore((state) => state.editor);
  const currentSelection = useWhiteboardStore((state) => state.currentSelection);
  const setCurrentSelection = useWhiteboardStore((state) => state.setCurrentSelection);
  const fillColor = merge(currentSelection.map((s: Shape) => s.fillColor));
  const fillStyle = merge(currentSelection.map((s: Shape) => s.fillStyle));

  return (
    <div className="flex flex-col gap-2">
      <ColorFieldComponent
        value={fillColor ?? "#000000"}
        onValueChange={(value) => {
          const updated = batchUpdateShapes(editor, currentSelection, { fillColor: value });
          setCurrentSelection(updated);
        }}
      />
      <div className="flex items-center justify-center">
        <ToggleGroup
          type="single"
          value={fillStyle}
          onValueChange={(value) => {
            const updated = batchUpdateShapes(editor, currentSelection, { fillStyle: value as FillStyleEnum });
            setCurrentSelection(updated);
          }}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem size="sm" value={FillStyle.NONE}>
                <FillNoneIcon size={16} />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>
              <p>No fill</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem size="sm" value={FillStyle.SOLID}>
                <FillSolidIcon size={16} />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>
              <p>Solid fill</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem size="sm" value={FillStyle.HACHURE}>
                <FillHachureIcon size={16} />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>
              <p>Hachure fill</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem size="sm" value={FillStyle.CROSS_HATCH}>
                <FillCrossHatchIcon size={16} />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>
              <p>Cross-hatch fill</p>
            </TooltipContent>
          </Tooltip>
        </ToggleGroup>
      </div>
    </div>
  );
};
