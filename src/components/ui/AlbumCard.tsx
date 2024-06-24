"use client";

import { useAuth } from "@/app/providers/AuthContext";
import { PythonRelease, Release } from "@/lib/interfaces";
import { useEffect, useState } from "react";

interface AlbumCardProps {
  release: Release;
  favorites: PythonRelease[];
}

export default function AlbumCard({ release, favorites }: AlbumCardProps) {
  const { isAuthenticated } = useAuth();
  const [coverArtUrl, setCoverArtUrl] = useState<string | null>(null);
  const [coverArtError, setCoverArtError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

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

  useEffect(() => {
    const isFavorited = favorites.some(fav => fav.album_id === release.id);
    setIsFavorite(isFavorited);
  }, [favorites, release.id]);

  const handleSaveFavorite = async () => {
    if (!isAuthenticated) {
      alert("Você precisa estar loggado para salvar nos favoritos");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/users/me/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          album_id: release.id,
          album_name: release.title,
          artist_name: release["artist-credit"][0].name,
          cover_art_url: coverArtUrl,
        }),
      });

      if (response.ok) {
        setIsFavorite(true);
      } else {
        console.error("Error saving favorite:", response.statusText);
      }
    } catch (error) {
      console.error("Error saving favorite:", error);
    }
  };

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
      <button
        onClick={handleSaveFavorite}
        className={`mt-4 px-4 py-2 rounded ${isFavorite ? 'bg-gray-300' : 'bg-indigo-600 text-white'} `}
        disabled={isFavorite}
      >
        {isFavorite ? "Favorited" : "Save to Favorites"}
      </button>
    </div>
  );
}
