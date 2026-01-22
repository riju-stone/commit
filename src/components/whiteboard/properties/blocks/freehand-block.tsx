import React from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { merge, batchUpdateShapes } from "@/utils/whiteboard";
import { Freehand, Shape } from "@dgmjs/core";
import { useWhiteboardStore } from "@/store/whiteboardStore";

export const FreehandBlock: React.FC = () => {
  const editor = useWhiteboardStore((state) => state.editor);
  const currentSelection = useWhiteboardStore((state) => state.currentSelection);
  const setCurrentSelection = useWhiteboardStore((state) => state.setCurrentSelection);
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
            const updated = batchUpdateShapes(editor, currentSelection, { thinning: value[0] });
            setCurrentSelection(updated);
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
            const updated = batchUpdateShapes(editor, currentSelection, { tailTaper: value[0] });
            setCurrentSelection(updated);
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
            const updated = batchUpdateShapes(editor, currentSelection, { headTaper: value[0] });
            setCurrentSelection(updated);
          }}
        />
      </div>
    </div>
  </>
  );
};
