export default function LoadingHome() {
  return (
    <main style={{ padding: 32, minHeight: "100vh", color: "white" }}>
      <div
        style={{
          height: 46,
          width: 320,
          borderRadius: 16,
          background: "rgba(255,255,255,.06)",
          marginBottom: 18,
        }}
      />
      <div
        style={{
          height: "60vh",
          borderRadius: 26,
          background: "rgba(255,255,255,.06)",
          marginBottom: 34,
        }}
      />
      {Array.from({ length: 4 }).map((_, i) => (
        <section key={i} style={{ marginBottom: 50 }}>
          <div
            style={{
              height: 22,
              width: 220,
              borderRadius: 12,
              background: "rgba(255,255,255,.06)",
              marginBottom: 16,
            }}
          />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px,1fr))", gap: 24 }}>
            {Array.from({ length: 12 }).map((__, j) => (
              <div key={j} style={{ height: 260, borderRadius: 16, background: "rgba(255,255,255,.06)" }} />
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}

