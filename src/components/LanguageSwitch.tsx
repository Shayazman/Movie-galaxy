"use client";

import { useState } from "react";

export default function LanguageSwitch() {
  const [lang, setLang] = useState("en");

  return (
    <div
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
      }}
    >
      <select
        aria-label="Language"
        value={lang}
        onChange={(e) => {
          const next = e.target.value;
          setLang(next);
          localStorage.setItem("lang", next);
          location.reload();
        }}
        style={{
          appearance: "none",
          WebkitAppearance: "none",
          MozAppearance: "none",
          height: 34,
          minWidth: 108,
          padding: "0 34px 0 12px",
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,.16)",
          background:
            "linear-gradient(135deg, rgba(124,58,237,.22), rgba(0,0,0,.5))",
          color: "white",
          fontWeight: 700,
          fontSize: 13,
          cursor: "pointer",
          outline: "none",
          boxShadow: "0 0 18px rgba(124,58,237,.2)",
        }}
      >
        <option value="en">English</option>
        <option value="sw">Swahili</option>
      </select>

      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          right: 10,
          fontSize: 10,
          color: "#c4b5fd",
          pointerEvents: "none",
        }}
      >
        v
      </span>
    </div>
  );
}
