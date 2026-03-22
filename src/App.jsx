import { useState, useEffect } from "react";
import { phases, transferable } from "./data.js";

const STORAGE_KEY = "ai-roadmap-progress-v1";

/* ─── helpers ─── */
function loadChecked() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
  catch { return {}; }
}
function saveChecked(obj) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(obj)); } catch {}
}

/* ─── sub-components ─── */
function LangBadge({ lang }) {
  const isAr = lang === "🇪🇬";
  return (
    <span style={{
      fontSize: "clamp(9px,1.5vw,10px)", padding: "1px 5px", borderRadius: 4, whiteSpace: "nowrap",
      background: isAr ? "rgba(251,191,36,0.15)" : "rgba(147,197,253,0.12)",
      color: isAr ? "#FBBF24" : "#93C5FD",
    }}>{isAr ? "عربي" : "English"}</span>
  );
}

function PriceBadge({ price }) {
  const isFree = price.includes("مجاني");
  const isBought = price.includes("اشتريته");
  return (
    <span style={{
      fontSize: "clamp(9px,1.5vw,10px)", padding: "2px 7px", borderRadius: 4, whiteSpace: "nowrap",
      background: isFree ? "rgba(52,211,153,0.13)" : isBought ? "rgba(0,212,255,0.13)" : "rgba(251,191,36,0.13)",
      color: isFree ? "#34D399" : isBought ? "#00D4FF" : "#FBBF24",
    }}>{price}</span>
  );
}

function Checkbox({ checked, color, onClick }) {
  return (
    <div onClick={onClick} style={{
      width: 15, height: 15, borderRadius: 3, flexShrink: 0, marginTop: 2, cursor: "pointer",
      border: `1.5px solid ${checked ? color : "#334155"}`,
      background: checked ? color : "transparent",
      display: "flex", alignItems: "center", justifyContent: "center",
      transition: "all 0.18s",
    }}>
      {checked && <span style={{ color: "#060A12", fontSize: 9, fontWeight: 900, lineHeight: 1 }}>✓</span>}
    </div>
  );
}

function ProgressBar({ pct, color, height = 4 }) {
  return (
    <div style={{ width: "100%", height, background: "#0F1A2E", borderRadius: 99, overflow: "hidden" }}>
      <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 99, transition: "width 0.4s ease" }} />
    </div>
  );
}

function ContentTab({ phase, checked, toggle }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 185px), 1fr))", gap: 10 }}>
      {phase.topics.map(g => (
        <div key={g.id} style={{ background: "rgba(0,0,0,0.3)", borderRadius: 10, padding: "11px 13px", borderRight: `3px solid ${phase.color}44` }}>
          <div style={{ fontSize: "clamp(9px,1.5vw,10px)", color: phase.color, fontWeight: 800, marginBottom: 8, letterSpacing: 1 }}>{g.label}</div>
          {g.items.map(item => (
            <div key={item.id} onClick={() => toggle(item.id)}
              style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 7, cursor: "pointer", userSelect: "none" }}>
              <Checkbox checked={!!checked[item.id]} color={phase.color} onClick={() => {}} />
              <span style={{
                fontSize: "clamp(11px,2vw,12px)", color: checked[item.id] ? "#475569" : "#CBD5E1",
                lineHeight: 1.55, textDecoration: checked[item.id] ? "line-through" : "none", transition: "all 0.18s",
              }}>{item.text}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function SourcesTab({ phase }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      {phase.sources.map(src => (
        <a key={src.id} href={src.url} target="_blank" rel="noopener noreferrer"
          style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(0,0,0,0.3)", borderRadius: 10, padding: "clamp(8px,2vw,11px) clamp(10px,2vw,13px)", textDecoration: "none", border: `1px solid ${phase.color}18`, transition: "border-color 0.2s, background 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = phase.color + "55"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = phase.color + "18"; e.currentTarget.style.background = "rgba(0,0,0,0.3)"; }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 5 }}>
              <span style={{ fontSize: "clamp(12px,2vw,13px)", fontWeight: 700, color: "#E2E8F0" }}>{src.name}</span>
              <LangBadge lang={src.lang} />
              <span style={{ fontSize: "clamp(9px,1.5vw,10px)", padding: "1px 5px", borderRadius: 4, background: "rgba(255,255,255,0.05)", color: "#475569", whiteSpace: "nowrap" }}>{src.type}</span>
            </div>
            <div style={{ fontSize: "clamp(10px,1.8vw,11px)", color: "#475569", marginTop: 3 }}>{src.note}</div>
          </div>
          <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
            <PriceBadge price={src.price} />
            <span style={{ fontSize: 11, color: phase.color }}>↗</span>
          </div>
        </a>
      ))}
    </div>
  );
}

