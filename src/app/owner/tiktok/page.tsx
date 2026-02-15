"use client";

import { useState } from "react";
import { isOwner, ownerLogin } from "@/lib/owner";

export default function TikTokGen() {
  const [pass, setPass] = useState("");
  const [movie, setMovie] = useState("");
  const [mood, setMood] = useState("HYPE");

  if (!isOwner()) {
    return (
      <main style={{ padding: 30, color: "white" }}>
        <h1>Owner Login</h1>
        <input value={pass} onChange={(e) => setPass(e.target.value)} placeholder="Owner pass" />
        <button
          onClick={() => {
            const ok = ownerLogin(pass);
            if (!ok) alert("Wrong pass");
            else location.reload();
          }}
        >
          Login
        </button>
      </main>
    );
  }

  const caption = (() => {
    const base = `${movie || "This movie"} is crazy...`;
    if (mood === "HYPE") return `${base}\nWatch till the end.\n#movie #movietok #film #moviegalaxy`;
    if (mood === "SAD") return `${base}\nNot emotionally ready.\n#movie #cinema #moviegalaxy`;
    if (mood === "SCIFI") return `${base}\nMind blown.\n#scifi #movie #moviegalaxy`;
    return `${base}\nWould you watch this?\n#movies #moviegalaxy`;
  })();

  return (
    <main style={{ padding: 30, color: "white" }}>
      <h1>TikTok Caption Generator</h1>

      <input
        value={movie}
        onChange={(e) => setMovie(e.target.value)}
        placeholder="Movie title"
        style={{ width: "100%", padding: 10 }}
      />

      <select value={mood} onChange={(e) => setMood(e.target.value)} style={{ marginTop: 10, padding: 10 }}>
        <option value="HYPE">HYPE</option>
        <option value="SAD">SAD</option>
        <option value="SCIFI">SCIFI</option>
        <option value="QUESTION">QUESTION</option>
      </select>

      <textarea value={caption} readOnly style={{ width: "100%", height: 180, marginTop: 10, padding: 10 }} />

      <button onClick={() => navigator.clipboard.writeText(caption)} style={{ marginTop: 10, padding: "10px 16px", borderRadius: 14 }}>
        Copy Caption
      </button>
    </main>
  );
}
