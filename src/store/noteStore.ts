import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type { NoteState, NoteStore } from "@/types/notes";
import type { Editor } from "@tiptap/react";

const initialState: NoteState = {
  editor: null,
  isDirty: false,
};

export const useNoteStore = create<NoteStore>()(
  subscribeWithSelector((set) => ({
    ...initialState,
    setEditor: (editor: Editor | null) => set({ editor }),
    markDirty: () => set({ isDirty: true }),
  })),
);
