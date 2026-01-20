import { Button } from '@/components/ui/button'
import { Heading, Heading1, Heading2, Heading3, Heading4, Image, Table, TextAlignCenter, TextAlignEnd, TextAlignJustify, TextAlignStart, Type } from 'lucide-react'
import { useCurrentEditor } from '@tiptap/react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ToggleGroup, ToggleGroupItem } from '@radix-ui/react-toggle-group';

function ToolbarComponent() {
  const { editor } = useCurrentEditor();

  return (
    <div className='absolute flex items-center justify-center bottom-7 left-1/2 -translate-x-1/2 h-[45px] backdrop-blur-sm border-2 border-white/20 rounded-xl z-99'>
      <div className='flex gap-[5px] bg-transparent rounded-[5px] p-1'>
        <Popover>
          <PopoverTrigger>
            <Tooltip delayDuration={500}>
              <TooltipTrigger asChild>
                <Button
                  variant='ghost' size='sm'
                  className='text-white'>
                  <Heading />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Heading</p>
              </TooltipContent>
            </Tooltip>
          </PopoverTrigger>
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
          <PopoverTrigger>
            <Tooltip delayDuration={500}>
              <TooltipTrigger asChild>
                <Button
                  variant='ghost' size='sm' className='text-white'
                >
                  <Type />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Font Style</p>
              </TooltipContent>
            </Tooltip>
          </PopoverTrigger>
          <PopoverContent side='top' align='center' className='h-[45px] w-fit mb-2 flex items-center justify-center gap-1 bg-transparent backdrop-blur-sm border-2 border-white/20 rounded-xl p-1'>

            <ToggleGroup type='single' value='left'
              onValueChange={(value: string) => editor?.chain().focus().setTextAlign(value).run()}>

              <ToggleGroupItem value='left' className='text-white'>
                <Tooltip delayDuration={500}>
                  <TooltipTrigger asChild>
                    <TextAlignStart />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Align Left</p>
                  </TooltipContent>
                </Tooltip>
              </ToggleGroupItem>


              <ToggleGroupItem value='center' className='text-white'>
                <Tooltip delayDuration={500}>
                  <TooltipTrigger asChild>
                    <TextAlignCenter />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Align Center</p>
                  </TooltipContent>
                </Tooltip>
              </ToggleGroupItem>


              <ToggleGroupItem value='right' className='text-white'>
                <Tooltip delayDuration={500}>
                  <TooltipTrigger asChild>
                    <TextAlignEnd />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Align Right</p>
                  </TooltipContent>
                </Tooltip>
              </ToggleGroupItem>

              <ToggleGroupItem value='justify' className='text-white'>
                <Tooltip delayDuration={500}>
                  <TooltipTrigger asChild>
                    <TextAlignJustify />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Align Justify</p>
                  </TooltipContent>
                </Tooltip>
              </ToggleGroupItem>
            </ToggleGroup>
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
      </div>
    </div>
  )
}

export default ToolbarComponent