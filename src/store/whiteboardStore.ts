import { Box, Doc, Editor, Page, Shape } from "@dgmjs/core"
import { TiptapEditor } from "@dgmjs/react"
import { create } from "zustand"

export type WhiteboardState = {
  editor: Editor | null
  gridScale: number
  gridOrigin: number[]
  darkMode: boolean
  showGrid: boolean
  snapToGrid: boolean
  snapToObjects: boolean
  activeHandler: string
  activeHandlerLock: boolean
  selectedShape: Shape[] | null
  doc: Doc | null
  currentPage: Page | null
  currentSelection: Shape[]
  libraries: Doc[]
  tiptapEditor: TiptapEditor | null
  editingText: Box | null
}

export type WhiteboardActions = {
  setEditor: (editor: Editor | null) => void
  setGridScale: (scale: number) => void
  setGridOrigin: (origin: number[]) => void
  setDarkMode: (darkMode: boolean) => void
  setShowGrid: (showGrid: boolean) => void
  setSnapToGrid: (snapToGrid: boolean) => void
  setSnapToObjects: (snapToObjects: boolean) => void
  setActiveHandler: (activeHandler: string) => void
  setActiveHandlerLock: (activeHandlerLock: boolean) => void
  setSelectedShape: (selectedShape: Shape[]) => void
  setDoc: (doc: Doc) => void
  setCurrentPage: (page: Page) => void
  setCurrentSelection: (selection: Shape[]) => void
  setLibraries: (libraries: Doc[]) => void
  setTiptapEditor: (tiptapEditor: TiptapEditor | null) => void
  setEditingText: (editingText: Box | null) => void
}

const initialState: WhiteboardState = {
  editor: null,
  gridScale: 1,
  gridOrigin: [0, 0],
  darkMode: false,
  showGrid: false,
  snapToGrid: false,
  snapToObjects: false,
  activeHandler: 'Select',
  activeHandlerLock: false,
  selectedShape: null,
  doc: null,
  currentPage: null,
  currentSelection: [],
  libraries: [],
  tiptapEditor: null,
  editingText: null,
}

export const useWhiteboardStore = create<WhiteboardState & WhiteboardActions>((set) => ({
  ...initialState,
  setEditor: (editor: Editor | null) => set({ editor }),
  setGridScale: (scale: number) => set({ gridScale: scale }),
  setGridOrigin: (origin: number[]) => set({ gridOrigin: origin }),
  setDarkMode: (darkMode: boolean) => set({ darkMode: darkMode }),
  setShowGrid: (showGrid: boolean) => set({ showGrid: showGrid }),
  setSnapToGrid: (snapToGrid: boolean) => set({ snapToGrid: snapToGrid }),
  setSnapToObjects: (snapToObjects: boolean) => set({ snapToObjects: snapToObjects }),
  setActiveHandler: (activeHandler: string) => set((state) => {
    state.editor?.activateHandler(activeHandler)
    return { activeHandler: activeHandler }
  }),
  setActiveHandlerLock: (activeHandlerLock: boolean) => set({ activeHandlerLock: activeHandlerLock }),
  setSelectedShape: (selectedShape: Shape[]) => set({ selectedShape: selectedShape }),
  setDoc: (doc: Doc) => set({ doc: doc }),
  setCurrentPage: (page: Page) => set({ currentPage: page }),
  setCurrentSelection: (selection: Shape[]) => set({ currentSelection: selection }),
  setLibraries: (libraries: Doc[]) => set({ libraries: libraries }),
  setTiptapEditor: (tiptapEditor: TiptapEditor | null) => set({ tiptapEditor }),
  setEditingText: (editingText: Box | null) => set({ editingText }),
}))
