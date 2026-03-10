import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface SpotifyTrack {
  id: string;
  title: string;
  artist: string;
  poster: string;
  duration: string;
  preview_url: string | null;
  spotify_url: string | null;
}

export function useSpotifySearch() {
  const [results, setResults] = useState<SpotifyTrack[]>([]);
  const [loading, setLoading] = useState(false);

  const search = async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/spotify?action=search&q=${encodeURIComponent(query)}&limit=20`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
        }
      );
      const json = await res.json();
      setResults(json.tracks || []);
    } catch (err) {
      console.error("Spotify search error:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return { results, loading, search };
}

export function useSpotifyTopTracks() {
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTopTracks = async () => {
    setLoading(true);
    try {
      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/spotify?action=top-tracks`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
        }
      );
      const json = await res.json();
      setTracks(json.tracks || []);
    } catch (err) {
      console.error("Spotify top tracks error:", err);
    } finally {
      setLoading(false);
    }
  };

  return { tracks, loading, fetchTopTracks };
}
