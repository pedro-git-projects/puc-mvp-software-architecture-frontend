"use client";

import { useEffect, useState } from "react";
import { PythonRelease, Release } from "@/lib/interfaces";
import { useAuth } from "@/app/providers/AuthContext";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/20/solid";
import { HeartIcon as HeartIconOutline } from "@heroicons/react/24/outline";

interface AlbumCardProps {
  release: Release | PythonRelease;
  favorites: PythonRelease[];
}

export default function AlbumCard({ release, favorites }: AlbumCardProps) {
  const { isAuthenticated } = useAuth();
  const [coverArtUrl, setCoverArtUrl] = useState<string | null>(null);
  const [coverArtError, setCoverArtError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  useEffect(() => {
    if ('cover_art_url' in release) {
      setCoverArtUrl(release.cover_art_url);
      setLoading(false);
    } else {
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
    }
  }, [release]);

  useEffect(() => {
    const isFavorited = favorites.some(fav => fav.album_id === release.id);
    setIsFavorite(isFavorited);
  }, [favorites, release.id]);

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      alert("Você precisa estar logado para salvar nos favoritos");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const url = isFavorite
        ? `http://localhost:8000/users/me/favorites/${release.id}`
        : "http://localhost:8000/users/me/favorites";
      const method = isFavorite ? "DELETE" : "POST";
      const body = !isFavorite ? JSON.stringify({
        album_id: release.id,
        album_name: release.title || release.album_name,
        artist_name: release["artist-credit"] ? release["artist-credit"][0].name : release.artist_name,
        cover_art_url: coverArtUrl,
      }) : null;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body,
      });

      if (response.ok) {
        setIsFavorite(!isFavorite);
      } else {
        console.error("Error toggling favorite:", response.statusText);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
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
            alt={`${release.title || release.album_name} cover art`}
            className="w-full h-64 object-cover rounded-md mb-4"
            onError={() => setCoverArtError(true)}
          />
        )
      )}
      <h2 className="text-xl font-bold">{release.title || release.album_name}</h2>
      <p className="text-gray-600">
        Artista:{" "}
        {release["artist-credit"] && release["artist-credit"].length > 0
          ? release["artist-credit"][0].name
          : release.artist_name || "Artista Desconhecido"}
      </p>
      <p className="text-gray-600">Data de lançamento: {release.date}</p>
      <p className="text-gray-600">País: {release.country}</p>
      {release["label-info"] && release["label-info"].length > 0 && (
        <p className="text-gray-600">
          Gravadora: {release["label-info"][0].label.name}
        </p>
      )}
      <button
        onClick={handleToggleFavorite}
        className="mt-4 px-4 py-2"
      >
        {isFavorite ? <HeartIconSolid className="h-6 w-6 text-indigo-600" /> : <HeartIconOutline className="h-6 w-6 text-indigo-600" />}
      </button>
    </div>
  );
}
