import { motion } from "motion/react"
import { useEffect, useRef } from "react";
import { useWhiteboardStore } from "@/store/whiteboardStore";
import WhiteboardEditorComponent from "@/components/custom/whiteboard/editor";
import DottedGridOverlay from "@/components/custom/whiteboard/overlay";
import WhiteboardToolbarComponent from "@/components/custom/whiteboard/toolbar";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import WhiteboardContextMenuComponent from "@/components/custom/whiteboard/context-menu";

const WHITEBOARD_VIEW_ANIMATION = {
  initial: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
  transition: {
    duration: 0.5,
    ease: "easeInOut",
  },
}

function WhiteboardView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { editor } = useWhiteboardStore();

  useEffect(() => {
    if (!editor || !containerRef.current) return;
    const resizeObserver = new ResizeObserver(() => {
      editor.fit();
    });
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [editor]);

  return (
    <div className="grow w-full h-screen bg-transparent flex items-center justify-center overflow-hidden text-white" ref={containerRef}>
      <motion.div layout className="w-full h-screen relative" variants={WHITEBOARD_VIEW_ANIMATION} initial="initial" animate="visible" exit="initial">
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <div className="w-full h-screen">
              <WhiteboardEditorComponent />
            </div>
          </ContextMenuTrigger>
          <WhiteboardContextMenuComponent />
        </ContextMenu>
        <DottedGridOverlay />
        <WhiteboardToolbarComponent />
      </motion.div>
    </div>
  )
}

export default WhiteboardView
