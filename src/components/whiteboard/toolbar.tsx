import React from 'react'
import { CircleIcon, EraserIcon, HandIcon, HighlighterIcon, MousePointer2Icon, PencilIcon, SquareIcon, TypeIcon, ImageIcon, SlashIcon, SplineIcon, Frame } from 'lucide-react';
import { useWhiteboardStore } from '@/store/whiteboardStore';

interface ToolbarItemProps extends React.HTMLAttributes<HTMLButtonElement> {
  active?: boolean
}

function ToolbarItem({ active = false, children, ...props }: ToolbarItemProps) {
  return (
    <button
      className={`border-none cursor-pointer h-[30px] w-[30px] flex items-center justify-center text-white rounded-[5px] p-[5px] transition-all duration-200 ease-in-out hover:bg-[rgba(151,151,151,0.7)] ${active ? 'bg-[rgba(151,151,151,1)]' : 'bg-transparent '}`}
      {...props}
    >
      {children}
    </button>
  )
}

function ToolbarSeparator() {
  return <div className="w-[2px] h-[30px] bg-white/40" />
}

function WhiteboardToolbarComponent() {
  const { activeHandler, setActiveHandler } = useWhiteboardStore();

  return (
    <div className="absolute bottom-[10px] left-1/2 -translate-x-1/2">
      <div className="flex gap-[5px] bg-black/20 p-[5px] rounded-[5px]">
        <ToolbarItem
          title="Select"
          active={activeHandler === 'Select'}
          onClick={() => setActiveHandler('Select')}
        >
          <MousePointer2Icon />
        </ToolbarItem>
        <ToolbarItem
          title="Hand"
          active={activeHandler === 'Hand'}
          onClick={() => setActiveHandler('Hand')}
        >
          <HandIcon />
        </ToolbarItem>
        <ToolbarItem
          title="Eraser"
          active={activeHandler === 'Eraser'}
          onClick={() => setActiveHandler('Eraser')}
        >
          <EraserIcon />
        </ToolbarItem>
        <ToolbarSeparator />
        <ToolbarItem
          title="Rectangle"
          active={activeHandler === 'Rectangle'}
          onClick={() => setActiveHandler('Rectangle')}
        >
          <SquareIcon />
        </ToolbarItem>
        <ToolbarItem
          title="Ellipse"
          active={activeHandler === 'Ellipse'}
          onClick={() => setActiveHandler('Ellipse')}
        >
          <CircleIcon />
        </ToolbarItem>
        <ToolbarItem
          title="Text"
          active={activeHandler === 'Text'}
          onClick={() => setActiveHandler('Text')}
        >
          <TypeIcon />
        </ToolbarItem>
        <ToolbarItem
          title="Image"
          active={activeHandler === 'Image'}
          onClick={() => setActiveHandler('Image')}
        >
          <ImageIcon />
        </ToolbarItem>
        <ToolbarSeparator />
        <ToolbarItem
          title="Line"
          active={activeHandler === 'Line'}
          onClick={() => setActiveHandler('Line')}
        >
          <SlashIcon />
        </ToolbarItem>
        <ToolbarItem
          title="Connector"
          active={activeHandler === 'Connector'}
          onClick={() => setActiveHandler('Connector')}
        >
          <SplineIcon />
        </ToolbarItem>
        <ToolbarItem
          title="Freehand"
          active={activeHandler === 'Freehand'}
          onClick={() => setActiveHandler('Freehand')}
        >
          <PencilIcon />
        </ToolbarItem>
        <ToolbarItem
          title="Highlighter"
          active={activeHandler === 'Highlighter'}
          onClick={() => setActiveHandler('Highlighter')}
        >
          <HighlighterIcon />
        </ToolbarItem>
        <ToolbarSeparator />
        <ToolbarItem
          title="Frame"
          active={activeHandler === 'Frame'}
          onClick={() => setActiveHandler('Frame')}
        >
          <Frame />
        </ToolbarItem>
      </div>
    </div>
  )
}

export default WhiteboardToolbarComponent