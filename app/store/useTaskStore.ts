import { create } from "zustand";

interface TaskUIState {
  isAddTaskModalOpen: boolean;
  searchQuery: string;
  setAddTaskModal: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
}

export const useTaskStore = create<TaskUIState>((set) => ({
  isAddTaskModalOpen: false,
  searchQuery: "",
  setAddTaskModal: (open) => set({ isAddTaskModalOpen: open }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}));