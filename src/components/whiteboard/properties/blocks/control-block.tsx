import { Checkbox } from "@/components/ui/checkbox";
import {
  Box,
  Shape,
} from "@dgmjs/core";
import React from "react";
import { Label } from "@/components/ui/label";
import { merge, batchUpdateShapes } from "@/utils/whiteboard";
import { useWhiteboardStore } from "@/store/whiteboardStore";

export const ControlBlock: React.FC = () => {
  const editor = useWhiteboardStore((state) => state.editor);
  const currentSelection = useWhiteboardStore((state) => state.currentSelection);
  const setCurrentSelection = useWhiteboardStore((state) => state.setCurrentSelection);
  const isBox = currentSelection.every((s: Shape) => s instanceof Box);

  const visible = merge(currentSelection.map((s: Shape) => s.visible));
  const connectable = merge(currentSelection.map((s: Shape) => s.connectable));
  const rotatable = merge(currentSelection.map((s: Shape) => s.rotatable));
  const anchored = merge(
    currentSelection.map((s: Shape) => (s instanceof Box ? s.anchored : false))
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="grid h-7 grid-cols-2 items-center">
        <div className="flex items-center gap-2">
          <Checkbox
            id="shape-visible-checkbox"
            checked={visible}
            onCheckedChange={(checked) => {
              if (typeof checked === "boolean") {
                const updated = batchUpdateShapes(editor, currentSelection, { visible: checked });
                setCurrentSelection(updated);
              }
            }}
          />
          <Label
            className="font-normal text-xs"
            htmlFor="shape-visible-checkbox"
          >
            Visible
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="shape-connectable-checkbox"
            checked={connectable}
            onCheckedChange={(checked) => {
              if (typeof checked === "boolean") {
                const updated = batchUpdateShapes(editor, currentSelection, { connectable: checked });
                setCurrentSelection(updated);
              }
            }}
          />
          <Label
            className="font-normal text-xs"
            htmlFor="shape-connectable-checkbox"
          >
            Connectable
          </Label>
        </div>
      </div>
      <div className="grid h-7 grid-cols-2 items-center">
        <div className="flex items-center gap-2">
          <Checkbox
            id="shape-rotatable-checkbox"
            checked={rotatable}
            onCheckedChange={(checked) => {
              if (typeof checked === "boolean") {
                const updated = batchUpdateShapes(editor, currentSelection, { rotatable: checked });
                setCurrentSelection(updated);
              }
            }}
          />
          <Label
            className="font-normal peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-xs"
            htmlFor="shape-rotatable-checkbox"
          >
            Rotatable
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="shape-anchored-checkbox"
            checked={anchored}
            disabled={!isBox}
            onCheckedChange={(checked) => {
              if (typeof checked === "boolean") {
                const updated = batchUpdateShapes(editor, currentSelection, { anchored: checked });
                setCurrentSelection(updated);
              }
            }}
          />
          <Label
            className="font-normal peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-xs"
            htmlFor="shape-anchored-checkbox"
          >
            Anchored
          </Label>
        </div>
      </div>
    </div>
  );
};
