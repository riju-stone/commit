import React from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { FillStyle, FillStyleEnum, Shape } from "@dgmjs/core";
import {
  FillCrossHatchIcon,
  FillHachureIcon,
  FillNoneIcon,
  FillSolidIcon,
} from "@/assets/icons";
import { merge } from "@/utils/whiteboard";
import ColorFieldComponent from "../fields/color-field";
import { useWhiteboardStore } from "@/store/whiteboardStore";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const FillColorBlock: React.FC = () => {
  const { editor, setCurrentSelection } = useWhiteboardStore();
  const { currentSelection } = useWhiteboardStore();
  const fillColor = merge(currentSelection.map((s: Shape) => s.fillColor));
  const fillStyle = merge(currentSelection.map((s: Shape) => s.fillStyle));

  return (
    <div className="flex flex-col gap-2">
      <ColorFieldComponent
        value={fillColor ?? "#000000"}
        onValueChange={(value) => {
          currentSelection.forEach((shape: Shape) => {
            editor?.actions.update({ fillColor: value }, [shape]);
          });
          setCurrentSelection(editor?.selection.shapes as Shape[]);
        }}
      />
      <div className="flex items-center justify-center">
        <ToggleGroup
          type="single"
          value={fillStyle}
          onValueChange={(value) => {
            currentSelection.forEach((shape: Shape) => {
              editor?.actions.update({ fillStyle: value as FillStyleEnum }, [shape]);
            });
            setCurrentSelection(editor?.selection.shapes as Shape[]);
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
