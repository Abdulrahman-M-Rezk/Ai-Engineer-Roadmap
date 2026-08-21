import { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useApp } from '../context/AppContext';
import { getTodayLocal } from '../utils/dates';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;
const MODEL_NAME = 'gemini-1.5-flash';

export interface AiResource {
  name: string;
  url: string;
}

export interface AiSearchResult {
  title: string;
  description: string;
  actionable_steps: string[];
  resources: AiResource[];
}

const MENTOR_PROMPT = (topic: string) =>
  `أنت Senior AI Engineering Mentor خبير، يساعد المتعلمين على بناء مهاراتهم خطوة بخطوة.

سؤال المتعلم: "${topic}"

قدّم خطة تعلم مركزة وواقعية لهذا الموضوع، واجب حصراً بصيغة JSON صالحة (بدون أي نص أو شرح خارجها) بالبنية التالية حرفياً:

{"title": "عنوان قصير للموضوع", "description": "شرح موجز من 2-3 جمل بالعربية", "actionable_steps": ["خطوة عملية قابلة للتنفيذ", "خطوة عملية أخرى"], "resources": [{"name": "اسم الكورس أو المقال أو الأداة", "url": "https://..."}]}

القواعد:
- title: عنوان مختصر يصف الموضوع.
- description: لماذا هذا الموضوع مهم لمهندس AI + ماذا ستتعلم منه (2-3 جمل بالعربية).
- actionable_steps: من 3 إلى 5 خطوات عملية قابلة للتنفيذ فوراً (مشاريع صغيرة، تمارين، أدوات).
- resources: من 3 إلى 4 مصادر حقيقية ومعروفة فقط (كورسات، مقالات، توثيق رسمي، أدوات) كل مصدر معه رابط URL يعمل فعلاً. اعتمد على مواقع موثوقة مثل: YouTube (قنوات مشهورة)، freeCodeCamp، Coursera، المستندات الرسمية، GitHub. لا تخترع روابط وهمية — إن لم تكن متأكداً من رابط صفحة محددة، استخدم الصفحة الرئيسية للموقع أو رابط بحث رسمي.
- لا تُخرج أي شيء غير الـ JSON.`;

const URL_REGEX = /(https?:\/\/[^\s)\]}]+)/g;

function isValidUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

