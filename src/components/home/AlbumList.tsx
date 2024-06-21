"use client";

import { fetchAlbums } from "@/lib/fetch";
import { Album } from "@/lib/interfaces";
import { useEffect, useState } from "react";

const Skeleton = () => (
  <div className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow animate-pulse">
    <div className="flex flex-1 flex-col p-8">
      <div className="mx-auto h-32 w-32 flex-shrink-0 rounded-full bg-gray-300"></div>
      <div className="mt-6 h-4 w-3/4 mx-auto bg-gray-300 rounded"></div>
      <div className="mt-2 h-4 w-1/2 mx-auto bg-gray-300 rounded"></div>
    </div>
  </div>
);

export default function AlbumList() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);

  const queries = [
    { artist: "polyphia", album: "new_levels_new_devils" },
    { artist: "tool", album: "undertow" },
    { artist: "animals_as_leaders", album: "the_madness_of_many" },
    { artist: "lorna_shore", album: "…and_i_return_to_nothingness" },
    { artist: "polyphia", album: "remember_that_you_will_die" },
    { artist: "polyphia", album: "live_at_the_factory_in_deep_ellum" },
  ];

  useEffect(() => {
    const getAlbumData = async () => {
      const albumData = await fetchAlbums(queries);
      setAlbums(albumData);
      setLoading(false);
    };
    getAlbumData();
  }, []);

  return (
    <ul
      role="list"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 lg:mx-10 pb-4"
    >
      {loading
        ? Array.from({ length: 6 }).map((_, index) => <Skeleton key={index} />)
        : albums.map((album, index) => (
            <li
              key={index}
              className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow"
            >
              <div className="flex flex-1 flex-col p-8">
                <img
                  className="mx-auto h-32 w-32 flex-shrink-0 rounded-full"
                  src={album.coverArtUrl}
                  alt=""
                />
                <h3 className="mt-6 text-sm font-medium text-gray-900">
                  {album.name}
                </h3>
                <dl className="mt-1 flex flex-grow flex-col justify-between">
                  <dt className="sr-only">Artist</dt>
                  <dd className="text-sm text-gray-500">{album.artist}</dd>
                </dl>
              </div>
            </li>
          ))}
    </ul>
  );
}
