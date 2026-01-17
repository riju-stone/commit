
import { Input } from '@/components/ui/input'
import { Box, Shape } from '@dgmjs/core'
import { useWhiteboardStore } from '@/store/whiteboardStore'
import { Slider } from '@/components/ui/slider';

function CornerRadiusBlock() {
  const { currentSelection, editor, setCurrentSelection } = useWhiteboardStore();
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
            currentSelection.forEach((shape: Shape) => {
              if (shape instanceof Box) {
                editor?.actions.update(
                  { corners: [value, value, value, value] },
                  [shape]
                );
              }
            });
            setCurrentSelection(editor?.selection.shapes as Shape[]);
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
          currentSelection.forEach((shape: Shape) => {
            if (shape instanceof Box) {
              editor?.actions.update(
                { corners: [value[0], value[0], value[0], value[0]] },
                [shape]
              );
            }
          });
          setCurrentSelection(editor?.selection.shapes as Shape[]);
        }}
      />
    </div>
  )
}

export default CornerRadiusBlock