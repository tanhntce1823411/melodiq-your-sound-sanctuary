import { Play } from "lucide-react";
import { Song, formatPlays } from "@/data/mockData";
import { usePlayer } from "@/contexts/PlayerContext";
import Equalizer from "./Equalizer";

interface SongRowProps {
  song: Song;
  index: number;
}

export default function SongRow({ song, index }: SongRowProps) {
  const { play, currentSong, isPlaying } = usePlayer();
  const isActive = currentSong?.id === song.id;

  return (
    <button
      onClick={() => play(song)}
      className="group flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-secondary"
    >
      {/* Index / Equalizer */}
      <div className="w-6 text-center text-sm font-medium text-muted-foreground">
        {isActive && isPlaying ? (
          <Equalizer />
        ) : (
          <span className="group-hover:hidden">{index + 1}</span>
        )}
        <Play size={14} className="hidden group-hover:block mx-auto text-primary" />
      </div>

      {/* Cover */}
      <img src={song.poster} alt={song.title} className="h-10 w-10 rounded object-cover" />

      {/* Info */}
      <div className="flex-1 min-w-0 text-left">
        <p className={`truncate text-sm font-medium ${isActive ? "text-primary" : "text-foreground"}`}>
          {song.title}
        </p>
        <p className="truncate text-xs text-muted-foreground">{song.artist}</p>
      </div>

      {/* Meta */}
      <span className="text-xs text-muted-foreground">{formatPlays(song.plays)}</span>
      <span className="text-xs text-muted-foreground">{song.duration}</span>
    </button>
  );
}
