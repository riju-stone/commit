import { Doc, Editor, Page, Shape } from "@dgmjs/core"

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
  currentSelection: Shape[]
  doc: Doc | null
  currentPage: Page | null
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
  setCurrentSelection: (selection: Shape[]) => void
  setDoc: (doc: Doc) => void
  setCurrentPage: (page: Page) => void
}

export type WhiteboardStore = WhiteboardState & WhiteboardActions

export interface WhiteboardDocument {
  id: string
  name: string
  version: number
  createdAt: string
  updatedAt: string
  pages: SerializedPage[]
  settings: DocumentSettings
}

export interface SerializedPage {
  id: string
  name: string
  shapes: SerializedShape[]
}

export interface SerializedShape {
  id: string
  type: string
  properties: Record<string, unknown>
  children?: SerializedShape[]
}

export interface DocumentSettings {
  darkMode: boolean
  showGrid: boolean
  snapToGrid: boolean
  snapToObjects: boolean
}

export interface DocumentMetadata {
  id: string
  name: string
  updatedAt: string
  thumbnail?: string
}

export interface DocumentSliceState {
  document: WhiteboardDocument | null
  isDirty: boolean
  lastSavedAt: string | null
}

export interface DocumentSliceActions {
  createDocument: (name: string) => void
  loadDocument: (doc: WhiteboardDocument) => void
  markDirty: () => void
  markSaved: () => void
  serialize: () => WhiteboardDocument | null
}

export type DocumentSlice = DocumentSliceState & DocumentSliceActions
