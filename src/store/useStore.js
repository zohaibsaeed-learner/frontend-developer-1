import { create } from 'zustand'

export const useStore = create((set) => ({
  user: null,
  profile: null,
  cameras: [],
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setCameras: (cameras) => set({ cameras }),
  addCamera: (camera) => set((state) => ({ cameras: [...state.cameras, camera] })),
  updateCamera: (id, updates) =>
    set((state) => ({
      cameras: state.cameras.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    })),
  removeCamera: (id) =>
    set((state) => ({ cameras: state.cameras.filter((c) => c.id !== id) })),
  reset: () => set({ user: null, profile: null, cameras: [] }),
}))