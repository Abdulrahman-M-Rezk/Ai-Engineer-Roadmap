import { useState, useEffect, useRef, useCallback } from "react";
import { doc, setDoc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase.js";
import { phases, transferable } from "./data.js";

/* ───────────── GLOBAL STYLES ───────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { font-family: 'Inter', 'Segoe UI', Tahoma, Arial, sans-serif; background: #060A12; color: #E2E8F0; direction: rtl; }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: #0A1020; }
  ::-webkit-scrollbar-thumb { background: #1E293B; border-radius: 99px; }
  ::-webkit-scrollbar-thumb:hover { background: #334155; }

  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes fadeIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
  @keyframes slideIn { from { opacity:0; transform:translateX(32px); } to { opacity:1; transform:translateX(0); } }
  @keyframes checkPop { 0%{transform:scale(0.6);} 60%{transform:scale(1.25);} 100%{transform:scale(1);} }
  @keyframes pinPop { 0%{transform:scale(0.85);opacity:0;} 100%{transform:scale(1);opacity:1;} }
  @keyframes confettiFall {
    0%   { transform:translateY(-10px) rotate(0deg); opacity:1; }
    100% { transform:translateY(110vh) rotate(720deg); opacity:0; }
  }
  @keyframes glow { 0%,100%{box-shadow:0 0 18px var(--glow-c,#00D4FF44);} 50%{box-shadow:0 0 38px var(--glow-c,#00D4FF88);} }
  @keyframes progressShimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.5;} }
  @keyframes noteOpen { from{opacity:0;max-height:0;} to{opacity:1;max-height:200px;} }
  @keyframes shake { 0%,100%{transform:translateX(0);} 20%,60%{transform:translateX(-6px);} 40%,80%{transform:translateX(6px);} }

  .phase-card { animation: fadeIn 0.35s ease both; }
  .detail-page { animation: slideIn 0.3s ease both; }
  .checkbox-check { animation: checkPop 0.25s ease; }
  .note-area { animation: noteOpen 0.2s ease; }
  .pin-screen { animation: pinPop 0.4s cubic-bezier(.34,1.56,.64,1) both; }
  .shake { animation: shake 0.35s ease; }

  .btn-hover { transition: filter 0.15s, transform 0.15s; }
  .btn-hover:hover { filter: brightness(1.15); transform: scale(1.02); }
  .src-link:hover  { border-color: var(--phase-c, #00D4FF) !important; background: rgba(255,255,255,0.03) !important; }
  .copy-btn:active { transform: scale(0.95); }

  .pin-input {
    width: 56px; height: 68px;
    background: rgba(255,255,255,0.04);
    border: 2px solid #1E293B;
    border-radius: 14px;
    color: #F1F5F9;
    font-size: 28px;
    font-weight: 900;
    text-align: center;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    caret-color: #00D4FF;
  }
  .pin-input:focus {
    border-color: #00D4FF;
    box-shadow: 0 0 0 3px rgba(0,212,255,0.15);
  }
  .pin-input::selection { background: rgba(0,212,255,0.3); }
`;

/* ───────────── PIN SCREEN ───────────── */
function PINScreen({ onEnter }) {
  const [digits, setDigits] = useState(["","","",""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shaking, setShaking] = useState(false);
  const refs = [useRef(), useRef(), useRef(), useRef()];

  const pin = digits.join("");

  const handleDigit = (i, val) => {
    const v = val.replace(/\D/g,"").slice(-1);
    const next = [...digits];
    next[i] = v;
    setDigits(next);
    setError("");
    if (v && i < 3) refs[i+1].current?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      refs[i-1].current?.focus();
    }
    if (e.key === "Enter") handleSubmit();
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g,"").slice(0,4);
    if (pasted.length === 4) {
      setDigits(pasted.split(""));
      refs[3].current?.focus();
    }
    e.preventDefault();
  };

  const triggerShake = () => {
    setShaking(true);
    setTimeout(()=>setShaking(false), 400);
  };

  const handleSubmit = async () => {
    if (pin.length < 4) {
      setError("أدخل الـ 4 أرقام كاملين");
      triggerShake();
      return;
    }
    setLoading(true);
    setError("");
    try {
      const ref = doc(db, "progress", pin);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        await setDoc(ref, { checked:{}, notes:{}, dates:{}, updatedAt: Date.now() });
      }
      localStorage.setItem("roadmap-pin", pin);
      onEnter(pin);
    } catch (e) {
      setError("حصل خطأ — تأكد من الاتصال");
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight:"100vh", background:"#060A12",
      display:"flex", alignItems:"center", justifyContent:"center",
      padding:24, direction:"rtl"
    }}>
      <style>{GLOBAL_CSS}</style>

      {/* BG glow blobs */}
      <div style={{ position:"fixed",top:"20%",right:"10%",width:320,height:320,borderRadius:"50%",background:"rgba(0,212,255,0.05)",filter:"blur(80px)",pointerEvents:"none" }}/>
      <div style={{ position:"fixed",bottom:"20%",left:"10%",width:280,height:280,borderRadius:"50%",background:"rgba(167,139,250,0.06)",filter:"blur(80px)",pointerEvents:"none" }}/>

      <div className={`pin-screen${shaking?" shake":""}`}
        style={{
          width:"100%", maxWidth:400,
          background:"rgba(11,20,36,0.95)",
          border:"1px solid rgba(0,212,255,0.15)",
          borderRadius:24, padding:"40px 32px 36px",
          boxShadow:"0 32px 80px rgba(0,0,0,0.6)",
          textAlign:"center"
        }}>

        {/* Icon */}
        <div style={{ fontSize:52, marginBottom:16, lineHeight:1 }}>🔐</div>

        {/* Title */}
        <h1 style={{
          fontSize:"clamp(20px,4vw,26px)", fontWeight:900, marginBottom:8,
          background:"linear-gradient(135deg,#00D4FF 0%,#A78BFA 50%,#F472B6 100%)",
          WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent"
        }}>أدخل الـ PIN بتاعك</h1>
        <p style={{ color:"#475569", fontSize:13, marginBottom:32, lineHeight:1.6 }}>
          PIN = 4 أرقام · نفس الـ PIN على أي جهاز هيجيب تقدمك<br/>
          <span style={{ color:"#334155", fontSize:11 }}>لو PIN جديد هيتعمل حساب جديد تلقائياً</span>
        </p>

        {/* 4-box PIN input */}
        <div style={{ display:"flex", gap:10, justifyContent:"center", marginBottom:24, direction:"ltr" }}
          onPaste={handlePaste}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={refs[i]}
              className="pin-input"
              type="tel"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={e => handleDigit(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              autoFocus={i === 0}
            />
          ))}
        </div>

        {/* Error */}
        {error && (
          <div style={{ color:"#F87171", fontSize:12, marginBottom:16, background:"rgba(248,113,113,0.1)", border:"1px solid rgba(248,113,113,0.25)", borderRadius:8, padding:"7px 14px" }}>
            {error}
          </div>
        )}

        {/* Submit */}
        <button className="btn-hover" onClick={handleSubmit} disabled={loading}
          style={{
            width:"100%", padding:"13px 24px",
            background: pin.length===4
              ? "linear-gradient(135deg,rgba(0,212,255,0.2),rgba(167,139,250,0.2))"
              : "rgba(255,255,255,0.04)",
            border:`1px solid ${pin.length===4?"rgba(0,212,255,0.4)":"#1E293B"}`,
            borderRadius:12, color: pin.length===4?"#E2E8F0":"#334155",
            fontSize:15, fontWeight:800, cursor: loading?"not-allowed":"pointer",
            display:"flex", alignItems:"center", justifyContent:"center", gap:10,
            transition:"all 0.25s"
          }}>
          {loading ? (
            <><div style={{ width:18,height:18,border:"2px solid #334155",borderTop:"2px solid #00D4FF",borderRadius:"50%",animation:"spin 0.8s linear infinite" }}/>جاري الدخول…</>
          ) : "دخول →"}
        </button>

        {/* Hint */}
        <p style={{ color:"#1E293B", fontSize:11, marginTop:20, lineHeight:1.6 }}>
          💡 اختار PIN سهل تتذكره — ده هو الوحيد اللي هيوصلك لتقدمك
        </p>
      </div>
    </div>
  );
}

