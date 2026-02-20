"use client";

import { signIn } from "next-auth/react";

export default function Login() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", color: "white" }}>
      <button
        onClick={() => signIn("google")}
        style={{
          padding: "14px 20px",
          borderRadius: 12,
          background: "linear-gradient(135deg,#7c3aed,#4c1d95)",
          border: "none",
          color: "white",
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        Continue with Google
      </button>
    </main>
  );
}
