import { useState, useEffect, useRef, useCallback } from "react";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { auth, db, provider } from "./firebase.js";
import { phases, transferable } from "./data.js";

function LangBadge({ lang }) {
  const ar = lang === "🇪🇬";
  return <span style={{ fontSize:"clamp(9px,1.5vw,10px)",padding:"1px 5px",borderRadius:4,whiteSpace:"nowrap",background:ar?"rgba(251,191,36,0.15)":"rgba(147,197,253,0.12)",color:ar?"#FBBF24":"#93C5FD" }}>{ar?"عربي":"English"}</span>;
}
function PriceBadge({ price }) {
  const free=price.includes("مجاني"),bought=price.includes("اشتريته");
  return <span style={{ fontSize:"clamp(9px,1.5vw,10px)",padding:"2px 7px",borderRadius:4,whiteSpace:"nowrap",background:free?"rgba(52,211,153,0.13)":bought?"rgba(0,212,255,0.13)":"rgba(251,191,36,0.13)",color:free?"#34D399":bought?"#00D4FF":"#FBBF24" }}>{price}</span>;
}
function Checkbox({ on, color }) {
  return <div style={{ width:15,height:15,borderRadius:3,flexShrink:0,marginTop:2,border:`1.5px solid ${on?color:"#334155"}`,background:on?color:"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.18s" }}>{on&&<span style={{ color:"#060A12",fontSize:9,fontWeight:900,lineHeight:1 }}>✓</span>}</div>;
}
function Bar({ pct, color, h=4 }) {
  return <div style={{ width:"100%",height:h,background:"#0F1A2E",borderRadius:99,overflow:"hidden" }}><div style={{ width:`${pct}%`,height:"100%",background:color,borderRadius:99,transition:"width 0.4s ease" }} /></div>;
}
function SyncDot({ status }) {
  const map={synced:["#34D399","محفوظ ☁️"],syncing:["#FBBF24","جاري الحفظ…"],error:["#F87171","خطأ"]};
  const [c,l]=map[status]||["#475569",""];
  return l?<div style={{ display:"flex",alignItems:"center",gap:4,fontSize:11,color:c }}><div style={{ width:6,height:6,borderRadius:"50%",background:c }} />{l}</div>:null;
}

