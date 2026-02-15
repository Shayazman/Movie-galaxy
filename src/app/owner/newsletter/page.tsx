"use client";

import { useState } from "react";
import { isOwner, ownerLogin } from "@/lib/owner";

export default function OwnerNewsletter() {
  const [pass, setPass] = useState("");
  const [subject, setSubject] = useState("Movie Galaxy Weekly");
  const [content, setContent] = useState("Top picks this week...\n\n1)\n2)\n3)");
  const [status, setStatus] = useState("");

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

  async function send() {
    setStatus("Sending...");
    const res = await fetch("/api/newsletter/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, content }),
    });
    const data = await res.json();
    setStatus(res.ok ? `Sent to ${data.count} subscribers` : data.error || "Failed");
  }

  return (
    <main style={{ padding: 30, color: "white" }}>
      <h1>Newsletter Sender</h1>

      <input value={subject} onChange={(e) => setSubject(e.target.value)} style={{ width: "100%", padding: 10 }} />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{ width: "100%", height: 240, marginTop: 10, padding: 10 }}
      />

      <button onClick={send} style={{ marginTop: 12, padding: "10px 16px", borderRadius: 14 }}>
        Send Newsletter
      </button>

      <div style={{ marginTop: 10, color: "#bbb" }}>{status}</div>
    </main>
  );
}
