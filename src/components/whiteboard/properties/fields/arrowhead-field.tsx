import React, { useState } from "react";
import { LineEndType } from "@dgmjs/core";
import {
  LineEndArrowIcon,
  LineEndCircleFilledIcon,
  LineEndCircleIcon,
  LineEndCirclePlusIcon,
  LineEndCrossIcon,
  LineEndCrowfootOneIcon,
  LineEndCrowfootOnlyOneIcon,
  LineEndCrowfootManyIcon,
  LineEndCrowfootZeroManyIcon,
  LineEndCrowfootZeroOneIcon,
  LineEndDiamondFilledIcon,
  LineEndDiamondIcon,
  LineEndDotIcon,
  LineEndFlatIcon,
  LineEndPlusIcon,
  LineEndSolidArrowIcon,
  LineEndTriangleFilledIcon,
  LineEndTriangleIcon,
  LineEndCrowfootOneManyIcon,
  LineEndBarIcon,
  LineEndSquareIcon,
} from "@/assets/icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toPascalCaseWithSpace } from "@/utils/whiteboard";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function ArrowheadIcon({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  switch (value) {
    case LineEndType.FLAT:
      return <LineEndFlatIcon size={16} className={className} />;
    case LineEndType.ARROW:
      return <LineEndArrowIcon size={16} className={className} />;
    case LineEndType.SOLID_ARROW:
      return <LineEndSolidArrowIcon size={16} className={className} />;
    case LineEndType.TRIANGLE:
      return <LineEndTriangleIcon size={16} className={className} />;
    case LineEndType.TRIANGLE_FILLED:
      return <LineEndTriangleFilledIcon size={16} className={className} />;
    case LineEndType.DIAMOND:
      return <LineEndDiamondIcon size={16} className={className} />;
    case LineEndType.DIAMOND_FILLED:
      return <LineEndDiamondFilledIcon size={16} className={className} />;
    case LineEndType.PLUS:
      return <LineEndPlusIcon size={16} className={className} />;
    case LineEndType.CIRCLE:
      return <LineEndCircleIcon size={16} className={className} />;
    case LineEndType.CIRCLE_PLUS:
      return <LineEndCirclePlusIcon size={16} className={className} />;
    case LineEndType.CIRCLE_FILLED:
      return <LineEndCircleFilledIcon size={16} className={className} />;
    case LineEndType.CROWFOOT_ONE:
      return <LineEndCrowfootOneIcon size={16} className={className} />;
    case LineEndType.CROWFOOT_ONLY_ONE:
      return <LineEndCrowfootOnlyOneIcon size={16} className={className} />;
    case LineEndType.CROWFOOT_ZERO_ONE:
      return <LineEndCrowfootZeroOneIcon size={16} className={className} />;
    case LineEndType.CROWFOOT_MANY:
      return <LineEndCrowfootManyIcon size={16} className={className} />;
    case LineEndType.CROWFOOT_ONE_MANY:
      return <LineEndCrowfootOneManyIcon size={16} className={className} />;
    case LineEndType.CROWFOOT_ZERO_MANY:
      return <LineEndCrowfootZeroManyIcon size={16} className={className} />;
    case LineEndType.CROSS:
      return <LineEndCrossIcon size={16} className={className} />;
    case LineEndType.DOT:
      return <LineEndDotIcon size={16} className={className} />;
    case LineEndType.BAR:
      return <LineEndBarIcon size={16} className={className} />;
    case LineEndType.SQUARE:
      return <LineEndSquareIcon size={16} className={className} />;
    default:
      return <LineEndFlatIcon size={16} className={className} />;
  }
}

interface SelectArrowheadProps {
  id?: string;
  className?: string;
  value: string | undefined;
  title?: string;
  rotate?: boolean;
  onValueChange: (value: string) => void;
}

export const SelectArrowheadComponent: React.FC<SelectArrowheadProps> = ({
  className,
  value,
  rotate = false,
  onValueChange,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={(open) => setOpen(open)}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn("rounded-sm w-7 h-7 px-1", className)}
        >
          <ArrowheadIcon
            value={value ?? LineEndType.FLAT}
            className={cn(rotate && "transform rotate-180")}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-2">
        <div className="grid grid-cols-5 gap-0.5 w-fit">
          {Object.values(LineEndType).map((value) => (
            <Tooltip key={value}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn("h-7 w-7")}
                  onClick={() => {
                    setOpen(false);
                    if (onValueChange) onValueChange(value);
                  }}
                >
                  <ArrowheadIcon
                    value={value}
                    className={cn(rotate && "transform rotate-180")}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{toPascalCaseWithSpace(value)}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
