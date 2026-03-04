import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from "react";
import { Song, featuredSongs } from "@/data/mockData";
import { SpotifyTrack } from "@/hooks/useSpotify";

export type PlayableSong = Song | SpotifyTrack;

interface PlayerState {
  currentSong: PlayableSong | null;
  isPlaying: boolean;
  queue: PlayableSong[];
  progress: number;
  duration: number;
  play: (song: PlayableSong) => void;
  playQueue: (songs: PlayableSong[], startIndex?: number) => void;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  seek: (pct: number) => void;
  hasAudio: boolean;
}

const PlayerContext = createContext<PlayerState | undefined>(undefined);

function getPreviewUrl(song: PlayableSong): string | null {
  if ("preview_url" in song) return song.preview_url;
  return null;
}

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [currentSong, setCurrentSong] = useState<PlayableSong | null>(featuredSongs[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState<PlayableSong[]>(featuredSongs);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.addEventListener("timeupdate", () => {
        setProgress(audioRef.current!.currentTime);
      });
      audioRef.current.addEventListener("loadedmetadata", () => {
        setDuration(audioRef.current!.duration);
      });
      audioRef.current.addEventListener("ended", () => {
        // Auto next
        nextInternal();
      });
    }
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const playAudio = (song: PlayableSong) => {
    const url = getPreviewUrl(song);
    if (url && audioRef.current) {
      audioRef.current.src = url;
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current?.pause();
    }
  };

  const play = (song: PlayableSong) => {
    setCurrentSong(song);
    setIsPlaying(true);
    playAudio(song);
  };

  const playQueue = (songs: PlayableSong[], startIndex = 0) => {
    setQueue(songs);
    const song = songs[startIndex];
    if (song) {
      setCurrentSong(song);
      setIsPlaying(true);
      playAudio(song);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play().catch(() => {});
    }
    setIsPlaying((p) => !p);
  };

  const nextInternal = () => {
    setCurrentSong((curr) => {
      if (!curr) return curr;
      setQueue((q) => {
        const idx = q.findIndex((s) => s.id === curr.id);
        const nextSong = q[(idx + 1) % q.length];
        if (nextSong) {
          playAudio(nextSong);
          setIsPlaying(true);
        }
        setCurrentSong(nextSong || curr);
        return q;
      });
      return curr;
    });
  };

  const next = () => {
    if (!currentSong) return;
    const idx = queue.findIndex((s) => s.id === currentSong.id);
    const nextSong = queue[(idx + 1) % queue.length];
    if (nextSong) {
      setCurrentSong(nextSong);
      setIsPlaying(true);
      playAudio(nextSong);
    }
  };

  const prev = () => {
    if (!currentSong) return;
    const idx = queue.findIndex((s) => s.id === currentSong.id);
    const prevSong = queue[(idx - 1 + queue.length) % queue.length];
    if (prevSong) {
      setCurrentSong(prevSong);
      setIsPlaying(true);
      playAudio(prevSong);
    }
  };

  const seek = (pct: number) => {
    if (audioRef.current && duration) {
      audioRef.current.currentTime = pct * duration;
    }
  };

  const hasAudio = !!currentSong && !!getPreviewUrl(currentSong);

  return (
    <PlayerContext.Provider value={{ currentSong, isPlaying, queue, progress, duration, play, playQueue, togglePlay, next, prev, seek, hasAudio }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be inside PlayerProvider");
  return ctx;
}
