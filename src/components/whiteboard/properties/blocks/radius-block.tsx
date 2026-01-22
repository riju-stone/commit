
import { Input } from '@/components/ui/input'
import { Box } from '@dgmjs/core'
import { useWhiteboardStore } from '@/store/whiteboardStore'
import { Slider } from '@/components/ui/slider';
import { batchUpdateShapes } from '@/utils/whiteboard';

function CornerRadiusBlock() {
  const editor = useWhiteboardStore((state) => state.editor);
  const currentSelection = useWhiteboardStore((state) => state.currentSelection);
  const setCurrentSelection = useWhiteboardStore((state) => state.setCurrentSelection);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-white/40 text-[10px]">Radius</span>
        <Input
          type="number"
          min={0}
          max={100}
          step={1}
          value={
            currentSelection.length === 1 && currentSelection[0] instanceof Box
              ? (currentSelection[0] as any).corners?.[0] || 0
              : 0
          }
          onChange={(e) => {
            const value = parseInt(e.target.value);
            if (isNaN(value)) return;
            // Filter to only Box shapes for corner radius
            const boxShapes = currentSelection.filter((shape) => shape instanceof Box);
            const updated = batchUpdateShapes(editor, boxShapes, { corners: [value, value, value, value] });
            setCurrentSelection(updated);
          }}
          className="w-16 h-6 text-xs bg-white/5 border-white/10 text-white/80"
        />
      </div>
      <Slider
        min={0}
        max={100}
        step={1}
        value={[
          currentSelection.length === 1 && currentSelection[0] instanceof Box
            ? (currentSelection[0] as any).corners?.[0] || 0
            : 0
        ]}
        onValueChange={(value) => {
          // Filter to only Box shapes for corner radius
          const boxShapes = currentSelection.filter((shape) => shape instanceof Box);
          const updated = batchUpdateShapes(editor, boxShapes, { corners: [value[0], value[0], value[0], value[0]] });
          setCurrentSelection(updated);
        }}
      />
    </div>
  )
}

export default CornerRadiusBlock