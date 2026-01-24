import React from "react";
import { Button } from "@/components/ui/button";
import {
  AlignCenterHorizontalIcon,
  AlignCenterVerticalIcon,
  AlignEndHorizontalIcon,
  AlignEndVerticalIcon,
  AlignStartHorizontalIcon,
  AlignStartVerticalIcon,
} from "lucide-react";
import {
  AlignBringForwardIcon,
  AlignBringToFrontIcon,
  AlignSendBackwardIcon,
  AlignSendToBackIcon,
} from "@/assets/icons";
import { useWhiteboardStore } from "@/store/whiteboardStore";
import { HorzAlign, Shape, VertAlign } from "@dgmjs/core";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const AlignmentBlock: React.FC = () => {
  const editor = useWhiteboardStore((state) => state.editor);
  const setCurrentSelection = useWhiteboardStore((state) => state.setCurrentSelection);

  // Use editor's current selection directly for actions
  const getSelectedShapes = () => editor?.selection.getShapes() ?? [];

  const handleBringToFront = () => {
    if (!editor) return;
    const shapes = getSelectedShapes();
    if (shapes.length === 0) return;
    editor.actions.bringToFront(shapes);
    setCurrentSelection(editor.selection.getShapes() as Shape[]);
  };

  const handleBringForward = () => {
    if (!editor) return;
    const shapes = getSelectedShapes();
    if (shapes.length === 0) return;
    editor.actions.bringForward(shapes);
    setCurrentSelection(editor.selection.getShapes() as Shape[]);
  };

  const handleSendToBack = () => {
    if (!editor) return;
    const shapes = getSelectedShapes();
    if (shapes.length === 0) return;
    editor.actions.sendToBack(shapes);
    setCurrentSelection(editor.selection.getShapes() as Shape[]);
  };

  const handleSendBackward = () => {
    if (!editor) return;
    const shapes = getSelectedShapes();
    if (shapes.length === 0) return;
    editor.actions.sendBackward(shapes);
    setCurrentSelection(editor.selection.getShapes() as Shape[]);
  };

  const handleAlignLeft = () => {
    if (!editor) return;
    const shapes = getSelectedShapes();
    if (shapes.length === 0) return;
    // editor.actions.alignLeft(shapes);
    editor.actions.update({
      horzAlign: HorzAlign.LEFT,
    }, shapes);
    setCurrentSelection(editor.selection.getShapes() as Shape[]);
  };

  const handleAlignCenter = () => {
    if (!editor) return;
    const shapes = getSelectedShapes();
    if (shapes.length === 0) return;
    // editor.actions.alignCenter(shapes);
    editor.actions.update({
      horzAlign: HorzAlign.CENTER,
    }, shapes);
    setCurrentSelection(editor.selection.getShapes() as Shape[]);
  };

  const handleAlignRight = () => {
    if (!editor) return;
    const shapes = getSelectedShapes();
    if (shapes.length === 0) return;
    // editor.actions.alignRight(shapes);
    editor.actions.update({
      horzAlign: HorzAlign.RIGHT,
    }, shapes);
    setCurrentSelection(editor.selection.getShapes() as Shape[]);
  };

  const handleAlignTop = () => {
    if (!editor) return;
    const shapes = getSelectedShapes();
    if (shapes.length === 0) return;
    // editor.actions.alignTop(shapes);
    editor.actions.update({
      vertAlign: VertAlign.TOP,
    }, shapes);
    setCurrentSelection(editor.selection.getShapes() as Shape[]);
  };

  const handleAlignMiddle = () => {
    if (!editor) return;
    const shapes = getSelectedShapes();
    if (shapes.length === 0) return;
    // editor.actions.alignMiddle(shapes);
    editor.actions.update({
      vertAlign: VertAlign.MIDDLE,
    }, shapes);
    setCurrentSelection(editor.selection.getShapes() as Shape[]);
  };

  const handleAlignBottom = () => {
    if (!editor) return;
    const shapes = getSelectedShapes();
    if (shapes.length === 0) return;
    // editor.actions.alignBottom(shapes);
    editor.actions.update({
      vertAlign: VertAlign.BOTTOM,
    }, shapes);
    setCurrentSelection(editor.selection.getShapes() as Shape[]);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="w-7 h-7 text-white"
                onClick={handleBringToFront}
              >
                <AlignBringToFrontIcon size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="dark">
              <p>Bring to front</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="w-7 h-7 text-white"
                onClick={handleBringForward}
              >
                <AlignBringForwardIcon size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="dark">
              <p>Bring forward</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="w-7 h-7 text-white"
                onClick={handleAlignLeft}
              >
                <AlignStartVerticalIcon size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="dark">
              <p>Align left</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="w-7 h-7 text-white"
                onClick={handleAlignCenter}
              >
                <AlignCenterVerticalIcon size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="dark">
              <p>Align center</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-7 h-7 text-white"
                onClick={handleAlignRight}
              >
                <AlignEndVerticalIcon size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="dark">
              <p>Align right</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="w-7 h-7 text-white"
                onClick={handleSendToBack}
              >
                <AlignSendToBackIcon size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="dark">
              <p>Send to back</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="w-7 h-7 text-white"
                onClick={handleSendBackward}
              >
                <AlignSendBackwardIcon size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="dark">
              <p>Send backward</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="w-7 h-7 text-white"
                onClick={handleAlignTop}
              >
                <AlignStartHorizontalIcon size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="dark">
              <p>Align top</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="w-7 h-7 text-white"
                onClick={handleAlignMiddle}
              >
                <AlignCenterHorizontalIcon size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="dark">
              <p>Align middle</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="w-7 h-7 text-white"
                onClick={handleAlignBottom}
              >
                <AlignEndHorizontalIcon size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="dark">
              <p>Align bottom</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};
