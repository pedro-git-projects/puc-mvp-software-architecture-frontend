"use client";

import AlbumCard from "@/components/ui/AlbumCard";
import { Release } from "@/lib/interfaces";
import { useEffect, useState } from "react";
import { useAuth } from "../providers/AuthContext";

function SkeletonCard() {
  return (
    <div className="border rounded-lg p-4 shadow-md mb-4 animate-pulse">
      <div className="w-full h-64 bg-gray-200 rounded-md mb-4"></div>
      <div className="h-6 bg-gray-200 rounded mb-2"></div>
      <div className="h-4 bg-gray-200 rounded mb-2"></div>
      <div className="h-4 bg-gray-200 rounded mb-2"></div>
      <div className="h-4 bg-gray-200 rounded mb-2"></div>
      <div className="mt-4 h-10 bg-gray-200 rounded"></div>
    </div>
  );
}

export default function ResultsPage() {
  const { isAuthenticated } = useAuth();
  const [releases, setReleases] = useState<Release[]>(() => {
    try {
      const item = window.sessionStorage.getItem("searchResults");
      return item ? JSON.parse(item) : [];
    } catch (error) {
      console.error(error);
      return [];
    }
  });
  const [favorites, setFavorites] = useState<PythonRelease[]>([]);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);

    if (isAuthenticated) {
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
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleStorageUpdate = () => {
      try {
        const item = window.sessionStorage.getItem("searchResults");
        setReleases(item ? JSON.parse(item) : []);
      } catch (error) {
        console.error(error);
      }
    };

    window.addEventListener("storageUpdate", handleStorageUpdate);
    return () => {
      window.removeEventListener("storageUpdate", handleStorageUpdate);
    };
  }, []);

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-8 w-full max-w-6xl">
          {Array.from({ length: 8 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      {releases.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-8 w-full max-w-6xl">
          {releases.map((release: Release) => (
            <AlbumCard key={release.id} release={release} favorites={favorites} />
          ))}
        </div>
      ) : (
        <p>Sua pesquisa não retornou resultados.</p>
      )}
    </div>
  );
}
