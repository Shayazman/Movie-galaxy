"use client";

import { useState } from "react";
import { Movie } from "@/lib/tmdb";
import { addToFolder } from "@/lib/folders";

export default function FolderManager({ movie }: { movie: Movie }) {
  const [name, setName] = useState("");

  const save = () => {
    if (!name.trim()) return;
    addToFolder(name, movie.id);
    alert("Saved to " + name);
    setName("");
  };

  return (
    <div style={{ marginTop: 20 }}>
      <h4>Save to folder</h4>

      <input
        placeholder="Weekend / With friends..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{
          padding: 8,
          borderRadius: 10,
          background: "black",
          color: "white",
          border: "1px solid rgba(255,255,255,.2)",
          marginRight: 8,
        }}
      />

      <button
        onClick={save}
        style={{
          padding: "8px 12px",
          borderRadius: 10,
          border: "1px solid rgba(255,255,255,.16)",
          background: "rgba(255,255,255,.06)",
          color: "white",
        }}
      >
        Save
      </button>
    </div>
  );
}
