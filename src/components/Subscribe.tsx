"use client";

import { useState } from "react";

export default function Subscribe() {
  const [email, setEmail] = useState("");

  function join() {
    const raw = localStorage.getItem("subs");
    const list: string[] = raw ? JSON.parse(raw) : [];

    if (email && !list.includes(email)) {
      list.push(email);
      localStorage.setItem("subs", JSON.stringify(list));
      alert("Subscribed!");
      setEmail("");
    }
  }

  return (
    <div style={{ margin: "30px 0" }}>
      <h3>Join Movie Galaxy</h3>

      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="email"
        style={{
          padding: 8,
          borderRadius: 10,
          border: "1px solid rgba(255,255,255,.2)",
          background: "rgba(0,0,0,.6)",
          color: "white",
          marginRight: 8,
        }}
      />

      <button
        onClick={join}
        style={{
          padding: "8px 12px",
          borderRadius: 10,
          border: "none",
          background: "#7c3aed",
          color: "white",
          cursor: "pointer",
        }}
      >
        Subscribe
      </button>
    </div>
  );
}
