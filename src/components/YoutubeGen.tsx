"use client";

import { Movie } from "@/lib/tmdb";

export function YoutubeGen({ movie }: { movie: Movie }) {
  const name = movie.title || movie.name || "Untitled";
  const displayFont =
    '"Orbitron","Rajdhani","Segoe UI","Trebuchet MS",sans-serif';
  const titleFont =
    '"Rajdhani","Orbitron","Segoe UI","Trebuchet MS",sans-serif';
  const descriptionFont =
    '"JetBrains Mono","Fira Code","Consolas","Courier New",monospace';
  const year = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "";

  const title = `${name} ${year ? "(" + year + ")" : ""} - Watch Tonight`;

  const desc = `
${name}
Rating: ${movie.vote_average}

${movie.overview || ""}

#movies #film #galaxypicks
  `;

  function copy(text: string) {
    navigator.clipboard.writeText(text).catch(() => {});
  }

  return (
    <section
      className="card-glow"
      style={{
        marginTop: 20,
        padding: 16,
        borderRadius: 18,
        background:
          "linear-gradient(135deg, rgba(124,58,237,.14), rgba(0,0,0,.55))",
        border: "1px solid rgba(255,255,255,.1)",
      }}
    >
      <h3
        style={{
          margin: 0,
          marginBottom: 12,
          fontSize: 22,
          fontFamily: displayFont,
          letterSpacing: 0.8,
          textTransform: "uppercase",
          textShadow: "0 0 18px rgba(124,58,237,.45)",
        }}
      >
        YouTube Kit
      </h3>

      <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8 }}>
        <div style={{ fontSize: 12, color: "#bdbdbd", fontFamily: displayFont, letterSpacing: 0.5 }}>
          Title
        </div>
        <button
          onClick={() => copy(title)}
          style={{
            marginLeft: "auto",
            padding: "6px 10px",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,.16)",
            background: "rgba(255,255,255,.06)",
            color: "white",
            cursor: "pointer",
            fontFamily: displayFont,
            letterSpacing: 0.4,
            textTransform: "uppercase",
          }}
        >
          Copy
        </button>
      </div>

      <textarea
        value={title}
        style={{
          width: "100%",
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,.14)",
          background: "rgba(0,0,0,.55)",
          color: "white",
          padding: 10,
          marginBottom: 12,
          resize: "vertical",
          fontFamily: titleFont,
          fontSize: 16,
          fontWeight: 700,
          letterSpacing: 0.35,
          lineHeight: 1.35,
        }}
        readOnly
      />

      <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8 }}>
        <div style={{ fontSize: 12, color: "#bdbdbd", fontFamily: displayFont, letterSpacing: 0.5 }}>
          Description
        </div>
        <button
          onClick={() => copy(desc)}
          style={{
            marginLeft: "auto",
            padding: "6px 10px",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,.16)",
            background: "rgba(255,255,255,.06)",
            color: "white",
            cursor: "pointer",
            fontFamily: displayFont,
            letterSpacing: 0.4,
            textTransform: "uppercase",
          }}
        >
          Copy
        </button>
      </div>

      <textarea
        value={desc}
        rows={7}
        style={{
          width: "100%",
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,.14)",
          background: "rgba(0,0,0,.55)",
          color: "white",
          padding: 10,
          resize: "vertical",
          fontFamily: descriptionFont,
          fontSize: 13,
          lineHeight: 1.6,
        }}
        readOnly
      />
    </section>
  );
}
