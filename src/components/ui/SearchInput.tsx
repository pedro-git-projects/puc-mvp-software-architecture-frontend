import {
  MagnifyingGlassIcon,
  MusicalNoteIcon,
} from "@heroicons/react/20/solid";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function SearchInput() {
  const [album, setAlbum] = useState<string>("");
  const router = useRouter();
  const pathname = usePathname();

  const handleSearch = async () => {
    if (album.trim() === "") return;

    // Clear previous results
    sessionStorage.removeItem("searchResults");

    try {
      const response = await fetch(
        `/api/search?album=${encodeURIComponent(album)}`,
      );
      if (response.ok) {
        const data = await response.json();

        sessionStorage.setItem("searchResults", JSON.stringify(data));
        window.dispatchEvent(new Event("storageUpdate"));

        if (pathname !== "/results") {
          router.push("/results");
        } else {
          router.refresh();
        }
      } else {
        console.error("Error fetching data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div>
      <div className="mt-2 flex rounded-md shadow-sm">
        <div className="relative flex flex-grow items-stretch focus-within:z-10">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MusicalNoteIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </div>
          <input
            type="text"
            name="album"
            id="album"
            className="block w-full rounded-none rounded-l-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="Insira o nome do álbum"
            value={album}
            onChange={e => setAlbum(e.target.value)}
          />
        </div>
        <button
          type="button"
          onClick={handleSearch}
          className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          <MagnifyingGlassIcon
            className="-ml-0.5 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  );
}
