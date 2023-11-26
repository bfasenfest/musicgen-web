import { create } from "zustand";

export type Track = {
  created_at: string;
  id: string;
  title: string;
  type: string;
  url: string;
};

export type TrackStore = {
  tracks: Track[];
  setTracks: (tracks: Track[]) => void;
};

export const useTrackStore = create<TrackStore>((set) => ({
  tracks: [],
  setTracks: (tracks) => set({ tracks }),
}));
