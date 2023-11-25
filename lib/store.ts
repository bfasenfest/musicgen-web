import { create } from "zustand";

export type Track = {
  id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
  last_accessed_at: Date;
};

export type TrackStore = {
  tracks: Track[];
  setTracks: (tracks: Track[]) => void;
};

export const useTrackStore = create<TrackStore>((set) => ({
  tracks: [],
  setTracks: (tracks) => set({ tracks }),
}));
