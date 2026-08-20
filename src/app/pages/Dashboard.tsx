import { useState, useEffect, useMemo } from 'react';
import { TypeAnimation } from 'react-type-animation';
import { useApp } from '../context/AppContext';
import { phases, TOTAL_TOPICS } from '../data/roadmapData';
import { PhaseCard } from '../components/PhaseCard';
import { SearchModal } from '../components/SearchModal';
import { BottomNav } from '../components/BottomNav';
import { DailyTracker } from '../components/DailyTracker';

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

/* ── Consistency quotes for Daily tab ── */
const DAILY_QUOTES = [
  'قليلٌ دائم، خيرٌ من كثيرٍ منقطع.',
  'النجاح ليس قفزة سريعة، بل خطوات يومية مستمرة.',
  'من سار على الدرب بانتظام.. أبدع.',
  'قطرات الماء المستمرة تحفر في الصخر.',
];

/* ── References ── */
const REFERENCES = [
  { name: 'roadmap.sh — AI Engineer Roadmap', url: 'https://roadmap.sh/ai-engineer', desc: 'المرجع التقني الأساسي للـ Roadmap' },
  { name: 'AI Engineer PDF — roadmap.sh', url: 'https://roadmap.sh/pdfs/roadmaps/ai-engineer.pdf', desc: 'النسخة الكاملة PDF' },
  { name: 'Moataz Elmesmary — Data Science Roadmap', url: 'https://github.com/Moataz-Elmesmary/Data-Science-Roadmap', desc: '4.2k ⭐ — أشمل Roadmap عربي للـ Data Science' },
  { name: 'Mariam Ahmed — IEEE ManCSC 2025', url: 'https://github.com/Mariam-Ahmed15/Data-Science-Roadmap-IEEEManCSC-2025', desc: 'Roadmap منظم بالأسابيع — مثالي للمبتدئين' },
  ];

