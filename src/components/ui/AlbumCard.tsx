"use client";

import { Release } from "@/lib/interfaces";
import { useEffect, useState } from "react";

interface AlbumCardProps {
  release: Release;
}

export default function AlbumCard({ release }: AlbumCardProps) {
  const [coverArtUrl, setCoverArtUrl] = useState<string | null>(null);
  const [coverArtError, setCoverArtError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCoverArt = async () => {
      try {
        const response = await fetch(
          `https://coverartarchive.org/release/${release.id}/front-250`,
        );
        if (response.ok) {
          setCoverArtUrl(response.url);
        } else {
          setCoverArtError(true);
        }
      } catch (error) {
        setCoverArtError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCoverArt();
  }, [release.id]);

  return (
    <div className="border rounded-lg p-4 shadow-md mb-4">
      {loading ? (
        <div className="w-full h-64 flex items-center justify-center bg-gray-200 text-gray-600 rounded-md mb-4 animate-pulse">
          <div className="text-center">Carregando...</div>
        </div>
      ) : coverArtError ? (
        <div className="w-full h-64 flex items-center justify-center bg-gray-200 text-gray-600 rounded-md mb-4">
          Capa Não Encontrada
        </div>
      ) : (
        coverArtUrl && (
          <img
            src={coverArtUrl}
            alt={`${release.title} cover art`}
            className="w-full h-64 object-cover rounded-md mb-4"
            onError={() => setCoverArtError(true)}
          />
        )
      )}
      <h2 className="text-xl font-bold">{release.title}</h2>
      <p className="text-gray-600">
        Artista:{" "}
        {release["artist-credit"] && release["artist-credit"].length > 0
          ? release["artist-credit"][0].name
          : "Artista Desconhecido"}
      </p>
      <p className="text-gray-600">Data de lançamento: {release.date}</p>
      <p className="text-gray-600">País: {release.country}</p>
      {release["label-info"] && release["label-info"].length > 0 && (
        <p className="text-gray-600">
          Gravadora: {release["label-info"][0].label.name}
        </p>
      )}
    </div>
  );
}
