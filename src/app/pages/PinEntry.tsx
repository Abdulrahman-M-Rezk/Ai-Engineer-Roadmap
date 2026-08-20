import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';

type AuthMode = 'login' | 'signup' | 'recovery';

export default function PinEntry() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const emailRef = useRef<HTMLInputElement>(null);
  const { login, signup, resetPassword } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    emailRef.current?.focus();
    setError('');
    setResetSent(false);
  }, [mode]);

  const triggerShake = () => { setShake(true); setTimeout(() => setShake(false), 600); };

  const handleSubmit = async () => {
    setError('');

    if (mode === 'recovery') {
      if (!email.trim()) { setError('أدخل البريد الإلكتروني'); triggerShake(); return; }
      setLoading(true);
      const res = await resetPassword(email.trim());
      setLoading(false);
      if (res.success) {
        setResetSent(true);
      } else {
        setError(res.error || 'تعذر إرسال رابط الاسترجاع');
        triggerShake();
      }
      return;
    }

    if (!email.trim()) { setError('أدخل البريد الإلكتروني'); triggerShake(); return; }
    if (!password) { setError('أدخل كلمة المرور'); triggerShake(); return; }
    if (mode === 'signup' && password.length < 6) { setError('كلمة المرور على الأقل 6 أحرف'); triggerShake(); return; }

    setLoading(true);
    const res = mode === 'signup'
      ? await signup(email.trim(), password, displayName.trim())
      : await login(email.trim(), password);
    setLoading(false);

    if (res.success) {
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 600);
    } else {
      setError(res.error || 'حدث خطأ');
      triggerShake();
    }
  };

  const resetForm = (newMode: AuthMode) => {
    setMode(newMode);
    setError('');
    setPassword('');
    setDisplayName('');
    setResetSent(false);
  };

  return (
    <div dir="rtl" className="noise-bg w-full min-h-screen bg-[#060A12] flex items-center justify-center relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)' }} />
      <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.06) 0%, transparent 70%)' }} />

      {/* Card */}
      <div className={`glass-card ${shake ? 'animate-shake' : ''} w-full max-w-[680px] p-8 sm:p-12 flex flex-col gap-6 sm:gap-8 text-center relative`} style={{
        margin: '0 1rem', borderRadius: 28,
        border: `1px solid ${success ? 'rgba(52,211,153,0.4)' : 'rgba(0,212,255,0.15)'}`,
        boxShadow: success
          ? '0 0 60px rgba(52,211,153,0.3), 0 0 120px rgba(52,211,153,0.1)'
          : '0 0 40px rgba(0,212,255,0.08), 0 20px 60px rgba(0,0,0,0.5)',
        transition: 'box-shadow 0.4s ease',
      }}>
        <div className="animate-float text-6xl block leading-none">
          {mode === 'signup' ? '✨' : mode === 'recovery' ? '🔑' : '🔐'}
        </div>

        <div>
          <h1 className="font-black mb-3 leading-tight text-3xl sm:text-4xl" style={{
            background: 'linear-gradient(135deg, #00D4FF, #A78BFA)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            {mode === 'signup' ? 'إنشاء حساب جديد' : mode === 'recovery' ? 'استرجاع كلمة المرور' : 'تسجيل دخول'}
          </h1>
          <p className="text-slate-400 text-base sm:text-lg">AI Engineer Roadmap · نظام شخصي</p>
        </div>

        {resetSent ? (
          <div className="flex flex-col gap-6">
            <div className="animate-float text-6xl mb-2">📧</div>
            <h2 className="text-white text-2xl font-bold leading-normal">تم إرسال رابط الاسترجاع!</h2>
            <p className="text-slate-400 text-base leading-relaxed">
              تحقق من بريدك الإلكتروني — أرسلنا لك رابطاً لإعادة تعيين كلمة المرور.
            </p>
            <button onClick={() => resetForm('login')} className="w-full p-4 rounded-xl border-none bg-gradient-to-r from-cyan-400 to-cyan-600 text-black text-lg font-black cursor-pointer">
              العودة لتسجيل الدخول
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-4">
              {/* Email */}
              <input
                ref={emailRef}
                type="email"
                dir="ltr"
                placeholder="البريد الإلكتروني"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSubmit(); }}
                className="w-full px-5 py-4 rounded-xl bg-[#0D1525]/90 border-2 border-white/10 text-white text-lg outline-none transition-all text-left"
                onFocus={e => { e.target.style.border = '2px solid #00D4FF'; }}
                onBlur={e => { e.target.style.border = '2px solid rgba(255,255,255,0.08)'; }}
              />

              {/* Display name (signup only) */}
              {mode === 'signup' && (
                <input
                  type="text"
                  placeholder="اسم العرض (اختياري)"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleSubmit(); }}
                  className="w-full px-5 py-4 rounded-xl bg-[#0D1525]/90 border-2 border-white/10 text-white text-lg outline-none transition-all text-center"
                  onFocus={e => { e.target.style.border = '2px solid #A78BFA'; }}
                  onBlur={e => { e.target.style.border = '2px solid rgba(255,255,255,0.08)'; }}
                />
              )}

              {/* Password (hidden in recovery mode) */}
              {mode !== 'recovery' && (
                <input
                  type="password"
                  dir="ltr"
                  placeholder={mode === 'signup' ? 'كلمة المرور (6 أحرف على الأقل)' : 'كلمة المرور'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleSubmit(); }}
                  className="w-full px-5 py-4 rounded-xl bg-[#0D1525]/90 border-2 border-white/10 text-white text-lg outline-none transition-all text-left"
                  onFocus={e => { e.target.style.border = '2px solid #00D4FF'; }}
                  onBlur={e => { e.target.style.border = '2px solid rgba(255,255,255,0.08)'; }}
                />
              )}
            </div>

            {error && <p className="text-red-400 text-sm font-semibold">{error}</p>}

            <button onClick={handleSubmit} disabled={loading}
              className="w-full py-4 px-6 rounded-xl border-none text-black text-xl font-bold cursor-pointer transition-all"
              style={{
                background: success ? 'linear-gradient(135deg,#34D399,#059669)' : 'linear-gradient(135deg,#00D4FF,#0099BB)',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 24px rgba(0,212,255,0.4)', opacity: loading ? 0.7 : 1,
              }}>
              {loading ? '⏳ جاري التحميل...' : success ? '✅ جاي...' : mode === 'signup' ? 'إنشاء حساب' : mode === 'recovery' ? 'إرسال رابط الاسترجاع' : 'دخول →'}
            </button>

            <div className="flex flex-col gap-4 mt-2">
              {mode === 'login' ? (
                <>
                  <button onClick={() => resetForm('signup')} className="bg-none border-none text-cyan-400 text-base cursor-pointer underline">ليس لديك حساب؟ إنشاء حساب جديد</button>
                  <button onClick={() => resetForm('recovery')} className="bg-none border-none text-slate-400 text-base cursor-pointer">نسيت كلمة المرور؟</button>
                </>
              ) : (
                <button onClick={() => resetForm('login')} className="bg-none border-none text-slate-400 text-base cursor-pointer">العودة لتسجيل الدخول</button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}