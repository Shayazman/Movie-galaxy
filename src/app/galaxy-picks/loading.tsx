export default function LoadingGalaxyPicks() {
  return (
    <main style={{ padding: "80px 40px", minHeight: "100vh", color: "white" }}>
      <div
        style={{
          height: 54,
          width: 360,
          borderRadius: 18,
          background: "rgba(255,255,255,.06)",
          marginBottom: 14,
        }}
      />
      <div
        style={{
          height: 18,
          width: 320,
          borderRadius: 14,
          background: "rgba(255,255,255,.06)",
          marginBottom: 60,
        }}
      />
      {Array.from({ length: 3 }).map((_, i) => (
        <section key={i} style={{ marginBottom: 90 }}>
          <div
            style={{
              height: 38,
              width: 420,
              borderRadius: 18,
              background: "rgba(255,255,255,.06)",
              marginBottom: 12,
            }}
          />
          <div
            style={{
              height: 18,
              width: 300,
              borderRadius: 14,
              background: "rgba(255,255,255,.06)",
              marginBottom: 34,
            }}
          />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: 28 }}>
            {Array.from({ length: 6 }).map((__, j) => (
              <div key={j} style={{ height: 290, borderRadius: 16, background: "rgba(255,255,255,.06)" }} />
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}

