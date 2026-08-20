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
      'الـ Transformer هو أساس كل الـ LLMs الحديثة زي GPT وـ BERT. معماريته بتعتمد على Attention Mechanism بدل الـ RNNs. فهمه مهم جدًا لأي AI Engineer.',
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

export function findMockResult(query: string): MockResult {
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

  const [wasOpen, setWasOpen] = useState(false);
  if (wasOpen !== isSearchOpen) {
    setWasOpen(isSearchOpen);
    if (isSearchOpen) {
      setQuery('');
      setResult(null);
    }
  }

  useEffect(() => {
    if (isSearchOpen) {
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
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
      style={{
        background: 'rgba(6, 10, 18, 0.85)',
        backdropFilter: 'blur(16px)',
      }}
      onClick={e => { if (e.target === e.currentTarget) setIsSearchOpen(false); }}
    >
      <div
        className="animate-slide-down w-full max-w-[560px] rounded-3xl p-8 max-h-[90vh] overflow-y-auto"
        style={{
          background: 'rgba(13, 21, 37, 0.95)',
          border: '1px solid rgba(167, 139, 250, 0.4)',
          boxShadow: '0 0 60px rgba(167,139,250,0.2), 0 30px 80px rgba(0,0,0,0.6)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-slate-200 text-xl font-black">
            🔍 ابحث عن أي topic
          </h2>
          <button
            onClick={() => setIsSearchOpen(false)}
            className="bg-white/5 border border-white/10 text-slate-500 w-9 h-9 rounded-xl cursor-pointer text-base flex items-center justify-center transition-all"
            onMouseEnter={e => (e.currentTarget.style.color = '#F1F5F9')}
            onMouseLeave={e => (e.currentTarget.style.color = '#64748B')}
          >
            ✕
          </button>
        </div>

        {/* Search input */}
        <div className="relative mb-4">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="اكتب الـ topic اللي عايز تتعلمه... مثلاً: RAG, LangChain, Docker"
            className="w-full p-[14px_16px] rounded-xl text-slate-200 text-sm outline-none transition-all box-border"
            style={{
              border: '1px solid rgba(167,139,250,0.3)',
              background: 'rgba(255,255,255,0.04)',
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
          className="w-full p-[14px] rounded-xl border-none text-sm font-black mb-5 transition-all"
          style={{
            background: loading || !query.trim()
              ? 'rgba(167,139,250,0.2)'
              : 'linear-gradient(135deg, #A78BFA, #7C3AED)',
            color: loading || !query.trim() ? '#64748B' : '#fff',
            cursor: loading || !query.trim() ? 'not-allowed' : 'pointer',
            boxShadow: loading || !query.trim() ? 'none' : '0 4px 20px rgba(167,139,250,0.4)',
          }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-[6px]">
              جاري البحث
              <span className="w-2 h-2 rounded-full bg-purple-400 inline-block animate-dots-1" />
              <span className="w-2 h-2 rounded-full bg-purple-400 inline-block animate-dots-2" />
              <span className="w-2 h-2 rounded-full bg-purple-400 inline-block animate-dots-3" />
            </span>
          ) : 'بحث بـ AI ✨'}
        </button>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-5">
            <div className="w-12 h-12 rounded-full border-3 border-purple-400/20 mx-auto mb-3" style={{ borderTop: '3px solid #A78BFA', animation: 'spin 1s linear infinite' }} />
            <p className="text-slate-500 text-sm">بنسأل الـ AI عن أفضل مصادر...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* Results */}
        {result && !loading && (
          <div className="animate-slide-down">
            {/* Topic description */}
            <div className="p-4 rounded-xl mb-[14px]" style={{
              border: '1px solid rgba(167,139,250,0.2)',
              background: 'rgba(167,139,250,0.05)',
            }}>
              <h3 className="text-purple-400 text-sm font-black mb-2">
                {result.topic}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">{result.description}</p>
            </div>

            {/* Resources */}
            <p className="text-slate-500 text-xs font-bold mb-2.5 tracking-[1px]">
              المصادر المقترحة:
            </p>
            <div className="flex flex-col gap-2 mb-[14px]">
              {result.resources.map((r, i) => (
                <div key={i} className="p-[12px_14px] rounded-xl flex items-center justify-between gap-2.5" style={{
                  border: '1px solid rgba(255,255,255,0.07)',
                  background: 'rgba(255,255,255,0.03)',
                }}>
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{getTypeIcon(r.type)}</span>
                    <div>
                      <p className="text-slate-300 text-xs font-semibold">{r.name}</p>
                      <div className="flex gap-[5px] mt-[3px]">
                        <span className="text-[10px] text-purple-400 bg-purple-400/10 px-[6px] py-[1px] rounded">
                          {getTypeLabel(r.type)}
                        </span>
                        <span className={`text-[10px] px-[6px] py-[1px] rounded ${r.lang === 'ar' ? 'text-emerald-400 bg-emerald-400/10' : 'text-cyan-400 bg-cyan-400/10'}`}>
                          {r.lang === 'ar' ? '🇪🇬 عربي' : '🌍 English'}
                        </span>
                        <span className={`text-[10px] px-[6px] py-[1px] rounded ${r.price === 'free' ? 'text-emerald-400 bg-emerald-400/10' : 'text-amber-400 bg-amber-400/10'}`}>
                          {r.price === 'free' ? 'مجاني' : 'مدفوع'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Task card */}
            <div className="p-[14px_16px] rounded-xl flex items-start gap-2.5 mb-4" style={{
              border: '1px solid rgba(251,146,60,0.25)',
              background: 'rgba(251,146,60,0.06)',
            }}>
              <span className="text-xl shrink-0">🚀</span>
              <div>
                <p className="text-orange-400 text-xs font-bold mb-1">التكليف المقترح</p>
                <p className="text-slate-300 text-sm leading-relaxed">{result.task}</p>
              </div>
            </div>

            {/* Add to roadmap button */}
            <button
              className="w-full p-[13px] rounded-xl text-sm font-bold cursor-pointer transition-all"
              style={{
                border: '1px solid rgba(52,211,153,0.3)',
                background: 'rgba(52,211,153,0.1)',
                color: '#34D399',
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