function LoginScreen({ onLogin, loading }) {
  return (
    <div style={{ background:"#060A12",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"20px",direction:"rtl" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ maxWidth:420,width:"100%",textAlign:"center" }}>
        <div style={{ fontSize:52,marginBottom:16 }}>🤖</div>
        <h1 style={{ fontSize:"clamp(26px,5vw,40px)",fontWeight:900,margin:"0 0 10px",background:"linear-gradient(135deg,#00D4FF 0%,#A78BFA 45%,#F472B6 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>AI Engineer Roadmap</h1>
        <p style={{ color:"#475569",fontSize:14,marginBottom:36,lineHeight:1.7 }}>~8–9 أشهر · 7 مراحل · CV Specialized<br/><span style={{ color:"#334155",fontSize:12 }}>سجّل دخولك وتقدمك يتزامن تلقائياً على كل أجهزتك</span></p>
        <button onClick={onLogin} disabled={loading} style={{ width:"100%",padding:"14px 24px",borderRadius:12,border:"1px solid #1E293B",background:loading?"#0D1525":"rgba(255,255,255,0.04)",color:"#F1F5F9",fontSize:15,fontWeight:700,cursor:loading?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:12,transition:"all 0.2s",marginBottom:16 }} onMouseEnter={e=>{if(!loading)e.currentTarget.style.background="rgba(255,255,255,0.08)"}} onMouseLeave={e=>{if(!loading)e.currentTarget.style.background="rgba(255,255,255,0.04)"}}>
          {loading?(<><div style={{ width:20,height:20,border:"2px solid #334155",borderTop:"2px solid #00D4FF",borderRadius:"50%",animation:"spin 0.8s linear infinite" }} />جاري تسجيل الدخول…</>):(<><svg width="20" height="20" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20H24v8h11.3C33.7 33.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.1 6.5 29.3 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5c10.6 0 19.1-7.7 19.5-18l.1-5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.1 18.9 12 24 12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.1 6.5 29.3 4.5 24 4.5c-7.6 0-14.2 4.3-17.7 10.2z"/><path fill="#4CAF50" d="M24 43.5c5.2 0 9.9-1.9 13.5-5L31.3 33c-2 1.4-4.5 2.1-7.3 2.1-5.2 0-9.6-3.3-11.2-8l-6.5 5C9.8 39.1 16.4 43.5 24 43.5z"/><path fill="#1976D2" d="M43.6 20H24v8h11.3c-.8 2.3-2.3 4.2-4.2 5.5l6.2 5.1C37.9 35.3 40 30 40 24.5c0-.7 0-2-.1-4l-.3-.5z"/></svg>تسجيل الدخول بـ Google</>)}
        </button>
        <p style={{ color:"#1E293B",fontSize:11,lineHeight:1.6 }}>بنستخدم Google فقط للتعرف عليك — مش بنشوف أو بنحفظ أي بيانات تانية</p>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:28 }}>
          {[["☁️","تزامن تلقائي","على كل الأجهزة"],["✅","تتبع التقدم","لكل جزئية"],["🔗","مصادر مباشرة","كتب + كورسات + Docs"],["🎯","Roadmap مخصصة","CV Specialized"]].map(([icon,title,sub])=>(
            <div key={title} style={{ background:"rgba(255,255,255,0.02)",border:"1px solid #0F1A2E",borderRadius:10,padding:"12px 14px",textAlign:"right" }}>
              <div style={{ fontSize:20,marginBottom:4 }}>{icon}</div>
              <div style={{ fontSize:12,fontWeight:700,color:"#94A3B8" }}>{title}</div>
              <div style={{ fontSize:11,color:"#334155",marginTop:2 }}>{sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function UserMenu({ user, onSignOut, syncStatus }) {
  const [open,setOpen]=useState(false);
  const ref=useRef();
  useEffect(()=>{
    const h=(e)=>{if(ref.current&&!ref.current.contains(e.target))setOpen(false)};
    document.addEventListener("mousedown",h);return()=>document.removeEventListener("mousedown",h);
  },[]);
  return (
    <div ref={ref} style={{ position:"relative" }}>
      <button onClick={()=>setOpen(p=>!p)} style={{ background:"rgba(255,255,255,0.05)",border:"1px solid #1E293B",borderRadius:10,padding:"6px 10px",display:"flex",alignItems:"center",gap:8,cursor:"pointer" }}>
        <img src={user.photoURL} alt="" width={28} height={28} style={{ borderRadius:"50%",border:"2px solid #1E293B" }} onError={e=>e.target.style.display="none"} />
        <span style={{ fontSize:12,color:"#94A3B8",maxWidth:100,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{user.displayName?.split(" ")[0]}</span>
        <SyncDot status={syncStatus} />
        <span style={{ color:"#334155",fontSize:10 }}>{open?"▲":"▼"}</span>
      </button>
      {open&&(
        <div style={{ position:"absolute",top:"calc(100% + 8px)",left:"50%",transform:"translateX(-50%)",width:"min(240px,88vw)",background:"#0D1525",border:"1px solid #1E293B",borderRadius:12,padding:16,zIndex:999,boxShadow:"0 20px 40px rgba(0,0,0,0.7)" }}>
          <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:14,paddingBottom:14,borderBottom:"1px solid #1A2540" }}>
            <img src={user.photoURL} alt="" width={36} height={36} style={{ borderRadius:"50%" }} onError={e=>e.target.style.display="none"} />
            <div><div style={{ fontSize:13,fontWeight:700,color:"#F1F5F9" }}>{user.displayName}</div><div style={{ fontSize:11,color:"#475569",marginTop:2 }}>{user.email}</div></div>
          </div>
          <div style={{ display:"flex",alignItems:"center",gap:6,marginBottom:14,padding:"8px 10px",background:"rgba(52,211,153,0.06)",border:"1px solid #34D39922",borderRadius:8 }}>
            <span style={{ fontSize:12 }}>☁️</span><span style={{ fontSize:11,color:"#34D399",lineHeight:1.5 }}>التقدم يتزامن تلقائياً على كل أجهزتك</span>
          </div>
          <button onClick={onSignOut} style={{ width:"100%",background:"rgba(248,113,113,0.1)",border:"1px solid rgba(248,113,113,0.3)",borderRadius:8,padding:"8px 0",color:"#F87171",fontSize:13,fontWeight:700,cursor:"pointer" }}>تسجيل الخروج</button>
        </div>
      )}
    </div>
  );
}

function ContentTab({ phase, checked, toggle }) {
  return (
    <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,185px),1fr))",gap:10 }}>
      {phase.topics.map(g=>(
        <div key={g.id} style={{ background:"rgba(0,0,0,0.3)",borderRadius:10,padding:"11px 13px",borderRight:`3px solid ${phase.color}44` }}>
          <div style={{ fontSize:"clamp(9px,1.5vw,10px)",color:phase.color,fontWeight:800,marginBottom:8,letterSpacing:1 }}>{g.label}</div>
          {g.items.map(item=>(
            <div key={item.id} onClick={()=>toggle(item.id)} style={{ display:"flex",gap:8,alignItems:"flex-start",marginBottom:7,cursor:"pointer",userSelect:"none" }}>
              <Checkbox on={!!checked[item.id]} color={phase.color} />
              <span style={{ fontSize:"clamp(11px,2vw,12px)",color:checked[item.id]?"#3D5166":"#CBD5E1",lineHeight:1.55,textDecoration:checked[item.id]?"line-through":"none",transition:"all 0.18s" }}>{item.text}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function SourcesTab({ phase }) {
  return (
    <div style={{ display:"flex",flexDirection:"column",gap:7 }}>
      {phase.sources.map(src=>(
        <a key={src.id} href={src.url} target="_blank" rel="noopener noreferrer" style={{ display:"flex",alignItems:"center",gap:8,background:"rgba(0,0,0,0.3)",borderRadius:10,padding:"clamp(8px,2vw,11px) clamp(10px,2vw,13px)",textDecoration:"none",border:`1px solid ${phase.color}18`,transition:"all 0.2s" }} onMouseEnter={e=>{e.currentTarget.style.borderColor=phase.color+"55";e.currentTarget.style.background="rgba(255,255,255,0.03)"}} onMouseLeave={e=>{e.currentTarget.style.borderColor=phase.color+"18";e.currentTarget.style.background="rgba(0,0,0,0.3)"}}>
          <div style={{ flex:1,minWidth:0 }}>
            <div style={{ display:"flex",alignItems:"center",flexWrap:"wrap",gap:5 }}>
              <span style={{ fontSize:"clamp(12px,2vw,13px)",fontWeight:700,color:"#E2E8F0" }}>{src.name}</span>
              <LangBadge lang={src.lang} />
              <span style={{ fontSize:"clamp(9px,1.5vw,10px)",padding:"1px 5px",borderRadius:4,background:"rgba(255,255,255,0.05)",color:"#475569",whiteSpace:"nowrap" }}>{src.type}</span>
            </div>
            <div style={{ fontSize:"clamp(10px,1.8vw,11px)",color:"#475569",marginTop:3 }}>{src.note}</div>
          </div>
          <div style={{ flexShrink:0,display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4 }}>
            <PriceBadge price={src.price} />
            <span style={{ fontSize:11,color:phase.color }}>↗</span>
          </div>
        </a>
      ))}
    </div>
  );
}

function PhaseCard({ phase, idx, isActive, onToggleOpen, checked, toggle }) {
  const [tab,setTab]=useState("المحتوى");
  const allItems=phase.topics.flatMap(t=>t.items);
  const done=allItems.filter(i=>checked[i.id]).length;
  const pct=allItems.length?Math.round((done/allItems.length)*100):0;
  return (
    <div style={{ display:"flex",marginBottom:6 }}>
      <div style={{ display:"flex",flexDirection:"column",alignItems:"center",width:"clamp(40px,6vw,54px)",flexShrink:0 }}>
        <div onClick={onToggleOpen} style={{ width:"clamp(36px,5vw,42px)",height:"clamp(36px,5vw,42px)",borderRadius:"50%",background:isActive?`radial-gradient(circle,${phase.glow},transparent 70%)`:"transparent",border:`2px solid ${isActive?phase.color:phase.color+"44"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"clamp(15px,2.5vw,18px)",cursor:"pointer",flexShrink:0,boxShadow:isActive?`0 0 18px ${phase.glow}`:"none",transition:"all 0.25s",transform:isActive?"scale(1.1)":"scale(1)" }}>{phase.icon}</div>
        {idx<phases.length-1&&<div style={{ width:2,flex:1,minHeight:14,background:`linear-gradient(to bottom,${phase.color}44,${phases[idx+1].color}22)`,margin:"4px 0" }} />}
      </div>
      <div style={{ flex:1,marginRight:"clamp(8px,2vw,14px)" }}>
        <div onClick={onToggleOpen} style={{ background:isActive?`linear-gradient(135deg,${phase.glow},#0B1420 100%)`:"rgba(11,20,32,0.95)",border:`1px solid ${isActive?phase.color+"66":"#192035"}`,borderRadius:isActive?"12px 12px 0 0":12,padding:"clamp(10px,2.5vw,14px) clamp(12px,3vw,16px)",cursor:"pointer",transition:"all 0.25s",boxShadow:isActive?`0 0 22px ${phase.glow}`:"none" }}>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",gap:6 }}>
            <div style={{ display:"flex",alignItems:"center",gap:6,flexWrap:"wrap",flex:1,minWidth:0 }}>
              <span style={{ fontSize:"clamp(9px,1.5vw,10px)",color:phase.color,fontWeight:800,letterSpacing:2,flexShrink:0 }}>PHASE {phase.number}</span>
              <span style={{ fontSize:"clamp(13px,2.5vw,15px)",fontWeight:700,color:"#F1F5F9" }}>{phase.title}</span>
              {phase.badge&&<span style={{ background:`${phase.color}18`,border:`1px solid ${phase.color}44`,borderRadius:20,padding:"1px 8px",fontSize:"clamp(9px,1.5vw,10px)",color:phase.color,fontWeight:700 }}>{phase.badge}</span>}
              {phase.statusLabel&&<span style={{ background:"#34D39918",border:"1px solid #34D39944",borderRadius:20,padding:"1px 8px",fontSize:"clamp(9px,1.5vw,10px)",color:"#34D399",fontWeight:700 }}>{phase.statusLabel}</span>}
            </div>
            <div style={{ display:"flex",alignItems:"center",gap:6,flexShrink:0 }}>
              <span style={{ fontSize:"clamp(10px,1.8vw,11px)",color:"#334155",whiteSpace:"nowrap" }}>⏱ {phase.duration}</span>
              <span style={{ color:phase.color,fontSize:11,transition:"transform 0.3s",display:"inline-block",transform:isActive?"rotate(180deg)":"rotate(0deg)" }}>▼</span>
            </div>
          </div>
          <div style={{ marginTop:8,display:"flex",alignItems:"center",gap:8 }}>
            <div style={{ flex:1 }}><Bar pct={pct} color={phase.color} h={3} /></div>
            <span style={{ fontSize:"clamp(9px,1.5vw,11px)",color:phase.color,fontWeight:700,whiteSpace:"nowrap" }}>{done}/{allItems.length}</span>
          </div>
        </div>
        {isActive&&(
          <div style={{ background:"rgba(8,14,26,0.98)",border:`1px solid ${phase.color}33`,borderTop:"none",borderRadius:"0 0 12px 12px" }}>
            <div style={{ display:"flex",borderBottom:"1px solid #192035" }}>
              {["المحتوى","المصادر"].map(t=>(
                <button key={t} onClick={()=>setTab(t)} style={{ background:"none",border:"none",padding:"9px clamp(10px,2vw,16px)",fontSize:"clamp(11px,2vw,13px)",fontWeight:700,cursor:"pointer",color:tab===t?phase.color:"#334155",borderBottom:tab===t?`2px solid ${phase.color}`:"2px solid transparent",transition:"all 0.2s" }}>{t}</button>
              ))}
            </div>
            <div style={{ padding:"clamp(12px,3vw,16px)" }}>
              {tab==="المحتوى"?<ContentTab phase={phase} checked={checked} toggle={toggle}/>:<SourcesTab phase={phase}/>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [user,setUser]=useState(undefined);
  const [loginLoading,setLoginLoading]=useState(false);
  const [active,setActive]=useState(null);
  const [checked,setChecked]=useState({});
  const [syncStatus,setSyncStatus]=useState("synced");
  const saveTimer=useRef(null);
  const unsubRef=useRef(null);

  useEffect(()=>{
    const unsub=onAuthStateChanged(auth,(u)=>setUser(u));
    return unsub;
  },[]);

  useEffect(()=>{
    if(unsubRef.current){unsubRef.current();unsubRef.current=null;}
    if(!user){setChecked({});return;}
    const ref=doc(db,"progress",user.uid);
    unsubRef.current=onSnapshot(ref,
      snap=>{if(snap.exists())setChecked(snap.data().checked||{});setSyncStatus("synced");},
      ()=>setSyncStatus("error")
    );
    return()=>unsubRef.current?.();
  },[user]);

  const save=useCallback((uid,data)=>{
    clearTimeout(saveTimer.current);setSyncStatus("syncing");
    saveTimer.current=setTimeout(async()=>{
      try{await setDoc(doc(db,"progress",uid),{checked:data,updatedAt:Date.now()},{merge:true});setSyncStatus("synced");}
      catch{setSyncStatus("error");}
    },700);
  },[]);

  const toggle=useCallback((id)=>{
    if(!user)return;
    setChecked(prev=>{const next={...prev,[id]:!prev[id]};save(user.uid,next);return next;});
  },[user,save]);

  const handleLogin=async()=>{
    setLoginLoading(true);
    try{await signInWithPopup(auth,provider);}
    catch(e){if(e.code!=="auth/popup-closed-by-user")console.error(e);}
    finally{setLoginLoading(false);}
  };
  const handleSignOut=async()=>{
    if(unsubRef.current)unsubRef.current();
    await signOut(auth);
  };

  const allItems=phases.flatMap(p=>p.topics.flatMap(t=>t.items));
  const totalDone=allItems.filter(i=>checked[i.id]).length;
  const totalPct=allItems.length?Math.round((totalDone/allItems.length)*100):0;

  if(user===undefined)return(
    <div style={{ background:"#060A12",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16 }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ width:40,height:40,border:"3px solid #1E293B",borderTop:"3px solid #00D4FF",borderRadius:"50%",animation:"spin 0.8s linear infinite" }} />
      <p style={{ color:"#475569",fontSize:13 }}>جاري التحميل…</p>
    </div>
  );

  if(!user)return <LoginScreen onLogin={handleLogin} loading={loginLoading}/>;

  return (
    <div style={{ background:"#060A12",minHeight:"100vh",fontFamily:"'Segoe UI',Tahoma,Arial,sans-serif",color:"#E2E8F0",padding:"clamp(20px,4vw,44px) clamp(12px,3vw,24px) 60px",direction:"rtl",boxSizing:"border-box" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      <div style={{ position:"fixed",top:12,left:12,zIndex:100 }}>
        <UserMenu user={user} onSignOut={handleSignOut} syncStatus={syncStatus}/>
      </div>

      <div style={{ textAlign:"center",marginBottom:"clamp(28px,5vw,52px)" }}>
        <div style={{ fontSize:"clamp(9px,1.5vw,11px)",letterSpacing:5,color:"#334155",marginBottom:10,textTransform:"uppercase" }}>Personalized · Computer Vision Specialized</div>
        <h1 style={{ fontSize:"clamp(24px,5vw,50px)",fontWeight:900,margin:0,lineHeight:1.2,background:"linear-gradient(135deg,#00D4FF 0%,#A78BFA 45%,#F472B6 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>AI Engineer Roadmap</h1>
        <p style={{ color:"#475569",marginTop:8,fontSize:"clamp(11px,2vw,13px)" }}>~8–9 أشهر · 7 مراحل · اضغط على أي مرحلة للتفاصيل</p>
        <div style={{ display:"flex",justifyContent:"center",gap:8,marginTop:12,flexWrap:"wrap" }}>
          {[["🇪🇬 عربي","#FBBF2433","#FBBF24"],["🌍 English","#93C5FD33","#93C5FD"],["✅ عندك","#34D39933","#34D399"],["⭐ أساسي","#F472B633","#F472B6"]].map(([l,bg,c])=>(
            <span key={l} style={{ fontSize:"clamp(10px,1.8vw,11px)",padding:"3px 9px",borderRadius:20,background:bg,color:c,border:`1px solid ${c}44` }}>{l}</span>
          ))}
        </div>
        <div style={{ maxWidth:460,margin:"16px auto 0",background:"rgba(11,20,32,0.9)",border:"1px solid #192035",borderRadius:12,padding:"14px 18px" }}>
          <div style={{ display:"flex",justifyContent:"space-between",marginBottom:7,fontSize:"clamp(11px,2vw,13px)" }}>
            <span style={{ color:"#94A3B8",fontWeight:600 }}>التقدم الكلي</span>
            <span style={{ color:"#F1F5F9",fontWeight:700 }}>{totalDone} / {allItems.length} <span style={{ color:"#34D399" }}>({totalPct}%)</span></span>
          </div>
          <div style={{ width:"100%",height:7,background:"#0F1A2E",borderRadius:99,overflow:"hidden" }}>
            <div style={{ width:`${totalPct}%`,height:"100%",background:"linear-gradient(90deg,#00D4FF,#A78BFA,#F472B6)",borderRadius:99,transition:"width 0.4s" }} />
          </div>
        </div>
      </div>

      <div style={{ maxWidth:880,margin:"0 auto" }}>
        {phases.map((phase,idx)=>(
          <PhaseCard key={phase.id} phase={phase} idx={idx} isActive={active===phase.id} onToggleOpen={()=>setActive(p=>p===phase.id?null:phase.id)} checked={checked} toggle={toggle}/>
        ))}
      </div>

      <div style={{ maxWidth:880,margin:"28px auto 0" }}>
        <div style={{ background:"rgba(11,20,32,0.95)",border:"1px solid #192035",borderRadius:14,padding:"clamp(14px,3vw,22px) clamp(14px,3vw,24px)" }}>
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

      <div style={{ maxWidth:880,margin:"14px auto 0" }}>
        <div style={{ background:"rgba(11,20,32,0.95)",border:"1px solid #192035",borderRadius:14,padding:"clamp(14px,3vw,22px) clamp(14px,3vw,24px)" }}>
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

      <div style={{ textAlign:"center",marginTop:32,color:"#1E293B",fontSize:"clamp(10px,1.8vw,11px)" }}>
        مرحباً {user.displayName?.split(" ")[0]} 👋 · التقدم محفوظ على السحابة · AI Engineer Roadmap © 2026
      </div>
    </div>
  );
}
