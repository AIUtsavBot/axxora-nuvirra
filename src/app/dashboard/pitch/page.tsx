"use client";

import React, { useState, useEffect } from "react";

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  content: React.ReactNode;
  visual: React.ReactNode;
}

export default function PitchDeckPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: Slide[] = [
    {
      id: 1,
      title: "Distributed Intelligence in Modern CRM",
      subtitle: "The Nuvirra Ops CRM Paradigm",
      content: (
        <div style={{ display: "grid", gap: "16px" }}>
          <p className="hero-copy" style={{ fontSize: "1.05rem" }}>
            Traditional CRMs rely on monolithic centralized servers for all business processes, creating system bottlenecks, latency, and single points of failure.
          </p>
          <p className="hero-copy" style={{ fontSize: "1.05rem" }}>
            <strong>Nuvirra Ops CRM</strong> introduces a distributed intelligence approach: partitioning workload and decision-making logic between the edge client, serverless execution lanes, and dedicated autonomous communication agents.
          </p>
          <div className="callout-grid" style={{ gridTemplateColumns: "1fr", gap: "12px", marginTop: "12px" }}>
            <div className="callout" style={{ margin: 0 }}>
              <strong>Localized Execution First</strong>
              <span>Heavy data validation and preview actions run on the client, minimizing unnecessary cloud database computation.</span>
            </div>
            <div className="callout" style={{ margin: 0 }}>
              <strong>Specialized Agent Nodes</strong>
              <span>WhatsApp (Unipile), Telegram bots, and Gemini synthesis act as autonomous nodes operating asynchronously.</span>
            </div>
          </div>
        </div>
      ),
      visual: (
        <div style={{ position: "relative", width: "100%", height: "100%", minHeight: "280px", display: "grid", placeItems: "center" }}>
          <div style={{ position: "relative", width: "240px", height: "240px" }}>
            {/* Center Node */}
            <div style={{
              position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
              width: "80px", height: "80px", borderRadius: "24px",
              background: "linear-gradient(135deg, var(--accent), var(--accent-deep))",
              display: "grid", placeItems: "center", color: "#fff", fontWeight: "bold", fontSize: "0.9rem",
              boxShadow: "0 12px 30px rgba(184, 92, 56, 0.4)", zIndex: 10
            }}>
              Orchestrator
            </div>
            {/* Satellite Nodes */}
            <div className="pulse-slow" style={{
              position: "absolute", top: "0", left: "50%", transform: "translateX(-50%)",
              width: "50px", height: "50px", borderRadius: "50%", background: "var(--teal)",
              display: "grid", placeItems: "center", color: "#fff", fontSize: "0.75rem", fontWeight: "bold"
            }}>
              Gemini AI
            </div>
            <div className="pulse-slow" style={{
              position: "absolute", bottom: "0", left: "50%", transform: "translateX(-50%)",
              width: "50px", height: "50px", borderRadius: "50%", background: "var(--gold)",
              display: "grid", placeItems: "center", color: "#fff", fontSize: "0.75rem", fontWeight: "bold"
            }}>
              Edge Client
            </div>
            <div className="pulse-slow" style={{
              position: "absolute", top: "50%", left: "0", transform: "translateY(-50%)",
              width: "50px", height: "50px", borderRadius: "50%", background: "#483524",
              display: "grid", placeItems: "center", color: "#fff", fontSize: "0.75rem", fontWeight: "bold"
            }}>
              Telegram
            </div>
            <div className="pulse-slow" style={{
              position: "absolute", top: "50%", right: "0", transform: "translateY(-50%)",
              width: "50px", height: "50px", borderRadius: "50%", background: "var(--accent-deep)",
              display: "grid", placeItems: "center", color: "#fff", fontSize: "0.75rem", fontWeight: "bold"
            }}>
              Unipile
            </div>
            {/* SVG Connecting lines */}
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 1 }}>
              <line x1="50%" y1="50%" x2="50%" y2="10%" stroke="var(--stroke)" strokeWidth="2" strokeDasharray="4" />
              <line x1="50%" y1="50%" x2="50%" y2="90%" stroke="var(--stroke)" strokeWidth="2" strokeDasharray="4" />
              <line x1="50%" y1="50%" x2="10%" y2="50%" stroke="var(--stroke)" strokeWidth="2" strokeDasharray="4" />
              <line x1="50%" y1="50%" x2="90%" y2="50%" stroke="var(--stroke)" strokeWidth="2" strokeDasharray="4" />
            </svg>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "The Problem of Centralization",
      subtitle: "Bottlenecks in Modern Workspaces",
      content: (
        <div style={{ display: "grid", gap: "16px" }}>
          <p className="hero-copy" style={{ fontSize: "1.05rem" }}>
            When operations scale, standard CRM architectures encounter severe challenges:
          </p>
          <div style={{ display: "grid", gap: "12px", marginTop: "8px" }}>
            <div className="priority-card" style={{ margin: 0, padding: "14px" }}>
              <div>
                <strong>High Infrastructure Bills</strong>
                <p style={{ margin: "4px 0 0", fontSize: "0.9rem" }}>Constant database roundtrips just to validate, preview, and parse file formats (e.g. CSVs) exhaust server resources.</p>
              </div>
              <div className="priority-level high">Resource Drain</div>
            </div>
            <div className="priority-card" style={{ margin: 0, padding: "14px" }}>
              <div>
                <strong>Workflow Bottlenecks</strong>
                <p style={{ margin: "4px 0 0", fontSize: "0.9rem" }}>Single-server architectures process queues sequentially, creating massive backlogs in message responses and campaign releases.</p>
              </div>
              <div className="priority-level high">Sequential Lag</div>
            </div>
            <div className="priority-card" style={{ margin: 0, padding: "14px" }}>
              <div>
                <strong>Fragile Channel Integrations</strong>
                <p style={{ margin: "4px 0 0", fontSize: "0.9rem" }}>Direct monolithic connections to multiple chat platforms crash when API rate limits are hit or when third-party servers drop offline.</p>
              </div>
              <div className="priority-level medium">API Lockups</div>
            </div>
          </div>
        </div>
      ),
      visual: (
        <div style={{ position: "relative", width: "100%", height: "100%", minHeight: "280px", display: "grid", placeItems: "center" }}>
          <div style={{ width: "80%", background: "rgba(181, 66, 66, 0.08)", border: "1px dashed var(--danger)", borderRadius: "20px", padding: "24px", textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: "8px" }}>🛑</div>
            <h4 className="tone-danger" style={{ margin: 0, fontFamily: "var(--font-heading)" }}>The Monolith Bottleneck</h4>
            <p style={{ fontSize: "0.9rem", color: "var(--muted)", margin: "8px 0 0" }}>
              Client requests, chat streams, database reads, and third-party integrations clogging a single centralized execution pipeline.
            </p>
            <div style={{ display: "flex", gap: "6px", justifyContent: "center", marginTop: "16px" }}>
              <span className="tag" style={{ background: "rgba(181,66,66,0.15)", color: "var(--danger)", borderColor: "rgba(181,66,66,0.2)" }}>High Latency</span>
              <span className="tag" style={{ background: "rgba(181,66,66,0.15)", color: "var(--danger)", borderColor: "rgba(181,66,66,0.2)" }}>Scale Limits</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Client-Side Intelligence",
      subtitle: "The Edge Compute Layer",
      content: (
        <div style={{ display: "grid", gap: "16px" }}>
          <p className="hero-copy" style={{ fontSize: "1.05rem" }}>
            Nuvirra shifts the primary data processing workload directly to the client's browser. This utilizes end-user devices as active edge compute nodes.
          </p>
          <div style={{ display: "grid", gap: "12px", marginTop: "8px" }}>
            <div className="callout" style={{ margin: 0 }}>
              <strong>Zero-Server CSV Validation</strong>
              <span>CSV imports are parsed, analyzed, validated for column compliance, and previewed directly in the client browser before a single database query is fired.</span>
            </div>
            <div className="callout" style={{ margin: 0 }}>
              <strong>Local Backup & Persistence</strong>
              <span>If Supabase is unconfigured or experiences network downtime, the client seamlessly shifts state synchronization to local browser storage, ensuring uninterrupted operations.</span>
            </div>
            <div className="callout" style={{ margin: 0 }}>
              <strong>Instant Dynamic Rendering</strong>
              <span>Filtering, sorting, and analytics computations are performed locally on pre-fetched state caches, bringing page response times down to under 5ms.</span>
            </div>
          </div>
        </div>
      ),
      visual: (
        <div style={{ position: "relative", width: "100%", height: "100%", minHeight: "280px", display: "grid", placeItems: "center" }}>
          <div style={{ width: "90%", padding: "20px", borderRadius: "20px", background: "var(--panel-strong)", border: "1px solid var(--stroke)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--stroke)", paddingBottom: "10px", marginBottom: "12px" }}>
              <strong style={{ fontSize: "0.85rem", textTransform: "uppercase", color: "var(--muted)" }}>Client-Side Browser</strong>
              <span className="tag" style={{ fontSize: "0.75rem", padding: "4px 8px" }}>Edge Parsing</span>
            </div>
            <div style={{ display: "grid", gap: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", background: "rgba(47,107,102,0.06)", padding: "8px 12px", borderRadius: "8px" }}>
                <span>Validate CSV format</span>
                <span className="tone-teal">✓ Success (Local)</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", background: "rgba(47,107,102,0.06)", padding: "8px 12px", borderRadius: "8px" }}>
                <span>Deduplicate records</span>
                <span className="tone-teal">✓ Success (Local)</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", background: "rgba(215,157,69,0.08)", padding: "8px 12px", borderRadius: "8px" }}>
                <span>DB Write Payload</span>
                <span className="tone-gold">Ready for Push</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Serverless Gateways",
      subtitle: "The Cloud Orchestration Hub",
      content: (
        <div style={{ display: "grid", gap: "16px" }}>
          <p className="hero-copy" style={{ fontSize: "1.05rem" }}>
            The middle tier utilizes light, ephemeral serverless execution runtimes hosted on Vercel, feeding into Supabase's secure real-time replication database.
          </p>
          <div style={{ display: "grid", gap: "12px", marginTop: "8px" }}>
            <div className="callout" style={{ margin: 0 }}>
              <strong>Stateless Transit Points</strong>
              <span>API routes and Server Actions spin up instantly to process actions (e.g. initiating WhatsApp campaigns or calling Gemini) and teardown immediately, resulting in zero idle CPU fees.</span>
            </div>
            <div className="callout" style={{ margin: 0 }}>
              <strong>Row-Level Security (RLS)</strong>
              <span>Security parameters are enforced at the database level. Queries authenticate dynamically, guaranteeing absolute data isolation between team operations.</span>
            </div>
            <div className="callout" style={{ margin: 0 }}>
              <strong>Real-Time Sync Replication</strong>
              <span>Changes made by background webhooks or edge actions stream live to all active workspace interfaces instantly.</span>
            </div>
          </div>
        </div>
      ),
      visual: (
        <div style={{ position: "relative", width: "100%", height: "100%", minHeight: "280px", display: "grid", placeItems: "center" }}>
          <div style={{ position: "relative", width: "100%", padding: "0 20px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ background: "rgba(47, 107, 102, 0.08)", border: "1px solid rgba(47, 107, 102, 0.15)", borderRadius: "14px", padding: "12px" }}>
                <div style={{ fontWeight: "bold", fontSize: "0.9rem" }}>Serverless Route (Vercel)</div>
                <div style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: "4px" }}>Execution time: ~85ms | RAM usage: 48MB</div>
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>⬇️ Secure Tunnel</div>
              <div style={{ background: "rgba(184, 92, 56, 0.08)", border: "1px solid rgba(184, 92, 56, 0.15)", borderRadius: "14px", padding: "12px" }}>
                <div style={{ fontWeight: "bold", fontSize: "0.9rem" }}>Supabase DB (RLS Enabled)</div>
                <div style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: "4px" }}>Policies: "authenticated read / write" only</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: "Autonomous Agents",
      subtitle: "Decoupled Integration Nodes",
      content: (
        <div style={{ display: "grid", gap: "16px" }}>
          <p className="hero-copy" style={{ fontSize: "1.05rem" }}>
            Instead of managing long-lived server processes, CRM integrations are delegated to independent nodes that act autonomously on system-triggered events.
          </p>
          <div style={{ display: "grid", gap: "12px", marginTop: "8px" }}>
            <div className="callout" style={{ margin: 0 }}>
              <strong>Telegram Approval Node</strong>
              <span>Campaigns and designs are sent directly to Telegram channels. Admins can click inline button webhooks to update Vercel/Supabase state immediately—bypassing the CRM UI.</span>
            </div>
            <div className="callout" style={{ margin: 0 }}>
              <strong>Unipile Sync Node</strong>
              <span>Independently handles the stream mapping of incoming WhatsApp and Instagram messaging requests, routing them back into the workspace.</span>
            </div>
            <div className="callout" style={{ margin: 0 }}>
              <strong>Gemini AI Synthesis</strong>
              <span>Analyses customer context dynamically to draft smart outbound auto-responses and contextually categorize incoming leads.</span>
            </div>
          </div>
        </div>
      ),
      visual: (
        <div style={{ position: "relative", width: "100%", height: "100%", minHeight: "280px", display: "grid", placeItems: "center" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", width: "100%", padding: "0 10px" }}>
            <div className="board" style={{ padding: "12px", margin: 0 }}>
              <strong style={{ fontSize: "0.8rem", display: "block", marginBottom: "6px" }}>💬 Channels Node</strong>
              <div style={{ fontSize: "0.75rem", background: "rgba(72,53,36,0.04)", padding: "6px", borderRadius: "6px", marginBottom: "4px" }}>WhatsApp Sync</div>
              <div style={{ fontSize: "0.75rem", background: "rgba(72,53,36,0.04)", padding: "6px", borderRadius: "6px" }}>Instagram Webhooks</div>
            </div>
            <div className="board" style={{ padding: "12px", margin: 0 }}>
              <strong style={{ fontSize: "0.8rem", display: "block", marginBottom: "6px" }}>⚡ Automation Node</strong>
              <div style={{ fontSize: "0.75rem", background: "rgba(72,53,36,0.04)", padding: "6px", borderRadius: "6px", marginBottom: "4px" }}>Telegram Approvals</div>
              <div style={{ fontSize: "0.75rem", background: "rgba(72,53,36,0.04)", padding: "6px", borderRadius: "6px" }}>Gemini Context Engine</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 6,
      title: "Business Architecture & Metrics",
      subtitle: "Why Distributed Intelligence Wins",
      content: (
        <div style={{ display: "grid", gap: "16px" }}>
          <p className="hero-copy" style={{ fontSize: "1.05rem" }}>
            By moving intelligence to the edge and utilizing serverless coordination, Nuvirra Ops CRM establishes standard-setting operational benefits.
          </p>
          <div className="stats-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: "14px", marginTop: "12px" }}>
            <div className="stat-card" style={{ padding: "14px", margin: 0 }}>
              <span className="eyebrow">Load times</span>
              <div className="metric" style={{ fontSize: "1.8rem", margin: "6px 0" }}>~5ms</div>
              <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>Local cached processing</span>
            </div>
            <div className="stat-card" style={{ padding: "14px", margin: 0 }}>
              <span className="eyebrow">Cloud Compute</span>
              <div className="metric" style={{ fontSize: "1.8rem", margin: "6px 0" }}>-90%</div>
              <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>Shifted load to browser</span>
            </div>
            <div className="stat-card" style={{ padding: "14px", margin: 0 }}>
              <span className="eyebrow">Integrations</span>
              <div className="metric" style={{ fontSize: "1.8rem", margin: "6px 0" }}>100%</div>
              <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>Decoupled event nodes</span>
            </div>
            <div className="stat-card" style={{ padding: "14px", margin: 0 }}>
              <span className="eyebrow">Offline uptime</span>
              <div className="metric" style={{ fontSize: "1.8rem", margin: "6px 0" }}>99.9%</div>
              <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>Automatic local fallbacks</span>
            </div>
          </div>
        </div>
      ),
      visual: (
        <div style={{ position: "relative", width: "100%", height: "100%", minHeight: "280px", display: "grid", placeItems: "center" }}>
          <div style={{ textAlign: "center", width: "90%", padding: "20px", background: "linear-gradient(135deg, rgba(47,107,102,0.1), rgba(215,157,69,0.05))", border: "1px solid var(--stroke)", borderRadius: "20px" }}>
            <h4 style={{ margin: "0 0 10px", fontFamily: "var(--font-heading)", fontSize: "1.2rem" }}>Ready to Scale</h4>
            <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--muted)", lineHeight: "1.5" }}>
              Nuvirra enables operational teams to orchestrate infinite communication lanes and gigabytes of customer CSV records with negligible infrastructure overhead.
            </p>
            <div style={{ marginTop: "18px" }}>
              <span className="value-pill" style={{ background: "rgba(255,255,255,0.7)" }}>Enterprise Architecture</span>
            </div>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const slide = slides[currentSlide];

  return (
    <div style={{ display: "grid", gap: "22px", width: "100%", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Slide Deck Hero Header */}
      <div className="panel hero" style={{ padding: "24px" }}>
        <div>
          <span className="hero-chip hero-chip-alt" style={{ display: "inline-block", marginBottom: "8px", fontWeight: "bold" }}>Architecture Deck</span>
          <h2 style={{ fontSize: "2.2rem" }}>Nuvirra Pitch Deck</h2>
          <p className="hero-copy">Explore the distributed intelligence principles driving the Nuvirra Ops CRM framework.</p>
        </div>
        <div style={{ display: "flex", gap: "8px", alignSelf: "flex-end" }}>
          <button className="secondary-button" onClick={handlePrev} style={{ padding: "10px 18px", borderRadius: "20px" }}>← Prev</button>
          <button className="primary-button" onClick={handleNext} style={{ padding: "10px 18px", borderRadius: "20px" }}>Next →</button>
        </div>
      </div>

      {/* Slide Body Container */}
      <div className="panel" style={{
        padding: "32px",
        borderRadius: "28px",
        display: "grid",
        gridTemplateColumns: "1.1fr 0.9fr",
        gap: "32px",
        minHeight: "480px",
        alignItems: "center",
        transition: "all 0.3s ease"
      }}>
        {/* Left Side: Slide Details */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
              <span className="tag" style={{ fontSize: "0.8rem", padding: "4px 10px", borderRadius: "10px" }}>Slide {slide.id} / {slides.length}</span>
              <span className="eyebrow">{slide.subtitle}</span>
            </div>
            <h3 style={{
              fontSize: "1.9rem",
              fontFamily: "var(--font-heading)",
              margin: "0 0 16px",
              color: "var(--text)"
            }}>
              {slide.title}
            </h3>
            <div style={{ marginTop: "10px" }}>
              {slide.content}
            </div>
          </div>

          {/* Dots Indicator */}
          <div style={{ display: "flex", gap: "6px", marginTop: "24px", alignItems: "center" }}>
            {slides.map((_, index) => (
              <div
                key={index}
                onClick={() => setCurrentSlide(index)}
                style={{
                  width: index === currentSlide ? "24px" : "8px",
                  height: "8px",
                  borderRadius: "999px",
                  background: index === currentSlide ? "var(--accent)" : "rgba(72,53,36,0.18)",
                  cursor: "pointer",
                  transition: "all 0.3s ease"
                }}
              />
            ))}
          </div>
        </div>

        {/* Right Side: Slide Visual Illustration */}
        <div style={{
          height: "100%",
          display: "grid",
          placeItems: "center",
          background: "linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.15) 100%)",
          border: "1px solid var(--stroke)",
          borderRadius: "22px",
          padding: "20px",
          overflow: "hidden"
        }}>
          {slide.visual}
        </div>
      </div>
    </div>
  );
}
