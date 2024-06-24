import { Album, Query } from "./interfaces";

export const fetchAlbumData = async (artist: string, album: string) => {
  const response = await fetch(
    `https://musicbrainz.org/ws/2/release?query=artist:${artist}%20AND%20release:${album}&fmt=json`,
  );
  const data = await response.json();
  if (data.releases && data.releases.length > 0) {
    const releaseId = data.releases[0].id;
    const coverArtUrl = `https://coverartarchive.org/release/${releaseId}/front`;
    return {
      name: data.releases[0].title,
      artist: data.releases[0]["artist-credit"][0].name,
      coverArtUrl,
    };
  }
  return null;
};

export const fetchAlbums = async (queries: Query[]): Promise<Album[]> => {
  const albums = [];
  for (const query of queries) {
    const response = await fetch(
      `https://musicbrainz.org/ws/2/release?query=artist:${query.artist}%20AND%20release:${query.album}&fmt=json`,
    );
    const data = await response.json();
    if (data.releases && data.releases.length > 0) {
      const releaseId = data.releases[0].id;
      const coverArtUrl = `https://coverartarchive.org/release/${releaseId}/front-250`;
      albums.push({
        name: data.releases[0].title,
        artist: data.releases[0]["artist-credit"][0].name,
        coverArtUrl,
      });
    }
  }
  return albums;
};
