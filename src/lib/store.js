const { create } = require("zustand");

const useUserStore = create((set) => ({
  user: null,
  timeline: [],
  isLoading: true,
  error: null,
  
  setUser: (user) => set({ user }),
  setTimeline: (timeline) => set({timeline}),
  addTimeline: (newItem) => set((state) => ({ timeline: [...state.timeline, newItem] })),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));

export {useUserStore};