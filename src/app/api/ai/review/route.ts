import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { title, overview, year, rating } = await req.json();

    const key = process.env.AI_API_KEY;
    const base = process.env.AI_BASE_URL || "https://api.openai.com/v1";
    const model = process.env.AI_MODEL || "gpt-4o-mini";

    if (!key) {
      return NextResponse.json({ error: "Missing AI_API_KEY" }, { status: 400 });
    }

    const prompt = `
Write a short, punchy movie review (max 120 words).
Movie: ${title} (${year || "-"})
Rating: ${rating || "-"}
Overview: ${overview || "-"}
Include: vibe, who will love it, 1 standout thing. No spoilers.
`;

    const r = await fetch(`${base}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: "You write cinematic, trendy reviews for a streaming app." },
          { role: "user", content: prompt },
        ],
        temperature: 0.8,
      }),
    });

    const data = await r.json();
    const text = data?.choices?.[0]?.message?.content?.trim?.() || "";
    return NextResponse.json({ review: text || "No review generated." });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "AI error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
