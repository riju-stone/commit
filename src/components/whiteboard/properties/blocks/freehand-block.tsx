import React from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { merge } from "@/utils/whiteboard";
import { Freehand } from "@dgmjs/core";
import { Shape } from "@dgmjs/core";
import { useWhiteboardStore } from "@/store/whiteboardStore";

export const FreehandBlock: React.FC = () => {
  const { currentSelection, editor, setCurrentSelection } = useWhiteboardStore();
  const thinning = merge(currentSelection.map((s: Shape) => (s as Freehand).thinning));
  const tailTaper = merge(currentSelection.map((s: Shape) => (s as Freehand).tailTaper));
  const headTaper = merge(currentSelection.map((s: Shape) => (s as Freehand).headTaper));

  return (<>
    <div className="flex h-7 text-xs items-center gap-3">
      <Label className="font-normal text-xs w-28">Thining</Label>
      <div className="w-full">
        <Slider
          max={1}
          step={0.1}
          min={0}
          value={[thinning || 0]}
          onValueChange={(value) => {
            currentSelection.forEach((shape: Shape) => editor?.actions.update({ thinning: value[0] }, [shape]));
            setCurrentSelection(editor?.selection.shapes as Shape[]);
          }}
        />
      </div>
    </div>
    <div className="flex h-7 text-xs items-center gap-3">
      <Label className="font-normal text-xs w-28">Tail Taper</Label>
      <div className="w-full">
        <Slider
          max={1}
          step={0.01}
          min={0}
          value={[tailTaper || 0]}
          onValueChange={(value) => {
            currentSelection.forEach((shape: Shape) => editor?.actions.update({ tailTaper: value[0] }, [shape]));
            setCurrentSelection(editor?.selection.shapes as Shape[]);
          }}
        />
      </div>
    </div>
    <div className="flex h-7 text-xs items-center gap-3">
      <Label className="font-normal text-xs w-28">Head Taper</Label>
      <div className="w-full">
        <Slider
          max={1}
          step={0.01}
          min={0}
          value={[headTaper || 0]}
          onValueChange={(value) => {
            currentSelection.forEach((shape: Shape) => editor?.actions.update({ headTaper: value[0] }, [shape]));
            setCurrentSelection(editor?.selection.shapes as Shape[]);
          }}
        />
      </div>
    </div>
  </>
  );
};
