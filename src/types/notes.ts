import type { Editor } from "@tiptap/react"

export type NoteState = {
  editor: Editor | null
  isDirty: boolean
}

export type NoteActions = {
  setEditor: (editor: Editor | null) => void
  markDirty: () => void
}

export type NoteStore = NoteState & NoteActions



