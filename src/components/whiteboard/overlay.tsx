// Grid configuration
const GRID_SIZE = 30; // Base grid spacing in pixels
const DOT_RADIUS = 1.5; // Radius of each dot
const DOT_COLOR = "rgba(255, 255, 255, 0.175)"; // Subtle white dots

import { useWhiteboardStore } from "@/store/whiteboardStore";

function DottedGridOverlay() {
  const { gridOrigin, gridScale } = useWhiteboardStore();
  const scaledGridSize = GRID_SIZE * gridScale;
  const offsetX = (gridOrigin[0] * gridScale) % scaledGridSize;
  const offsetY = (gridOrigin[1] * gridScale) % scaledGridSize;

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    >
      <defs>
        <pattern
          id="dotted-grid-pattern"
          x={offsetX}
          y={offsetY}
          width={scaledGridSize}
          height={scaledGridSize}
          patternUnits="userSpaceOnUse"
        >
          <circle
            cx={scaledGridSize / 2}
            cy={scaledGridSize / 2}
            r={DOT_RADIUS * Math.min(gridScale, 1.5)}
            fill={DOT_COLOR}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dotted-grid-pattern)" />
    </svg>
  );
}

export default DottedGridOverlay;