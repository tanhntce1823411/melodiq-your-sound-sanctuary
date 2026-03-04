import { Play, Pause, SkipForward, SkipBack, Heart } from "lucide-react";
import { usePlayer } from "@/contexts/PlayerContext";
import { useState } from "react";

export default function NowPlayingBar() {
  const { currentSong, isPlaying, togglePlay, next, prev, progress, duration, seek, hasAudio } = usePlayer();
  const [liked, setLiked] = useState(false);

  if (!currentSong) return null;

  const progressPct = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <div className="fixed bottom-[52px] left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur-xl px-3 py-2">
      <div className="flex items-center gap-3">
        {/* Album art */}
        <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-md">
          <img
            src={currentSong.poster}
            alt={currentSong.title}
            className={`h-full w-full object-cover ${isPlaying ? "animate-spin-slow" : ""}`}
          />
        </div>

        {/* Song info */}
        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{currentSong.title}</p>
          <p className="truncate text-xs text-muted-foreground">{currentSong.artist}</p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1">
          <button onClick={() => setLiked(!liked)} className="p-2">
            <Heart size={18} className={liked ? "fill-primary text-primary" : "text-muted-foreground"} />
          </button>
          <button onClick={prev} className="p-1.5 text-foreground">
            <SkipBack size={18} />
          </button>
          <button
            onClick={togglePlay}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg"
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
          </button>
          <button onClick={next} className="p-1.5 text-foreground">
            <SkipForward size={18} />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div
        className="mt-1.5 h-0.5 w-full overflow-hidden rounded-full bg-muted cursor-pointer"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const pct = (e.clientX - rect.left) / rect.width;
          seek(pct);
        }}
      >
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${progressPct}%` }}
        />
      </div>
    </div>
  );
}
