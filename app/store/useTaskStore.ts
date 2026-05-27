import { create } from "zustand";

interface TaskUIState {
  isTaskModalOpen: boolean;
  searchQuery: string;
  setTaskModal: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
}

export const useTaskStore = create<TaskUIState>((set) => ({
  isTaskModalOpen: false,
  searchQuery: "",
  setTaskModal: (open) => set({ isTaskModalOpen: open }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
