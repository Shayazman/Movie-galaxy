"use client";

export default function ShareBar({ title }: { title: string }) {
  const url =
    typeof window !== "undefined" ? window.location.href : "";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      alert("Link copied");
    } catch {
      alert("Copy failed");
    }
  };

  const share = async () => {
    // @ts-ignore
    if (navigator.share) {
      // @ts-ignore
      await navigator.share({ title, url });
    } else {
      await copy();
    }
  };

  return (
    <div
      className="card-glow shine"
      style={{
        display: "flex",
        gap: 10,
        alignItems: "center",
        justifyContent: "space-between",
        padding: 14,
        borderRadius: 18,
        background: "rgba(255,255,255,.05)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div style={{ fontWeight: 800 }}>Share this movie</div>

      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={share}
          style={{
            padding: "10px 14px",
            borderRadius: 14,
            border: "none",
            color: "white",
            cursor: "pointer",
            background: "linear-gradient(135deg,#7c3aed,#4c1d95)",
          }}
        >
          Share
        </button>

        <button
          onClick={copy}
          style={{
            padding: "10px 14px",
            borderRadius: 14,
            border: "1px solid rgba(255,255,255,.16)",
            color: "white",
            cursor: "pointer",
            background: "rgba(255,255,255,.06)",
          }}
        >
          Copy
        </button>
      </div>
    </div>
  );
}
