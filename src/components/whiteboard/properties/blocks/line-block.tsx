import React from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Connector,
  Line,
  LineEndTypeEnum,
  LineType,
  LineTypeEnum,
  Shape,
} from "@dgmjs/core";
import { LineCurveIcon, LineStraightIcon } from "@/assets/icons";
import { merge, batchUpdateShapes } from "@/utils/whiteboard";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useWhiteboardStore } from "@/store/whiteboardStore";
import { SelectArrowheadComponent } from "../fields/arrowhead-field";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const LineBlock: React.FC = () => {
  const editor = useWhiteboardStore((state) => state.editor);
  const currentSelection = useWhiteboardStore((state) => state.currentSelection);
  const setCurrentSelection = useWhiteboardStore((state) => state.setCurrentSelection);


  const lineType = merge(currentSelection.map((s) => (s as Line).lineType));
  const headEndType = merge(currentSelection.map((s) => (s as Line).headEndType));
  const tailEndType = merge(currentSelection.map((s) => (s as Line).tailEndType));
  const isConnector = currentSelection.every((s) => s.type === "Connector");
  const headMargin = merge(currentSelection.map((s) => (s as Connector).headMargin));
  const tailMargin = merge(currentSelection.map((s) => (s as Connector).tailMargin));
  const margin = Math.min(headMargin || 0, tailMargin || 0);

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <SelectArrowheadComponent
                  id="line-head-end"
                  className="rounded-r-none"
                  rotate={true}
                  value={tailEndType}
                  title="Tail arrowhead"
                  onValueChange={(value) => {
                    const updated = batchUpdateShapes(editor, currentSelection, { tailEndType: value as LineEndTypeEnum });
                    setCurrentSelection(updated);
                  }}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent className="dark">
              <p>Tail arrowhead</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <SelectArrowheadComponent
                  id="line-tail-end"
                  className="rounded-l-none -ml-px dark text-white"
                  value={headEndType}
                  title="Head arrowhead"
                  onValueChange={(value) => {
                    const updated = batchUpdateShapes(editor, currentSelection, { headEndType: value as LineEndTypeEnum });
                    setCurrentSelection(updated);
                  }}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent className="dark">
              <p>Head arrowhead</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="flex items-center gap-2">
          <ToggleGroup
            type="single"
            value={lineType}
            onValueChange={(value) => {
              if (!value) return;
              const updated = batchUpdateShapes(editor, currentSelection, { lineType: value as LineTypeEnum });
              setCurrentSelection(updated);
            }}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem
                  className="w-7 h-7 p-1 dark text-white"
                  size="sm"
                  value={LineType.STRAIGHT}
                >
                  <LineStraightIcon size={16} />
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent className="dark">
                <p>Straight line</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem
                  size="sm"
                  className="w-7 h-7 p-1 dark text-white"
                  value={LineType.CURVE}
                >
                  <LineCurveIcon size={16} />
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent className="dark">
                <p>Curved line</p>
              </TooltipContent>
            </Tooltip>
          </ToggleGroup>
        </div>
      </div>
      {isConnector && (
        <div className="flex items-center h-7 gap-3">
          <Label className="font-normal text-xs text-white">Margin</Label>
          <div className="w-full">
            <Slider
              max={50}
              step={5}
              min={0}
              value={[margin]}
              onValueChange={(value) => {
                const updated = batchUpdateShapes(editor, currentSelection, { headMargin: value[0], tailMargin: value[0] });
                setCurrentSelection(updated);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};
