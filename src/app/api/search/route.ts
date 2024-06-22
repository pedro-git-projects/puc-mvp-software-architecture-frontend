import { NextResponse } from "next/server";
import { MusicBrainzResponse } from "@/lib/interfaces";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const album = searchParams.get("album");

  if (!album) {
    return NextResponse.json(
      { error: "Nome do álbum é obrigatório" },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(
      `https://musicbrainz.org/ws/2/release/?query=release:${album}&fmt=json`,
      {
        headers: {
          "User-Agent": "Songboxd/1.0 (pedro.coding.contact@gmail.com)",
        },
      },
    );
    const data: MusicBrainzResponse = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data }, { status: response.status });
    }

    return NextResponse.json(data.releases);
  } catch (error) {
    return NextResponse.json(
      { error: "Falha ao buscar dados do MusicBrainz" },
      { status: 500 },
    );
  }
}
