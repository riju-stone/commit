import { FileMetadata, getDirectoryChildren, getFileIcon } from "@/lib/file";
import { JSX, memo, useCallback, useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  FolderPlus,
  FilePlus,
  File,
  FileText,
  FileImage,
  FileBraces,
  FileArchive,
  FileMusic,
  FileVideoCamera,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AnimatePresence, motion } from "motion/react";

interface FileTreeItemProps {
  item: FileMetadata;
  level: number;
}

function FileIcon(extension: string | null): JSX.Element {
  const iconType = getFileIcon(extension);
  switch (iconType) {
    case "text":
      return <FileText className="w-4 h-4 text-white" />;
    case "image":
      return <FileImage className="w-4 h-4 text-white" />;
    case "code":
      return <FileBraces className="w-4 h-4 text-white" />;
    case "zip":
      return <FileArchive className="w-4 h-4 text-white" />;
    case "video":
      return <FileVideoCamera className="w-4 h-4 text-white" />;
    case "audio":
      return <FileMusic className="w-4 h-4 text-white" />;
    default:
      return <File className="w-4 h-4 text-white" />;
  }
}

function FileTreeItem({ item, level }: FileTreeItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [children, setChildren] = useState<FileMetadata[] | null>(item.children);

  const handleToggle = useCallback(async () => {
    if (!item.is_dir) return;

    if (isExpanded) {
      // Collapse
      setIsExpanded(false);
    } else {
      // Expand - fetch children if not already loaded
      if (!children) {
        try {
          const fetchedChildren = await getDirectoryChildren(item.path);
          setChildren(fetchedChildren);
          setIsExpanded(true);
        } catch (error) {
          console.error("Failed to load children:", error);
        }
      } else {
        setIsExpanded(true);
      }
    }
  }, [isExpanded, item.is_dir, item.path, children]);

  return (
    <div className="select-none">
      <button
        className="flex w-full items-center gap-1 px-2 py-1 hover:bg-accent/50 cursor-pointer"
        style={{ paddingLeft: `${level * 8}px` }}
        onClick={(e) => {
          e.stopPropagation();
          handleToggle();
        }}
      >
        {item.is_dir && (
          <div className="p-0.5 rounded">
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-white" />
            ) : (
              <ChevronRight className="w-4 h-4 text-white" />
            )}
          </div>
        )}

        {!item.is_dir && <div className="w-4" />}

        {item.is_dir ? (
          isExpanded ? (
            <FolderOpen className="w-4 h-4 text-white" />
          ) : (
            <Folder className="w-4 h-4 text-white" />
          )
        ) : (
          <span className="text-sm">{FileIcon(item.extension)}</span>
        )}

        <span className="text-sm text-white">{item.name}</span>
      </button>

      <AnimatePresence>
        {item.is_dir && isExpanded && children && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -5 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -5 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          >
            {children.map((child) => (
              <FileTreeItem key={child.path} item={child} level={level + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface FileExplorerProps {
  path?: string;
}

function FileExplorerComponent({ path = "/Users/rijustone/Documents/" }: FileExplorerProps) {
  const [fileTree, setFileTree] = useState<FileMetadata | null>(null);

  const fetchFileTree = useCallback(async () => {
    try {
      // Fetch only the root level - children will be loaded lazily
      const children = await getDirectoryChildren(path);
      // Create a root node
      const rootNode: FileMetadata = {
        name: path.split("/").filter(Boolean).pop() || path,
        path: path,
        is_dir: true,
        is_file: false,
        extension: null,
        children,
      };
      setFileTree(rootNode);
    } catch (err) {
      console.error("Failed to fetch file tree:", err);
    }
  }, [path]);

  useEffect(() => {
    fetchFileTree();
  }, [fetchFileTree]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-2 border-b mt-5">
        <div className="flex justify-end gap-1 flex-1">
          <Button size="sm" variant="ghost" className="dark">
            <FolderPlus className="w-4 h-4 text-white" />
          </Button>
          <Button size="sm" variant="ghost" className="dark" onClick={fetchFileTree}>
            <FilePlus className="w-4 h-4 text-white" />
          </Button>
        </div>
      </div>

      {/* File Tree */}
      <ScrollArea className="flex-1">
        {fileTree && (
          <div className="py-2">
            <FileTreeItem item={fileTree} level={0} />
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

export default memo(FileExplorerComponent);
