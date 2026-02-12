"use client";

import { useState } from "react";

const langs = ["English", "Swahili", "Arabic", "French"];

export default function Languages() {
  const [active, setActive] = useState("English");

  return (
    <section style={{ marginTop: 30 }}>
      <h2>Language Center</h2>

      {langs.map((l) => (
        <button
          key={l}
          onClick={() => setActive(l)}
          style={{
            marginRight: 10,
            background: active === l ? "#7c3aed" : "#111",
            color: "white",
            padding: "8px 12px",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,.12)",
            cursor: "pointer",
          }}
        >
          {l}
        </button>
      ))}

      <p>Active: {active}</p>
    </section>
  );
}
