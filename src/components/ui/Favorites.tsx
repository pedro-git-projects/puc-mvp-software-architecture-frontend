"use client";

import { useEffect, useState } from "react";
import { PythonRelease } from "@/lib/interfaces";
import { useAuth } from "@/app/providers/AuthContext";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/20/solid";
import { HeartIcon as HeartIconOutline } from "@heroicons/react/24/outline";

interface FavoriteAlbumCardProps {
  release: PythonRelease;
  favorites: PythonRelease[];
}

function FavoriteAlbumCard({ release, favorites }: FavoriteAlbumCardProps) {
  const { isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = useState<boolean>(true);

  useEffect(() => {
    const isFavorited = favorites.some(fav => fav.album_id === release.album_id);
    setIsFavorite(isFavorited);
  }, [favorites, release]);

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      alert("Você precisa estar logado para salvar nos favoritos");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const url = isFavorite
        ? `http://localhost:8000/users/me/favorites/${release.album_id}`
        : "http://localhost:8000/users/me/favorites";
      const method = isFavorite ? "DELETE" : "POST";
      const body = !isFavorite ? JSON.stringify({
        album_id: release.album_id,
        album_name: release.album_name,
        artist_name: release.artist_name,
        cover_art_url: release.cover_art_url,
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
      <img
        src={release.cover_art_url}
        alt={`${release.album_name} cover art`}
        className="w-full h-64 object-cover rounded-md mb-4"
        onError={() => setIsFavorite(true)}
      />
      <h2 className="text-xl font-bold">{release.album_name}</h2>
      <p className="text-gray-600">Artista: {release.artist_name}</p>
      <p className="text-gray-600">Data de lançamento: {release.date || "Data desconhecida"}</p>
      <p className="text-gray-600">País: {release.country || "País desconhecido"}</p>
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

export default function Favorites() {
  const { isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState<PythonRelease[]>([]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8000/users/me/favorites", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setFavorites(data);
        } else {
          console.error("Error fetching favorites:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchFavorites();
  }, [isAuthenticated]);

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Seus álbums favoritos</h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">
          Clique no coração para remover uma entrada.
          </p>
        </div>
        <div className="mx-auto mt-10 max-w-2xl border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none">
          {favorites.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8 lg:gap-8 w-full">
              {favorites.map((release: PythonRelease) => (
                <FavoriteAlbumCard key={release.album_id} release={release} favorites={favorites} />
              ))}
            </div>
          ) : (
            <p>Nenhum favorito encontrado.</p>
          )}
        </div>
      </div>
    </div>
  )
}
