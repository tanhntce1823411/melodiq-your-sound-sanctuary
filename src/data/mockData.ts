import featured1 from "@/assets/featured-1.png";
import featured2 from "@/assets/featured-2.png";
import featured3 from "@/assets/featured-3.png";
import album1 from "@/assets/album-1.png";
import album2 from "@/assets/album-2.png";
import album3 from "@/assets/album-3.png";
import album4 from "@/assets/album-4.png";

export interface Song {
  id: string;
  title: string;
  artist: string;
  poster: string;
  duration: string;
  plays: number;
}

export interface Playlist {
  id: string;
  name: string;
  cover: string;
  songCount: number;
}

export const featuredSongs: Song[] = [
  { id: "1", title: "Midnight Fire", artist: "Luna Eclipse", poster: featured1, duration: "3:45", plays: 2400000 },
  { id: "2", title: "Electric Storm", artist: "Red Voltage", poster: featured2, duration: "4:12", plays: 1800000 },
  { id: "3", title: "Neon Dreams", artist: "DJ Crimson", poster: featured3, duration: "3:58", plays: 3100000 },
];

export const topCharts: Song[] = [
  { id: "4", title: "Crimson Sky", artist: "Ava Storm", poster: album1, duration: "3:22", plays: 5200000 },
  { id: "5", title: "Dark Paradise", artist: "Marco Blaze", poster: album2, duration: "4:01", plays: 4100000 },
  { id: "6", title: "Inferno", artist: "The Reds", poster: album3, duration: "3:55", plays: 3800000 },
  { id: "7", title: "Velvet Night", artist: "Piano Noir", poster: album4, duration: "5:10", plays: 2900000 },
  { id: "8", title: "Burning Heart", artist: "Luna Eclipse", poster: featured1, duration: "3:33", plays: 2700000 },
  { id: "9", title: "Thunder Road", artist: "Red Voltage", poster: featured2, duration: "4:25", plays: 2200000 },
  { id: "10", title: "Bass Drop", artist: "DJ Crimson", poster: featured3, duration: "3:15", plays: 1900000 },
];

export const playlists: Playlist[] = [
  { id: "p1", name: "Top Tuần", cover: album3, songCount: 25 },
  { id: "p2", name: "Nhạc Chill", cover: album4, songCount: 18 },
  { id: "p3", name: "Workout Mix", cover: featured2, songCount: 30 },
  { id: "p4", name: "Late Night Vibes", cover: album1, songCount: 22 },
];

export const recentlyPlayed: Song[] = [
  topCharts[0], topCharts[2], featuredSongs[0], topCharts[3], topCharts[1],
];

export function formatPlays(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(0) + "K";
  return n.toString();
}
