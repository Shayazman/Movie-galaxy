"use client";

import { useEffect, useState } from "react";
import { tmdb, Movie } from "@/lib/tmdb";
import Link from "next/link";

type Res = { results: Movie[] };

export default function BlogPage() {
  const [posts, setPosts] = useState<Movie[]>([]);

  useEffect(() => {
    tmdb<Res>("/trending/movie/week").then((r) =>
      setPosts(r.results.slice(0, 12))
    );
  }, []);

  return (
    <main style={{ padding: 30, color: "white" }}>
      <h1>Movie Blog</h1>

      {posts.map((m) => (
        <article key={m.id} style={{ marginBottom: 40 }}>
          <h2>{m.title || m.name}</h2>

          <p>{m.overview}</p>

          <Link href={`/movie/${m.id}`}>
            Read more →
          </Link>
        </article>
      ))}
    </main>
  );
}
