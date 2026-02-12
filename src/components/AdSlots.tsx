"use client";

export default function AdSlots() {
  return (
    <section style={{ marginTop: 30 }}>
      <h2>Ad Slots</h2>

      <p>Copy your AdSense code here:</p>

      <textarea
        placeholder="<script> Adsense code </script>"
        style={{ width: "100%", height: 120 }}
      />

      <div style={{ marginTop: 20 }}>
        <h4>Preview Areas</h4>

        <div
          style={{
            height: 90,
            background: "#111",
            marginBottom: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#666",
          }}
        >
          Top Banner
        </div>

        <div
          style={{
            height: 250,
            background: "#111",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#666",
          }}
        >
          Movie Page Slot
        </div>
      </div>
    </section>
  );
}
