"use client";

import AlbumCard from "@/components/ui/AlbumCard";
import { Release } from "@/lib/interfaces";
import { useEffect, useState } from "react";

const LoadingSkeleton = () => {
  return (
    <div className="animate-pulse flex flex-col items-center justify-center p-4 border rounded-lg bg-white shadow-md">
      <div className="w-24 h-24 bg-gray-300 rounded-md"></div>
      <div className="mt-2 w-32 h-4 bg-gray-300 rounded"></div>
      <div className="mt-2 w-20 h-4 bg-gray-300 rounded"></div>
    </div>
  );
};

export default function ResultsPage() {
  const [releases, setReleases] = useState<Release[]>(() => {
    try {
      const item = window.sessionStorage.getItem("searchResults");
      return item ? JSON.parse(item) : [];
    } catch (error) {
      console.error(error);
      return [];
    }
  });

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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      {releases.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-8 w-full max-w-6xl">
          {releases.map((release: Release) => (
            <AlbumCard key={release.id} release={release} />
          ))}
        </div>
      ) : (
        <p>Sua pesquisa não retornou resultados.</p>
      )}
    </div>
  );
}
