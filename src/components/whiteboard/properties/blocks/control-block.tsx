import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Movable,
  Sizable,
  Box,
  MovableEnum,
  SizableEnum,
  Path,
  Shape,
} from "@dgmjs/core";
import React from "react";
import { Label } from "@/components/ui/label";
import TextFieldComponent from "../fields/text-field";
import { merge } from "@/utils/whiteboard";
import { cn } from "@/lib/utils";
import { useWhiteboardStore } from "@/store/whiteboardStore";

export const ControlBlock: React.FC = () => {
  const { currentSelection, editor, setCurrentSelection } = useWhiteboardStore();
  const isBox = currentSelection.every((s: Shape) => s instanceof Box);
  const isPath = currentSelection.every((s: Shape) => s instanceof Path);

  const enabled = merge(currentSelection.map((s: Shape) => s.enable));
  const visible = merge(currentSelection.map((s: Shape) => s.visible));
  const containable = merge(currentSelection.map((s: Shape) => s.containable));
  const containableFilter = merge(currentSelection.map((s: Shape) => s.containableFilter));
  const movableParentFilter = merge(currentSelection.map((s: Shape) => s.movableParentFilter));
  const connectable = merge(currentSelection.map((s: Shape) => s.connectable));
  const rotatable = merge(currentSelection.map((s: Shape) => s.rotatable));
  const sizable = merge(currentSelection.map((s: Shape) => s.sizable));
  const movable = merge(currentSelection.map((s: Shape) => s.movable));
  const textEditable = merge(
    currentSelection.map((s: Shape) => (s instanceof Box ? s.textEditable : false))
  );
  const pathEditable = merge(
    currentSelection.map((s: Shape) => (s instanceof Path ? s.pathEditable : false))
  );
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
                currentSelection.forEach((shape: Shape) => {
                  editor?.actions.update({ visible: checked }, [shape]);
                });
                setCurrentSelection(editor?.selection.shapes as Shape[]);
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
              if (typeof checked === "boolean")
                currentSelection.forEach((shape: Shape) => {
                  editor?.actions.update({ connectable: checked }, [shape]);
                });
              setCurrentSelection(editor?.selection.shapes as Shape[]);
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
              if (typeof checked === "boolean")
                currentSelection.forEach((shape: Shape) => {
                  editor?.actions.update({ rotatable: checked }, [shape]);
                });
              setCurrentSelection(editor?.selection.shapes as Shape[]);
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
                currentSelection.forEach((shape: Shape) => {
                  editor?.actions.update({ anchored: checked }, [shape]);
                });
                setCurrentSelection(editor?.selection.shapes as Shape[]);
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
