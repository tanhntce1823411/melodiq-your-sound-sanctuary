import { Music, Heart, ListMusic, Plus } from "lucide-react";
import { playlists, topCharts } from "@/data/mockData";
import SongRow from "@/components/SongRow";
import SectionHeader from "@/components/SectionHeader";

export default function LibraryPage() {
  return (
    <div className="pb-32 animate-fade-in">
      <header className="px-4 pt-6 pb-2">
        <h1 className="text-2xl font-bold font-display text-foreground">Thư viện</h1>
      </header>

      {/* Quick links */}
      <section className="px-4 mt-4 space-y-2">
        {[
          { icon: Heart, label: "Bài hát yêu thích", count: 12 },
          { icon: Music, label: "Đã tải xuống", count: 5 },
          { icon: ListMusic, label: "Playlist của tôi", count: playlists.length },
        ].map(({ icon: Icon, label, count }) => (
          <button
            key={label}
            className="flex w-full items-center gap-4 rounded-xl bg-secondary/60 px-4 py-3.5 transition-colors hover:bg-secondary"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Icon size={20} className="text-primary" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold text-foreground">{label}</p>
              <p className="text-xs text-muted-foreground">{count} bài hát</p>
            </div>
          </button>
        ))}
      </section>

      {/* Playlists */}
      <section className="px-4 mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold font-display text-foreground">Playlist</h2>
          <button className="flex items-center gap-1 text-xs font-medium text-primary">
            <Plus size={14} /> Tạo mới
          </button>
        </div>
        <div className="space-y-3">
          {playlists.map((pl) => (
            <div key={pl.id} className="flex items-center gap-3 rounded-lg">
              <img src={pl.cover} alt={pl.name} className="h-14 w-14 rounded-lg object-cover" />
              <div>
                <p className="text-sm font-semibold text-foreground">{pl.name}</p>
                <p className="text-xs text-muted-foreground">{pl.songCount} bài hát</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent */}
      <section className="px-4 mt-8">
        <SectionHeader title="Nghe gần đây" />
        {topCharts.slice(0, 4).map((s, i) => (
          <SongRow key={s.id} song={s} index={i} />
        ))}
      </section>
    </div>
  );
}
