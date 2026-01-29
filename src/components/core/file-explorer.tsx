import useAppStore from "@/store/appStore";
import { motion } from "motion/react";
import { ReactNode } from "react";

const FILE_EXPLORER_CLOSED_WIDTH = "0px";
const FILE_EXPLORER_OPEN_WIDTH = "250px";

const FILE_EXPLORER_CONTENT_ANIMATION = {
  fileExplorerWrapper: {
    closed: {
      width: FILE_EXPLORER_CLOSED_WIDTH,
      minWidth: FILE_EXPLORER_CLOSED_WIDTH,
    },
    open: {
      width: FILE_EXPLORER_OPEN_WIDTH,
      minWidth: FILE_EXPLORER_OPEN_WIDTH,
    },
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
  fileExplorerContent: {
    closed: {
      opacity: 0,
      x: -50,
    },
    open: {
      opacity: 1,
      x: 0,
    },
  },
  transition: {
    duration: 0.2,
    ease: "easeInOut",
  },
};

function FileExplorerComponent({ children }: { children?: ReactNode }) {
  const { fileExplorerOpen } = useAppStore();
  return (
    <motion.div
      layout
      className={`shrink-0 flex-wrap h-screen bg-black/50 flex flex-col items-start justify-between`}
      variants={FILE_EXPLORER_CONTENT_ANIMATION.fileExplorerWrapper}
      initial="closed"
      animate={fileExplorerOpen ? "open" : "closed"}
    >
      {children && <div className="w-full h-full text-nowrap overflow-x-hidden">{children}</div>}
    </motion.div>
  );
}

export default FileExplorerComponent;
