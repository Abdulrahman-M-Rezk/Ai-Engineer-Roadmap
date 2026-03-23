import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';

interface MockResult {
  topic: string;
  description: string;
  resources: {
    type: 'video' | 'book' | 'article';
    name: string;
    lang: 'ar' | 'en';
    price: 'free' | 'paid';
  }[];
  task: string;
}

const MOCK_RESULTS: Record<string, MockResult> = {
  default: {
    topic: 'AI Topic',
    description:
      'هذا الموضوع من أهم المواضيع في مجال الـ AI. يتضمن مفاهيم أساسية تحتاجها لتكون AI Engineer محترف. ينصح بإتقانه قبل الانتقال لمواضيع أكثر تقدمًا.',
    resources: [
      { type: 'video', name: 'شرح مفصل على YouTube', lang: 'ar', price: 'free' },
      { type: 'book', name: 'Deep Learning Book — Goodfellow', lang: 'en', price: 'free' },
      { type: 'article', name: 'Towards Data Science Article', lang: 'en', price: 'free' },
    ],
    task: 'ابني مشروع تطبيقي يستخدم هذا الـ topic وارفعه على GitHub',
  },
};

const TOPICS_MAP: Record<string, MockResult> = {
  'transformer': {
    topic: 'Transformer Architecture',
    description:
      'الـ Transformer هو أس��س كل الـ LLMs الحديثة زي GPT وـ BERT. معماريته بتعتمد على Attention Mechanism بدل الـ RNNs. فهمه مهم جدًا لأي AI Engineer.',
    resources: [
      { type: 'video', name: 'Andrej Karpathy — Building GPT from Scratch', lang: 'en', price: 'free' },
      { type: 'article', name: 'The Illustrated Transformer — Jay Alammar', lang: 'en', price: 'free' },
      { type: 'book', name: 'NLP with Transformers (Hugging Face)', lang: 'en', price: 'paid' },
    ],
    task: 'ابني Transformer بسيط من scratch بـ PyTorch ودرّبه على مشكلة بسيطة',
  },
  'rag': {
    topic: 'Retrieval Augmented Generation (RAG)',
    description:
      'الـ RAG هو تقنية بتدمج بين الـ Retrieval (جلب المعلومات) وـ Generation (توليد النص). بتخلي الـ LLM يوصل لمعلومات محدثة من قاعدة بيانات خاصة.',
    resources: [
      { type: 'video', name: 'LangChain RAG Tutorial — Official Docs', lang: 'en', price: 'free' },
      { type: 'article', name: 'RAG بالعربي — منتدى AI عربي', lang: 'ar', price: 'free' },
      { type: 'book', name: 'Building LLM Applications — Chip Huyen', lang: 'en', price: 'free' },
    ],
    task: 'ابني RAG system يقرأ PDFs ويجاوب على أسئلة عنها بـ ChromaDB وـ OpenAI',
  },
  'langchain': {
    topic: 'LangChain Framework',
    description:
      'LangChain فريمووورك بيسهّل بناء تطبيقات LLM. بتقدر تبني بيه Chains وـ Agents وتستخدم Tools مختلفة. من أكتر الـ frameworks استخدامًا في مجال الـ AI Apps.',
    resources: [
      { type: 'video', name: 'LangChain Crash Course — DeepLearning.AI', lang: 'en', price: 'free' },
      { type: 'video', name: 'LangChain بالعربي — قناة AI بالعربي', lang: 'ar', price: 'free' },
      { type: 'article', name: 'LangChain Official Documentation', lang: 'en', price: 'free' },
    ],
    task: 'ابني AI Agent بـ LangChain يستخدم أدوات زي Web Search وـ Calculator',
  },
  'docker': {
    topic: 'Docker للـ ML',
    description:
      'Docker بيخليك تغلّف الـ ML application في container قابل للنقل على أي بيئة. ضروري جدًا لنشر الموديلات في Production. بتحل مشكلة "عندي بيشتغل بس عنده لا".',
    resources: [
      { type: 'video', name: 'Docker for ML Engineers — ArjanCodes', lang: 'en', price: 'free' },
      { type: 'video', name: 'Docker بالعربي — Codezilla', lang: 'ar', price: 'free' },
      { type: 'article', name: 'Docker Curriculum — Official Docs', lang: 'en', price: 'free' },
    ],
    task: 'غلّف ML API بـ FastAPI في Docker container وانشره على Railway أو Fly.io',
  },
};

