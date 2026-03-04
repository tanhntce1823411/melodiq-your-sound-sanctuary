import { Search, Loader2 } from "lucide-react";
import { useState, useCallback } from "react";
import { useSpotifySearch, SpotifyTrack } from "@/hooks/useSpotify";
import { usePlayer } from "@/contexts/PlayerContext";
import SongRow from "@/components/SongRow";

const genres = [
  { name: "Pop", color: "from-pink-600 to-rose-500" },
  { name: "Rock", color: "from-orange-600 to-red-600" },
  { name: "Hip-Hop", color: "from-yellow-600 to-amber-600" },
  { name: "EDM", color: "from-cyan-600 to-blue-600" },
  { name: "R&B", color: "from-purple-600 to-indigo-600" },
  { name: "Jazz", color: "from-emerald-600 to-teal-600" },
];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const { results, loading, search } = useSpotifySearch();
  const { play, playQueue } = usePlayer();
  const debounceRef = useState<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = (value: string) => {
    setQuery(value);
    if (debounceRef[0]) clearTimeout(debounceRef[0]);
    debounceRef[0] = setTimeout(() => {
      search(value);
    }, 400);
  };

  const handlePlayTrack = (track: SpotifyTrack, index: number) => {
    if (!track.preview_url) {
      // Open Spotify if no preview
      if (track.spotify_url) window.open(track.spotify_url, "_blank");
      return;
    }
    playQueue(results, index);
  };

  return (
    <div className="pb-32 animate-fade-in">
      <header className="px-4 pt-6 pb-4">
        <h1 className="text-2xl font-bold font-display text-foreground mb-4">Tìm kiếm</h1>
        <div className="flex items-center gap-3 rounded-xl bg-secondary px-4 py-3">
          <Search size={18} className="text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Bài hát, nghệ sĩ..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          {loading && <Loader2 size={16} className="animate-spin text-muted-foreground" />}
        </div>
      </header>

      {query ? (
        <section className="px-4">
          <p className="text-sm text-muted-foreground mb-3">
            {loading ? "Đang tìm..." : `${results.length} kết quả cho "${query}"`}
          </p>
          <div className="space-y-0.5">
            {results.map((track, i) => (
              <button
                key={track.id}
                onClick={() => handlePlayTrack(track, i)}
                className="flex w-full items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-secondary/60 text-left"
              >
                <span className="w-6 text-center text-xs text-muted-foreground">{i + 1}</span>
                <img src={track.poster} alt={track.title} className="h-10 w-10 rounded object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{track.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                </div>
                <span className="text-xs text-muted-foreground">{track.duration}</span>
                {!track.preview_url && (
                  <span className="text-[10px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">Spotify</span>
                )}
              </button>
            ))}
          </div>
        </section>
      ) : (
        <section className="px-4">
          <h2 className="text-lg font-bold font-display text-foreground mb-4">Thể loại</h2>
          <div className="grid grid-cols-2 gap-3">
            {genres.map((g) => (
              <button
                key={g.name}
                onClick={() => handleChange(g.name)}
                className={`rounded-xl bg-gradient-to-br ${g.color} p-4 h-24 flex items-end`}
              >
                <span className="text-sm font-bold text-foreground">{g.name}</span>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
