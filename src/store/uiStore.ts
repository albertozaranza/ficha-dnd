import { create } from "zustand";

type SaveStatus = "idle" | "saving" | "saved" | "error";
type OpenModal = "session" | "delete" | null;

interface UIStore {
  activeView: string;
  isDark: boolean;
  saveStatus: SaveStatus;
  openModal: OpenModal;
  editingSessionId: string | null;

  setActiveView: (view: string) => void;
  toggleDark: () => void;
  setSaveStatus: (status: SaveStatus) => void;
  setOpenModal: (modal: OpenModal, sessionId?: string) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  activeView: "overview",
  isDark: localStorage.getItem("dnd_dark") !== "0",
  saveStatus: "idle",
  openModal: null,
  editingSessionId: null,

  setActiveView: (view) => set({ activeView: view }),

  toggleDark: () =>
    set((state) => {
      const next = !state.isDark;
      localStorage.setItem("dnd_dark", next ? "1" : "0");
      document.documentElement.classList.toggle("dark", next);
      document.documentElement.classList.toggle("light", !next);
      return { isDark: next };
    }),

  setSaveStatus: (saveStatus) => set({ saveStatus }),

  setOpenModal: (openModal, sessionId) =>
    set({ openModal, editingSessionId: sessionId ?? null }),
}));
