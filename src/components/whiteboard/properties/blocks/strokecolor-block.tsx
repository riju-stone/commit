import React from "react";
import TextFieldComponent from "../fields/text-field";
import { StrokeDottedIcon, StrokeSolidIcon } from "@/assets/icons";
import NumberFieldComponent from "../fields/number-field";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { merge } from "@/utils/whiteboard";
import { useWhiteboardStore } from "@/store/whiteboardStore";
import { Shape } from "@dgmjs/core";
import ColorFieldComponent from "../fields/color-field";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const StrokeColorBlock: React.FC = () => {
  const { editor, currentSelection, setCurrentSelection } = useWhiteboardStore();
  const strokeColor = merge(currentSelection.map((s: Shape) => s.strokeColor));
  const strokeWidth = merge(currentSelection.map((s: Shape) => s.strokeWidth));
  const strokePattern = merge(currentSelection.map((s: Shape) => s.strokePattern));
  const roughness = merge(currentSelection.map((s: Shape) => s.roughness));

  return (
    <div className="flex flex-col gap-2">
      <ColorFieldComponent
        value={strokeColor ?? "#000000"}
        className="w-full"
        onValueChange={(value) => {
          currentSelection.forEach((shape: Shape) => editor?.actions.update({ strokeColor: value }, [shape]));
          setCurrentSelection(editor?.selection.shapes as Shape[]);
        }}
      />
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Label htmlFor="stroke-width-field" className="flex-none px-1 cursor-help">
                <StrokeSolidIcon size={16} />
              </Label>
            </TooltipTrigger>
            <TooltipContent>
              <p>Stroke width</p>
            </TooltipContent>
          </Tooltip>
          <NumberFieldComponent
            id="stroke-width-field"
            className="grow text-xs h-7"
            value={strokeWidth}
            onChange={(value: number) => {
              currentSelection.forEach((shape: Shape) => editor?.actions.update({ strokeWidth: value }, [shape]));
              setCurrentSelection(editor?.selection.shapes as Shape[]);
            }}
          />
        </div>
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Label htmlFor="stroke-pattern-field" className="flex-none px-1 cursor-help">
                <StrokeDottedIcon size={16} />
              </Label>
            </TooltipTrigger>
            <TooltipContent>
              <p>Stroke pattern</p>
            </TooltipContent>
          </Tooltip>
          <TextFieldComponent
            id="stroke-pattern-field"
            className="grow text-xs h-7"
            value={
              Array.isArray(strokePattern)
                ? strokePattern.length > 0
                  ? strokePattern.join(",")
                  : "0"
                : undefined
            }
            onChange={(value: string) => {
              const pattern = JSON.parse(`[${value}]`);
              currentSelection.forEach((shape: Shape) => editor?.actions.update({ strokePattern: pattern }, [shape]));
              setCurrentSelection(editor?.selection.shapes as Shape[]);
            }}
          />
        </div>
      </div>
      <div className="flex h-7 items-center gap-3">
        <Label className="font-normal text-xs">Roughness</Label>
        <div className="w-full">
          <Slider
            max={5}
            step={0.5}
            min={0}
            value={[roughness || 0]}
            onValueChange={(value) => {
              currentSelection.forEach((shape: Shape) => editor?.actions.update({ roughness: value[0] }, [shape]));
              setCurrentSelection(editor?.selection.shapes as Shape[]);
            }}
          />
        </div>
      </div>
    </div>
  );
};
