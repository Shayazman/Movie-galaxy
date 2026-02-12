export default function SupportBox() {
  return (
    <div
      className="card-glow shine"
      style={{
        marginTop: 16,
        padding: 16,
        borderRadius: 18,
        background: "linear-gradient(135deg,rgba(255,200,0,.10),rgba(124,58,237,.10))",
      }}
    >
      <div style={{ fontWeight: 900, marginBottom: 8 }}>Support Movie Galaxy</div>
      <div style={{ color: "#bbb", fontSize: 13, marginBottom: 10 }}>
        If you love this project, support helps us grow.
      </div>
      <button
        onClick={() => alert("Add your payment link later")}
        style={{
          padding: "10px 14px",
          borderRadius: 14,
          border: "none",
          color: "black",
          cursor: "pointer",
          fontWeight: 900,
          background: "linear-gradient(135deg,#facc15,#fde68a)",
        }}
      >
        Add Payment Link
      </button>
    </div>
  );
}
