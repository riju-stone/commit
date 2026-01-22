import { Toggle } from "@/components/ui/toggle";
import { LockIcon, RotateCcwIcon } from "lucide-react";
import React from "react";
import NumberFieldComponent from "../fields/number-field";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { merge, batchUpdateShapes } from "@/utils/whiteboard";
import { useWhiteboardStore } from "@/store/whiteboardStore";

export const ShapeBlock: React.FC = () => {
  const editor = useWhiteboardStore((state) => state.editor);
  const currentSelection = useWhiteboardStore((state) => state.currentSelection);
  const setCurrentSelection = useWhiteboardStore((state) => state.setCurrentSelection);
  const rotate = merge(currentSelection.map((s) => s.rotate));
  const rotatable = merge(currentSelection.map((s) => s.rotatable));
  const opacity = merge(currentSelection.map((s) => s.opacity));

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center w-full gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2">
              <Label
                htmlFor="shape-rotate-field"
                className="text-sm flex-none px-1"
              >
                <RotateCcwIcon size={16} />
              </Label>
              <NumberFieldComponent
                id="shape-rotate-field"
                className="flex-grow text-xs h-7"
                value={rotate}
                onChange={(value: number) => {
                  const updated = batchUpdateShapes(editor, currentSelection, { rotate: value });
                  setCurrentSelection(updated);
                }}
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Rotate</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              variant="outline"
              size="sm"
              className="w-7 h-7 px-1 justify-center flex-none"
              pressed={!rotatable}
              onPressedChange={(pressed) => {
                const updated = batchUpdateShapes(editor, currentSelection, { rotatable: !pressed });
                setCurrentSelection(updated);
              }}
            >
              <LockIcon size={16} />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>
            <p>Lock Rotation</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="flex h-7 items-center gap-3">
        <Label className="font-normal text-xs">Opacity</Label>
        <div className="w-full">
          <Slider
            max={1}
            step={0.1}
            min={0}
            value={[opacity || 0]}
            onValueChange={(value: number[]) => {
              const updated = batchUpdateShapes(editor, currentSelection, { opacity: value[0] });
              setCurrentSelection(updated);
            }}
          />
        </div>
      </div>
    </div>
  );
};