/* ───────────── CONFETTI ───────────── */
function ConfettiPiece({ color, x, delay, size }) {
  return (
    <div style={{
      position:"fixed", top:-20, left:`${x}%`, width:size, height:size*0.5,
      background:color, borderRadius:2, opacity:1, zIndex:9999,
      animation:`confettiFall ${1.8+Math.random()*1.2}s ${delay}s ease-in forwards`,
      pointerEvents:"none"
    }}/>
  );
}
function Confetti({ active }) {
  if (!active) return null;
  const COLORS = ["#00D4FF","#A78BFA","#F472B6","#34D399","#FBBF24","#F87171"];
  return <>{Array.from({length:80},(_,i)=>(
    <ConfettiPiece key={i} color={COLORS[i%COLORS.length]}
      x={Math.random()*100} delay={Math.random()*1.5}
      size={6+Math.random()*8}
    />
  ))}</>;
}

/* ───────────── ATOMS ───────────── */
function LangBadge({ lang }) {
  const ar = lang === "🇪🇬";
  return <span style={{ fontSize:"clamp(9px,1.5vw,10px)",padding:"1px 6px",borderRadius:4,whiteSpace:"nowrap",background:ar?"rgba(251,191,36,0.15)":"rgba(147,197,253,0.12)",color:ar?"#FBBF24":"#93C5FD" }}>{ar?"عربي":"English"}</span>;
}
function PriceBadge({ price }) {
  const free=price.includes("مجاني"),bought=price.includes("اشتريته");
  return <span style={{ fontSize:"clamp(9px,1.5vw,10px)",padding:"2px 7px",borderRadius:4,whiteSpace:"nowrap",background:free?"rgba(52,211,153,0.13)":bought?"rgba(0,212,255,0.13)":"rgba(251,191,36,0.13)",color:free?"#34D399":bought?"#00D4FF":"#FBBF24" }}>{price}</span>;
}

function Checkbox({ on, color, onClick }) {
  const [animKey, setAnimKey] = useState(0);
  const handleClick = () => { if (!on) setAnimKey(k=>k+1); onClick?.(); };
  return (
    <div onClick={handleClick} key={animKey} className={on?"checkbox-check":""}
      style={{ width:18,height:18,borderRadius:4,flexShrink:0,marginTop:1,cursor:"pointer",
        border:`2px solid ${on?color:"#334155"}`,background:on?color:"transparent",
        display:"flex",alignItems:"center",justifyContent:"center",
        transition:"border-color 0.18s, background 0.18s",
        boxShadow:on?`0 0 10px ${color}55`:"none" }}>
      {on&&<span style={{ color:"#060A12",fontSize:10,fontWeight:900,lineHeight:1 }}>✓</span>}
    </div>
  );
}

function AnimatedBar({ pct, color, h=5 }) {
  return (
    <div style={{ width:"100%",height:h,background:"#0F1A2E",borderRadius:99,overflow:"hidden" }}>
      <div style={{
        width:`${pct}%`, height:"100%", borderRadius:99,
        background:`linear-gradient(90deg,${color}99,${color},${color}dd,${color}88)`,
        backgroundSize:"200% 100%",
        animation:"progressShimmer 2.5s linear infinite",
        transition:"width 0.6s cubic-bezier(.4,0,.2,1)"
      }}/>
    </div>
  );
}

function SyncDot({ status }) {
  const map = { synced:["#34D399","محفوظ ☁️"], syncing:["#FBBF24","جاري الحفظ…"], error:["#F87171","خطأ"] };
  const [c,l] = map[status] || ["#475569",""];
  return l ? (
    <div style={{ display:"flex",alignItems:"center",gap:5,fontSize:11,color:c }}>
      <div style={{ width:7,height:7,borderRadius:"50%",background:c,animation:status==="syncing"?"pulse 1s ease infinite":"none" }}/>
      {l}
    </div>
  ) : null;
}

/* ───────────── NOTE EDITOR ───────────── */
function NoteEditor({ itemId, notes, onSaveNote }) {
  const [open, setOpen] = useState(false);
  const [val, setVal] = useState(notes[itemId]||"");
  useEffect(()=>setVal(notes[itemId]||""),[notes,itemId]);
  return (
    <div style={{ display:"inline-flex",flexDirection:"column",gap:4 }}>
      <button onClick={()=>setOpen(o=>!o)} title="أضف ملاحظة"
        style={{ background:"none",border:"none",cursor:"pointer",padding:"2px 4px",fontSize:13,
          opacity:notes[itemId]?1:0.4,filter:notes[itemId]?"drop-shadow(0 0 4px #FBBF2488)":"none",transition:"opacity 0.2s" }}>📝</button>
      {open && (
        <textarea className="note-area" value={val} onChange={e=>setVal(e.target.value)}
          onBlur={()=>onSaveNote(itemId,val)} placeholder="ملاحظتك هنا…" rows={3}
          style={{ background:"rgba(251,191,36,0.07)",border:"1px solid #FBBF2444",borderRadius:8,
            padding:"8px 10px",color:"#E2E8F0",fontSize:11,direction:"rtl",resize:"vertical",
            outline:"none",minWidth:200,maxWidth:340,width:"100%" }}/>
      )}
    </div>
  );
}

