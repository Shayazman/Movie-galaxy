"use client";

import { useEffect, useState } from "react";
import { Movie } from "@/lib/tmdb";
import { getComments, addComment, Comment } from "@/lib/comments";
import GlowIcon from "@/components/GlowIcon";

export default function GalaxyComments({ movie }: { movie: Movie }) {
  const [list, setList] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);

  useEffect(() => {
    setList(getComments(movie.id));
  }, [movie.id]);

  const submit = () => {
    if (!text.trim()) return;

    addComment(movie, "Galaxy User", text, rating);
    setList(getComments(movie.id));
    setText("");
  };

  return (
    <div
      className="card-glow"
      style={{
        marginTop: 24,
        padding: 16,
        borderRadius: 18,
        background: "rgba(0,0,0,.3)",
      }}
    >
      <h3>
        <span className="icon-inline">
          <GlowIcon name="spark" size={14} className="glow-icon" />
          Galaxy Reviews
        </span>
      </h3>

      <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your thoughts..."
          style={{
            flex: 1,
            minWidth: 200,
            padding: 10,
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,.2)",
            background: "#000",
            color: "white",
          }}
        />

        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          style={{
            borderRadius: 12,
            background: "#000",
            color: "white",
            padding: "8px 10px",
          }}
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              Star {n}
            </option>
          ))}
        </select>

        <button
          onClick={submit}
          style={{
            padding: "10px 14px",
            borderRadius: 12,
            background: "#7c3aed",
            border: "none",
            color: "white",
          }}
        >
          Post
        </button>
      </div>

      <div style={{ marginTop: 16 }}>
        {list.map((c) => (
          <div
            key={c.id}
            style={{
              padding: 10,
              borderBottom: "1px solid rgba(255,255,255,.1)",
            }}
          >
            <div style={{ fontSize: 12, color: "#aaa" }}>
              Star {c.rating} - {new Date(c.time).toLocaleDateString()}
            </div>
            <div>{c.text}</div>
          </div>
        ))}

        {list.length === 0 && (
          <div style={{ color: "#666", marginTop: 10 }}>
            Be first to review this movie.
          </div>
        )}
      </div>
    </div>
  );
}
