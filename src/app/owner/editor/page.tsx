"use client";

import { isOwner } from "@/lib/owner";
import { useEffect, useState } from "react";

export default function Editor() {
  const [mounted, setMounted] = useState(false);
  const [note, setNote] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  if (!isOwner()) return <div>Not allowed</div>;

  return (
    <main style={{ padding: 30, color: "white" }}>
      <h1>Movie Editor</h1>

      <textarea
        placeholder="Write custom movie notes..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
        style={{ width: "100%", height: 120 }}
      />

      <button
        onClick={() => {
          localStorage.setItem("admin-note", note);
          alert("Saved");
        }}
        style={{ marginTop: 10 }}
      >
        Save
      </button>
    </main>
  );
}
