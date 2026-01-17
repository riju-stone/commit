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
import { merge } from "@/utils/whiteboard";
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
  const { currentSelection, editor, setCurrentSelection } = useWhiteboardStore();


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
                    currentSelection.forEach((shape: Shape) => {
                      editor?.actions.update({ tailEndType: value as LineEndTypeEnum }, [shape]);
                    });
                    setCurrentSelection(editor?.selection.shapes as Shape[]);
                  }}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Tail arrowhead</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <SelectArrowheadComponent
                  id="line-tail-end"
                  className="rounded-l-none -ml-px"
                  value={headEndType}
                  title="Head arrowhead"
                  onValueChange={(value) => {
                    currentSelection.forEach((shape: Shape) => {
                      editor?.actions.update({ headEndType: value as LineEndTypeEnum }, [shape]);
                    });
                    setCurrentSelection(editor?.selection.shapes as Shape[]);
                  }}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Head arrowhead</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="flex items-center gap-2">
          <ToggleGroup
            type="single"
            value={lineType}
            onValueChange={(value) => {
              currentSelection.forEach((shape: Shape) => {
                editor?.actions.update({ lineType: value as LineTypeEnum }, [shape]);
              });
              setCurrentSelection(editor?.selection.shapes as Shape[]);
            }}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem
                  className="w-7 h-7 p-1"
                  size="sm"
                  value={LineType.STRAIGHT}
                >
                  <LineStraightIcon size={16} />
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent>
                <p>Straight line</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem
                  size="sm"
                  className="w-7 h-7 p-1"
                  value={LineType.CURVE}
                >
                  <LineCurveIcon size={16} />
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent>
                <p>Curved line</p>
              </TooltipContent>
            </Tooltip>
          </ToggleGroup>
        </div>
      </div>
      {isConnector && (
        <div className="flex items-center h-7 gap-3">
          <Label className="font-normal text-xs">Margin</Label>
          <div className="w-full">
            <Slider
              max={50}
              step={5}
              min={0}
              value={[margin]}
              onValueChange={(value) => {
                currentSelection.forEach((shape: Shape) => {
                  editor?.actions.update({ headMargin: value[0], tailMargin: value[0] }, [shape]);
                });
                setCurrentSelection(editor?.selection.shapes as Shape[]);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};
