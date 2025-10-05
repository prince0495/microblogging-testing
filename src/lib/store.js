const { create } = require("zustand");

const useUserStore = create((set) => ({
  user: null,
  timeline: [],
  isLoading: true,
  error: null,

  lastPostId: null, 
  isFetchingMore: false,
  
  setUser: (user) => set({ user }),
  setTimeline: (timeline) => set({ 
    timeline,
    lastPostId: timeline.length > 0 ? timeline[timeline.length - 1].id : null
  }),
  addTimeline: (newPost) => set((state) => ({
    timeline: [newPost, ...state.timeline]
  })),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  setIsFetchingMore: (isFetchingMore) => set({ isFetchingMore }),
  appendTimeline: (newPosts) => set((state) => ({
    timeline: [...state.timeline, ...newPosts],
    // Update lastPostId with the ID of the last post from the new batch
    lastPostId: newPosts.length > 0 ? newPosts[newPosts.length - 1].id : state.lastPostId
  })),
}));

export {useUserStore};