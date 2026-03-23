import { useState, useEffect, useRef } from "react";
import { generateId, saveProgress, loadProgress, configured } from "./sync.js";

const LS_ID_KEY = "ai-roadmap-sync-id";

export function useSyncId() {
  const [syncId, setSyncId] = useState(() => {
    return localStorage.getItem(LS_ID_KEY) || null;
  });

  const init = () => {
    const id = generateId();
    localStorage.setItem(LS_ID_KEY, id);
    setSyncId(id);
    return id;
  };

  const setId = (id) => {
    localStorage.setItem(LS_ID_KEY, id);
    setSyncId(id);
  };

  useEffect(() => {
    if (!syncId) init();
  }, []);

  return { syncId: syncId || "", setId, reset: init };
}

export default function SyncPanel({ syncId, setId, checked, onLoad }) {
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | saving | saved | error
  const [importing, setImporting] = useState(false);
  const [importVal, setImportVal] = useState("");
  const [importErr, setImportErr] = useState("");
  const saveTimer = useRef(null);
  const isConfigured = configured();

  // Auto-save on checked change (debounced 1.5s)
  useEffect(() => {
    if (!isConfigured || !syncId) return;
    clearTimeout(saveTimer.current);
    setStatus("saving");
    saveTimer.current = setTimeout(async () => {
      const res = await saveProgress(syncId, checked);
      setStatus(res.ok ? "saved" : "error");
      setTimeout(() => setStatus("idle"), 3000);
    }, 1500);
    return () => clearTimeout(saveTimer.current);
  }, [checked, syncId]);

  const copy = () => {
    navigator.clipboard.writeText(syncId).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const doImport = async () => {
    const val = importVal.trim().toUpperCase();
    if (val.length < 4) { setImportErr("ID غلط"); return; }
    setImportErr("");
    const res = await loadProgress(val);
    if (!res.ok) { setImportErr("مش لاقي البيانات دي"); return; }
    setId(val);
    onLoad(res.checked);
    setImporting(false);
    setImportVal("");
  };

  const statusColor = { idle: "#475569", saving: "#FBBF24", saved: "#34D399", error: "#F87171" }[status];
  const statusText = { idle: "", saving: "⏳ جاري الحفظ...", saved: "✅ محفوظ", error: "⚠️ خطأ في الحفظ" }[status];

  if (!isConfigured) {
    return (
      <div style={{ maxWidth: 460, margin: "14px auto 0", background: "rgba(251,191,36,0.08)", border: "1px solid #FBBF2444", borderRadius: 12, padding: "12px 16px" }}>
        <div style={{ fontSize: 12, color: "#FBBF24", fontWeight: 700, marginBottom: 4 }}>
          ⚠️ Firebase غير مضبوط — التقدم محفوظ محلياً فقط
        </div>
        <div style={{ fontSize: 11, color: "#64748B", lineHeight: 1.6 }}>
          شوف الـ README لتفعيل التزامن بين الأجهزة (3 دقايق)
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 460, margin: "14px auto 0", background: "rgba(11,20,32,0.9)", border: "1px solid #192035", borderRadius: 12, padding: "12px 16px" }}>
      {/* Sync ID row */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <span style={{ fontSize: 11, color: "#64748B", flexShrink: 0 }}>🔗 Sync ID:</span>
        <span style={{ fontFamily: "monospace", fontSize: 14, fontWeight: 800, color: "#00D4FF", letterSpacing: 3 }}>{syncId}</span>
        <button onClick={copy} style={{ background: copied ? "rgba(52,211,153,0.15)" : "rgba(0,212,255,0.1)", border: `1px solid ${copied ? "#34D39955" : "#00D4FF33"}`, borderRadius: 6, padding: "3px 10px", fontSize: 11, color: copied ? "#34D399" : "#00D4FF", cursor: "pointer", transition: "all 0.2s" }}>
          {copied ? "✓ اتنسخ" : "نسخ"}
        </button>
        <button onClick={() => setImporting(v => !v)} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid #1E293B", borderRadius: 6, padding: "3px 10px", fontSize: 11, color: "#64748B", cursor: "pointer" }}>
          {importing ? "إلغاء" : "تغيير ID"}
        </button>
        {statusText && <span style={{ fontSize: 11, color: statusColor, marginRight: "auto" }}>{statusText}</span>}
      </div>

      {/* Import ID */}
      {importing && (
        <div style={{ marginTop: 10, display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
          <input
            value={importVal}
            onChange={e => setImportVal(e.target.value.toUpperCase())}
            placeholder="ادخل الـ Sync ID..."
            maxLength={12}
            style={{ flex: 1, minWidth: 140, background: "#0B1420", border: "1px solid #1E293B", borderRadius: 8, padding: "6px 10px", color: "#E2E8F0", fontSize: 13, fontFamily: "monospace", letterSpacing: 2, outline: "none" }}
          />
          <button onClick={doImport} style={{ background: "rgba(0,212,255,0.15)", border: "1px solid #00D4FF44", borderRadius: 8, padding: "6px 14px", fontSize: 12, color: "#00D4FF", cursor: "pointer", fontWeight: 700 }}>
            تحميل
          </button>
          {importErr && <span style={{ fontSize: 11, color: "#F87171", width: "100%" }}>{importErr}</span>}
        </div>
      )}

      <div style={{ marginTop: 8, fontSize: 11, color: "#334155", lineHeight: 1.6 }}>
        💡 انسخ الـ ID واستخدمه على أي جهاز تاني عشان تزامن تقدمك
      </div>
    </div>
  );
}
