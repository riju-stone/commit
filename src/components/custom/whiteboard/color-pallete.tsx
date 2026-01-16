import React from "react";
import { cn } from "@/lib/utils";

export const simplePalette: string[][] = [
  [
    "rgba(239, 68, 68, 1)",   // red
    "rgba(249, 115, 22, 1)",  // orange
    "rgba(168, 85, 247, 1)",  // purple
    "rgba(59, 130, 246, 1)",  // blue
    "rgba(6, 182, 212, 1)",   // cyan
    "rgba(34, 197, 94, 1)",   // green
    "rgba(139, 69, 19, 1)",   // brown
    "rgba(234, 179, 8, 1)",   // yellow
    "rgba(132, 204, 22, 1)",  // lime
    "rgba(16, 185, 129, 1)",  // mint/teal
    "rgba(107, 114, 128, 1)", // gray
    "rgba(0, 0, 0, 1)"        // black
  ],
];

interface ColorItemProps {
  value: string;
  className?: string;
  onClick?: (value: string) => void;
}

const ColorItem: React.FC<ColorItemProps> = ({
  value,
  className,
  onClick,
}) => {
  return (
    <div
      className={cn(
        "h-[18px] w-[18px] cursor-pointer rounded-full",
        className
      )}
      style={{ backgroundColor: value }}
      onClick={() => {
        if (onClick) onClick(value);
      }}
    />
  );
};

interface ColorPaletteProps {
  palette: string[][];
  itemClassName?: string;
  className?: string;
  onClick?: (value: string) => void;
}

export const ColorPalette: React.FC<ColorPaletteProps> = ({
  palette,
  itemClassName,
  className,
  onClick,
}) => {
  return (
    <div className={cn("w-full flex flex-col gap-1", className)}>
      {palette.map((row, j) => (
        <div key={j} className="flex flex-row w-full justify-between items-center gap-1">
          {row.map((c, i) => (
            <ColorItem
              key={i}
              className={itemClassName}
              value={c}
              onClick={(value) => {
                if (onClick) onClick(value);
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
