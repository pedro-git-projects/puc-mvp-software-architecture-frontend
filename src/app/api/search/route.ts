import { NextResponse } from "next/server";

async function fetchWithRetry(url: string, options: RequestInit, retries: number = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) {
        return response;
      }
      console.warn(`Attempt ${i + 1} failed: ${response.statusText}`);
    } catch (error) {
      console.warn(`Attempt ${i + 1} error: ${error}`);
      if (i === retries - 1) {
        throw error;
      }
    }
  }
  throw new Error("All retry attempts failed");
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const album = searchParams.get("album");

  if (!album) {
    console.error("Album name is required");
    return NextResponse.json(
      { error: "Nome do álbum é obrigatório" },
      { status: 400 },
    );
  }

  try {
    console.log(`Fetching album: ${album}`);
    const response = await fetchWithRetry(
      `https://musicbrainz.org/ws/2/release/?query=release:${album}&fmt=json`,
      {
        headers: {
          "User-Agent": "Songboxd/1.0 (pedro.coding.contact@gmail.com)",
        },
      },
    );

    console.log(`Response status: ${response.status}`);
    const data = await response.json();

    console.log("Response data:", data);

    if (!response.ok) {
      console.error("Error fetching from MusicBrainz:", data);
      return NextResponse.json({ error: data }, { status: response.status });
    }

    return NextResponse.json(data.releases);
  } catch (error) {
    console.error("Internal server error:", error);
    return NextResponse.json(
      { error: "Falha ao buscar dados do MusicBrainz" },
      { status: 500 },
    );
  }
}