function linkify(text: string) {
  return text.split(URL_REGEX).map((part, i) =>
    /^https?:\/\//i.test(part) ? (
      <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-sky-400 underline break-all hover:text-sky-300">{part}</a>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

function parseAiJson(text: string): AiSearchResult | null {
  try {
    const cleaned = text.replace(/```json|```/gi, '').trim();
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start === -1 || end === -1) return null;

    const obj: unknown = JSON.parse(cleaned.slice(start, end + 1));
    if (!obj || typeof obj !== 'object') return null;

    const record = obj as Record<string, unknown>;
    const title = typeof record.title === 'string' ? record.title : '';
    const description = typeof record.description === 'string' ? record.description : '';
    const actionable_steps = Array.isArray(record.actionable_steps)
      ? record.actionable_steps.filter((s): s is string => typeof s === 'string')
      : [];
    const resources = Array.isArray(record.resources)
      ? (record.resources as unknown[])
          .map(r => (r && typeof r === 'object') ? (r as Record<string, unknown>) : null)
          .filter((r): r is Record<string, unknown> => r !== null)
          .filter(r => typeof r.name === 'string' && typeof r.url === 'string' && isValidUrl(r.url))
          .map(r => ({ name: r.name as string, url: r.url as string }))
      : [];

    if (!title && !description && actionable_steps.length === 0 && resources.length === 0) return null;

    return { title, description, actionable_steps, resources };
  } catch {
    return null;
  }
}

export { parseAiJson };

export function SearchModal() {
  const { isSearchOpen, setIsSearchOpen, addDailyTask } = useApp();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AiSearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [addedCount, setAddedCount] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [wasOpen, setWasOpen] = useState(false);
  if (wasOpen !== isSearchOpen) {
    setWasOpen(isSearchOpen);
    if (isSearchOpen) {
      setQuery('');
      setResult(null);
      setError(null);
      setAddedCount(null);
    }
  }

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isSearchOpen]);

  const handleSearch = async () => {
    const topic = query.trim();
    if (!topic || loading) return;

    if (!genAI) {
      setError('⚠️ يرجى إضافة VITE_GEMINI_API_KEY في ملف .env لتفعيل البحث الذكي');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setAddedCount(null);

    try {
      const model = genAI.getGenerativeModel({ model: MODEL_NAME });
      const response = await model.generateContent(MENTOR_PROMPT(topic));
      const text = response.response.text();

      const parsed = parseAiJson(text);
      if (!parsed) {
        setError('تعذر فهم استجابة الذكاء الاصطناعي، حاول مرة أخرى');
        return;
      }

      setResult(parsed);
    } catch (err) {
      const status = err instanceof Error && 'status' in err
        ? (err as { status?: number }).status
        : undefined;
      console.error('Gemini search failed:', err);
      if (status === 404) {
        setError('مفتاح Gemini لا يملك صلاحية لهذا النموذج — فعّل Generative Language API في المشروع، أو أنشئ مفتاحاً جديداً من Google AI Studio');
      } else if (status === 403) {
        setError('المفتاح محجوب لهذا الطلب — تحقق من قيود المفتاح في Google Cloud');
      } else if (status === 429) {
        setError('تجاوزت حد الاستخدام المجاني — حاول بعد قليل');
      } else {
        setError('حدث خطأ أثناء البحث، تحقق من اتصالك بالإنترنت وحاول مجدداً');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddToRoadmap = () => {
    if (!result || result.actionable_steps.length === 0) return;
    const today = getTodayLocal();
    result.actionable_steps.forEach(step => addDailyTask(today, step, 'high'));
    setAddedCount(result.actionable_steps.length);
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

        {/* Missing API key warning */}
        {!genAI && (
          <div className="mb-4 p-[14px_16px] rounded-xl text-sm leading-relaxed" style={{
            border: '1px solid rgba(251,191,36,0.3)',
            background: 'rgba(251,191,36,0.06)',
            color: '#FBBF24',
          }}>
            ⚠️ يرجى إضافة <code dir="ltr" className="text-amber-300">VITE_GEMINI_API_KEY</code> في ملف <code dir="ltr" className="text-amber-300">.env</code> لتفعيل البحث الذكي
          </div>
        )}

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

        {/* Error message */}
        {error && (
          <div className="mb-4 p-[14px_16px] rounded-xl text-sm leading-relaxed animate-slide-down" style={{
            border: '1px solid rgba(248,113,113,0.3)',
            background: 'rgba(248,113,113,0.06)',
            color: '#F87171',
          }}>
            {error}
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="animate-pulse">
            <div className="p-4 rounded-xl mb-[14px]" style={{ border: '1px solid rgba(167,139,250,0.15)', background: 'rgba(167,139,250,0.04)' }}>
              <div className="h-4 w-1/3 rounded mb-2" style={{ background: 'rgba(167,139,250,0.15)' }} />
              <div className="h-3 w-full rounded mb-1.5" style={{ background: 'rgba(255,255,255,0.06)' }} />
              <div className="h-3 w-5/6 rounded" style={{ background: 'rgba(255,255,255,0.06)' }} />
            </div>
            <div className="flex flex-col gap-2 mb-[14px]">
              {[0, 1, 2].map(i => (
                <div key={i} className="p-[12px_14px] rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.03)' }}>
                  <div className="h-3 w-2/3 rounded mb-1.5" style={{ background: 'rgba(255,255,255,0.07)' }} />
                  <div className="h-3 w-1/2 rounded" style={{ background: 'rgba(255,255,255,0.05)' }} />
                </div>
              ))}
            </div>
            <p className="text-center text-slate-500 text-sm">بنسأل الـ AI عن أفضل مصادر...</p>
          </div>
        )}

        {/* Results */}
        {result && !loading && (
          <div className="animate-slide-down">
            {/* Title + description */}
            <div className="p-4 rounded-xl mb-[14px]" style={{
              border: '1px solid rgba(167,139,250,0.2)',
              background: 'rgba(167,139,250,0.05)',
            }}>
              <h3 className="text-purple-400 text-sm font-black mb-2">
                {result.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">{result.description}</p>
            </div>

            {/* Suggested resources with real links */}
            {result.resources.length > 0 && (
              <>
                <p className="text-slate-500 text-xs font-bold mb-2.5 tracking-[1px]">
                  🔗 مصادر مقترحة:
                </p>
                <div className="flex flex-col gap-2 mb-4">
                  {result.resources.map((r, i) => (
                    <a
                      key={i}
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-[12px_14px] rounded-xl flex items-center gap-2.5 no-underline transition-all"
                      style={{ border: '1px solid rgba(56,189,248,0.2)', background: 'rgba(56,189,248,0.05)' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(56,189,248,0.12)'; e.currentTarget.style.borderColor = 'rgba(56,189,248,0.4)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(56,189,248,0.05)'; e.currentTarget.style.borderColor = 'rgba(56,189,248,0.2)'; }}
                    >
                      <span className="text-lg shrink-0">🔗</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sky-300 text-sm font-semibold m-0">{r.name}</p>
                        <p dir="ltr" className="text-slate-500 text-[11px] truncate m-0">{r.url}</p>
                      </div>
                      <span className="text-sky-400 shrink-0">↗</span>
                    </a>
                  ))}
                </div>
              </>
            )}

            {/* Actionable steps */}
            <p className="text-slate-500 text-xs font-bold mb-2.5 tracking-[1px]">
              خطوات عملية لبدء التعلم:
            </p>
            <div className="flex flex-col gap-2 mb-4">
              {result.actionable_steps.map((step, i) => (
                <div key={i} className="p-[12px_14px] rounded-xl flex items-start gap-2.5" style={{
                  border: '1px solid rgba(255,255,255,0.07)',
                  background: 'rgba(255,255,255,0.03)',
                }}>
                  <span className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black" style={{
                    background: 'rgba(167,139,250,0.15)',
                    border: '1px solid rgba(167,139,250,0.3)',
                    color: '#A78BFA',
                  }}>
                    {i + 1}
                  </span>
                  <p className="text-slate-300 text-sm leading-relaxed flex-1">{linkify(step)}</p>
                </div>
              ))}
            </div>

            {/* Success toast */}
            {addedCount !== null && (
              <div className="mb-4 p-[12px_14px] rounded-xl flex items-center gap-2.5 animate-slide-down" style={{
                border: '1px solid rgba(52,211,153,0.3)',
                background: 'rgba(52,211,153,0.08)',
                color: '#34D399',
              }}>
                <span className="text-lg">✅</span>
                <p className="text-sm font-semibold">تمت إضافة {addedCount} مهام عالية الأولوية لليوم في المتابعة اليومية</p>
              </div>
            )}

            {/* Add to roadmap button */}
            <button
              disabled={addedCount !== null}
              className="w-full p-[13px] rounded-xl text-sm font-bold cursor-pointer transition-all"
              style={{
                border: '1px solid rgba(52,211,153,0.3)',
                background: addedCount !== null ? 'rgba(52,211,153,0.25)' : 'rgba(52,211,153,0.1)',
                color: '#34D399',
                cursor: addedCount !== null ? 'default' : 'pointer',
              }}
              onMouseEnter={e => {
                if (addedCount === null) {
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(52,211,153,0.2)';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 20px rgba(52,211,153,0.2)';
                }
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = addedCount !== null ? 'rgba(52,211,153,0.25)' : 'rgba(52,211,153,0.1)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
              }}
              onClick={handleAddToRoadmap}
            >
              {addedCount !== null ? '✓ تمت الإضافة للـ Roadmap' : `➕ أضف للـ Roadmap (${result.actionable_steps.length})`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}