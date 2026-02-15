import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Box, HorzAlign, HorzAlignEnum, Shape, Text as TextShape, VertAlign, VertAlignEnum } from "@dgmjs/core";
import { AlignCenterIcon, AlignLeftIcon, AlignRightIcon, ChevronsUpDownIcon, WrapTextIcon } from "lucide-react";
import React from "react";
import ColorFieldComponent from "../fields/color-field";
import {
  LineHeightIcon,
  ParagraphSpacingIcon,
  VerticalBottomIcon,
  VerticalMiddleIcon,
  VerticalTopIcon,
} from "@/assets/icons/editor";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { merge, batchUpdateShapes } from "@/utils/whiteboard";
import { useWhiteboardStore } from "@/store/whiteboardStore";
import NumberFieldComponent from "../fields/number-field";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const fontFamilies = [
  "Arial",
  "Helvetica",
  "Times New Roman",
  "Verdana",
  "Courier New",
  "Georgia",
  "Palatino",
  "Gloria Hallelujah",
  "Inter",
];

const FONT_SIZES = [
  8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 62,
  64, 66, 68, 70, 72, 74, 76, 78, 80, 82, 84, 86, 88, 90, 92, 94, 96, 98, 100,
];

export const TextBlock: React.FC = () => {
  const editor = useWhiteboardStore((state) => state.editor);
  const currentSelection = useWhiteboardStore((state) => state.currentSelection);
  const setCurrentSelection = useWhiteboardStore((state) => state.setCurrentSelection);

  const isBox = currentSelection.every((s: Shape) => s instanceof Box);
  const fontColor = merge(currentSelection.map((s: Shape) => (s as TextShape).fontColor));
  const fontFamily = merge(currentSelection.map((s: Shape) => (s as TextShape).fontFamily));
  const fontWeight = merge(currentSelection.map((s: Shape) => (s as TextShape).fontWeight));
  const fontSize = merge(currentSelection.map((s: Shape) => (s as TextShape).fontSize));
  const vertAlign = merge(currentSelection.map((s: Shape) => (s as TextShape).vertAlign));
  const horzAlign = merge(currentSelection.map((s: Shape) => (s as TextShape).horzAlign));
  const wordWrap = merge(currentSelection.map((s: Shape) => (s as TextShape).wordWrap));
  const lineHeight = merge(currentSelection.map((s: Shape) => (s as TextShape).lineHeight));
  const paragraphSpacing = merge(currentSelection.map((s: Shape) => (s as TextShape).paragraphSpacing));

  return (
    <>
      <ColorFieldComponent
        value={fontColor ?? "#000000"}
        onValueChange={(value) => {
          const updated = batchUpdateShapes(editor, currentSelection, { fontColor: value });
          setCurrentSelection(updated);
        }}
      />
      <div className="flex items-center">
        <Select
          value={fontFamily}
          onValueChange={(value) => {
            const updated = batchUpdateShapes(editor, currentSelection, { fontFamily: value });
            setCurrentSelection(updated);
          }}
        >
          <SelectTrigger className="h-7 text-xs dark text-white" title="Font Family">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="dark">
            {fontFamilies.map((family: string) => (
              <SelectItem className="text-xs dark text-white" key={family} value={family}>
                {family}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2 w-full">
        <div className="flex items-center w-full">
          <Select
            value={fontWeight?.toString()}
            onValueChange={(value) => {
              const numberValue = parseInt(value);
              const updated = batchUpdateShapes(editor, currentSelection, { fontWeight: numberValue });
              setCurrentSelection(updated);
            }}
          >
            <SelectTrigger className="h-7 text-xs w-full dark text-white" title="Font Weight">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="dark">
              <SelectItem className="text-xs dark text-white" value="100">
                Thin
              </SelectItem>
              <SelectItem className="text-xs dark text-white" value="200">
                ExtraLight
              </SelectItem>
              <SelectItem className="text-xs dark text-white" value="300">
                Light
              </SelectItem>
              <SelectItem className="text-xs dark text-white" value="400">
                Regular
              </SelectItem>
              <SelectItem className="text-xs dark text-white" value="500">
                Medium
              </SelectItem>
              <SelectItem className="text-xs dark text-white" value="600">
                SemiBold
              </SelectItem>
              <SelectItem className="text-xs dark text-white" value="700">
                Bold
              </SelectItem>
              <SelectItem className="text-xs dark text-white" value="800">
                ExtraBold
              </SelectItem>
              <SelectItem className="text-xs dark text-white" value="900">
                Black
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center w-full">
          <NumberFieldComponent
            value={fontSize}
            onChange={(value: number) => {
              const updated = batchUpdateShapes(editor, currentSelection, { fontSize: value });
              setCurrentSelection(updated);
            }}
            className="w-20 h-7 text-xs items-center dark text-white"
            title="Font Size"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex h-7 text-xs min-w-6 relative -left-7 items-center">
                <Button variant="ghost" className="h-6 min-w-6 px-0 dark text-white">
                  <ChevronsUpDownIcon size={12} />
                </Button>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="dark">
              {FONT_SIZES.map((size: number) => (
                <DropdownMenuItem
                  className="text-xs dark text-white"
                  key={size}
                  onSelect={() => {
                    const updated = batchUpdateShapes(editor, currentSelection, { fontSize: size });
                    setCurrentSelection(updated);
                  }}
                >
                  {size}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {isBox && (
        <div className="flex items-center justify-between">
          <ToggleGroup
            type="single"
            size="sm"
            className="dark text-white"
            value={horzAlign}
            onValueChange={(value) => {
              if (!value) return;
              const updated = batchUpdateShapes(editor, currentSelection, { horzAlign: value as HorzAlignEnum });
              setCurrentSelection(updated);
            }}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem value={HorzAlign.LEFT} className="h-7 w-7 p-0 dark text-white">
                  <AlignLeftIcon size={16} />
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent className="dark">
                <p>Align left</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem value={HorzAlign.CENTER} className="h-7 w-7 p-0 dark text-white">
                  <AlignCenterIcon size={16} />
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent className="dark">
                <p>Align center</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem value={HorzAlign.RIGHT} className="h-7 w-7 p-0 dark text-white">
                  <AlignRightIcon size={16} />
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent className="dark">
                <p>Align right</p>
              </TooltipContent>
            </Tooltip>
          </ToggleGroup>
          <ToggleGroup
            type="single"
            size="sm"
            value={vertAlign}
            onValueChange={(value) => {
              if (!value) return;
              const updated = batchUpdateShapes(editor, currentSelection, { vertAlign: value as VertAlignEnum });
              setCurrentSelection(updated);
            }}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem value={VertAlign.TOP} className="h-7 w-7 p-0 dark text-white">
                  <VerticalTopIcon size={16} />
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent className="dark">
                <p>Align top</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem value={VertAlign.MIDDLE} className="h-7 w-7 p-0 dark text-white">
                  <VerticalMiddleIcon size={16} />
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent className="dark">
                <p>Align middle</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem value={VertAlign.BOTTOM} className="h-7 w-7 p-0 dark text-white">
                  <VerticalBottomIcon size={16} />
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent className="dark">
                <p>Align bottom</p>
              </TooltipContent>
            </Tooltip>
          </ToggleGroup>
        </div>
      )}
      {isBox && (
        <div className="flex w-full items-center gap-2">
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Label htmlFor="text-line-height-field" className="text-xs px-1 cursor-help dark text-white">
                  <LineHeightIcon size={16} />
                </Label>
              </TooltipTrigger>
              <TooltipContent className="dark">
                <p>Line height</p>
              </TooltipContent>
            </Tooltip>
            <NumberFieldComponent
              id="text-line-height-field"
              className="grow text-xs h-7 dark text-white"
              value={lineHeight}
              onChange={(value: number) => {
                const updated = batchUpdateShapes(editor, currentSelection, { lineHeight: value });
                setCurrentSelection(updated);
              }}
            />
          </div>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Label htmlFor="text-paragraph-spacing-field" className="text-xs cursor-help dark text-white">
                  <ParagraphSpacingIcon size={16} />
                </Label>
              </TooltipTrigger>
              <TooltipContent className="dark">
                <p>Paragraph spacing</p>
              </TooltipContent>
            </Tooltip>
            <NumberFieldComponent
              id="text-paragraph-spacing-field"
              className="grow text-xs h-7 dark text-white"
              value={paragraphSpacing}
              onChange={(value: number) => {
                const updated = batchUpdateShapes(editor, currentSelection, { paragraphSpacing: value });
                setCurrentSelection(updated);
              }}
            />
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                variant="outline"
                size="sm"
                className="w-7 h-7 p-1 dark text-white"
                pressed={wordWrap}
                onPressedChange={(pressed) => {
                  const updated = batchUpdateShapes(editor, currentSelection, { wordWrap: pressed });
                  setCurrentSelection(updated);
                }}
              >
                <WrapTextIcon size={16} />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent className="dark">
              <p>Word wrap</p>
            </TooltipContent>
          </Tooltip>
        </div>
      )}
    </>
  );
};
