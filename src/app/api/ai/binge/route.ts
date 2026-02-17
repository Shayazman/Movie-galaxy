import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Req = {
  mode: "movie" | "tv";
  mood: string;
  historyTitles: string[];
  watchlistTitles: string[];
};

function fallbackPicks(mood: string) {
  const m = mood.toLowerCase();
  if (m.includes("sci") || m.includes("space"))
    return { genres: "878,12", label: "Cosmic" };
  if (m.includes("horror") || m.includes("dark"))
    return { genres: "27,53", label: "Dark Energy" };
  if (m.includes("rom")) return { genres: "10749,18", label: "Heart Mode" };
  if (m.includes("com")) return { genres: "35", label: "Comfort Zone" };
  if (m.includes("anime")) return { genres: "16", label: "Anime Soul" };
  return { genres: "28,53", label: "Adrenaline" };
}

export async function POST(req: Request) {
  const body = (await req.json()) as Req;
  const key = process.env.OPENAI_API_KEY;

  if (!key) {
    return NextResponse.json({
      ok: true,
      ai: false,
      ...fallbackPicks(body.mood),
      reason: "No OpenAI key set. Using smart fallback.",
    });
  }

  const prompt = `
You are a binge-recommendation engine for a Netflix-style app.
Return JSON only.

User mood: ${body.mood}
Mode: ${body.mode}
Recent history: ${body.historyTitles.slice(0, 12).join(", ")}
Watchlist: ${body.watchlistTitles.slice(0, 12).join(", ")}

Return:
{
  "genres": "comma_separated_tmdb_genre_ids",
  "label": "short vibe label",
  "reason": "1 sentence why"
}
Choose genres that fit mood, avoid repeating history.
`;

  try {
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    });

    const data = (await r.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const text = data?.choices?.[0]?.message?.content || "";

    try {
      const json = JSON.parse(text);
      return NextResponse.json({ ok: true, ai: true, ...json });
    } catch {
      return NextResponse.json({
        ok: true,
        ai: false,
        ...fallbackPicks(body.mood),
        reason: "AI response parsing failed. Using fallback.",
      });
    }
  } catch {
    return NextResponse.json({
      ok: true,
      ai: false,
      ...fallbackPicks(body.mood),
      reason: "AI request failed. Using fallback.",
    });
  }
}
