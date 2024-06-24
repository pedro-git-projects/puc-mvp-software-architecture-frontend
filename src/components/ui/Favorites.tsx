"use client";

import { useEffect, useState } from "react";
import { PythonRelease, Release } from "@/lib/interfaces";
import { useAuth } from "@/app/providers/AuthContext";

interface AlbumCardProps {
  release: PythonRelease;
}

function AlbumCard({ release }: AlbumCardProps) {
  const { isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = useState<boolean>(true);

  return (
    <div className="border rounded-lg p-4 shadow-md mb-4">
      <img
        src={release.cover_art_url}
        alt={`${release.album_name} cover art`}
        className="w-full h-64 object-cover rounded-md mb-4"
        onError={() => setCoverArtError(true)}
      />
      <h2 className="text-xl font-bold">{release.album_name}</h2>
      <p className="text-gray-600">
        Artista: {release.artist_name}
      </p>
      {release.date && <p className="text-gray-600">Data de lançamento: {release.date}</p>}
      {release.country && <p className="text-gray-600">País: {release.country}</p>}
      {release["label-info"] && release["label-info"].length > 0 && (
        <p className="text-gray-600">
          Gravadora: {release["label-info"][0].label.name}
        </p>
      )}
      <button
        className={`mt-4 px-4 py-2 rounded ${isFavorite ? 'bg-gray-300' : 'bg-indigo-600 text-white'} `}
        disabled={isFavorite}
      >
        {isFavorite ? "Favorited" : "Save to Favorites"}
      </button>
    </div>
  );
}


export default function Favorites() {
  const { isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState<Release[]>([]);

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
        console.log("Reponse ", response);


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
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-8 w-full max-w-6xl">
          {favorites.map((release: Release) => (
            <AlbumCard key={release.id} release={release} />
          ))}
        </div>
      ) : (
        <p>No favorites found.</p>
      )}
    </div>
  );
}
