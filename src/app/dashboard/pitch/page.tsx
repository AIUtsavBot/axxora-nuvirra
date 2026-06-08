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
      title: "Axxora: Orchestration of Distributed Intelligence",
      subtitle: "For Limitless & Omnichannel Conversations",
      content: (
        <div style={{ display: "grid", gap: "16px" }}>
          <p className="hero-copy" style={{ fontSize: "1.05rem" }}>
            Modern customer service is crippled by fragmented messaging (WhatsApp, Telegram, Instagram, Facebook Messenger) and disjointed APIs.
          </p>
          <p className="hero-copy" style={{ fontSize: "1.05rem" }}>
            <strong>Axxora</strong> introduces a unified orchestration platform using a distributed multi-agent AI system built on <strong>CrewAI</strong> and <strong>LangChain</strong>, combined with a real-time data normalization middleware.
          </p>
          <div className="callout-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "12px" }}>
            <div className="callout" style={{ margin: 0 }}>
              <strong>Multi-Agent AI</strong>
              <span>Powered by CrewAI for intent, leads, orders, support, and escalations.</span>
            </div>
            <div className="callout" style={{ margin: 0 }}>
              <strong>Normalized Message Hub</strong>
              <span>Webhook aggregation middleware standardizing multi-channel payloads.</span>
            </div>
          </div>
        </div>
      ),
      visual: (
        <div style={{ position: "relative", width: "100%", height: "100%", minHeight: "280px", display: "grid", placeItems: "center" }}>
          <div style={{ position: "relative", width: "240px", height: "240px" }}>
            <div style={{
              position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
              width: "90px", height: "90px", borderRadius: "24px",
              background: "linear-gradient(135deg, var(--accent), var(--accent-deep))",
              display: "grid", placeItems: "center", color: "#fff", fontWeight: "bold", fontSize: "0.95rem",
              boxShadow: "0 12px 30px rgba(184, 92, 56, 0.4)", zIndex: 10, textAlign: "center"
            }}>
              Axxora Hub
            </div>
            <div className="pulse-slow" style={{
              position: "absolute", top: "0", left: "50%", transform: "translateX(-50%)",
              width: "55px", height: "55px", borderRadius: "50%", background: "var(--teal)",
              display: "grid", placeItems: "center", color: "#fff", fontSize: "0.75rem", fontWeight: "bold", textAlign: "center"
            }}>
              CrewAI
            </div>
            <div className="pulse-slow" style={{
              position: "absolute", bottom: "0", left: "50%", transform: "translateX(-50%)",
              width: "55px", height: "55px", borderRadius: "50%", background: "var(--gold)",
              display: "grid", placeItems: "center", color: "#fff", fontSize: "0.75rem", fontWeight: "bold", textAlign: "center"
            }}>
              LangChain
            </div>
            <div className="pulse-slow" style={{
              position: "absolute", top: "50%", left: "0", transform: "translateY(-50%)",
              width: "55px", height: "55px", borderRadius: "50%", background: "#483524",
              display: "grid", placeItems: "center", color: "#fff", fontSize: "0.75rem", fontWeight: "bold", textAlign: "center"
            }}>
              GPT/Llama
            </div>
            <div className="pulse-slow" style={{
              position: "absolute", top: "50%", right: "0", transform: "translateY(-50%)",
              width: "55px", height: "55px", borderRadius: "50%", background: "var(--accent-deep)",
              display: "grid", placeItems: "center", color: "#fff", fontSize: "0.75rem", fontWeight: "bold", textAlign: "center"
            }}>
              Vector DB
            </div>
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
      title: "Problem Formulation",
      subtitle: "Mathematical Modeling of Routing",
      content: (
        <div style={{ display: "grid", gap: "12px" }}>
          <p className="hero-copy" style={{ fontSize: "0.95rem", margin: 0 }}>
            Let the incoming message stream be defined as:
            <code style={{ display: "block", background: "var(--stroke)", padding: "6px", borderRadius: "8px", margin: "6px 0", fontFamily: "monospace" }}>
              M = &#123;m₁, m₂, ..., m_n&#125;
            </code>
            Where each message <code style={{ fontFamily: "monospace" }}>m_i = (t_i, p_i, u_i, τ_i)</code> represents:
          </p>
          <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "0.9rem", color: "var(--muted)", display: "grid", gap: "4px" }}>
            <li><code>t_i</code>: Text content</li>
            <li><code>p_i</code>: Originating platform (WhatsApp, Telegram, etc.)</li>
            <li><code>u_i</code>: User identifier</li>
            <li><code>τ_i</code>: Timestamp</li>
          </ul>
          <p className="hero-copy" style={{ fontSize: "0.95rem", margin: 0 }}>
            Axxora maps this to specialized agents <code style={{ fontFamily: "monospace" }}>A = &#123;a₁, a₂, ..., a_p&#125;</code> using a routing function <code style={{ fontFamily: "monospace" }}>f: M → A</code> which predicts intents <code style={{ fontFamily: "monospace" }}>Y = &#123;y₁, y₂, y₃, y₄&#125;</code>:
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            <span className="tag">y₁: Lead Generation</span>
            <span className="tag">y₂: Customer Support</span>
            <span className="tag">y₃: Order Management</span>
            <span className="tag">y₄: Escalation</span>
          </div>
        </div>
      ),
      visual: (
        <div style={{ position: "relative", width: "100%", height: "100%", minHeight: "280px", display: "grid", placeItems: "center" }}>
          <div style={{ width: "90%", padding: "20px", borderRadius: "20px", background: "var(--panel-strong)", border: "1px solid var(--stroke)" }}>
            <strong style={{ fontSize: "0.85rem", textTransform: "uppercase", color: "var(--muted)", display: "block", marginBottom: "12px" }}>Intent Classification Probability</strong>
            <div style={{ background: "rgba(30, 24, 20, 0.04)", padding: "12px", borderRadius: "10px", fontFamily: "serif", fontSize: "1.1rem", textAlign: "center", marginBottom: "12px" }}>
              P(y_k | m_i) = exp(W_k * e_i + b_k) / Σ exp(W_j * e_i + b_j)
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", borderTop: "1px solid var(--stroke)", paddingTop: "10px" }}>
              <span>Embedding Vector</span>
              <span className="tone-teal">e_i = f_θ(t_i)</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "System Optimization Objective",
      subtitle: "Minimizing Weighted Cost & Losses",
      content: (
        <div style={{ display: "grid", gap: "16px" }}>
          <p className="hero-copy" style={{ fontSize: "1.05rem" }}>
            The orchestrator objective is modeled to balance response efficiency, routing accuracy, and service reliability by minimizing:
          </p>
          <div style={{ background: "rgba(30, 24, 20, 0.04)", padding: "14px", borderRadius: "12px", fontFamily: "serif", fontSize: "1.15rem", textAlign: "center" }}>
            min( α * T_response + β * E_routing + γ * SLA_violations )
          </div>
          <div style={{ display: "grid", gap: "8px", fontSize: "0.9rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <strong>T_response:</strong> <span className="tone-teal">Average response time</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <strong>E_routing:</strong> <span className="tone-teal">Misclassification rate of intent routing</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <strong>SLA_violations:</strong> <span className="tone-teal">Proportion of delayed responses</span>
            </div>
          </div>
          <p className="hero-copy" style={{ fontSize: "0.95rem" }}>
            Confidence-based routing sends to <strong>Escalation</strong> when classification confidence falls below threshold <code>δ</code>.
          </p>
        </div>
      ),
      visual: (
        <div style={{ position: "relative", width: "100%", height: "100%", minHeight: "280px", display: "grid", placeItems: "center" }}>
          <div style={{ width: "90%", padding: "20px", borderRadius: "20px", background: "var(--panel-strong)", border: "1px solid var(--stroke)" }}>
            <strong style={{ fontSize: "0.85rem", textTransform: "uppercase", color: "var(--muted)", display: "block", marginBottom: "8px" }}>Categorical Cross-Entropy Loss</strong>
            <div style={{ background: "rgba(30, 24, 20, 0.04)", padding: "12px", borderRadius: "10px", fontFamily: "serif", fontSize: "1.05rem", textAlign: "center", marginBottom: "12px" }}>
              L = - (1 / N) * Σ_i Σ_k y_ik * log P(y_k | m_i)
            </div>
            <p style={{ fontSize: "0.8rem", color: "var(--muted)", margin: 0 }}>
              Optimizes routing parameters during multi-agent intent training.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Decoupled Key Technologies",
      subtitle: "The Production Tech Stack",
      content: (
        <div style={{ display: "grid", gap: "14px" }}>
          <p className="hero-copy" style={{ fontSize: "1.05rem" }}>
            Axxora integrates modular layers for ingestion, intent parsing, analytics, and persistent storage:
          </p>
          <div className="callout-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div className="callout" style={{ margin: 0 }}>
              <strong>Backend & API</strong>
              <span>Python 3.x with FastAPI for webhooks & agent orchestration.</span>
            </div>
            <div className="callout" style={{ margin: 0 }}>
              <strong>Dashboard UI</strong>
              <span>Streamlit / Next.js for real-time customer analytics.</span>
            </div>
            <div className="callout" style={{ margin: 0 }}>
              <strong>LLM Core</strong>
              <span>GPT-4 variants, Llama 3, and Mistral via Groq/OpenAI APIs.</span>
            </div>
            <div className="callout" style={{ margin: 0 }}>
              <strong>Data Layer</strong>
              <span>MongoDB for logs, Redis for session caches, Vector DBs for RAG.</span>
            </div>
          </div>
        </div>
      ),
      visual: (
        <div style={{ position: "relative", width: "100%", height: "100%", minHeight: "280px", display: "grid", placeItems: "center" }}>
          <div style={{ display: "grid", gap: "10px", width: "90%" }}>
            <div style={{ padding: "10px", borderRadius: "10px", background: "rgba(47,107,102,0.1)", border: "1px solid rgba(47,107,102,0.2)", fontSize: "0.85rem", display: "flex", justifyContent: "space-between" }}>
              <strong>Agent Ingest Gateways</strong>
              <span>FastAPI webhooks</span>
            </div>
            <div style={{ padding: "10px", borderRadius: "10px", background: "rgba(215,157,69,0.1)", border: "1px solid rgba(215,157,69,0.2)", fontSize: "0.85rem", display: "flex", justifyContent: "space-between" }}>
              <strong>Intent / RAG Parsing</strong>
              <span>CrewAI / LangChain</span>
            </div>
            <div style={{ padding: "10px", borderRadius: "10px", background: "rgba(184,92,56,0.1)", border: "1px solid rgba(184,92,56,0.2)", fontSize: "0.85rem", display: "flex", justifyContent: "space-between" }}>
              <strong>Database Storage</strong>
              <span>MongoDB + Supabase + Redis</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: "Baseline Comparison & Performance",
      subtitle: "Quantitative Evaluation of Axxora",
      content: (
        <div style={{ display: "grid", gap: "14px" }}>
          <p className="hero-copy" style={{ fontSize: "1.05rem" }}>
            Validated across a dataset of <strong>1,200 conversational instances</strong> over a 30-day window on WhatsApp & Telegram:
          </p>
          <div className="crm-wrap" style={{ overflow: "hidden", border: "1px solid var(--stroke)", borderRadius: "14px" }}>
            <table className="crm-table" style={{ fontSize: "0.85rem", background: "var(--panel-strong)" }}>
              <thead>
                <tr>
                  <th style={{ padding: "8px 12px" }}>System</th>
                  <th style={{ padding: "8px 12px" }}>Accuracy</th>
                  <th style={{ padding: "8px 12px" }}>Avg Response</th>
                  <th style={{ padding: "8px 12px" }}>Automation</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: "8px 12px" }}>Rule-Based Bot</td>
                  <td style={{ padding: "8px 12px" }}>71%</td>
                  <td style={{ padding: "8px 12px" }}>2.9 min</td>
                  <td style={{ padding: "8px 12px" }}>55%</td>
                </tr>
                <tr>
                  <td style={{ padding: "8px 12px" }}>Single LLM Bot</td>
                  <td style={{ padding: "8px 12px" }}>88%</td>
                  <td style={{ padding: "8px 12px" }}>1.3 min</td>
                  <td style={{ padding: "8px 12px" }}>70%</td>
                </tr>
                <tr style={{ fontWeight: "bold", background: "rgba(47,107,102,0.08)" }}>
                  <td style={{ padding: "8px 12px" }} className="tone-teal">Axxora (Proposed)</td>
                  <td style={{ padding: "8px 12px" }} className="tone-teal">94.6%</td>
                  <td style={{ padding: "8px 12px" }} className="tone-teal">41 sec</td>
                  <td style={{ padding: "8px 12px" }} className="tone-teal">82.3%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ),
      visual: (
        <div style={{ position: "relative", width: "100%", height: "100%", minHeight: "280px", display: "grid", placeItems: "center" }}>
          <div style={{ width: "90%", padding: "18px", background: "var(--panel-strong)", border: "1px solid var(--stroke)", borderRadius: "20px" }}>
            <strong style={{ fontSize: "0.85rem", textTransform: "uppercase", color: "var(--muted)", display: "block", marginBottom: "12px" }}>Key Metrics Achieved</strong>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div style={{ textAlign: "center", padding: "8px", background: "rgba(47,107,102,0.08)", borderRadius: "10px" }}>
                <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>96.1%</div>
                <div style={{ fontSize: "0.7rem", color: "var(--muted)" }}>SLA Compliance</div>
              </div>
              <div style={{ textAlign: "center", padding: "8px", background: "rgba(47,107,102,0.08)", borderRadius: "10px" }}>
                <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>94.0%</div>
                <div style={{ fontSize: "0.7rem", color: "var(--muted)" }}>F1-Score</div>
              </div>
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: "12px", textAlign: "center" }}>
              Average response time was reduced from <strong>4.7 minutes</strong> (manual baseline) down to <strong>41 seconds</strong>.
            </div>
          </div>
        </div>
      )
    },
    {
      id: 6,
      title: "Agent Task Distribution",
      subtitle: "Workflow Allocation",
      content: (
        <div style={{ display: "grid", gap: "16px" }}>
          <p className="hero-copy" style={{ fontSize: "1.05rem" }}>
            Axxora breaks down conversational workflows into dedicated task containers, preventing token overhead and context confusion:
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "0.85rem" }}>
            <div style={{ padding: "8px 12px", borderRadius: "10px", background: "rgba(72,53,36,0.04)" }}>
              <strong>Support Agent (41%)</strong>
              <span style={{ display: "block", fontSize: "0.75rem", color: "var(--muted)" }}>Handles resolutions & FAQ semantic retrieval.</span>
            </div>
            <div style={{ padding: "8px 12px", borderRadius: "10px", background: "rgba(72,53,36,0.04)" }}>
              <strong>Lead Agent (32%)</strong>
              <span style={{ display: "block", fontSize: "0.75rem", color: "var(--muted)" }}>Nurturing, detail collection & CRM entry.</span>
            </div>
            <div style={{ padding: "8px 12px", borderRadius: "10px", background: "rgba(72,53,36,0.04)" }}>
              <strong>Order Agent (18%)</strong>
              <span style={{ display: "block", fontSize: "0.75rem", color: "var(--muted)" }}>Gateway management & tracking updates.</span>
            </div>
            <div style={{ padding: "8px 12px", borderRadius: "10px", background: "rgba(72,53,36,0.04)" }}>
              <strong>Escalation Agent (9%)</strong>
              <span style={{ display: "block", fontSize: "0.75rem", color: "var(--muted)" }}>Sentiment analysis & handoff triggers.</span>
            </div>
          </div>
        </div>
      ),
      visual: (
        <div style={{ position: "relative", width: "100%", height: "100%", minHeight: "280px", display: "grid", placeItems: "center" }}>
          <div style={{ width: "200px", height: "200px", borderRadius: "50%", background: "conic-gradient(var(--teal) 0% 41%, var(--gold) 41% 73%, var(--accent) 73% 91%, var(--accent-deep) 91% 100%)", position: "relative" }}>
            <div style={{
              position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
              width: "100px", height: "100px", borderRadius: "50%", background: "var(--panel-strong)",
              display: "grid", placeItems: "center", fontSize: "0.8rem", fontWeight: "bold", textAlign: "center"
            }}>
              Agent Tasks
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
          <span className="hero-chip hero-chip-alt" style={{ display: "inline-block", marginBottom: "8px", fontWeight: "bold" }}>Academic & Tech Pitch Deck</span>
          <h2 style={{ fontSize: "2.2rem" }}>Axxora Architecture</h2>
          <p className="hero-copy">Orchestration of Distributed Intelligence for Limitless Conversations.</p>
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