function findMockResult(query: string): MockResult {
  const lower = query.toLowerCase();
  for (const key of Object.keys(TOPICS_MAP)) {
    if (lower.includes(key)) return TOPICS_MAP[key];
  }
  return { ...MOCK_RESULTS.default, topic: query };
}

export function SearchModal() {
  const { isSearchOpen, setIsSearchOpen } = useApp();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MockResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setQuery('');
      setResult(null);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isSearchOpen]);

  const handleSearch = () => {
    if (!query.trim()) return;
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      setResult(findMockResult(query));
      setLoading(false);
    }, 1800);
  };

  const getTypeIcon = (type: string) => {
    if (type === 'video') return '📹';
    if (type === 'book') return '📕';
    return '📄';
  };
  const getTypeLabel = (type: string) => {
    if (type === 'video') return 'فيديو';
    if (type === 'book') return 'كتاب';
    return 'مقال';
  };

  if (!isSearchOpen) return null;

  return (
    <div
      dir="rtl"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(6, 10, 18, 0.85)',
        backdropFilter: 'blur(16px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        fontFamily: "'Cairo', sans-serif",
      }}
      onClick={e => { if (e.target === e.currentTarget) setIsSearchOpen(false); }}
    >
      <div
        className="animate-slide-down"
        style={{
          width: '100%',
          maxWidth: 560,
          background: 'rgba(13, 21, 37, 0.95)',
          border: '1px solid rgba(167, 139, 250, 0.4)',
          borderRadius: 24,
          padding: '32px 28px',
          boxShadow: '0 0 60px rgba(167,139,250,0.2), 0 30px 80px rgba(0,0,0,0.6)',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ color: '#F1F5F9', fontSize: 20, fontWeight: 800 }}>
            🔍 ابحث عن أي topic
          </h2>
          <button
            onClick={() => setIsSearchOpen(false)}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#64748B',
              width: 36,
              height: 36,
              borderRadius: 10,
              cursor: 'pointer',
              fontSize: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#F1F5F9')}
            onMouseLeave={e => (e.currentTarget.style.color = '#64748B')}
          >
            ✕
          </button>
        </div>

        {/* Search input */}
        <div style={{ position: 'relative', marginBottom: 16 }}>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="اكتب الـ topic اللي عايز تتعلمه... مثلاً: RAG, LangChain, Docker"
            style={{
              width: '100%',
              padding: '14px 16px',
              borderRadius: 14,
              border: '1px solid rgba(167,139,250,0.3)',
              background: 'rgba(255,255,255,0.04)',
              color: '#F1F5F9',
              fontSize: 14,
              fontFamily: "'Cairo', sans-serif",
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'all 0.2s',
            }}
            onFocus={e => {
              e.target.style.border = '1px solid rgba(167,139,250,0.7)';
              e.target.style.boxShadow = '0 0 20px rgba(167,139,250,0.2)';
            }}
            onBlur={e => {
              e.target.style.border = '1px solid rgba(167,139,250,0.3)';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Search button */}
        <button
          onClick={handleSearch}
          disabled={loading || !query.trim()}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: 14,
            border: 'none',
            background: loading || !query.trim()
              ? 'rgba(167,139,250,0.2)'
              : 'linear-gradient(135deg, #A78BFA, #7C3AED)',
            color: loading || !query.trim() ? '#64748B' : '#fff',
            fontSize: 15,
            fontWeight: 800,
            fontFamily: "'Cairo', sans-serif",
            cursor: loading || !query.trim() ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s',
            boxShadow: loading || !query.trim() ? 'none' : '0 4px 20px rgba(167,139,250,0.4)',
            marginBottom: 20,
          }}
        >
          {loading ? (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              جاري البحث
              <span className="animate-dots-1" style={{ width: 8, height: 8, borderRadius: '50%', background: '#A78BFA', display: 'inline-block' }} />
              <span className="animate-dots-2" style={{ width: 8, height: 8, borderRadius: '50%', background: '#A78BFA', display: 'inline-block' }} />
              <span className="animate-dots-3" style={{ width: 8, height: 8, borderRadius: '50%', background: '#A78BFA', display: 'inline-block' }} />
            </span>
          ) : 'بحث بـ AI ✨'}
        </button>

        {/* Loading state */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              border: '3px solid rgba(167,139,250,0.2)',
              borderTop: '3px solid #A78BFA',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 12px',
            }} />
            <p style={{ color: '#64748B', fontSize: 13 }}>بنسأل الـ AI عن أفضل مصادر...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* Results */}
        {result && !loading && (
          <div className="animate-slide-down">
            {/* Topic description */}
            <div style={{
              padding: '16px',
              borderRadius: 14,
              border: '1px solid rgba(167,139,250,0.2)',
              background: 'rgba(167,139,250,0.05)',
              marginBottom: 14,
            }}>
              <h3 style={{ color: '#A78BFA', fontSize: 15, fontWeight: 800, marginBottom: 8 }}>
                {result.topic}
              </h3>
              <p style={{ color: '#94A3B8', fontSize: 13, lineHeight: 1.8 }}>{result.description}</p>
            </div>

            {/* Resources */}
            <p style={{ color: '#64748B', fontSize: 12, fontWeight: 700, marginBottom: 10, letterSpacing: 1 }}>
              المصادر المقترحة:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
              {result.resources.map((r, i) => (
                <div key={i} style={{
                  padding: '12px 14px',
                  borderRadius: 12,
                  border: '1px solid rgba(255,255,255,0.07)',
                  background: 'rgba(255,255,255,0.03)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 10,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 18 }}>{getTypeIcon(r.type)}</span>
                    <div>
                      <p style={{ color: '#CBD5E1', fontSize: 12, fontWeight: 600 }}>{r.name}</p>
                      <div style={{ display: 'flex', gap: 5, marginTop: 3 }}>
                        <span style={{ fontSize: 10, color: '#A78BFA', background: 'rgba(167,139,250,0.1)', padding: '1px 6px', borderRadius: 4 }}>
                          {getTypeLabel(r.type)}
                        </span>
                        <span style={{ fontSize: 10, color: r.lang === 'ar' ? '#34D399' : '#00D4FF', background: r.lang === 'ar' ? 'rgba(52,211,153,0.1)' : 'rgba(0,212,255,0.1)', padding: '1px 6px', borderRadius: 4 }}>
                          {r.lang === 'ar' ? '🇪🇬 عربي' : '🌍 English'}
                        </span>
                        <span style={{ fontSize: 10, color: r.price === 'free' ? '#34D399' : '#FBBF24', background: r.price === 'free' ? 'rgba(52,211,153,0.1)' : 'rgba(251,191,36,0.1)', padding: '1px 6px', borderRadius: 4 }}>
                          {r.price === 'free' ? 'مجاني' : 'مدفوع'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Task card */}
            <div style={{
              padding: '14px 16px',
              borderRadius: 12,
              border: '1px solid rgba(251,146,60,0.25)',
              background: 'rgba(251,146,60,0.06)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
              marginBottom: 16,
            }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>🚀</span>
              <div>
                <p style={{ color: '#FB923C', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>التكليف المقترح</p>
                <p style={{ color: '#CBD5E1', fontSize: 13, lineHeight: 1.7 }}>{result.task}</p>
              </div>
            </div>

            {/* Add to roadmap button */}
            <button
              style={{
                width: '100%',
                padding: '13px',
                borderRadius: 12,
                border: '1px solid rgba(52,211,153,0.3)',
                background: 'rgba(52,211,153,0.1)',
                color: '#34D399',
                fontSize: 14,
                fontWeight: 700,
                fontFamily: "'Cairo', sans-serif",
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(52,211,153,0.2)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 20px rgba(52,211,153,0.2)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(52,211,153,0.1)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
              }}
              onClick={() => {
                alert('✅ تم إضافة الـ topic للـ Roadmap!');
                setIsSearchOpen(false);
              }}
            >
              ➕ أضف للـ Roadmap
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