/* ───────────── DATE FIELDS ───────────── */
function DateFields({ itemId, dates, onSaveDate }) {
  const [open, setOpen] = useState(false);
  const d = dates[itemId]||{};
  const hasDate = d.start||d.end;
  return (
    <div style={{ display:"inline-flex",flexDirection:"column",gap:4 }}>
      <button onClick={()=>setOpen(o=>!o)} title="تتبع التواريخ"
        style={{ background:"none",border:"none",cursor:"pointer",padding:"2px 4px",fontSize:13,
          opacity:hasDate?1:0.4,filter:hasDate?"drop-shadow(0 0 4px #93C5FD88)":"none",transition:"opacity 0.2s" }}>📅</button>
      {open && (
        <div className="note-area" style={{ background:"rgba(147,197,253,0.07)",border:"1px solid #93C5FD33",borderRadius:8,padding:"8px 10px",display:"flex",flexDirection:"column",gap:6,minWidth:200 }}>
          {[["start","🟢 بدأت"],["end","✅ خلصت"]].map(([f,label])=>(
            <label key={f} style={{ display:"flex",alignItems:"center",gap:6,fontSize:11,color:"#94A3B8" }}>
              <span style={{ whiteSpace:"nowrap",minWidth:58 }}>{label}</span>
              <input type="date" value={d[f]||""} onChange={e=>onSaveDate(itemId,{...d,[f]:e.target.value})}
                style={{ background:"rgba(255,255,255,0.05)",border:"1px solid #1E293B",borderRadius:6,padding:"3px 6px",color:"#CBD5E1",fontSize:11,outline:"none",flex:1 }}/>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

/* ───────────── ITEM ROW ───────────── */
function ItemRow({ item, color, checked, toggle, notes, dates, onSaveNote, onSaveDate }) {
  const done = !!checked[item.id];
  return (
    <div style={{ display:"flex",gap:8,alignItems:"flex-start",padding:"6px 4px",borderRadius:8,transition:"background 0.15s",background:done?"rgba(52,211,153,0.03)":"transparent" }}>
      <Checkbox on={done} color={color} onClick={()=>toggle(item.id)}/>
      <div style={{ flex:1,minWidth:0 }}>
        <span style={{ fontSize:"clamp(12px,2vw,13px)",color:done?"#3D5166":"#CBD5E1",lineHeight:1.6,
          textDecoration:done?"line-through":"none",transition:"all 0.18s",userSelect:"none",cursor:"pointer" }}
          onClick={()=>toggle(item.id)}>{item.text}</span>
        <div style={{ display:"flex",gap:4,marginTop:4,flexWrap:"wrap" }}>
          <NoteEditor itemId={item.id} notes={notes} onSaveNote={onSaveNote}/>
          <DateFields itemId={item.id} dates={dates} onSaveDate={onSaveDate}/>
          {(dates[item.id]?.start||dates[item.id]?.end) && (
            <div style={{ display:"flex",gap:6,fontSize:10,color:"#475569",alignItems:"center" }}>
              {dates[item.id]?.start && <span>🟢 {dates[item.id].start}</span>}
              {dates[item.id]?.end   && <span>✅ {dates[item.id].end}</span>}
            </div>
          )}
        </div>
        {notes[item.id] && (
          <div style={{ marginTop:4,fontSize:11,color:"#FBBF24",background:"rgba(251,191,36,0.07)",borderRadius:6,padding:"4px 8px",borderRight:"2px solid #FBBF2455" }}>
            💬 {notes[item.id]}
          </div>
        )}
      </div>
    </div>
  );
}

/* ───────────── FEATURE 2: FILTERED SOURCES ───────────── */
const SRC_FILTERS = [
  { id:"all", label:"الكل" },
  { id:"video", label:"📹 فيديو/كورس" },
  { id:"book", label:"📕 كتاب/PDF" },
  { id:"article", label:"📄 مقال/موقع" },
  { id:"arabic", label:"🇪🇬 عربي" },
];
function srcCat(src) {
  const t = src.type;
  if (/يوتيوب|كورس|Coursera/i.test(t)) return "video";
  if (/كتاب|PDF|pdf/i.test(t)) return "book";
  return "article";
}
function SourceLink({ src, color }) {
  return (
    <a href={src.url} target="_blank" rel="noopener noreferrer" className="src-link"
      style={{ "--phase-c":color,display:"flex",alignItems:"center",gap:10,background:"rgba(0,0,0,0.3)",borderRadius:12,padding:"clamp(9px,2vw,12px) clamp(12px,2vw,14px)",textDecoration:"none",border:`1px solid ${color}18`,transition:"all 0.2s" }}>
      <div style={{ flex:1,minWidth:0 }}>
        <div style={{ display:"flex",alignItems:"center",flexWrap:"wrap",gap:5,marginBottom:3 }}>
          <span style={{ fontSize:"clamp(12px,2vw,13px)",fontWeight:700,color:"#E2E8F0" }}>{src.name}</span>
          <LangBadge lang={src.lang}/>
          <span style={{ fontSize:"clamp(9px,1.5vw,10px)",padding:"1px 5px",borderRadius:4,background:"rgba(255,255,255,0.05)",color:"#475569",whiteSpace:"nowrap" }}>{src.type}</span>
        </div>
        <div style={{ fontSize:"clamp(10px,1.8vw,11px)",color:"#475569" }}>{src.note}</div>
      </div>
      <div style={{ flexShrink:0,display:"flex",flexDirection:"column",alignItems:"flex-end",gap:5 }}>
        <PriceBadge price={src.price}/>
        <span style={{ fontSize:12,color }}>↗</span>
      </div>
    </a>
  );
}
function FilteredSources({ phase }) {
  const [filter, setFilter] = useState("all");
  const list = filter==="all" ? phase.sources
    : filter==="arabic" ? phase.sources.filter(s=>s.lang==="🇪🇬")
    : phase.sources.filter(s=>srcCat(s)===filter);
  return (
    <div>
      <div style={{ display:"flex",gap:6,flexWrap:"wrap",marginBottom:14 }}>
        {SRC_FILTERS.map(f=>(
          <button key={f.id} onClick={()=>setFilter(f.id)}
            style={{ background:filter===f.id?`${phase.color}20`:"rgba(255,255,255,0.03)",border:`1px solid ${filter===f.id?phase.color+"55":"#1E293B"}`,borderRadius:8,padding:"5px 12px",color:filter===f.id?phase.color:"#475569",fontSize:11,fontWeight:700,cursor:"pointer",transition:"all 0.2s" }}>
            {f.label}
          </button>
        ))}
      </div>
      {list.length===0
        ? <div style={{ color:"#334155",fontSize:13,textAlign:"center",padding:24 }}>مفيش مصادر في الفئة دي</div>
        : <div style={{ display:"flex",flexDirection:"column",gap:8 }}>{list.map(src=><SourceLink key={src.id} src={src} color={phase.color}/>)}</div>}
    </div>
  );
}

/* ───────────── FEATURE 1: FLOW TOPICS ───────────── */
function FlowTopics({ phase, checked, toggle, notes, dates, onSaveNote, onSaveDate }) {
  return (
    <div>
      {phase.topics.map((g,i)=>{
        const isLast = i===phase.topics.length-1;
        const allDone = g.items.every(it=>checked[it.id]);
        const doneCnt = g.items.filter(it=>checked[it.id]).length;
        return (
          <div key={g.id} style={{ display:"flex",gap:12 }}>
            <div style={{ display:"flex",flexDirection:"column",alignItems:"center",width:22,flexShrink:0 }}>
              <div style={{ width:14,height:14,borderRadius:"50%",marginTop:18,flexShrink:0,border:`2px solid ${allDone?phase.color:phase.color+"55"}`,background:allDone?phase.color:"transparent",boxShadow:allDone?`0 0 12px ${phase.color}88`:"none",transition:"all 0.4s" }}/>
              {!isLast&&<div style={{ width:2,flex:1,minHeight:24,background:allDone?`linear-gradient(to bottom,${phase.color},${phase.color}44)`:"#1E293B",boxShadow:allDone?`0 0 8px ${phase.color}55`:"none",transition:"all 0.5s",margin:"4px 0" }}/>}
            </div>
            <div style={{ flex:1,marginBottom:isLast?0:16 }}>
              <div style={{ background:"rgba(0,0,0,0.35)",borderRadius:12,padding:"14px 16px",borderRight:`3px solid ${allDone?phase.color:phase.color+"44"}`,boxShadow:allDone?`0 0 24px ${phase.color}18`:"none",transition:"all 0.4s" }}>
                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12 }}>
                  <div style={{ fontSize:11,color:phase.color,fontWeight:800,letterSpacing:1 }}>{g.label}</div>
                  <div style={{ fontSize:10,color:allDone?"#34D399":"#475569",fontWeight:700 }}>{doneCnt}/{g.items.length}{allDone?" ✅":""}</div>
                </div>
                <div style={{ display:"flex",flexDirection:"column",gap:2 }}>
                  {g.items.map(item=>(
                    <ItemRow key={item.id} item={item} color={phase.color} checked={checked} toggle={toggle} notes={notes} dates={dates} onSaveNote={onSaveNote} onSaveDate={onSaveDate}/>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ───────────── FEATURE 3: TASKS TAB ───────────── */
const T_ICON={practice:"🔨",project:"🚀",reading:"📖"};
const T_LABEL={practice:"تمرين",project:"مشروع",reading:"قراءة"};
const T_COLOR={practice:"#FBBF24",project:"#F472B6",reading:"#93C5FD"};
function TasksTab({ phase, tasks, toggleTask }) {
  const pt = phase.tasks||[];
  const done = pt.filter(t=>tasks[t.id]).length;
  const pct = pt.length?Math.round(done/pt.length*100):0;
  return (
    <div>
      <div style={{ background:"rgba(0,0,0,0.3)",borderRadius:10,padding:"12px 16px",marginBottom:12,display:"flex",justifyContent:"space-between",alignItems:"center" }}>
        <span style={{ fontSize:13,color:"#94A3B8",fontWeight:600 }}>التقدم</span>
        <span style={{ fontSize:13,color:phase.color,fontWeight:700 }}>{done}/{pt.length} تكاليف خلصت{done===pt.length&&pt.length>0?" 🎉":""}</span>
      </div>
      <AnimatedBar pct={pct} color={phase.color} h={4}/>
      <div style={{ marginTop:14,display:"flex",flexDirection:"column",gap:8 }}>
        {pt.map(task=>{
          const isDone=!!tasks[task.id]; const c=T_COLOR[task.type];
          return (
            <div key={task.id} style={{ background:isDone?"rgba(52,211,153,0.04)":"rgba(0,0,0,0.25)",border:`1px solid ${isDone?"#34D39933":"#1E293B"}`,borderRadius:10,padding:"12px 14px",display:"flex",gap:10,alignItems:"flex-start",transition:"all 0.2s" }}>
              <div onClick={()=>toggleTask(task.id)} style={{ width:18,height:18,borderRadius:4,flexShrink:0,marginTop:1,cursor:"pointer",border:`2px solid ${isDone?"#34D399":"#334155"}`,background:isDone?"#34D399":"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.18s",boxShadow:isDone?"0 0 8px rgba(52,211,153,0.5)":"none" }}>
                {isDone&&<span style={{ color:"#060A12",fontSize:9,fontWeight:900 }}>✓</span>}
              </div>
              <div style={{ flex:1,minWidth:0 }}>
                <div style={{ display:"flex",alignItems:"center",gap:6,marginBottom:4 }}>
                  <span>{T_ICON[task.type]}</span>
                  <span style={{ fontSize:10,background:`${c}20`,border:`1px solid ${c}44`,borderRadius:6,padding:"1px 7px",color:c,fontWeight:700 }}>{T_LABEL[task.type]}</span>
                  {task.topic&&<span style={{ fontSize:10,background:`${phase.color}18`,border:`1px solid ${phase.color}33`,borderRadius:6,padding:"1px 8px",color:phase.color,fontWeight:600 }}>{task.topic}</span>}
                </div>
                <div style={{ fontSize:13,color:isDone?"#475569":"#CBD5E1",lineHeight:1.5,textDecoration:isDone?"line-through":"none",transition:"all 0.2s" }}>{task.text}</div>
              </div>
              {task.url&&(
                <a href={task.url} target="_blank" rel="noopener noreferrer" style={{ flexShrink:0,background:"rgba(255,255,255,0.05)",border:"1px solid #1E293B",borderRadius:7,padding:"4px 10px",color:"#94A3B8",fontSize:11,textDecoration:"none",whiteSpace:"nowrap",alignSelf:"center" }}>
                  افتح ↗
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ───────────── PHASE DETAIL (updated: 3 tabs + FlowTopics) ───────────── */
function PhaseDetail({ phase, checked, toggle, notes, dates, tasks, onSaveNote, onSaveDate, toggleTask, onBack }) {
  const [tab, setTab] = useState("المحتوى");
  const allItems = phase.topics.flatMap(t=>t.items);
  const done = allItems.filter(i=>checked[i.id]).length;
  const pct = allItems.length ? Math.round((done/allItems.length)*100) : 0;
  const [confetti, setConfetti] = useState(false);
  const prevPct = useRef(pct);
  useEffect(()=>{
    if (pct===100 && prevPct.current<100) { setConfetti(true); setTimeout(()=>setConfetti(false),3500); }
    prevPct.current = pct;
  },[pct]);
  return (
    <div className="detail-page" style={{ minHeight:"100vh",background:"#060A12",padding:"0 0 100px" }}>
      <Confetti active={confetti}/>
      <div style={{ position:"sticky",top:0,zIndex:50,background:"rgba(6,10,18,0.92)",backdropFilter:"blur(16px)",borderBottom:"1px solid #0F1A2E",padding:"14px clamp(16px,4vw,32px)" }}>
        <div style={{ maxWidth:820,margin:"0 auto",display:"flex",alignItems:"center",gap:14,flexWrap:"wrap" }}>
          <button onClick={onBack} style={{ background:"rgba(255,255,255,0.05)",border:"1px solid #1E293B",borderRadius:10,padding:"6px 14px",color:"#94A3B8",fontSize:13,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:6,transition:"all 0.2s" }}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.09)"}
            onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.05)"}>← رجوع</button>
          <div style={{ fontSize:24 }}>{phase.icon}</div>
          <div style={{ flex:1,minWidth:0 }}>
            <div style={{ display:"flex",alignItems:"center",gap:8,flexWrap:"wrap" }}>
              <span style={{ fontSize:"clamp(9px,1.5vw,10px)",color:phase.color,fontWeight:800,letterSpacing:3 }}>PHASE {phase.number}</span>
              <span style={{ fontSize:"clamp(15px,3vw,20px)",fontWeight:900,color:"#F1F5F9" }}>{phase.title}</span>
              {pct===100&&<span style={{ fontSize:11,background:"#34D39920",border:"1px solid #34D39955",borderRadius:20,padding:"2px 10px",color:"#34D399",fontWeight:700 }}>🎉 مكتمل!</span>}
            </div>
            <div style={{ marginTop:6,display:"flex",alignItems:"center",gap:10 }}>
              <div style={{ flex:1,maxWidth:300 }}><AnimatedBar pct={pct} color={phase.color} h={4}/></div>
              <span style={{ fontSize:12,color:phase.color,fontWeight:700,whiteSpace:"nowrap" }}>{done}/{allItems.length} ({pct}%)</span>
            </div>
          </div>
        </div>
      </div>
      <div style={{ maxWidth:820,margin:"0 auto",padding:"0 clamp(16px,4vw,32px)" }}>
        <div style={{ display:"flex",borderBottom:"1px solid #192035",marginTop:20,marginBottom:20 }}>
          {["المحتوى","المصادر","تكاليف 📝"].map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{ background:"none",border:"none",padding:"10px clamp(10px,2vw,20px)",fontSize:13,fontWeight:700,cursor:"pointer",color:tab===t?phase.color:"#334155",borderBottom:tab===t?`2px solid ${phase.color}`:"2px solid transparent",transition:"all 0.2s" }}>{t}</button>
          ))}
        </div>
        {tab==="المحتوى" && <FlowTopics phase={phase} checked={checked} toggle={toggle} notes={notes} dates={dates} onSaveNote={onSaveNote} onSaveDate={onSaveDate}/>}
        {tab==="المصادر" && <FilteredSources phase={phase}/>}
        {tab==="تكاليف 📝" && <TasksTab phase={phase} tasks={tasks} toggleTask={toggleTask}/>}
      </div>
    </div>
  );
}

/* ───────────── PHASE CARD ───────────── */
function PhaseCard({ phase, idx, onOpenDetail, checked }) {
  const allItems = phase.topics.flatMap(t=>t.items);
  const done = allItems.filter(i=>checked[i.id]).length;
  const pct = allItems.length ? Math.round((done/allItems.length)*100) : 0;
  const isComplete = pct === 100;

  return (
    <div className="phase-card" onClick={onOpenDetail}
      style={{ display:"flex",gap:"clamp(10px,2vw,16px)",marginBottom:8,cursor:"pointer",animationDelay:`${idx*0.06}s` }}>
      <div style={{ display:"flex",flexDirection:"column",alignItems:"center",width:"clamp(38px,5vw,48px)",flexShrink:0 }}>
        <div style={{ width:"clamp(36px,4.5vw,44px)",height:"clamp(36px,4.5vw,44px)",borderRadius:"50%",border:`2px solid ${isComplete?phase.color:phase.color+"55"}`,background:isComplete?`radial-gradient(circle,${phase.glow},transparent 70%)`:"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"clamp(16px,2.5vw,20px)",flexShrink:0,boxShadow:isComplete?`0 0 22px ${phase.color}66`:"none",transition:"all 0.3s","--glow-c":phase.color+"66",animation:isComplete?"glow 2s ease-in-out infinite":"none" }}>{phase.icon}</div>
        {idx<phases.length-1 && <div style={{ width:2,flex:1,minHeight:16,background:`linear-gradient(to bottom,${phase.color}44,${phases[idx+1].color}22)`,margin:"4px 0" }}/>}
      </div>
      <div style={{ flex:1,background:isComplete?`linear-gradient(135deg,${phase.glow},rgba(11,20,32,0.95) 100%)`:"rgba(11,20,32,0.95)",border:`1px solid ${isComplete?phase.color+"55":"#192035"}`,borderRadius:12,padding:"clamp(12px,2.5vw,16px) clamp(14px,3vw,20px)",transition:"all 0.3s",boxShadow:isComplete?`0 0 28px ${phase.color}22`:"none" }}
        onMouseEnter={e=>{e.currentTarget.style.borderColor=phase.color+"44";e.currentTarget.style.transform="translateY(-1px)";}}
        onMouseLeave={e=>{e.currentTarget.style.borderColor=isComplete?phase.color+"55":"#192035";e.currentTarget.style.transform="translateY(0)";}}>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,marginBottom:10 }}>
          <div style={{ display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",flex:1,minWidth:0 }}>
            <span style={{ fontSize:"clamp(9px,1.5vw,10px)",color:phase.color,fontWeight:800,letterSpacing:3,flexShrink:0 }}>PHASE {phase.number}</span>
            <span style={{ fontSize:"clamp(14px,2.5vw,16px)",fontWeight:800,color:"#F1F5F9" }}>{phase.title}</span>
            {phase.badge && <span style={{ background:`${phase.color}18`,border:`1px solid ${phase.color}44`,borderRadius:20,padding:"2px 9px",fontSize:"clamp(9px,1.5vw,10px)",color:phase.color,fontWeight:700 }}>{phase.badge}</span>}
            {phase.statusLabel && <span style={{ background:"#34D39918",border:"1px solid #34D39944",borderRadius:20,padding:"2px 9px",fontSize:"clamp(9px,1.5vw,10px)",color:"#34D399",fontWeight:700 }}>{phase.statusLabel}</span>}
            {isComplete && <span style={{ fontSize:11,background:"#34D39920",border:"1px solid #34D39955",borderRadius:20,padding:"2px 9px",color:"#34D399",fontWeight:700 }}>🎉 مكتمل</span>}
          </div>
          <div style={{ display:"flex",alignItems:"center",gap:8,flexShrink:0 }}>
            <span style={{ fontSize:"clamp(10px,1.8vw,11px)",color:"#334155",whiteSpace:"nowrap" }}>⏱ {phase.duration}</span>
            <span style={{ color:phase.color,fontSize:11 }}>←</span>
          </div>
        </div>
        <div style={{ display:"flex",alignItems:"center",gap:10 }}>
          <div style={{ flex:1 }}><AnimatedBar pct={pct} color={phase.color} h={4}/></div>
          <span style={{ fontSize:"clamp(10px,1.8vw,12px)",color:phase.color,fontWeight:700,whiteSpace:"nowrap" }}>{done}/{allItems.length}</span>
        </div>
      </div>
    </div>
  );
}

/* ───────────── MOBILE BOTTOM NAV ───────────── */
function BottomNav({ phases, checked, onSelect }) {
  return (
    <div style={{ position:"fixed",bottom:0,left:0,right:0,zIndex:60,background:"rgba(6,10,18,0.96)",backdropFilter:"blur(20px)",borderTop:"1px solid #0F1A2E",display:"flex",overflowX:"auto",padding:"6px 4px 8px",gap:4,scrollbarWidth:"none" }}>
      {phases.map((ph)=>{
        const allItems = ph.topics.flatMap(t=>t.items);
        const done = allItems.filter(x=>checked[x.id]).length;
        const pct = allItems.length ? Math.round((done/allItems.length)*100) : 0;
        return (
          <button key={ph.id} onClick={()=>onSelect(ph.id)}
            style={{ flex:"0 0 auto",background:"rgba(255,255,255,0.03)",border:"1px solid #1E293B",borderRadius:10,padding:"6px 10px",display:"flex",flexDirection:"column",alignItems:"center",gap:2,cursor:"pointer",transition:"all 0.2s",minWidth:52 }}>
            <span style={{ fontSize:18,lineHeight:1 }}>{ph.icon}</span>
            <span style={{ fontSize:9,color:"#475569",fontWeight:700 }}>{pct}%</span>
          </button>
        );
      })}
    </div>
  );
}

/* ───────────── FEATURE 4: AI SEARCH MODAL ───────────── */
function AISearchModal({ onClose, onAdd }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;
  const search = async () => {
    if (!query.trim()) return;
    if (!KEY) { setError("أضف VITE_ANTHROPIC_API_KEY في .env"); return; }
    setLoading(true); setError(""); setResult(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{"Content-Type":"application/json","x-api-key":KEY,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:`أنا بتعلم AI Engineering وعايز أتعلم "${query}". اديني بالظبط: 1.شرح مختصر (3 جمل) 2.أفضل فيديو(اسم+لينك) 3.أفضل كتاب PDF مجاني(اسم+لينك) 4.أفضل مقال/موقع(اسم+لينك) 5.تاسك عملي واحد. رد JSON فقط. Format:{"description":"","video":{"name":"","url":""},"book":{"name":"","url":""},"article":{"name":"","url":""},"task":""}`}]})
      });
      if (!res.ok) throw new Error(`API ${res.status}`);
      const data = await res.json();
      const m = data.content[0].text.match(/\{[\s\S]*\}/);
      if (m) setResult(JSON.parse(m[0])); else throw new Error("Invalid JSON");
    } catch(e) { setError(`خطأ: ${e.message}`); }
    finally { setLoading(false); }
  };
  return (
    <>
      <div onClick={onClose} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",backdropFilter:"blur(8px)",zIndex:200 }}/>
      <div style={{ position:"fixed",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:"min(540px,94vw)",maxHeight:"85vh",overflowY:"auto",background:"#0B1525",border:"1px solid rgba(0,212,255,0.2)",borderRadius:20,padding:28,zIndex:201,boxShadow:"0 40px 80px rgba(0,0,0,0.8)",animation:"fadeIn 0.25s ease" }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18 }}>
          <h2 style={{ fontSize:17,fontWeight:800,color:"#F1F5F9",margin:0 }}>🔍 ابحث عن Topic</h2>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,0.05)",border:"1px solid #1E293B",borderRadius:8,width:30,height:30,cursor:"pointer",color:"#475569",fontSize:16 }}>✕</button>
        </div>
        <div style={{ display:"flex",gap:8,marginBottom:14 }}>
          <input value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==="Enter"&&search()}
            placeholder="اكتب الـ topic اللي عايز تتعلمه…"
            style={{ flex:1,background:"rgba(255,255,255,0.04)",border:"1px solid #1E293B",borderRadius:10,padding:"10px 14px",color:"#E2E8F0",fontSize:13,direction:"rtl",outline:"none" }}/>
          <button onClick={search} disabled={loading} className="btn-hover"
            style={{ background:"rgba(0,212,255,0.15)",border:"1px solid rgba(0,212,255,0.3)",borderRadius:10,padding:"10px 16px",color:"#00D4FF",fontSize:13,fontWeight:700,cursor:loading?"not-allowed":"pointer",whiteSpace:"nowrap" }}>
            {loading?"⏳":"بحث"}
          </button>
        </div>
        {error&&<div style={{ color:"#F87171",fontSize:12,background:"rgba(248,113,113,0.1)",border:"1px solid rgba(248,113,113,0.2)",borderRadius:8,padding:"8px 12px",marginBottom:12 }}>{error}</div>}
        {loading&&<div style={{ textAlign:"center",padding:28,color:"#475569" }}><div style={{ width:22,height:22,border:"2px solid #1E293B",borderTop:"2px solid #00D4FF",borderRadius:"50%",animation:"spin 0.8s linear infinite",margin:"0 auto 10px" }}/>كلود بيبحث…</div>}
        {result&&(
          <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
            <div style={{ background:"rgba(0,212,255,0.06)",border:"1px solid rgba(0,212,255,0.15)",borderRadius:12,padding:14 }}>
              <div style={{ fontSize:10,color:"#00D4FF",fontWeight:700,letterSpacing:2,marginBottom:8 }}>DESCRIPTION</div>
              <p style={{ fontSize:13,color:"#CBD5E1",lineHeight:1.7,margin:0 }}>{result.description}</p>
            </div>
            {[["📹 فيديو",result.video,"#F472B6"],["📕 كتاب",result.book,"#A78BFA"],["📄 مقال",result.article,"#34D399"]].map(([label,data,color])=>data&&(
              <div key={label} style={{ background:"rgba(0,0,0,0.3)",border:`1px solid ${color}22`,borderRadius:10,padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",gap:8 }}>
                <div style={{ flex:1,minWidth:0 }}>
                  <div style={{ fontSize:10,color,fontWeight:700,marginBottom:3 }}>{label}</div>
                  <div style={{ fontSize:13,color:"#CBD5E1",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{data.name}</div>
                </div>
                {data.url&&<a href={data.url} target="_blank" rel="noopener noreferrer" style={{ background:`${color}18`,border:`1px solid ${color}44`,borderRadius:7,padding:"4px 10px",color,fontSize:11,textDecoration:"none",whiteSpace:"nowrap" }}>↗ افتح</a>}
              </div>
            ))}
            {result.task&&<div style={{ background:"rgba(251,191,36,0.08)",border:"1px solid rgba(251,191,36,0.2)",borderRadius:10,padding:"12px 14px" }}>
              <div style={{ fontSize:10,color:"#FBBF24",fontWeight:700,marginBottom:6 }}>🔨 التاسك العملي</div>
              <div style={{ fontSize:13,color:"#CBD5E1",lineHeight:1.6 }}>{result.task}</div>
            </div>}
            <button onClick={()=>{onAdd({topic:query,result});onClose();}} className="btn-hover"
              style={{ width:"100%",padding:10,background:"rgba(167,139,250,0.12)",border:"1px solid rgba(167,139,250,0.3)",borderRadius:10,color:"#A78BFA",fontSize:13,fontWeight:700,cursor:"pointer" }}>
              ➕ أضف للـ Roadmap
            </button>
          </div>
        )}
      </div>
    </>
  );
}

/* ───────────── APP ───────────── */
export default function App() {
  const [pin, setPin] = useState(()=>localStorage.getItem("roadmap-pin")||null);
  const [checked, setChecked] = useState({});
  const [notes, setNotes]   = useState({});
  const [dates, setDates]   = useState({});
  const [tasks, setTasks]   = useState({});
  const [syncStatus, setSyncStatus] = useState("synced");
  const [detailPhase, setDetailPhase] = useState(null);
  const [showAI, setShowAI] = useState(false);
  const [finds, setFinds] = useState([]);
  const saveTimer = useRef(null);
  const unsubRef  = useRef(null);
  // Refs for latest values to avoid stale closures in save
  const rC=useRef({}),rN=useRef({}),rD=useRef({}),rT=useRef({});
  useEffect(()=>{rC.current=checked;},[checked]);
  useEffect(()=>{rN.current=notes;},[notes]);
  useEffect(()=>{rD.current=dates;},[dates]);
  useEffect(()=>{rT.current=tasks;},[tasks]);

  /* ─ Firestore listener ─ */
  useEffect(()=>{
    if (!pin) return;
    if (unsubRef.current) { unsubRef.current(); unsubRef.current=null; }
    const ref = doc(db,"progress",pin);
    unsubRef.current = onSnapshot(ref,
      snap=>{ if(snap.exists()){const d=snap.data();setChecked(d.checked||{});setNotes(d.notes||{});setDates(d.dates||{});setTasks(d.tasks||{});} setSyncStatus("synced"); },
      ()=>setSyncStatus("error")
    );
    return ()=>unsubRef.current?.();
  },[pin]);

  const save = useCallback(()=>{
    if (!pin) return;
    clearTimeout(saveTimer.current); setSyncStatus("syncing");
    saveTimer.current = setTimeout(async()=>{
      try { await setDoc(doc(db,"progress",pin),{checked:rC.current,notes:rN.current,dates:rD.current,tasks:rT.current,updatedAt:Date.now()},{merge:true}); setSyncStatus("synced"); }
      catch { setSyncStatus("error"); }
    },700);
  },[pin]);

  const toggle = useCallback((id)=>{
    setChecked(prev=>{ const next={...prev,[id]:!prev[id]}; rC.current=next; save(); return next; });
  },[save]);
  const onSaveNote = useCallback((id,text)=>{
    setNotes(prev=>{ const next={...prev,[id]:text}; rN.current=next; save(); return next; });
  },[save]);
  const onSaveDate = useCallback((id,val)=>{
    setDates(prev=>{ const next={...prev,[id]:val}; rD.current=next; save(); return next; });
  },[save]);
  const toggleTask = useCallback((id)=>{
    setTasks(prev=>{ const next={...prev,[id]:!prev[id]}; rT.current=next; save(); return next; });
  },[save]);

  /* ─ PIN entered ─ */
  const handleEnterPIN = (p) => setPin(p);

  /* ─ Change PIN ─ */
  const handleChangePIN = () => { localStorage.removeItem("roadmap-pin"); window.location.reload(); };

  const allItems = phases.flatMap(p=>p.topics.flatMap(t=>t.items));
  const totalDone = allItems.filter(i=>checked[i.id]).length;
  const totalPct  = allItems.length ? Math.round((totalDone/allItems.length)*100) : 0;

  if (!pin) return <PINScreen onEnter={(p)=>setPin(p)}/>;

  if (detailPhase !== null) {
    const phase = phases.find(p=>p.id===detailPhase);
    return (
      <>
        <style>{GLOBAL_CSS}</style>
        <PhaseDetail phase={phase} checked={checked} toggle={toggle}
          notes={notes} dates={dates} tasks={tasks}
          onSaveNote={onSaveNote} onSaveDate={onSaveDate} toggleTask={toggleTask}
          onBack={()=>setDetailPhase(null)}/>
        <button onClick={()=>setShowAI(true)} style={{ position:"fixed",bottom:24,right:16,zIndex:70,width:50,height:50,borderRadius:"50%",background:"linear-gradient(135deg,#00D4FF,#A78BFA)",border:"none",cursor:"pointer",boxShadow:"0 4px 20px rgba(0,212,255,0.4)",fontSize:20 }}>🔍</button>
        {showAI&&<AISearchModal onClose={()=>setShowAI(false)} onAdd={(f)=>setFinds(prev=>[...prev,{...f,id:Date.now()}])}/>}
      </>
    );
  }

  /* ─ Main view ─ */
  return (
    <div style={{ background:"#060A12",minHeight:"100vh",color:"#E2E8F0",padding:"clamp(20px,4vw,44px) clamp(14px,3vw,28px) 100px",direction:"rtl" }}>
      <style>{GLOBAL_CSS}</style>

      {/* Sync dot */}
      <div style={{ position:"fixed",top:14,left:14,zIndex:100 }}>
        <SyncDot status={syncStatus}/>
      </div>

      {/* Hero */}
      <div style={{ textAlign:"center",marginBottom:"clamp(24px,4vw,44px)" }}>
        <div style={{ fontSize:"clamp(9px,1.5vw,11px)",letterSpacing:5,color:"#334155",marginBottom:10,textTransform:"uppercase" }}>Personalized · Computer Vision Specialized</div>
        <h1 style={{ fontSize:"clamp(26px,5vw,52px)",fontWeight:900,margin:0,lineHeight:1.15,background:"linear-gradient(135deg,#00D4FF 0%,#A78BFA 45%,#F472B6 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>AI Engineer Roadmap</h1>
        <p style={{ color:"#475569",marginTop:8,fontSize:"clamp(12px,2vw,14px)" }}>~8–9 أشهر · 7 مراحل · اضغط على أي مرحلة للتفاصيل</p>
        <div style={{ display:"flex",justifyContent:"center",gap:8,marginTop:12,flexWrap:"wrap" }}>
          {[["🇪🇬 عربي","#FBBF2433","#FBBF24"],["🌍 English","#93C5FD33","#93C5FD"],["✅ عندك","#34D39933","#34D399"],["⭐ أساسي","#F472B633","#F472B6"]].map(([l,bg,c])=>(
            <span key={l} style={{ fontSize:"clamp(10px,1.8vw,11px)",padding:"3px 10px",borderRadius:20,background:bg,color:c,border:`1px solid ${c}44` }}>{l}</span>
          ))}
        </div>
        {/* Total progress */}
        <div style={{ maxWidth:500,margin:"18px auto 0",background:"rgba(11,20,32,0.9)",border:"1px solid #192035",borderRadius:14,padding:"16px 20px" }}>
          <div style={{ display:"flex",justifyContent:"space-between",marginBottom:10,fontSize:"clamp(12px,2vw,14px)" }}>
            <span style={{ color:"#94A3B8",fontWeight:600 }}>التقدم الكلي</span>
            <span style={{ color:"#F1F5F9",fontWeight:800 }}>{totalDone} / {allItems.length}&nbsp;<span style={{ color:"#34D399" }}>({totalPct}%)</span></span>
          </div>
          <AnimatedBar pct={totalPct} color="#A78BFA" h={7}/>
        </div>
      </div>

      {/* Phase Cards */}
      <div style={{ maxWidth:860,margin:"0 auto" }}>
        {phases.map((phase,idx)=>(
          <PhaseCard key={phase.id} phase={phase} idx={idx}
            onOpenDetail={()=>setDetailPhase(phase.id)} checked={checked}/>
        ))}
      </div>

      {/* English Strategy */}
      <div style={{ maxWidth:860,margin:"28px auto 0" }}>
        <div style={{ background:"rgba(11,20,32,0.95)",border:"1px solid #192035",borderRadius:14,padding:"clamp(14px,3vw,22px) clamp(16px,3vw,26px)" }}>
          <div style={{ fontSize:"clamp(9px,1.5vw,10px)",letterSpacing:4,color:"#334155",marginBottom:6 }}>ENGLISH STRATEGY</div>
          <h3 style={{ margin:"0 0 14px",fontSize:"clamp(13px,2.5vw,15px)",color:"#F1F5F9" }}>🌍 خطة التعامل مع الإنجليزي</h3>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,180px),1fr))",gap:8 }}>
            {[["Phase 00–02","عربي بالكامل ✅","#34D399"],["Phase 03","عربي أساسي + English Docs","#FBBF24"],["Phase 04–06","English أساسي — لازم","#F472B6"]].map(([p,s,c])=>(
              <div key={p} style={{ background:"rgba(0,0,0,0.3)",borderRadius:10,padding:"10px 12px",borderRight:`3px solid ${c}55` }}>
                <div style={{ fontSize:"clamp(9px,1.5vw,10px)",color:c,fontWeight:700,marginBottom:4 }}>{p}</div>
                <div style={{ fontSize:"clamp(11px,2vw,13px)",color:"#CBD5E1" }}>{s}</div>
              </div>
            ))}
          </div>
          <p style={{ marginTop:10,fontSize:"clamp(10px,1.8vw,12px)",color:"#334155",lineHeight:1.7 }}>💡 ابدأ الـ Concept بعربي → اقرأ الـ Docs إنجليزي → مع الوقت هتتعود تلقائياً</p>
        </div>
      </div>

      {/* Transferable Skills */}
      <div style={{ maxWidth:860,margin:"14px auto 0" }}>
        <div style={{ background:"rgba(11,20,32,0.95)",border:"1px solid #192035",borderRadius:14,padding:"clamp(14px,3vw,22px) clamp(16px,3vw,26px)" }}>
          <div style={{ fontSize:"clamp(9px,1.5vw,10px)",letterSpacing:4,color:"#334155",marginBottom:6 }}>FUTURE-PROOF</div>
          <h3 style={{ margin:"0 0 14px",fontSize:"clamp(13px,2.5vw,15px)",color:"#F1F5F9" }}>🔄 مهاراتك قابلة للنقل لأي تراك</h3>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,200px),1fr))",gap:7 }}>
            {transferable.map(item=>(
              <div key={item.skill} style={{ background:"rgba(0,0,0,0.25)",border:"1px solid #192035",borderRadius:9,padding:"8px 12px",display:"flex",justifyContent:"space-between",alignItems:"center",gap:4 }}>
                <span style={{ fontWeight:700,fontSize:"clamp(11px,2vw,13px)",color:"#E2E8F0" }}>{item.skill}</span>
                <span style={{ fontSize:11,color:"#1E293B" }}>→</span>
                <span style={{ fontSize:"clamp(10px,1.8vw,11px)",color:"#475569" }}>{item.goes}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer with PIN info */}
      <div style={{ textAlign:"center",marginTop:32,color:"#1E293B",fontSize:"clamp(10px,1.8vw,11px)",display:"flex",alignItems:"center",justifyContent:"center",gap:14,flexWrap:"wrap" }}>
        <span>AI Engineer Roadmap © 2026 · التقدم محفوظ على السحابة ☁️</span>
        <span style={{ color:"#334155" }}>🔑 PIN: <code style={{ color:"#00D4FF88",letterSpacing:2 }}>{pin}</code></span>
        <button onClick={()=>{ localStorage.removeItem("roadmap-pin"); window.location.reload(); }}
          style={{ background:"none",border:"none",color:"#334155",fontSize:"clamp(10px,1.8vw,11px)",cursor:"pointer",textDecoration:"underline dotted",padding:0 }}>
          تغيير PIN
        </button>
      </div>

      {/* AI Search finds */}
      {finds.length>0&&(
        <div style={{ maxWidth:860,margin:"20px auto 0",display:"flex",flexDirection:"column",gap:8 }}>
          <div style={{ fontSize:11,color:"#334155",letterSpacing:3,marginBottom:4 }}>🔍 اكتشافاتك</div>
          {finds.map(f=>(
            <div key={f.id} style={{ background:"rgba(167,139,250,0.06)",border:"1px solid rgba(167,139,250,0.2)",borderRadius:12,padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
              <div><div style={{ fontSize:13,fontWeight:700,color:"#A78BFA",marginBottom:3 }}>{f.topic}</div><div style={{ fontSize:11,color:"#475569" }}>{f.result.description?.slice(0,80)}…</div></div>
              <button onClick={()=>setFinds(p=>p.filter(x=>x.id!==f.id))} style={{ background:"none",border:"none",color:"#334155",cursor:"pointer",fontSize:16 }}>✕</button>
            </div>
          ))}
        </div>
      )}

      {/* Mobile bottom nav */}
      <BottomNav phases={phases} checked={checked} onSelect={(id)=>setDetailPhase(id)}/>

      {/* AI Search floating button */}
      <button onClick={()=>setShowAI(true)} style={{ position:"fixed",bottom:72,right:16,zIndex:70,width:50,height:50,borderRadius:"50%",background:"linear-gradient(135deg,#00D4FF,#A78BFA)",border:"none",cursor:"pointer",boxShadow:"0 4px 20px rgba(0,212,255,0.4)",fontSize:22,display:"flex",alignItems:"center",justifyContent:"center" }}>🔍</button>
      {showAI&&<AISearchModal onClose={()=>setShowAI(false)} onAdd={(f)=>setFinds(prev=>[...prev,{...f,id:Date.now()}])}/>}
    </div>
  );
}
