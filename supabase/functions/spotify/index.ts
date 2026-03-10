const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

let tokenCache: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (tokenCache && Date.now() < tokenCache.expiresAt) {
    return tokenCache.token;
  }

  const clientId = Deno.env.get('SPOTIFY_CLIENT_ID')!;
  const clientSecret = Deno.env.get('SPOTIFY_CLIENT_SECRET')!;

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
    },
    body: 'grant_type=client_credentials',
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Spotify token error: ${res.status} - ${errText}`);
  }

  const data = await res.json();
  tokenCache = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };
  return data.access_token;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get('action');
    const token = await getAccessToken();

    if (action === 'search') {
      const query = url.searchParams.get('q');
      const limit = url.searchParams.get('limit') || '20';
      if (!query) {
        return new Response(JSON.stringify({ error: 'Missing query' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const res = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}&market=VN`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) {
        const errText = await res.text();
        return new Response(JSON.stringify({ error: `Spotify API error: ${res.status}` }), {
          status: res.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const data = await res.json();

      const tracks = (data.tracks?.items || []).map((t: any) => ({
        id: t.id,
        title: t.name,
        artist: t.artists.map((a: any) => a.name).join(', '),
        poster: t.album?.images?.[0]?.url || '',
        duration: formatDuration(t.duration_ms),
        preview_url: t.preview_url,
        spotify_url: t.external_urls?.spotify,
      }));

      return new Response(JSON.stringify({ tracks }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'new-releases') {
      const res = await fetch(
        `https://api.spotify.com/v1/browse/new-releases?limit=20&country=VN`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();

      const albums = (data.albums?.items || []).map((a: any) => ({
        id: a.id,
        name: a.name,
        artist: a.artists.map((ar: any) => ar.name).join(', '),
        cover: a.images?.[0]?.url || '',
        spotify_url: a.external_urls?.spotify,
      }));

      return new Response(JSON.stringify({ albums }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'top-tracks') {
      // Get Vietnam's top tracks via a popular playlist
      const res = await fetch(
        `https://api.spotify.com/v1/browse/categories/toplists/playlists?limit=1&country=VN`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const catData = await res.json();
      const playlistId = catData.playlists?.items?.[0]?.id || '37i9dQZEVXbLdGSmz6xilI'; // Vietnam Top 50 fallback
      
      const plRes = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=20`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const plData = await plRes.json();

      const tracks = (plData.items || [])
        .filter((item: any) => item.track)
        .map((item: any) => {
          const t = item.track;
          return {
            id: t.id,
            title: t.name,
            artist: t.artists.map((a: any) => a.name).join(', '),
            poster: t.album?.images?.[0]?.url || '',
            duration: formatDuration(t.duration_ms),
            preview_url: t.preview_url,
            spotify_url: t.external_urls?.spotify,
          };
        });

      return new Response(JSON.stringify({ tracks }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Unknown action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function formatDuration(ms: number): string {
  const mins = Math.floor(ms / 60000);
  const secs = Math.floor((ms % 60000) / 1000);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
