import { Play } from "lucide-react";
import logo from "@/assets/logo.png";
import { featuredSongs, topCharts, recentlyPlayed, playlists } from "@/data/mockData";
import { usePlayer } from "@/contexts/PlayerContext";
import SectionHeader from "@/components/SectionHeader";
import SongRow from "@/components/SongRow";

export default function HomePage() {
  const { play } = usePlayer();

  return (
    <div className="pb-32 animate-fade-in">
      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between bg-background/80 backdrop-blur-xl px-4 py-3">
        <img src={logo} alt="melodiQ" className="h-9" />
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs text-muted-foreground">Live</span>
        </div>
      </header>

      {/* Featured Carousel */}
      <section className="px-4 mt-2">
        <SectionHeader title="Nổi bật" />
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {featuredSongs.map((song) => (
            <button
              key={song.id}
              onClick={() => play(song)}
              className="group relative flex-shrink-0 w-64 overflow-hidden rounded-xl"
            >
              <img src={song.poster} alt={song.title} className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-sm font-bold text-foreground">{song.title}</p>
                <p className="text-xs text-muted-foreground">{song.artist}</p>
              </div>
              <div className="absolute right-3 bottom-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary opacity-0 shadow-lg transition-all group-hover:opacity-100 group-hover:translate-y-0 translate-y-2">
                <Play size={18} className="ml-0.5 text-primary-foreground" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Recently Played */}
      <section className="px-4 mt-8">
        <SectionHeader title="Nghe gần đây" />
        <div className="grid grid-cols-2 gap-3">
          {recentlyPlayed.slice(0, 4).map((song) => (
            <button
              key={song.id}
              onClick={() => play(song)}
              className="flex items-center gap-3 rounded-lg bg-secondary/60 overflow-hidden transition-colors hover:bg-secondary"
            >
              <img src={song.poster} alt={song.title} className="h-12 w-12 object-cover" />
              <span className="text-xs font-medium text-foreground truncate pr-2">{song.title}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Top Charts */}
      <section className="px-4 mt-8">
        <SectionHeader title="🔥 Top Tuần" />
        <div className="space-y-0.5">
          {topCharts.slice(0, 5).map((song, i) => (
            <SongRow key={song.id} song={song} index={i} />
          ))}
        </div>
      </section>

      {/* Playlists */}
      <section className="px-4 mt-8">
        <SectionHeader title="Playlist cho bạn" />
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {playlists.map((pl) => (
            <div key={pl.id} className="flex-shrink-0 w-36">
              <div className="relative overflow-hidden rounded-xl aspect-square">
                <img src={pl.cover} alt={pl.name} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-background/20" />
              </div>
              <p className="mt-2 text-sm font-semibold text-foreground truncate">{pl.name}</p>
              <p className="text-xs text-muted-foreground">{pl.songCount} bài hát</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
