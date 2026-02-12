"use client";

import { isOwner } from "@/lib/owner";
import { useEffect, useState } from "react";

export default function Analytics() {
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState({
    visits: 0,
    tonight: 0,
    list: 0,
  });

  useEffect(() => {
    setMounted(true);
    const t = localStorage.getItem("tonight");
    const l = localStorage.getItem("movie-galaxy-list");

    setStats({
      visits: Number(localStorage.getItem("visits") || 1),
      tonight: t ? 1 : 0,
      list: l ? JSON.parse(l).length : 0,
    });
  }, []);

  if (!mounted) return null;
  if (!isOwner()) return <div>Not allowed</div>;

  return (
    <main style={{ padding: 30, color: "white" }}>
      <h1>Analytics</h1>

      <div>Site Visits: {stats.visits}</div>
      <div>Tonight Picks: {stats.tonight}</div>
      <div>My List Items: {stats.list}</div>
    </main>
  );
}
