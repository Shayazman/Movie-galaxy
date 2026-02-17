"use client";

import Link from "next/link";
import GlowIcon from "@/components/GlowIcon";

export default function WelcomePage() {
  const ctaMainStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    textDecoration: "none",
    color: "white",
    fontWeight: 900,
    borderRadius: 14,
    padding: "12px 16px",
    background: "linear-gradient(135deg, #ff2bd6, #7c3aed, #06b6d4)",
    boxShadow: "0 0 34px rgba(124, 58, 237, 0.45)",
  } as const;

  const ctaAltStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    textDecoration: "none",
    color: "white",
    fontWeight: 800,
    borderRadius: 14,
    padding: "12px 16px",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    background: "rgba(255, 255, 255, 0.08)",
    boxShadow: "0 0 20px rgba(124, 58, 237, 0.18)",
  } as const;

  const quickChipStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    textDecoration: "none",
    color: "#f0ecff",
    fontSize: 13,
    fontWeight: 700,
    padding: "8px 11px",
    borderRadius: 12,
    border: "1px solid rgba(255, 255, 255, 0.14)",
    background: "linear-gradient(135deg, rgba(124, 58, 237, 0.22), rgba(255, 43, 214, 0.12))",
    boxShadow: "0 0 16px rgba(124, 58, 237, 0.2)",
  } as const;

  const panelLinkStyle = {
    marginTop: "auto",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    textDecoration: "none",
    color: "white",
    fontSize: 14,
    fontWeight: 800,
    borderRadius: 12,
    border: "1px solid rgba(255, 255, 255, 0.2)",
    background: "linear-gradient(135deg, rgba(124, 58, 237, 0.25), rgba(6, 182, 212, 0.2))",
    padding: "10px 12px",
    boxShadow: "0 0 24px rgba(124, 58, 237, 0.24)",
  } as const;

  const quickLinks = [
    { href: "/home", label: "Home", icon: "star" as const },
    { href: "/galaxy-picks", label: "Galaxy Picks", icon: "spark" as const },
    { href: "/surprise", label: "Oracle", icon: "shuffle" as const },
    { href: "/binge-tonight", label: "Binge Tonight", icon: "play" as const },
  ];

  const highlightCards = [
    {
      title: "AI Taste Engine",
      desc: "Learns your list and surfaces stronger picks every session.",
      icon: "spark" as const,
    },
    {
      title: "Watch Flow",
      desc: "Continue watching and jump back into your last stream fast.",
      icon: "play" as const,
    },
    {
      title: "Premium Layer",
      desc: "Unlock advanced discovery, creator tools, and clean mode.",
      icon: "star" as const,
    },
  ];

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at 20% 0%, #171333 0%, #05050a 55%)",
        color: "white",
        position: "relative",
        overflow: "hidden",
        padding: "clamp(20px, 4vw, 46px)",
        fontFamily: '"Space Grotesk", "Sora", "Segoe UI", sans-serif',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(rgba(255,255,255,.12) 1px, transparent 1px), radial-gradient(rgba(124,58,237,.24), transparent 62%)",
          backgroundSize: "38px 38px, 100% 100%",
          opacity: 0.42,
        }}
      />
      <div className="glow-orb orb-a" aria-hidden="true" />
      <div className="glow-orb orb-b" aria-hidden="true" />

      <div
        className="welcome-shell"
        style={{
          width: "min(1200px, 100%)",
          position: "relative",
          zIndex: 3,
          margin: "0 auto",
        }}
      >
        <div
          className="hero-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr .8fr",
            gap: "clamp(18px, 3vw, 32px)",
            alignItems: "stretch",
          }}
        >
          <section className="hero-left">
            <div className="launch-tag">
              <GlowIcon name="rocket" size={14} className="glow-icon" />
              Streaming Discovery Platform
            </div>

            <h1 className="welcome-title">Movie Galaxy</h1>

            <p className="hero-subtext">
              Stop wasting nights on random picks. Get high-confidence movies and shows,
              tuned to your taste DNA, mood, and watch history.
            </p>

            <div className="cta-row">
              <Link href="/home" className="cta-main" style={ctaMainStyle}>
                <GlowIcon name="spark" size={15} className="glow-icon" />
                Enter The Galaxy
              </Link>
              <Link href="/surprise" className="cta-alt" style={ctaAltStyle}>
                <GlowIcon name="shuffle" size={15} className="glow-icon" />
                Ask The Oracle
              </Link>
            </div>

            <div className="quick-links">
              {quickLinks.map((item) => (
                <Link key={item.href} href={item.href} className="quick-chip" style={quickChipStyle}>
                  <GlowIcon name={item.icon} size={13} className="glow-icon" />
                  {item.label}
                </Link>
              ))}
            </div>
          </section>

          <aside className="hero-panel">
            <div className="panel-header">
              <span className="panel-title">Live Preview</span>
              <span className="panel-pill">
                <GlowIcon name="flame" size={12} className="glow-icon" />
                Trending
              </span>
            </div>

            <div className="panel-grid">
              <div className="panel-card panel-card-strong">
                <div className="panel-stat">12K+</div>
                <div className="panel-muted">Daily picks generated</div>
              </div>
              <div className="panel-card">
                <div className="panel-stat">2020+</div>
                <div className="panel-muted">Movie ranking baseline</div>
              </div>
              <div className="panel-card">
                <div className="panel-stat">2015+</div>
                <div className="panel-muted">TV recommendation baseline</div>
              </div>
              <div className="panel-card panel-card-accent">
                <div className="panel-stat">AI</div>
                <div className="panel-muted">Taste plus mood matching</div>
              </div>
            </div>

            <Link href="/binge-tonight" className="panel-link" style={panelLinkStyle}>
              Open Binge Tonight
              <GlowIcon name="play" size={14} className="glow-icon" />
            </Link>
          </aside>
        </div>

        <section className="highlights">
          {highlightCards.map((card) => (
            <article key={card.title} className="highlight-card">
              <div className="highlight-icon">
                <GlowIcon name={card.icon} size={16} className="glow-icon" />
              </div>
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
            </article>
          ))}
        </section>
      </div>

      <style jsx>{`
        .welcome-title::before {
          display: none !important;
        }

        .welcome-shell {
          display: grid;
          gap: clamp(18px, 3vw, 30px);
        }

        .hero-left,
        .hero-panel,
        .highlight-card {
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: linear-gradient(145deg, rgba(17, 19, 40, 0.72), rgba(5, 5, 10, 0.85));
          box-shadow: 0 0 36px rgba(124, 58, 237, 0.18);
          border-radius: 24px;
        }

        .hero-left {
          padding: clamp(20px, 3vw, 34px);
        }

        .launch-tag {
          width: fit-content;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border-radius: 999px;
          padding: 6px 12px;
          border: 1px solid rgba(167, 139, 250, 0.5);
          background: rgba(124, 58, 237, 0.18);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .welcome-title {
          font-size: clamp(44px, 9vw, 88px);
          line-height: 0.95;
          margin: 14px 0 12px;
          font-weight: 900;
          letter-spacing: -0.03em;
          text-shadow: 0 0 42px rgba(124, 58, 237, 0.9);
        }

        .hero-subtext {
          margin: 0;
          max-width: 740px;
          font-size: clamp(16px, 2.2vw, 21px);
          line-height: 1.5;
          color: #d9d9e7;
        }

        .cta-row {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 26px;
        }

        .cta-main,
        .cta-alt {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          color: white;
          font-weight: 800;
          border-radius: 14px;
          padding: 12px 16px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .cta-main {
          background: linear-gradient(135deg, #ff2bd6, #7c3aed, #06b6d4);
          box-shadow: 0 0 34px rgba(124, 58, 237, 0.45);
        }

        .cta-alt {
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.06);
        }

        .cta-main:hover,
        .cta-alt:hover {
          transform: translateY(-2px);
        }

        .quick-links {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 18px;
        }

        .quick-chip {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          text-decoration: none;
          color: #f0ecff;
          font-size: 13px;
          font-weight: 700;
          padding: 8px 11px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          background: rgba(124, 58, 237, 0.14);
        }

        .hero-panel {
          padding: clamp(18px, 2.5vw, 24px);
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
        }

        .panel-title {
          font-size: 18px;
          font-weight: 900;
          letter-spacing: 0.01em;
        }

        .panel-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 800;
          padding: 5px 10px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.16);
          background: rgba(255, 255, 255, 0.08);
        }

        .panel-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .panel-card {
          border-radius: 14px;
          padding: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.04);
        }

        .panel-card-strong {
          background: linear-gradient(135deg, rgba(255, 43, 214, 0.2), rgba(124, 58, 237, 0.26));
        }

        .panel-card-accent {
          background: linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(124, 58, 237, 0.18));
        }

        .panel-stat {
          font-size: 24px;
          font-weight: 900;
          line-height: 1.1;
        }

        .panel-muted {
          margin-top: 5px;
          font-size: 12px;
          color: #cfd0df;
        }

        .panel-link {
          margin-top: auto;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          text-decoration: none;
          color: white;
          font-size: 14px;
          font-weight: 800;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.08);
          padding: 10px 12px;
        }

        .highlights {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: clamp(10px, 2vw, 16px);
        }

        .highlight-card {
          padding: 18px;
        }

        .highlight-icon {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          display: grid;
          place-items: center;
          background: rgba(124, 58, 237, 0.2);
          border: 1px solid rgba(167, 139, 250, 0.45);
        }

        .highlight-card h3 {
          margin: 12px 0 8px;
          font-size: 18px;
          font-weight: 850;
        }

        .highlight-card p {
          margin: 0;
          font-size: 14px;
          line-height: 1.45;
          color: #cdcedf;
        }

        .glow-orb {
          position: absolute;
          border-radius: 999px;
          filter: blur(26px);
          pointer-events: none;
          z-index: 1;
          animation: orbFloat 8s ease-in-out infinite;
        }

        .orb-a {
          width: clamp(180px, 32vw, 360px);
          height: clamp(180px, 32vw, 360px);
          right: -70px;
          top: -70px;
          background: radial-gradient(circle, rgba(255, 43, 214, 0.4), rgba(124, 58, 237, 0.12) 65%, transparent 75%);
        }

        .orb-b {
          width: clamp(180px, 30vw, 320px);
          height: clamp(180px, 30vw, 320px);
          left: -80px;
          bottom: -80px;
          background: radial-gradient(circle, rgba(6, 182, 212, 0.35), rgba(124, 58, 237, 0.1) 62%, transparent 75%);
          animation-delay: 0.6s;
        }

        @keyframes orbFloat {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(0, -14px, 0) scale(1.04);
          }
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
        }

        @media (max-width: 980px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
          }

          .highlights {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .cta-row {
            flex-direction: column;
            align-items: stretch;
          }

          .cta-main,
          .cta-alt {
            justify-content: center;
          }

          .panel-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
