import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { phases, TOTAL_TOPICS } from '../data/roadmapData';
import { PhaseCard } from '../components/PhaseCard';
import { SearchModal } from '../components/SearchModal';
import { BottomNav } from '../components/BottomNav';

function SyncDot({ status }: { status: 'synced' | 'syncing' | 'error' }) {
  const colors: Record<string, string> = { synced:'#34D399', syncing:'#FBBF24', error:'#F87171' };
  const c = colors[status];
  return (
    <div style={{ display:'flex', alignItems:'center', gap:6 }}>
      <div style={{ width:8, height:8, borderRadius:'50%', background:c, boxShadow:`0 0 8px ${c}88`, transition:'all 0.3s' }}/>
      <span style={{ color:c, fontSize:11, fontWeight:700 }}>
        {status === 'synced' ? 'محفوظ' : status === 'syncing' ? 'جاري الحفظ...' : 'خطأ في الحفظ'}
      </span>
    </div>
  );
}

export default function Dashboard() {
  const { isAuthenticated, checkedTopics, setIsSearchOpen, pin, setNewPin, syncStatus } = useApp();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showPinChange, setShowPinChange] = useState(false);
  const [newPinInput, setNewPinInput] = useState('');

  useEffect(() => { if (!isAuthenticated) navigate('/'); }, [isAuthenticated, navigate]);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalDone = Object.values(checkedTopics).filter(Boolean).length;
  const pct = TOTAL_TOPICS > 0 ? Math.round((totalDone / TOTAL_TOPICS) * 100) : 0;

  const handlePinChange = () => {
    if (newPinInput.length === 4 && /^\d{4}$/.test(newPinInput)) {
      setNewPin(newPinInput);
      setShowPinChange(false);
      setNewPinInput('');
    } else {
      alert('❌ أدخل 4 أرقام صحيحة');
    }
  };

  return (
    <div dir="rtl" className="noise-bg" style={{
      minHeight:'100vh', background:'#060A12',
      fontFamily:"'Cairo', sans-serif", color:'#F1F5F9',
      position:'relative', paddingBottom: isMobile ? 90 : 60,
    }}>
      {/* Sync dot top-left */}
      <div style={{ position:'fixed', top:14, left:14, zIndex:100 }}>
        <SyncDot status={syncStatus}/>
      </div>

      {/* Background glow orbs */}
      <div style={{ position:'fixed', top:0, left:'50%', transform:'translateX(-50%)', width:800, height:400, background:'radial-gradient(ellipse, rgba(0,212,255,0.04) 0%, transparent 70%)', pointerEvents:'none', zIndex:0 }} />
      <div style={{ position:'fixed', bottom:'20%', right:0, width:500, height:500, background:'radial-gradient(circle, rgba(167,139,250,0.04) 0%, transparent 70%)', pointerEvents:'none', zIndex:0 }} />

      <div style={{ maxWidth:880, margin:'0 auto', padding:'0 1rem', position:'relative', zIndex:1 }}>

        {/* HEADER */}
        <header style={{ paddingTop:40, paddingBottom:24 }}>
          <h1 className="animate-rainbow" style={{
            background:'linear-gradient(135deg,#00D4FF,#A78BFA,#F472B6)',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
            fontSize: isMobile ? 26 : 36, fontWeight:900, marginBottom:6, lineHeight:1.3,
          }}>AI Engineer Roadmap</h1>
          <p style={{ color:'#64748B', fontSize:14, marginBottom:20 }}>~8-9 أشهر · 7 مراحل · {TOTAL_TOPICS} topic</p>

          {/* Legend badges */}
          <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:20 }}>
            {[
              { icon:'🇪🇬', label:'عربي',   color:'#34D399', bg:'rgba(52,211,153,0.1)' },
              { icon:'🌍', label:'English', color:'#00D4FF', bg:'rgba(0,212,255,0.1)' },
              { icon:'✅', label:'عندك',    color:'#A78BFA', bg:'rgba(167,139,250,0.1)' },
              { icon:'⭐', label:'أساسي',   color:'#FBBF24', bg:'rgba(251,191,36,0.1)' },
            ].map(b => (
              <span key={b.label} style={{
                display:'inline-flex', alignItems:'center', gap:5, padding:'4px 12px',
                borderRadius:20, background:b.bg, border:`1px solid ${b.color}30`, color:b.color, fontSize:12, fontWeight:700,
              }}>{b.icon} {b.label}</span>
            ))}
          </div>

          {/* Global progress card */}
          <div className="glass-card" style={{
            borderRadius:20, border:'1px solid rgba(255,255,255,0.07)',
            padding:'20px 24px', marginBottom:16, boxShadow:'0 8px 32px rgba(0,0,0,0.3)',
          }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
              <div>
                <p style={{ color:'#64748B', fontSize:12, marginBottom:3 }}>التقدم الكلي</p>
                <p style={{ fontSize:22, fontWeight:800, background:'linear-gradient(135deg,#00D4FF,#A78BFA)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                  {totalDone} / {TOTAL_TOPICS}
                </p>
              </div>
              <div style={{ textAlign:'center' }}>
                <p style={{ fontSize:32, fontWeight:900, color:'#F1F5F9' }}>{pct}%</p>
                <p style={{ color:'#64748B', fontSize:11 }}>مكتمل</p>
              </div>
              <SyncDot status={syncStatus}/>
            </div>

            {/* Rainbow progress bar */}
            <div style={{ height:10, borderRadius:5, background:'rgba(255,255,255,0.06)', overflow:'hidden' }}>
              <div className="animate-rainbow" style={{
                height:'100%', width:`${pct}%`,
                background:'linear-gradient(90deg,#00D4FF,#A78BFA,#F472B6,#34D399,#FBBF24)',
                borderRadius:5, boxShadow:'0 0 12px rgba(0,212,255,0.5)',
                transition:'width 0.8s cubic-bezier(0.34,1.56,0.64,1)',
              }}/>
            </div>

            {/* Phase pills */}
            <div style={{ display:'flex', gap:4, marginTop:10, flexWrap:'wrap' }}>
              {phases.map(phase => {
                const total = phase.topicGroups.reduce((a, g) => a + g.topics.length, 0);
                const done  = phase.topicGroups.reduce((a, g) => a + g.topics.filter(t => checkedTopics[t.id]).length, 0);
                const p = total > 0 ? Math.round((done/total)*100) : 0;
                return (
                  <div key={phase.id} style={{ flex:1, minWidth:30 }}>
                    <div style={{ height:4, borderRadius:2, background:'rgba(255,255,255,0.05)', overflow:'hidden' }}>
                      <div style={{ height:'100%', width:`${p}%`, background:phase.color, borderRadius:2, boxShadow:p>0?`0 0 4px ${phase.color}`:'none', transition:'width 0.6s ease' }}/>
                    </div>
                    <p style={{ color:'#334155', fontSize:9, textAlign:'center', marginTop:2 }}>{phase.emoji}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </header>

        {/* PHASE TIMELINE */}
        <section>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
            <h2 style={{ color:'#94A3B8', fontSize:13, fontWeight:700, letterSpacing:2 }}>◈ المراحل</h2>
            <span style={{ color:'#334155', fontSize:12 }}>
              {phases.filter(p => p.topicGroups.reduce((a,g)=>a+g.topics.filter(t=>checkedTopics[t.id]).length,0) === p.topicGroups.reduce((a,g)=>a+g.topics.length,0)).length} / 7 مكتملة
            </span>
          </div>
          {phases.map((phase, i) => (
            <div key={phase.id} id={phase.id}>
              <PhaseCard phase={phase} isLast={i===phases.length-1} phaseIndex={i}/>
            </div>
          ))}
        </section>

        {/* FOOTER */}
        <footer style={{ marginTop:32, paddingTop:20, borderTop:'1px solid rgba(255,255,255,0.05)', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10 }}>
          <p style={{ color:'#334155', fontSize:12 }}>
            🔑 PIN: <code style={{ color:'#00D4FF88', letterSpacing:2 }}>{pin}</code> ·{' '}
            <button onClick={() => setShowPinChange(!showPinChange)} style={{ background:'none', border:'none', color:'#475569', fontFamily:"'Cairo', sans-serif", fontSize:12, cursor:'pointer', textDecoration:'underline', padding:'0 4px' }}>
              تغيير PIN
            </button>
          </p>
          <p style={{ color:'#1E293B', fontSize:11 }}>AI Engineer Roadmap © 2026</p>
        </footer>

        {/* PIN change form */}
        {showPinChange && (
          <div className="animate-slide-down glass-card" style={{
            position:'fixed', bottom: isMobile ? 90 : 20, left:'50%', transform:'translateX(-50%)',
            width:'90%', maxWidth:340, padding:'20px', borderRadius:16,
            border:'1px solid rgba(0,212,255,0.3)', boxShadow:'0 8px 40px rgba(0,0,0,0.5)',
            zIndex:100, display:'flex', alignItems:'center', gap:10, flexWrap:'wrap',
          }}>
            <p style={{ color:'#94A3B8', fontSize:13, width:'100%', marginBottom:4 }}>تغيير الـ PIN:</p>
            <input type="password" inputMode="numeric" maxLength={4}
              placeholder="PIN جديد (4 أرقام)" value={newPinInput}
              onChange={e => setNewPinInput(e.target.value.replace(/\D/g,'').slice(0,4))}
              onKeyDown={e => e.key === 'Enter' && handlePinChange()}
              style={{ flex:1, padding:'10px 14px', borderRadius:10, border:'1px solid rgba(0,212,255,0.3)', background:'rgba(255,255,255,0.04)', color:'#F1F5F9', fontSize:16, fontFamily:"'Cairo', sans-serif", outline:'none', letterSpacing:4, textAlign:'center' }}/>
            <button onClick={handlePinChange} style={{ padding:'10px 16px', borderRadius:10, border:'none', background:'linear-gradient(135deg,#00D4FF,#0099BB)', color:'#000', fontWeight:700, fontFamily:"'Cairo', sans-serif", cursor:'pointer', fontSize:13 }}>حفظ</button>
            <button onClick={() => setShowPinChange(false)} style={{ padding:'10px 12px', borderRadius:10, border:'1px solid rgba(255,255,255,0.1)', background:'transparent', color:'#64748B', fontFamily:"'Cairo', sans-serif", cursor:'pointer', fontSize:13 }}>إلغاء</button>
          </div>
        )}
      </div>

      {/* Floating search button */}
      <button onClick={() => setIsSearchOpen(true)} className="animate-float"
        style={{
          position:'fixed', bottom: isMobile ? 78 : 24,
          left: isMobile ? '50%' : undefined, right: isMobile ? undefined : 24,
          transform: isMobile ? 'translateX(-50%)' : undefined,
          padding:'14px 20px', borderRadius:50,
          border:'1px solid rgba(167,139,250,0.5)', background:'rgba(13,21,37,0.95)',
          color:'#A78BFA', fontSize:14, fontWeight:800, fontFamily:"'Cairo', sans-serif",
          cursor:'pointer', display:'flex', alignItems:'center', gap:8,
          boxShadow:'0 0 24px rgba(167,139,250,0.3), 0 8px 32px rgba(0,0,0,0.4)',
          zIndex:40, transition:'all 0.3s', whiteSpace:'nowrap', backdropFilter:'blur(20px)',
        }}>
        🔍 <span>topic جديد</span>
      </button>

      <SearchModal/>
      {isMobile && <BottomNav/>}
    </div>
  );
}
