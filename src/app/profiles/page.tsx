"use client";

import { useEffect, useState } from "react";
import {
  type Profile,
  getProfiles,
  saveProfiles,
  setActiveProfile,
} from "@/lib/profile";

export default function ProfilesPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [name, setName] = useState("");

  useEffect(() => {
    setProfiles(getProfiles());
  }, []);

  function addProfile() {
    if (!name.trim()) return;

    const newProfile: Profile = {
      id: Date.now().toString(),
      name: name.trim(),
      avatar: "🪐",
    };

    const updated = [...profiles, newProfile];
    saveProfiles(updated);
    setProfiles(updated);
    setName("");
  }

  function selectProfile(p: Profile) {
    setActiveProfile(p);
    window.location.href = "/home";
  }

  return (
    <main style={{ padding: 60, color: "white", textAlign: "center" }}>
      <h1 style={{ fontSize: 42, marginBottom: 40 }}>Who&apos;s Watching?</h1>

      <div
        style={{ display: "flex", justifyContent: "center", gap: 30, flexWrap: "wrap" }}
      >
        {profiles.map((p) => (
          <div
            key={p.id}
            onClick={() => selectProfile(p)}
            style={{
              cursor: "pointer",
              padding: 20,
              borderRadius: 20,
              background: "rgba(255,255,255,.05)",
              minWidth: 120,
            }}
          >
            <div style={{ fontSize: 40 }}>{p.avatar}</div>
            <div>{p.name}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 50 }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New profile name"
          style={{
            padding: 10,
            borderRadius: 12,
            border: "none",
            marginRight: 10,
          }}
        />

        <button
          onClick={addProfile}
          style={{
            padding: "10px 20px",
            borderRadius: 12,
            background: "#7c3aed",
            border: "none",
            color: "white",
          }}
        >
          Add Profile
        </button>
      </div>
    </main>
  );
}
