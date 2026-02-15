"use client";

import { useEffect, useState } from "react";

type Metric = { label: string; value: string };

export default function AdminPage() {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/metrics")
      .then((r) => r.json())
      .then((d) => setMetrics(d.metrics || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main style={{ padding: 28, color: "white" }}>
      <h1 style={{ fontSize: 34, fontWeight: 900, marginBottom: 10 }}>
        Admin Dashboard
      </h1>
      <p style={{ color: "#bbb", marginBottom: 22 }}>
        Private analytics + controls.
      </p>

      {loading ? (
        <div style={{ color: "#aaa" }}>Loading metrics...</div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
            gap: 16,
          }}
        >
          {metrics.map((m) => (
            <div
              key={m.label}
              style={{
                borderRadius: 18,
                padding: 16,
                background: "rgba(255,255,255,.05)",
                border: "1px solid rgba(255,255,255,.08)",
                boxShadow: "0 0 30px rgba(124,58,237,.12)",
              }}
            >
              <div style={{ color: "#aaa", fontSize: 12 }}>{m.label}</div>
              <div style={{ fontSize: 26, fontWeight: 900 }}>{m.value}</div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

