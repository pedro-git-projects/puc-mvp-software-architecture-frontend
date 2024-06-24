export interface Query {
  artist: string;
  album: string;
}

export interface Album {
  name: string;
  artist: string;
  coverArtUrl: string;
}

export type MusicBrainzResponse = {
  created: string;
  count: number;
  offset: number;
  releases: Release[];
};

export type Release = {
  id: string;
  score: number;
  "status-id": string;
  count: number;
  title: string;
  status: string;
  "text-representation"?: TextRepresentation;
  "artist-credit": ArtistCredit[];
  "release-group": ReleaseGroup;
  date: string;
  country: string;
  "release-events": ReleaseEvent[];
  "label-info": LabelInfo[];
  "track-count": number;
  media: Media[];
};

export type TextRepresentation = {
  language: string;
  script: string;
};

export type ArtistCredit = {
  name: string;
  artist: Artist;
};

export type Artist = {
  id: string;
  name: string;
  "sort-name": string;
  disambiguation: string;
};

export type ReleaseGroup = {
  id: string;
  "type-id": string;
  "primary-type-id": string;
  title: string;
  "primary-type": string;
};

export type ReleaseEvent = {
  date: string;
  area: Area;
};

export type Area = {
  id: string;
  name: string;
  "sort-name": string;
  "iso-3166-1-codes": string[];
};

export type LabelInfo = {
  "catalog-number"?: string;
  label: Label;
};

export type Label = {
  id: string;
  name: string;
};

export type Media = {
  format: string;
  "disc-count": number;
  "track-count": number;
};

export type PythonRelease = {
  id: string;
  album_id: string;
  album_name: string;
  artist_name: string;
  cover_art_url: string;
  date?: string;
  country?: string;
  "artist-credit"?: { name: string }[];
  "label-info"?: { label: { name: string } }[];
}
