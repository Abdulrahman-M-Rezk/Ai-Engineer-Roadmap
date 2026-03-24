import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { TypeAnimation } from 'react-type-animation';
import { useApp } from '../context/AppContext';
import { phases, TOTAL_TOPICS } from '../data/roadmapData';
import { PhaseCard } from '../components/PhaseCard';
import { SearchModal } from '../components/SearchModal';
import { BottomNav } from '../components/BottomNav';

/* ── Motivational quotes ── */
const QUOTES = [
  { text: 'وَأَن لَّيْسَ لِلْإِنسَانِ إِلَّا مَا سَعَىٰ', source: 'سورة النجم' },
  { text: 'منك السعي ومن الله التوفيق', source: '' },
  { text: 'استعن بالله ولا تعجز', source: 'حديث شريف' },
  { text: 'إن مع العسر يسرا', source: 'سورة الشرح' },
  { text: 'العلم لا يعطيك بعضه حتى تعطيه كلك', source: '' },
  { text: 'من جد وجد، ومن زرع حصد', source: 'مثل عربي' },
  { text: 'الوقت كالسيف إن لم تقطعه قطعك', source: 'مثل عربي' },
  { text: 'طلب العلم فريضة على كل مسلم', source: 'حديث شريف' },
  { text: 'لا تحقر من المعروف شيئاً — كل خطوة صغيرة تقربك للهدف', source: '' },
  { text: 'The expert in anything was once a beginner', source: '' },
];

/* ── References ── */
const REFERENCES = [
  { name: 'roadmap.sh — AI Engineer Roadmap', url: 'https://roadmap.sh/ai-engineer', desc: 'المرجع التقني الأساسي للـ Roadmap' },
  { name: 'AI Engineer PDF — roadmap.sh', url: 'https://roadmap.sh/pdfs/roadmaps/ai-engineer.pdf', desc: 'النسخة الكاملة PDF' },
  { name: 'Moataz Elmesmary — Data Science Roadmap', url: 'https://github.com/Moataz-Elmesmary/Data-Science-Roadmap', desc: '4.2k ⭐ — أشمل Roadmap عربي للـ Data Science' },
  { name: 'Mariam Ahmed — IEEE ManCSC 2025', url: 'https://github.com/Mariam-Ahmed15/Data-Science-Roadmap-IEEEManCSC-2025', desc: 'Roadmap منظم بالأسابيع — مثالي للمبتدئين' },
  ];

function SyncDot({ status }: { status: 'synced' | 'syncing' | 'error' }) {
  const colors: Record<string, string> = { synced: '#34D399', syncing: '#FBBF24', error: '#F87171' };
  const c = colors[status];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: c, boxShadow: `0 0 8px ${c}88`, transition: 'all 0.3s' }} />
      <span style={{ color: c, fontSize: 11, fontWeight: 700 }}>
        {status === 'synced' ? 'محفوظ' : status === 'syncing' ? 'جاري الحفظ...' : 'خطأ في الحفظ'}
      </span>
    </div>
  );
}

function ReferencesModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      dir="rtl"
      style={{
        position: 'fixed', inset: 0, background: 'rgba(6,10,18,0.88)',
        backdropFilter: 'blur(16px)', zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
        fontFamily: "'Cairo', sans-serif",
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="animate-slide-down glass-card" style={{
        width: '100%', maxWidth: 520, borderRadius: 24,
        border: '1px solid rgba(251,191,36,0.3)',
        padding: '32px 28px', maxHeight: '85vh', overflowY: 'auto',
        boxShadow: '0 0 60px rgba(251,191,36,0.1), 0 30px 80px rgba(0,0,0,0.6)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ color: '#F1F5F9', fontSize: 18, fontWeight: 800 }}>📚 مصادر بناء هذا الـ Roadmap</h2>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
            color: '#64748B', width: 36, height: 36, borderRadius: 10,
            cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>✕</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {REFERENCES.map((ref, i) => (
            <a key={i} href={ref.url} target="_blank" rel="noopener noreferrer" style={{
              padding: '14px 16px', borderRadius: 14,
              border: '1px solid rgba(251,191,36,0.15)',
              background: 'rgba(251,191,36,0.04)',
              display: 'flex', alignItems: 'center', gap: 12,
              textDecoration: 'none', transition: 'all 0.2s',
            }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(251,191,36,0.4)';
                (e.currentTarget as HTMLElement).style.background = 'rgba(251,191,36,0.08)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(251,191,36,0.15)';
                (e.currentTarget as HTMLElement).style.background = 'rgba(251,191,36,0.04)';
              }}
            >
              <div style={{ flex: 1 }}>
                <p style={{ color: '#FBBF24', fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{ref.name}</p>
                <p style={{ color: '#64748B', fontSize: 12 }}>{ref.desc}</p>
              </div>
              <span style={{ color: '#FBBF24', fontSize: 18, opacity: 0.7 }}>↗</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { isAuthenticated, username, checkedTopics, setIsSearchOpen, pin, setNewPin, syncStatus } = useApp();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showPinChange, setShowPinChange] = useState(false);
  const [newPinInput, setNewPinInput] = useState('');
  const [showReferences, setShowReferences] = useState(false);

  // Pick a random quote once per visit
  const quote = useMemo(() => QUOTES[Math.floor(Math.random() * QUOTES.length)], []);

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
      minHeight: '100vh', background: '#060A12',
      fontFamily: "'Cairo', sans-serif", color: '#F1F5F9',
      position: 'relative', paddingBottom: isMobile ? 90 : 60,
    }}>
      {/* Sync dot top-left */}
      <div style={{ position: 'fixed', top: 14, left: 14, zIndex: 100 }}>
        <SyncDot status={syncStatus} />
      </div>

      {/* Background glow orbs */}
      <div style={{ position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)', width: 800, height: 400, background: 'radial-gradient(ellipse, rgba(0,212,255,0.04) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '20%', right: 0, width: 500, height: 500, background: 'radial-gradient(circle, rgba(167,139,250,0.04) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ maxWidth: 880, margin: '0 auto', padding: '0 1rem', position: 'relative', zIndex: 1 }}>

        {/* ── HEADER ── */}
        <header style={{ paddingTop: 40, paddingBottom: 24, textAlign: 'center' }}>
          <h1 className="animate-rainbow" style={{
            background: 'linear-gradient(135deg,#00D4FF,#A78BFA,#F472B6)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            fontSize: isMobile ? 26 : 36, fontWeight: 900, marginBottom: 6, lineHeight: 1.3,
          }}>AI Engineer Roadmap</h1>
          <p style={{ color: '#64748B', fontSize: 14, marginBottom: 20 }}>~8-9 أشهر · 7 مراحل · {TOTAL_TOPICS} topic</p>

          {/* Welcome Banner */}
          <style>{`
            @keyframes wave-animation {
              0% { transform: rotate(0.0deg) }
              10% { transform: rotate(14.0deg) }
              20% { transform: rotate(-8.0deg) }
              30% { transform: rotate(14.0deg) }
              40% { transform: rotate(-4.0deg) }
              50% { transform: rotate(10.0deg) }
              60% { transform: rotate(0.0deg) }
              100% { transform: rotate(0.0deg) }
            }
            .wave-emoji {
              display: inline-block;
              animation: wave-animation 2.5s infinite;
              transform-origin: 70% 70%;
            }
          `}</style>
          <div style={{ marginBottom: 32 }}>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2" style={{
              color: '#fff', fontSize: isMobile ? 28 : 42, lineHeight: 1.4, fontWeight: 900,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '8px'
            }}>
              <span>مرحباً يا</span>
              <TypeAnimation
                sequence={[
                  '',        // Start empty
                  1000,      // Wait 1 second
                  username,  // Type Username in blue
                  3000,      // Wait 3 seconds
                  '',        // Erase Username only
                  1000,      // Wait 1 second before repeating
                ]}
                wrapper="span"
                cursor={true}
                repeat={Infinity}
                style={{ color: '#3B82F6', display: 'inline-block' }}
              />
              <span className="wave-emoji">👋</span>
            </h1>
            <p style={{ color: '#94A3B8', fontSize: 16 }}>"جاهز لاستكمال رحلتك في عالم الذكاء الاصطناعي؟"</p>
          </div>

          {/* Global progress card */}
          <div className="glass-card" style={{
            borderRadius: 20, border: '1px solid rgba(255,255,255,0.07)',
            padding: '20px 24px', marginBottom: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div>
                <p style={{ color: '#64748B', fontSize: 12, marginBottom: 3 }}>التقدم الكلي</p>
                <p style={{ fontSize: 22, fontWeight: 800, background: 'linear-gradient(135deg,#00D4FF,#A78BFA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  {totalDone} / {TOTAL_TOPICS}
                </p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 32, fontWeight: 900, color: '#F1F5F9' }}>{pct}%</p>
                <p style={{ color: '#64748B', fontSize: 11 }}>مكتمل</p>
              </div>
              <SyncDot status={syncStatus} />
            </div>

            {/* Rainbow progress bar */}
            <div style={{ height: 10, borderRadius: 5, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
              <div className="animate-rainbow" style={{
                height: '100%', width: `${pct}%`,
                background: 'linear-gradient(90deg,#00D4FF,#A78BFA,#F472B6,#34D399,#FBBF24)',
                borderRadius: 5, boxShadow: '0 0 12px rgba(0,212,255,0.5)',
                transition: 'width 0.8s cubic-bezier(0.34,1.56,0.64,1)',
              }} />
            </div>
          </div>

          {/* ── Motivational Quote ── */}
          <div style={{ textAlign: 'center', padding: '16px 32px', marginBottom: 24, marginTop: 24 }}>
            <p style={{
              background: 'linear-gradient(135deg, #34D399, #00D4FF)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              fontSize: isMobile ? 22 : 28, fontStyle: 'italic', lineHeight: 1.8, fontWeight: 900,
              textShadow: '0 0 24px rgba(52,211,153,0.3)',
            }}>
              "{quote.text}"
            </p>
            {quote.source && (
              <p style={{ color: '#94A3B8', fontSize: 14, marginTop: 8, fontWeight: 700 }}>— {quote.source}</p>
            )}
          </div>
        </header>

        {/* ── PHASE TIMELINE ── */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2 style={{ color: '#94A3B8', fontSize: 13, fontWeight: 700, letterSpacing: 2 }}>◈ المراحل</h2>
            <span style={{ color: '#334155', fontSize: 12 }}>
              {phases.filter(p => p.topicGroups.reduce((a, g) => a + g.topics.filter(t => checkedTopics[t.id]).length, 0) === p.topicGroups.reduce((a, g) => a + g.topics.length, 0)).length} / 7 مكتملة
            </span>
          </div>
          {phases.map((phase, i) => (
            <div key={phase.id} id={phase.id}>
              <PhaseCard phase={phase} isLast={i === phases.length - 1} phaseIndex={i} />
            </div>
          ))}
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ marginTop: 32, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <p style={{ color: '#334155', fontSize: 12 }}>
            🔑 PIN: <code style={{ color: '#00D4FF88', letterSpacing: 2 }}>{pin}</code> ·{' '}
            <button onClick={() => setShowPinChange(!showPinChange)} style={{ background: 'none', border: 'none', color: '#475569', fontFamily: "'Cairo', sans-serif", fontSize: 12, cursor: 'pointer', textDecoration: 'underline', padding: '0 4px' }}>
              تغيير PIN
            </button>
          </p>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <button
              onClick={() => setShowReferences(true)}
              style={{
                background: 'none', border: '1px solid rgba(251,191,36,0.2)', color: '#64748B',
                fontFamily: "'Cairo', sans-serif", fontSize: 12, cursor: 'pointer',
                padding: '4px 12px', borderRadius: 8, transition: 'all 0.2s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#FBBF24'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#64748B'; }}
            >
              📚 مصادر الـ Roadmap
            </button>
            <p style={{ color: '#1E293B', fontSize: 11 }}>AI Engineer Roadmap © 2026</p>
          </div>
        </footer>

        {/* PIN change form */}
        {showPinChange && (
          <div className="animate-slide-down glass-card" style={{
            position: 'fixed', bottom: isMobile ? 90 : 20, left: '50%', transform: 'translateX(-50%)',
            width: '90%', maxWidth: 340, padding: '20px', borderRadius: 16,
            border: '1px solid rgba(0,212,255,0.3)', boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
            zIndex: 100, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
          }}>
            <p style={{ color: '#94A3B8', fontSize: 13, width: '100%', marginBottom: 4 }}>تغيير الـ PIN:</p>
            <input type="password" inputMode="numeric" maxLength={4}
              placeholder="PIN جديد (4 أرقام)" value={newPinInput}
              onChange={e => setNewPinInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
              onKeyDown={e => e.key === 'Enter' && handlePinChange()}
              style={{ flex: 1, padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(0,212,255,0.3)', background: 'rgba(255,255,255,0.04)', color: '#F1F5F9', fontSize: 16, fontFamily: "'Cairo', sans-serif", outline: 'none', letterSpacing: 4, textAlign: 'center' }} />
            <button onClick={handlePinChange} style={{ padding: '10px 16px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#00D4FF,#0099BB)', color: '#000', fontWeight: 700, fontFamily: "'Cairo', sans-serif", cursor: 'pointer', fontSize: 13 }}>حفظ</button>
            <button onClick={() => setShowPinChange(false)} style={{ padding: '10px 12px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#64748B', fontFamily: "'Cairo', sans-serif", cursor: 'pointer', fontSize: 13 }}>إلغاء</button>
          </div>
        )}
      </div>

      {/* Floating search button */}
      <button onClick={() => setIsSearchOpen(true)} className="animate-float"
        style={{
          position: 'fixed', bottom: isMobile ? 78 : 24,
          left: isMobile ? '50%' : undefined, right: isMobile ? undefined : 24,
          transform: isMobile ? 'translateX(-50%)' : undefined,
          padding: '14px 20px', borderRadius: 50,
          border: '1px solid rgba(167,139,250,0.5)', background: 'rgba(13,21,37,0.95)',
          color: '#A78BFA', fontSize: 14, fontWeight: 800, fontFamily: "'Cairo', sans-serif",
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
          boxShadow: '0 0 24px rgba(167,139,250,0.3), 0 8px 32px rgba(0,0,0,0.4)',
          zIndex: 40, transition: 'all 0.3s', whiteSpace: 'nowrap', backdropFilter: 'blur(20px)',
        }}>
        🔍 <span>topic جديد</span>
      </button>

      <SearchModal />
      {isMobile && <BottomNav />}
      {showReferences && <ReferencesModal onClose={() => setShowReferences(false)} />}
    </div>
  );
}
