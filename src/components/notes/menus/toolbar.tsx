import { Button } from '@/components/ui/button'
import { Heading, Heading1, Heading2, Heading3, Heading4, Image, Table, TextAlignJustify, TextAlignStart, TextAlignCenter, Type, ListChecks, TextAlignEnd } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useNoteStore } from '@/store/noteStore';

function ToolbarComponent() {
  const editor = useNoteStore((state) => state.editor);

  return (
    <div className='absolute flex items-center justify-center bottom-7 left-1/2 -translate-x-1/2 h-[45px] backdrop-blur-sm border-2 border-white/20 rounded-xl z-99'>
      <div className='flex gap-[5px] bg-transparent rounded-[5px] p-1'>
        <Popover>
          <Tooltip delayDuration={500}>
            <PopoverTrigger asChild>
              <TooltipTrigger asChild>
                <Button
                  variant='ghost' size='sm'
                  className='text-white'>
                  <Heading />
                </Button>
              </TooltipTrigger>
            </PopoverTrigger>
            <TooltipContent>
              <p>Heading</p>
            </TooltipContent>
          </Tooltip>
          <PopoverContent side='top' align='center' className='h-[45px] w-fit mb-2 flex items-center justify-center gap-1 bg-transparent backdrop-blur-sm border-2 border-white/20 rounded-xl p-1'>
            <Tooltip delayDuration={500}>
              <TooltipTrigger asChild>
                <Button variant='ghost' size='sm' className='text-white'
                  onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}>
                  <Heading1 />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Heading 1</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip delayDuration={500}>
              <TooltipTrigger asChild>
                <Button variant='ghost' size='sm' className='text-white'
                  onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}>
                  <Heading2 />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Heading 2</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip delayDuration={500}>
              <TooltipTrigger asChild>
                <Button variant='ghost' size='sm' className='text-white'
                  onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}>
                  <Heading3 />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Heading 3</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip delayDuration={500}>
              <TooltipTrigger asChild>
                <Button variant='ghost' size='sm' className='text-white'
                  onClick={() => editor?.chain().focus().toggleHeading({ level: 4 }).run()}>
                  <Heading4 />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Heading 4</p>
              </TooltipContent>
            </Tooltip>
          </PopoverContent>
        </Popover>

        <Popover>
          <Tooltip delayDuration={500}>
            <PopoverTrigger asChild>
              <TooltipTrigger asChild>
                <Button
                  variant='ghost' size='sm' className='text-white'
                >
                  <Type />
                </Button>
              </TooltipTrigger>
            </PopoverTrigger>
            <TooltipContent>
              <p>Font Style</p>
            </TooltipContent>
          </Tooltip>
          <PopoverContent side='top' align='center' className='h-[45px] w-fit mb-2 flex items-center justify-center gap-1 bg-transparent backdrop-blur-sm border-2 border-white/20 rounded-xl p-1'>

            <Tooltip delayDuration={500}>
              <TooltipTrigger asChild>
                <Button variant='ghost' size='sm' className='text-white'
                  onClick={() => { editor?.chain().focus().setTextAlign('left').run() }}>
                  <TextAlignStart />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Align Left</p>
              </TooltipContent>
            </Tooltip>


            <Tooltip delayDuration={500}>
              <TooltipTrigger asChild>
                <Button variant='ghost' size='sm' className='text-white'
                  onClick={() => { editor?.chain().focus().setTextAlign('center').run() }}>
                  <TextAlignCenter />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Align Center</p>
              </TooltipContent>
            </Tooltip>


            <Tooltip delayDuration={500}>
              <TooltipTrigger asChild>
                <Button variant='ghost' size='sm' className='text-white'
                  onClick={() => { editor?.chain().focus().setTextAlign('right').run() }}>
                  <TextAlignEnd />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Align Right</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip delayDuration={500}>
              <TooltipTrigger asChild>
                <Button variant='ghost' size='sm' className='text-white'
                  onClick={() => { editor?.chain().focus().setTextAlign('justify').run() }}>
                  <TextAlignJustify />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Align Justify</p>
              </TooltipContent>
            </Tooltip>
          </PopoverContent>
        </Popover>

        <Tooltip delayDuration={500}>
          <TooltipTrigger asChild>
            <Button
              variant='ghost' size='sm'
              className='text-white'
              onClick={() => editor?.chain().focus().insertTable().run()}>
              <Table />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add Table</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip delayDuration={500}>
          <TooltipTrigger asChild>
            <Button
              variant='ghost' size='sm'
              className='text-white'
              onClick={() => {
                editor?.chain().focus().setImageUploadNode().run()
              }}>
              <Image />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add Image</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip delayDuration={500}>
          <TooltipTrigger asChild>
            <Button
              variant='ghost' size='sm'
              className='text-white'
              onClick={() => {
                editor?.chain().focus().toggleTaskList().run()
              }}>
              <ListChecks />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Task List</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}

export default ToolbarComponent