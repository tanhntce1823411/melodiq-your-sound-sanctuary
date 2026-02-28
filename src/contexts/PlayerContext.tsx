import React, { createContext, useContext, useState, ReactNode } from "react";
import { Song, featuredSongs } from "@/data/mockData";

interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  queue: Song[];
  play: (song: Song) => void;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
}

const PlayerContext = createContext<PlayerState | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [currentSong, setCurrentSong] = useState<Song | null>(featuredSongs[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState<Song[]>(featuredSongs);

  const play = (song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  const togglePlay = () => setIsPlaying((p) => !p);

  const next = () => {
    if (!currentSong) return;
    const idx = queue.findIndex((s) => s.id === currentSong.id);
    const nextSong = queue[(idx + 1) % queue.length];
    setCurrentSong(nextSong);
  };

  const prev = () => {
    if (!currentSong) return;
    const idx = queue.findIndex((s) => s.id === currentSong.id);
    const prevSong = queue[(idx - 1 + queue.length) % queue.length];
    setCurrentSong(prevSong);
  };

  return (
    <PlayerContext.Provider value={{ currentSong, isPlaying, queue, play, togglePlay, next, prev }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be inside PlayerProvider");
  return ctx;
}
