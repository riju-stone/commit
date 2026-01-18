import { useCurrentEditor } from '@tiptap/react';
import { BoldIcon, ItalicIcon, Strikethrough, UnderlineIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

function BubbleMenuComponent() {
  const { editor } = useCurrentEditor();

  return (
    <div className='flex justify-center items-center bg-transparent backdrop-blur-sm border-2 border-white/20 rounded-xl p-2 gap-1'>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          editor?.chain().focus().toggleBold().run();
        }}>
        <BoldIcon />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          editor?.chain().focus().toggleItalic().run();
        }}>
        <ItalicIcon />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          editor?.chain().focus().toggleUnderline().run();
        }}>
        <UnderlineIcon />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          editor?.chain().focus().toggleStrike().run();
        }}>
        <Strikethrough />
      </Button>
    </div>
  )
}

export default BubbleMenuComponent