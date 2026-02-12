"use client";

import { isOwner } from "@/lib/owner";
import { useEffect, useState } from "react";

export default function YouTubeGen() {
  const [mounted, setMounted] = useState(false);
  const [title, setTitle] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  if (!isOwner()) return <div>No access</div>;

  const desc = `
${title}

Watch on Movie Galaxy
Best movies of 2026
Powered by TMDb

#movies #film #moviegalaxy
`;

  return (
    <main style={{ padding: 30, color: "white" }}>
      <h1>YouTube Generator</h1>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Movie name"
        style={{
          padding: 8,
          borderRadius: 10,
          border: "1px solid rgba(255,255,255,.2)",
          background: "rgba(0,0,0,.6)",
          color: "white",
          marginBottom: 10,
        }}
      />

      <textarea
        value={desc}
        style={{ width: "100%", height: 180 }}
        readOnly
      />

      <button
        onClick={() => navigator.clipboard.writeText(desc)}
        style={{ marginTop: 10 }}
      >
        Copy Description
      </button>
    </main>
  );
}
