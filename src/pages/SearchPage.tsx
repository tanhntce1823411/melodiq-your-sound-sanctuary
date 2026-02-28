import { Search } from "lucide-react";
import { useState } from "react";
import { topCharts, featuredSongs } from "@/data/mockData";
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
  const allSongs = [...featuredSongs, ...topCharts];
  const filtered = query
    ? allSongs.filter(
        (s) =>
          s.title.toLowerCase().includes(query.toLowerCase()) ||
          s.artist.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="pb-32 animate-fade-in">
      <header className="px-4 pt-6 pb-4">
        <h1 className="text-2xl font-bold font-display text-foreground mb-4">Tìm kiếm</h1>
        <div className="flex items-center gap-3 rounded-xl bg-secondary px-4 py-3">
          <Search size={18} className="text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Bài hát, nghệ sĩ..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
        </div>
      </header>

      {query ? (
        <section className="px-4">
          <p className="text-sm text-muted-foreground mb-3">
            {filtered.length} kết quả cho "{query}"
          </p>
          <div className="space-y-0.5">
            {filtered.map((s, i) => (
              <SongRow key={s.id} song={s} index={i} />
            ))}
          </div>
        </section>
      ) : (
        <section className="px-4">
          <h2 className="text-lg font-bold font-display text-foreground mb-4">Thể loại</h2>
          <div className="grid grid-cols-2 gap-3">
            {genres.map((g) => (
              <div
                key={g.name}
                className={`rounded-xl bg-gradient-to-br ${g.color} p-4 h-24 flex items-end`}
              >
                <span className="text-sm font-bold text-foreground">{g.name}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