function PhaseCard({ phase, idx, isActive, toggle, checked, onToggleOpen }) {
  const [tab, setTab] = useState("المحتوى");
  const allItems = phase.topics.flatMap(t => t.items);
  const done = allItems.filter(i => checked[i.id]).length;
  const pct = allItems.length ? Math.round((done / allItems.length) * 100) : 0;

  return (
    <div style={{ display: "flex", marginBottom: 6 }}>
      {/* Circle + line */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "clamp(40px,6vw,54px)", flexShrink: 0 }}>
        <div onClick={onToggleOpen} style={{
          width: "clamp(36px,5vw,42px)", height: "clamp(36px,5vw,42px)", borderRadius: "50%",
          background: isActive ? `radial-gradient(circle, ${phase.glow}, transparent 70%)` : "transparent",
          border: `2px solid ${isActive ? phase.color : phase.color + "44"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "clamp(15px,2.5vw,18px)", cursor: "pointer", flexShrink: 0,
          boxShadow: isActive ? `0 0 18px ${phase.glow}` : "none",
          transition: "all 0.25s", transform: isActive ? "scale(1.1)" : "scale(1)",
        }}>{phase.icon}</div>
        {idx < phases.length - 1 && (
          <div style={{ width: 2, flex: 1, minHeight: 14, background: `linear-gradient(to bottom, ${phase.color}44, ${phases[idx + 1].color}22)`, margin: "4px 0" }} />
        )}
      </div>

      {/* Card */}
      <div style={{ flex: 1, marginRight: "clamp(8px,2vw,14px)" }}>
        {/* Header */}
        <div onClick={onToggleOpen} style={{
          background: isActive ? `linear-gradient(135deg, ${phase.glow}, #0B1420 100%)` : "rgba(11,20,32,0.95)",
          border: `1px solid ${isActive ? phase.color + "66" : "#192035"}`,
          borderRadius: isActive ? "12px 12px 0 0" : 12,
          padding: "clamp(10px,2.5vw,14px) clamp(12px,3vw,16px)",
          cursor: "pointer", transition: "all 0.25s",
          boxShadow: isActive ? `0 0 22px ${phase.glow}` : "none",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", flex: 1, minWidth: 0 }}>
              <span style={{ fontSize: "clamp(9px,1.5vw,10px)", color: phase.color, fontWeight: 800, letterSpacing: 2, flexShrink: 0 }}>PHASE {phase.number}</span>
              <span style={{ fontSize: "clamp(13px,2.5vw,15px)", fontWeight: 700, color: "#F1F5F9" }}>{phase.title}</span>
              {phase.badge && <span style={{ background: `${phase.color}18`, border: `1px solid ${phase.color}44`, borderRadius: 20, padding: "1px 8px", fontSize: "clamp(9px,1.5vw,10px)", color: phase.color, fontWeight: 700 }}>{phase.badge}</span>}
              {phase.statusLabel && <span style={{ background: "#34D39918", border: "1px solid #34D39944", borderRadius: 20, padding: "1px 8px", fontSize: "clamp(9px,1.5vw,10px)", color: "#34D399", fontWeight: 700 }}>{phase.statusLabel}</span>}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
              <span style={{ fontSize: "clamp(10px,1.8vw,11px)", color: "#334155", whiteSpace: "nowrap" }}>⏱ {phase.duration}</span>
              <span style={{ color: phase.color, fontSize: 11, transition: "transform 0.3s", display: "inline-block", transform: isActive ? "rotate(180deg)" : "rotate(0deg)" }}>▼</span>
            </div>
          </div>
          {/* Mini progress */}
          <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ flex: 1 }}>
              <ProgressBar pct={pct} color={phase.color} height={3} />
            </div>
            <span style={{ fontSize: "clamp(9px,1.5vw,11px)", color: phase.color, fontWeight: 700, whiteSpace: "nowrap" }}>{done}/{allItems.length}</span>
          </div>
        </div>

        {/* Expanded body */}
        {isActive && (
          <div style={{ background: "rgba(8,14,26,0.98)", border: `1px solid ${phase.color}33`, borderTop: "none", borderRadius: "0 0 12px 12px" }}>
            {/* Tabs */}
            <div style={{ display: "flex", borderBottom: "1px solid #192035" }}>
              {["المحتوى", "المصادر"].map(t => (
                <button key={t} onClick={() => setTab(t)} style={{
                  background: "none", border: "none", padding: "9px clamp(10px,2vw,16px)",
                  fontSize: "clamp(11px,2vw,13px)", fontWeight: 700, cursor: "pointer",
                  color: tab === t ? phase.color : "#334155",
                  borderBottom: tab === t ? `2px solid ${phase.color}` : "2px solid transparent",
                  transition: "all 0.2s",
                }}>{t}</button>
              ))}
            </div>
            <div style={{ padding: "clamp(12px,3vw,16px)" }}>
              {tab === "المحتوى"
                ? <ContentTab phase={phase} checked={checked} toggle={toggle} />
                : <SourcesTab phase={phase} />
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Main App ─── */
export default function App() {
  const [active, setActive] = useState(null);
  const [checked, setChecked] = useState(loadChecked);

  useEffect(() => { saveChecked(checked); }, [checked]);

  const toggle = (id) => setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  const toggleOpen = (id) => setActive(prev => prev === id ? null : id);

  const allItems = phases.flatMap(p => p.topics.flatMap(t => t.items));
  const totalDone = allItems.filter(i => checked[i.id]).length;
  const totalPct = allItems.length ? Math.round((totalDone / allItems.length) * 100) : 0;

  return (
    <div style={{
      background: "#060A12", minHeight: "100vh",
      fontFamily: "'Segoe UI', Tahoma, Arial, sans-serif",
      color: "#E2E8F0", padding: "clamp(20px,4vw,44px) clamp(12px,3vw,24px) 60px",
      direction: "rtl", boxSizing: "border-box",
    }}>

      {/* ── Header ── */}
      <div style={{ textAlign: "center", marginBottom: "clamp(28px,5vw,52px)" }}>
        <div style={{ fontSize: "clamp(9px,1.5vw,11px)", letterSpacing: 5, color: "#334155", marginBottom: 10, textTransform: "uppercase" }}>
          Personalized · Computer Vision Specialized
        </div>
        <h1 style={{
          fontSize: "clamp(24px,5vw,50px)", fontWeight: 900, margin: 0, lineHeight: 1.2,
          background: "linear-gradient(135deg,#00D4FF 0%,#A78BFA 45%,#F472B6 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          AI Engineer Roadmap
        </h1>
        <p style={{ color: "#475569", marginTop: 8, fontSize: "clamp(11px,2vw,13px)" }}>
          ~8–9 أشهر · 7 مراحل · اضغط على أي مرحلة للتفاصيل
        </p>

        {/* Legend */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
          {[["🇪🇬 عربي","#FBBF2433","#FBBF24"],["🌍 English","#93C5FD33","#93C5FD"],["✅ عندك","#34D39933","#34D399"],["⭐ أساسي","#F472B633","#F472B6"]].map(([l,bg,c])=>(
            <span key={l} style={{ fontSize: "clamp(10px,1.8vw,11px)", padding: "3px 9px", borderRadius: 20, background: bg, color: c, border: `1px solid ${c}44` }}>{l}</span>
          ))}
        </div>

        {/* Global progress card */}
        <div style={{ maxWidth: 460, margin: "18px auto 0", background: "rgba(11,20,32,0.9)", border: "1px solid #192035", borderRadius: 12, padding: "14px 18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7, fontSize: "clamp(11px,2vw,13px)" }}>
            <span style={{ color: "#94A3B8", fontWeight: 600 }}>التقدم الكلي</span>
            <span style={{ color: "#F1F5F9", fontWeight: 700 }}>
              {totalDone} / {allItems.length}&nbsp;
              <span style={{ color: "#34D399" }}>({totalPct}%)</span>
            </span>
          </div>
          <div style={{ width: "100%", height: 7, background: "#0F1A2E", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ width: `${totalPct}%`, height: "100%", background: "linear-gradient(90deg,#00D4FF,#A78BFA,#F472B6)", borderRadius: 99, transition: "width 0.4s" }} />
          </div>
        </div>
      </div>

      {/* ── Phases ── */}
      <div style={{ maxWidth: 880, margin: "0 auto" }}>
        {phases.map((phase, idx) => (
          <PhaseCard
            key={phase.id}
            phase={phase}
            idx={idx}
            isActive={active === phase.id}
            checked={checked}
            toggle={toggle}
            onToggleOpen={() => toggleOpen(phase.id)}
          />
        ))}
      </div>

      {/* ── English Strategy ── */}
      <div style={{ maxWidth: 880, margin: "28px auto 0" }}>
        <div style={{ background: "rgba(11,20,32,0.95)", border: "1px solid #192035", borderRadius: 14, padding: "clamp(14px,3vw,22px) clamp(14px,3vw,24px)" }}>
          <div style={{ fontSize: "clamp(9px,1.5vw,10px)", letterSpacing: 4, color: "#334155", marginBottom: 6 }}>ENGLISH STRATEGY</div>
          <h3 style={{ margin: "0 0 14px", fontSize: "clamp(13px,2.5vw,15px)", color: "#F1F5F9" }}>🌍 خطة التعامل مع الإنجليزي</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 180px), 1fr))", gap: 8 }}>
            {[["Phase 00–02","عربي بالكامل ✅","#34D399"],["Phase 03","عربي أساسي + English Docs","#FBBF24"],["Phase 04–06","English أساسي — لازم","#F472B6"]].map(([p,s,c])=>(
              <div key={p} style={{ background: "rgba(0,0,0,0.3)", borderRadius: 10, padding: "10px 12px", borderRight: `3px solid ${c}55` }}>
                <div style={{ fontSize: "clamp(9px,1.5vw,10px)", color: c, fontWeight: 700, marginBottom: 4 }}>{p}</div>
                <div style={{ fontSize: "clamp(11px,2vw,13px)", color: "#CBD5E1" }}>{s}</div>
              </div>
            ))}
          </div>
          <p style={{ marginTop: 10, fontSize: "clamp(10px,1.8vw,12px)", color: "#334155", lineHeight: 1.7 }}>
            💡 ابدأ الـ Concept بعربي → اقرأ الـ Docs إنجليزي → مع الوقت هتتعود تلقائياً
          </p>
        </div>
      </div>

      {/* ── Transferable Skills ── */}
      <div style={{ maxWidth: 880, margin: "14px auto 0" }}>
        <div style={{ background: "rgba(11,20,32,0.95)", border: "1px solid #192035", borderRadius: 14, padding: "clamp(14px,3vw,22px) clamp(14px,3vw,24px)" }}>
          <div style={{ fontSize: "clamp(9px,1.5vw,10px)", letterSpacing: 4, color: "#334155", marginBottom: 6 }}>FUTURE-PROOF</div>
          <h3 style={{ margin: "0 0 14px", fontSize: "clamp(13px,2.5vw,15px)", color: "#F1F5F9" }}>🔄 مهاراتك قابلة للنقل لأي تراك</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))", gap: 7 }}>
            {transferable.map(item => (
              <div key={item.skill} style={{ background: "rgba(0,0,0,0.25)", border: "1px solid #192035", borderRadius: 9, padding: "8px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 4 }}>
                <span style={{ fontWeight: 700, fontSize: "clamp(11px,2vw,13px)", color: "#E2E8F0" }}>{item.skill}</span>
                <span style={{ fontSize: 11, color: "#1E293B" }}>→</span>
                <span style={{ fontSize: "clamp(10px,1.8vw,11px)", color: "#475569" }}>{item.goes}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div style={{ textAlign: "center", marginTop: 32, color: "#1E293B", fontSize: "clamp(10px,1.8vw,11px)" }}>
        التقدم محفوظ تلقائياً على جهازك · AI Engineer Roadmap © 2026
      </div>
    </div>
  );
}
