import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type { WhiteboardState, WhiteboardStore } from "@/types/whiteboard";
import type { Editor } from "@dgmjs/core";

const initialState: WhiteboardState = {
  editor: null,
  gridScale: 1,
  gridOrigin: [0, 0],
  darkMode: true,
  showGrid: false,
  snapToGrid: false,
  snapToObjects: false,
  activeHandler: "Select",
  activeHandlerLock: false,
  doc: null,
  currentPage: null,
  currentSelection: [],
};

export const whiteboardActions = {
  /**
   * Activate a handler tool on the editor and update store state.
   */
  activateHandler: (handler: string) => {
    const state = useWhiteboardStore.getState();
    state.editor?.activateHandler(handler);
    state.setActiveHandler(handler);
  },

  /**
   * Toggle grid visibility on the editor and update store state.
   */
  setShowGrid: (showGrid: boolean) => {
    const state = useWhiteboardStore.getState();
    state.setShowGrid(showGrid);
  },

  /**
   * Toggle snap to grid on the editor and update store state.
   */
  setSnapToGrid: (snapToGrid: boolean) => {
    const state = useWhiteboardStore.getState();
    // Note: snapToGrid is managed through the store and passed to the DGMEditor component
    state.setSnapToGrid(snapToGrid);
  },

  /**
   * Toggle snap to objects on the editor and update store state.
   */
  setSnapToObjects: (snapToObjects: boolean) => {
    const state = useWhiteboardStore.getState();
    // Note: snapToObjects is managed through the store and passed to the DGMEditor component
    state.setSnapToObjects(snapToObjects);
  },
};

export const useWhiteboardStore = create<WhiteboardStore>()(
  subscribeWithSelector((set) => ({
    ...initialState,
    setEditor: (editor: Editor | null) => set({ editor }),
    setGridScale: (scale) => set({ gridScale: scale }),
    setGridOrigin: (origin) => set({ gridOrigin: origin }),
    setDarkMode: (darkMode) => set({ darkMode }),
    setShowGrid: (showGrid) => set({ showGrid }),
    setSnapToGrid: (snapToGrid) => set({ snapToGrid }),
    setSnapToObjects: (snapToObjects) => set({ snapToObjects }),
    setActiveHandler: (activeHandler) => set({ activeHandler }),
    setActiveHandlerLock: (activeHandlerLock) => set({ activeHandlerLock }),
    setDoc: (doc) => set({ doc }),
    setCurrentPage: (page) => set({ currentPage: page }),
    setCurrentSelection: (selection) => set({ currentSelection: selection }),
  })),
);
