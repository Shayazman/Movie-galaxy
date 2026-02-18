"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function readJSON(key: string) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export default function AdminPage() {
  const router = useRouter();
  const [ok, setOk] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const allowed =
      localStorage.getItem("mg_admin") === "1" ||
      localStorage.getItem("movie-galaxy-admin") === "1";

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOk(allowed);
    setChecked(true);

    if (!allowed) {
      router.replace("/admin/login");
    }
  }, [router]);

  if (!checked) return null;
  if (!ok) return null;

  const watchlist = readJSON("movie-galaxy-list");
  const tonight = (() => {
    try {
      const raw = localStorage.getItem("tonight");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  return (
    <main style={{ minHeight: "100vh", padding: 32, background: "#05050a", color: "white" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontSize: 46, fontWeight: 900 }}>Admin Dashboard</h1>
        <button
          onClick={async () => {
            localStorage.removeItem("mg_admin");
            localStorage.removeItem("movie-galaxy-admin");
            try {
              await fetch("/api/admin/logout", { method: "POST" });
            } catch {}
            router.replace("/admin/login");
          }}
          style={{
            padding: "10px 14px",
            borderRadius: 14,
            border: "1px solid rgba(255,255,255,.14)",
            background: "rgba(255,255,255,.06)",
            color: "white",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      <div
        style={{
          marginTop: 22,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 16,
        }}
      >
        <div
          style={{
            padding: 18,
            borderRadius: 18,
            background: "rgba(255,255,255,.05)",
            border: "1px solid rgba(255,255,255,.10)",
          }}
        >
          <div style={{ color: "#bbb" }}>My List Count</div>
          <div style={{ fontSize: 34, fontWeight: 900 }}>{watchlist.length}</div>
        </div>

        <div
          style={{
            padding: 18,
            borderRadius: 18,
            background: "rgba(255,255,255,.05)",
            border: "1px solid rgba(255,255,255,.10)",
          }}
        >
          <div style={{ color: "#bbb" }}>Tonight</div>
          <div style={{ fontSize: 16, fontWeight: 900 }}>
            {tonight?.title || tonight?.name || "-"}
          </div>
        </div>

        <div
          style={{
            padding: 18,
            borderRadius: 18,
            background: "rgba(255,255,255,.05)",
            border: "1px solid rgba(255,255,255,.10)",
          }}
        >
          <div style={{ color: "#bbb" }}>Deploy Mode</div>
          <div style={{ fontSize: 16, fontWeight: 900 }}>APP Router OK</div>
        </div>
      </div>
    </main>
  );
}
