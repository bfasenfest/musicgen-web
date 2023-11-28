import { create } from "zustand";

import { Track } from "@/types_db";

export type TrackStore = {
  tracks: Track[];
  setTracks: (tracks: Track[]) => void;
};

export const useTrackStore = create<TrackStore>((set) => ({
  tracks: [],
  setTracks: (tracks) => set({ tracks }),
}));
