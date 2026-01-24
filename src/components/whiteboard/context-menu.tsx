import { ContextMenuItem, ContextMenuSeparator, ContextMenuLabel, ContextMenuContent, ContextMenuRadioGroup, ContextMenuRadioItem, ContextMenuCheckboxItem, ContextMenuSub, ContextMenuSubTrigger, ContextMenuSubContent, ContextMenuShortcut } from '@/components/ui/context-menu'

function WhiteboardContextMenuComponent() {
  return (
    <ContextMenuContent className="w-52 dark">
      <ContextMenuItem inset className="dark text-white">
        Back
        <ContextMenuShortcut>⌘[</ContextMenuShortcut>
      </ContextMenuItem>
      <ContextMenuItem inset disabled className="dark text-white">
        Forward
        <ContextMenuShortcut>⌘]</ContextMenuShortcut>
      </ContextMenuItem>
      <ContextMenuItem inset className="dark text-white">
        Reload
        <ContextMenuShortcut>⌘R</ContextMenuShortcut>
      </ContextMenuItem>
      <ContextMenuSub>
        <ContextMenuSubTrigger inset className="dark text-white">More Tools</ContextMenuSubTrigger>
        <ContextMenuSubContent className="w-44 dark">
          <ContextMenuItem className="dark text-white">Save Page...</ContextMenuItem>
          <ContextMenuItem className="dark text-white">Create Shortcut...</ContextMenuItem>
          <ContextMenuItem className="dark text-white">Name Window...</ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem className="dark text-white">Developer Tools</ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem variant="destructive" className="dark text-white">Delete</ContextMenuItem>
        </ContextMenuSubContent>
      </ContextMenuSub>
      <ContextMenuSeparator />
      <ContextMenuCheckboxItem checked className="dark text-white">
        Show Bookmarks
      </ContextMenuCheckboxItem>
      <ContextMenuCheckboxItem className="dark text-white">Show Full URLs</ContextMenuCheckboxItem>
      <ContextMenuSeparator />
      <ContextMenuRadioGroup value="pedro">
        <ContextMenuLabel inset className="dark text-white">People</ContextMenuLabel>
        <ContextMenuRadioItem value="pedro" className="dark text-white">
          Pedro Duarte
        </ContextMenuRadioItem>
        <ContextMenuRadioItem value="colm" className="dark text-white">Colm Tuite</ContextMenuRadioItem>
      </ContextMenuRadioGroup>
    </ContextMenuContent>
  )
}

export default WhiteboardContextMenuComponent