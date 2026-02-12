"use client";

import { useEffect, useState } from "react";
import { Movie } from "@/lib/tmdb";
import { createParty, getParties } from "@/lib/watchparty";

export default function WatchParty({ movie }: { movie: Movie }) {
  const [rooms, setRooms] = useState<any[]>([]);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    setRooms(getParties(movie.id));

    const i = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(i);
  }, [movie.id]);

  const make = () => {
    const p = createParty(movie.id);
    setRooms(getParties(movie.id));
    if (p.id) alert("Room created. Code: " + p.id);
  };

  return (
    <div className="card-glow" style={{ padding: 16, borderRadius: 18 }}>
      <h3>Watch Party</h3>

      <button
        onClick={make}
        style={{
          padding: 10,
          borderRadius: 12,
          background: "#7c3aed",
          color: "white",
          border: "none",
          margin: "10px 0",
        }}
      >
        Create Party Room
      </button>

      {rooms.map((r) => {
        const left = Math.max(0, r.time - now);

        return (
          <div key={r.id} style={{ marginTop: 8 }}>
            Room: <b>{r.id}</b> - starts in {Math.ceil(left / 1000)}s
          </div>
        );
      })}
    </div>
  );
}
