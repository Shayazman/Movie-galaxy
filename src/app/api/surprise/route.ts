import { NextResponse } from "next/server";
import { tmdb } from "@/lib/tmdb";

type SurpriseMovie = { id?: number } & Record<string, unknown>;

export async function GET() {
  const r = await tmdb<{ results: SurpriseMovie[] }>(
    "/discover/movie?sort_by=popularity.desc&primary_release_date.gte=2020-01-01&vote_average.gte=6.2"
  );

  const items = (r.results || []).filter(
    (m): m is SurpriseMovie & { id: number } => typeof m?.id === "number"
  );
  const pick = items[Math.floor(Math.random() * Math.max(1, items.length))];

  return NextResponse.json({ pick: pick || null });
}
