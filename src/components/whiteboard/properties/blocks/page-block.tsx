import React from "react";
import type { Page } from "@dgmjs/core";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import TextFieldComponent from "../fields/text-field";
import { useWhiteboardStore } from "@/store/whiteboardStore";

export const PageBlock: React.FC = () => {
  const { editor } = useWhiteboardStore();
  const page = editor?.getCurrentPage();
  const pageName = page?.name;
  const pageSize = JSON.stringify(page?.size);

  return (
    <>
      <div className="flex flex-col gap-2">
        <TextFieldComponent
          className="text-xs h-7"
          placeholder="Name"
          value={pageName}
          onChange={(value) => {
            editor?.actions.update({ name: value }, [page as Page]);
          }}
        />
      </div>
      <div className="flex items-center justify-between w-full gap-3">
        <Label className="w-16 whitespace-nowrap text-xs">Size</Label>
        <Select
          value={pageSize}
          onValueChange={(value) => {
            editor?.actions.update({ size: JSON.parse(value) }, [page as Page]);
          }}
        >
          <SelectTrigger className="w-full text-xs h-7" title="Font Family">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem className="text-xs" value="null">
              Infinite
            </SelectItem>
            <SelectItem className="text-xs" value="[960,720]">
              4:3
            </SelectItem>
            <SelectItem className="text-xs" value="[960,540]">
              16:9
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};
