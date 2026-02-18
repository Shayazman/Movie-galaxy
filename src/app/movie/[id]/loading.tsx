export default function LoadingMovie() {
  return (
    <main style={{ padding: 24, minHeight: "100vh", color: "white" }}>
      <section style={{ borderRadius: 26, overflow: "hidden", background: "rgba(255,255,255,.06)", height: 420 }} />
      <section style={{ marginTop: 24 }}>
        <div
          style={{
            height: 22,
            width: 220,
            borderRadius: 12,
            background: "rgba(255,255,255,.06)",
            marginBottom: 14,
          }}
        />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px,1fr))", gap: 18 }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} style={{ height: 260, borderRadius: 16, background: "rgba(255,255,255,.06)" }} />
          ))}
        </div>
      </section>
    </main>
  );
}