function getTodayLocal(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function SyncDot({ status }: { status: 'synced' | 'syncing' | 'error' }) {
  const colors: Record<string, string> = { synced: '#34D399', syncing: '#FBBF24', error: '#F87171' };
  const c = colors[status];
  return (
    <div className="flex items-center gap-[6px]">
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
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
      style={{ background: 'rgba(6,10,18,0.88)', backdropFilter: 'blur(16px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="animate-slide-down glass-card w-full max-w-[520px] rounded-3xl p-8 max-h-[85vh] overflow-y-auto" style={{
        border: '1px solid rgba(251,191,36,0.3)',
        boxShadow: '0 0 60px rgba(251,191,36,0.1), 0 30px 80px rgba(0,0,0,0.6)',
      }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-slate-200 text-lg font-black">📚 مصادر بناء هذا الـ Roadmap</h2>
          <button onClick={onClose} className="bg-white/5 border border-white/10 text-slate-500 w-9 h-9 rounded-xl cursor-pointer text-base flex items-center justify-center">
            ✕
          </button>
        </div>
        <div className="flex flex-col gap-2.5">
          {REFERENCES.map((ref, i) => (
            <a key={i} href={ref.url} target="_blank" rel="noopener noreferrer" className="p-[14px_16px] rounded-xl flex items-center gap-3 no-underline transition-all"
              style={{
                border: '1px solid rgba(251,191,36,0.15)',
                background: 'rgba(251,191,36,0.04)',
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
              <div className="flex-1">
                <p className="text-amber-400 text-sm font-bold mb-1">{ref.name}</p>
                <p className="text-slate-500 text-xs">{ref.desc}</p>
              </div>
              <span className="text-amber-400 text-lg opacity-70">↗</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { isAuthenticated, username, checkedTopics, setIsSearchOpen, pin, setNewPin, syncStatus, dailyTasks } = useApp();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showPinChange, setShowPinChange] = useState(false);
  const [newPinInput, setNewPinInput] = useState('');
  const [recoveryCodeInput, setRecoveryCodeInput] = useState('');
  const [showReferences, setShowReferences] = useState(false);
  const [greetingDone, setGreetingDone] = useState(false);
  const [activeTab, setActiveTab] = useState<'roadmap' | 'daily'>('roadmap');
  const quote = useMemo(() => QUOTES[Math.floor(Math.random() * QUOTES.length)], []);
  const dailyQuote = useMemo(() => DAILY_QUOTES[Math.floor(Math.random() * DAILY_QUOTES.length)], []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalDone = Object.values(checkedTopics).filter(Boolean).length;
  const pct = TOTAL_TOPICS > 0 ? Math.round((totalDone / TOTAL_TOPICS) * 100) : 0;

  // Daily progress (today)
  const todayStr = useMemo(() => getTodayLocal(), []);
  const todayTasks = dailyTasks[todayStr] || [];
  const todayCompleted = todayTasks.filter(t => t.completed).length;
  const dailyPct = todayTasks.length > 0 ? Math.round((todayCompleted / todayTasks.length) * 100) : 0;

  const handlePinChange = async () => {
    if (newPinInput.length !== 4 || !/^\d{4}$/.test(newPinInput)) {
      alert('❌ أدخل 4 أرقام صحيحة للـ PIN الجديد');
      return;
    }
    if (!recoveryCodeInput.trim() || recoveryCodeInput.length !== 6) {
      alert('❌ يرجى إدخال كود الاسترجاع (6 رموز)');
      return;
    }

    const res = await setNewPin(newPinInput, recoveryCodeInput.trim());
    if (res.success) {
      setShowPinChange(false);
      setNewPinInput('');
      setRecoveryCodeInput('');
      alert('✅ تم تغيير الرقم السري بنجاح');
    } else {
      alert(`❌ ${res.error}`);
    }
  };

  return (
    <div dir="rtl" className="w-full flex flex-col items-center justify-start min-h-screen py-8 noise-bg bg-[#060A12] text-slate-200 relative" style={{ paddingBottom: isMobile ? 90 : 60 }}>
      {/* Sync dot top-left */}
      <div className="fixed top-[14px] left-[14px] z-[100]">
        <SyncDot status={syncStatus} />
      </div>

      {/* Background glow orbs */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none z-0" style={{ background: 'radial-gradient(ellipse, rgba(0,212,255,0.04) 0%, transparent 70%)' }} />
      <div className="fixed bottom-[20%] right-0 w-[500px] h-[500px] pointer-events-none z-0" style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.04) 0%, transparent 70%)' }} />

      {/* ── MAIN CENTERED CONTAINER ── */}
      <div className="w-full max-w-3xl md:max-w-4xl lg:max-w-5xl mx-auto px-4 sm:px-6 relative z-[1] flex flex-col gap-6">

        {/* ── CONDITIONAL HEADER ── */}
        {activeTab === 'roadmap' ? (
          /* ── ROADMAP HEADER ── */
          <header className="w-full pt-10 pb-6 text-center">
            <h1 className="animate-rainbow font-black mb-[6px] leading-tight" style={{
              background: 'linear-gradient(135deg, #00F0FF, #C084FC, #F472B6)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              fontSize: isMobile ? 26 : 36,
            }}>AI Engineer Roadmap</h1>
            <p className="text-slate-500 text-sm mb-5">~8-9 أشهر · 7 مراحل · {TOTAL_TOPICS} topic</p>

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
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2 flex items-center justify-center flex-wrap gap-2" style={{
                color: '#fff', fontSize: isMobile ? 28 : 42, lineHeight: 1.4, fontWeight: 900,
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
              <p className="text-slate-400 text-base">"جاهز لاستكمال رحلتك في عالم الذكاء الاصطناعي؟"</p>
            </div>

            {/* Global progress card */}
            <div className="glass-card rounded-[20px] p-5 mb-4" style={{
              border: '1px solid rgba(255,255,255,0.07)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            }}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-slate-500 text-xs mb-[3px]">التقدم الكلي</p>
                  <p className="text-[22px] font-black" style={{
                    background: 'linear-gradient(135deg,#00D4FF,#A78BFA)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                  }}>
                    {totalDone} / {TOTAL_TOPICS}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[32px] font-black text-slate-200">{pct}%</p>
                  <p className="text-slate-500 text-[11px]">مكتمل</p>
                </div>
                <SyncDot status={syncStatus} />
              </div>

              {/* Rainbow progress bar */}
              <div className="h-2.5 rounded-[5px] overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="animate-rainbow h-full rounded-[5px]" style={{
                  width: `${pct}%`,
                  background: 'linear-gradient(90deg,#00D4FF,#A78BFA,#F472B6,#34D399,#FBBF24)',
                  boxShadow: '0 0 12px rgba(0,212,255,0.5)',
                  transition: 'width 0.8s cubic-bezier(0.34,1.56,0.64,1)',
                }} />
              </div>
            </div>

            {/* ── Motivational Quote ── */}
            <div className="text-center px-8 mb-6 mt-6">
              <p style={{
                background: 'linear-gradient(135deg, #34D399, #00D4FF)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                fontSize: isMobile ? 22 : 28, fontStyle: 'italic', lineHeight: 1.8, fontWeight: 900,
                textShadow: '0 0 24px rgba(52,211,153,0.3)',
              }}>
                "{quote.text}"
              </p>
              {quote.source && (
                <p className="text-slate-400 text-sm mt-2 font-bold">— {quote.source}</p>
              )}
            </div>
          </header>
        ) : (
          /* ── DAILY DASHBOARD HEADER ── */
          <header className="w-full pt-10 pb-6 text-center">
            <h1 className="font-black mb-2 leading-tight flex items-center justify-center gap-2" style={{
              fontSize: isMobile ? 28 : 38,
            }}>
              <span>📋</span>
              <span style={{
                background: 'linear-gradient(135deg, #34D399, #00FFC2, #00D4FF)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                color: 'transparent',
              }}>يوميات المهندس</span>
            </h1>
            <p className="text-slate-500 text-sm mb-6"> تتبّع مهامك اليومية وابقَ ملتزماً بخطتك</p>

            {/* Daily progress card */}
            <div className="glass-card rounded-[20px] p-5 mb-4" style={{
              border: '1px solid rgba(52,211,153,0.15)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            }}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-slate-500 text-xs mb-[3px]">Daily Tasks</p>
                  <p className="text-[22px] font-black" style={{
                    background: 'linear-gradient(135deg, #34D399, #10B981)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                  }}>
                    {todayCompleted} / {todayTasks.length}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[32px] font-black text-slate-200">{dailyPct}%</p>
                  <p className="text-slate-500 text-[11px]">مكتمل اليوم</p>
                </div>
                <SyncDot status={syncStatus} />
              </div>

              {/* Emerald progress bar */}
              <div className="h-2.5 rounded-[5px] overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="h-full rounded-[5px]" style={{
                  width: `${dailyPct}%`,
                  background: 'linear-gradient(90deg, #34D399, #10B981, #059669)',
                  boxShadow: '0 0 12px rgba(52,211,153,0.5)',
                  transition: 'width 0.8s cubic-bezier(0.34,1.56,0.64,1)',
                }} />
              </div>
            </div>

            {/* ── Daily Consistency Quote ── */}
            <div className="text-center px-8 mb-6 mt-6">
              <p style={{
                background: 'linear-gradient(135deg, #34D399, #10B981)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                fontSize: isMobile ? 20 : 26, fontStyle: 'italic', lineHeight: 1.8, fontWeight: 900,
                textShadow: '0 0 24px rgba(52,211,153,0.3)',
              }}>
                "{dailyQuote}"
              </p>
            </div>
          </header>
        )}

        {/* ── TOP NAV BAR ── */}
        <div className="flex justify-center items-center w-full gap-2">
          <button
            onClick={() => setActiveTab('roadmap')}
            style={{
              flex: 1,
              padding: '10px 0',
              borderRadius: 10,
              border: activeTab === 'roadmap' ? '1px solid rgba(0,212,255,0.5)' : '1px solid rgba(255,255,255,0.1)',
              background: activeTab === 'roadmap' ? 'rgba(0,212,255,0.1)' : 'rgba(255,255,255,0.03)',
              color: activeTab === 'roadmap' ? '#00D4FF' : '#64748b',
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            🗺️ الخريطة الرئيسية
          </button>
          <button
            onClick={() => setActiveTab('daily')}
            style={{
              flex: 1,
              padding: '10px 0',
              borderRadius: 10,
              border: activeTab === 'daily' ? '1px solid rgba(52,211,153,0.5)' : '1px solid rgba(255,255,255,0.1)',
              background: activeTab === 'daily' ? 'rgba(52,211,153,0.1)' : 'rgba(255,255,255,0.03)',
              color: activeTab === 'daily' ? '#34D399' : '#64748b',
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            📋 يومياتي
          </button>
        </div>

        {/* ── CONDITIONAL CONTENT ── */}
        {activeTab === 'daily' ? (
          <DailyTracker />
        ) : (
          <>
            {/* ── PHASE TIMELINE ── */}
            <section className="w-full">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-slate-400 text-sm font-bold tracking-[2px]">◈ المراحل</h2>
                <span className="text-slate-700 text-xs">
                  {phases.filter(p => p.topicGroups.reduce((a, g) => a + g.topics.filter(t => checkedTopics[t.id]).length, 0) === p.topicGroups.reduce((a, g) => a + g.topics.length, 0)).length} / 7 مكتملة
                </span>
              </div>
              {phases.map((phase, i) => (
                <div key={phase.id} id={phase.id}>
                  <PhaseCard phase={phase} isLast={i === phases.length - 1} phaseIndex={i} />
                </div>
              ))}
            </section>
          </>
        )}

        {/* ── FOOTER ── */}
        <footer className="w-full mt-8 pt-5 flex items-center justify-between flex-wrap gap-2.5" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <p className="text-slate-700 text-xs">
            🔑 PIN: <code className="text-cyan-400/50 tracking-[2px]">{pin}</code> ·{' '}
            <button onClick={() => setShowPinChange(!showPinChange)} className="bg-none border-none text-slate-600 text-xs cursor-pointer underline px-[4px]">
              تغيير PIN
            </button>
          </p>
          <div className="flex gap-3 items-center">
            <button
              onClick={() => setShowReferences(true)}
              className="bg-none text-slate-500 text-xs cursor-pointer px-3 py-1 rounded-lg transition-all"
              style={{ border: '1px solid rgba(251,191,36,0.2)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#FBBF24'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#64748B'; }}
            >
              📚 مصادر الـ Roadmap
            </button>
            <p className="text-slate-800 text-[11px]">AI Engineer Roadmap © 2026</p>
          </div>
        </footer>

        {/* PIN change form */}
        {showPinChange && (
          <div className="animate-slide-down glass-card fixed w-[90%] max-w-[360px] p-6 rounded-2xl z-[100] flex flex-col gap-3" style={{
            bottom: isMobile ? 90 : 20, left: '50%', transform: 'translateX(-50%)',
            border: '1px solid rgba(0,212,255,0.3)', boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
          }}>
            <p className="text-slate-400 text-sm font-bold m-0">تغيير الـ PIN:</p>
            
            <input type="text" maxLength={6}
              placeholder="كود الاسترجاع (6 رموز)" value={recoveryCodeInput}
              onChange={e => setRecoveryCodeInput(e.target.value)}
              className="p-[10px_14px] rounded-xl border border-purple-400/30 bg-white/5 text-slate-200 text-sm outline-none tracking-[2px] text-center" />
              
            <input type="password" inputMode="numeric" maxLength={4}
              placeholder="PIN جديد (4 أرقام)" value={newPinInput}
              onChange={e => setNewPinInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
              onKeyDown={e => e.key === 'Enter' && handlePinChange()}
              className="p-[10px_14px] rounded-xl border border-cyan-400/30 bg-white/5 text-slate-200 text-base outline-none tracking-[4px] text-center" />
              
            <div className="flex gap-2.5 mt-1">
              <button onClick={handlePinChange} className="flex-1 p-[10px_16px] rounded-xl border-none bg-gradient-to-r from-cyan-400 to-cyan-600 text-black font-bold text-sm cursor-pointer">تغيير</button>
              <button onClick={() => { setShowPinChange(false); setRecoveryCodeInput(''); setNewPinInput(''); }} className="flex-1 p-[10px_12px] rounded-xl border border-white/10 bg-transparent text-slate-500 text-sm cursor-pointer">إلغاء</button>
            </div>
          </div>
        )}
      </div>

      {/* Floating search button */}
      <button onClick={() => setIsSearchOpen(true)} className="animate-float fixed z-40 p-[14px_20px] rounded-[50px] flex items-center gap-2 text-sm font-black text-purple-400 cursor-pointer whitespace-nowrap transition-all"
        style={{
          bottom: isMobile ? 78 : 24,
          left: isMobile ? '50%' : undefined, right: isMobile ? undefined : 24,
          transform: isMobile ? 'translateX(-50%)' : undefined,
          border: '1px solid rgba(167,139,250,0.5)', background: 'rgba(13,21,37,0.95)',
          boxShadow: '0 0 24px rgba(167,139,250,0.3), 0 8px 32px rgba(0,0,0,0.4)',
          backdropFilter: 'blur(20px)',
        }}>
        🔍 <span>topic جديد</span>
      </button>

      <SearchModal />
      {isMobile && <BottomNav />}
      {showReferences && <ReferencesModal onClose={() => setShowReferences(false)} />}
    </div>
  );
}
