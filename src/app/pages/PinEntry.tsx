import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { Copy } from 'lucide-react';

type AuthMode = 'login' | 'signup' | 'recovery';

export default function PinEntry() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [username, setUsername] = useState('');
  const [digits, setDigits] = useState(['', '', '', '']);
  const [recoveryCodeInput, setRecoveryCodeInput] = useState('');
  
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const [signupRecoveryCode, setSignupRecoveryCode] = useState<string | null>(null);
  const [recoveredPin, setRecoveredPin] = useState<string | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const usernameRef = useRef<HTMLInputElement>(null);
  const { login, signup, recoverPin } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    usernameRef.current?.focus();
  }, [mode]);

  const handlePinChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[index] = value.slice(-1);
    setDigits(newDigits);
    setError('');
    if (value && index < 3) inputRefs.current[index + 1]?.focus();
    if (index === 3 && value) {
      const pin = [...newDigits.slice(0, 3), value].join('');
      if (pin.length === 4) handleSubmit(pin);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) inputRefs.current[index - 1]?.focus();
    if (e.key === 'Enter') { const pin = digits.join(''); if (pin.length === 4) handleSubmit(pin); }
  };

  const handleSubmit = async (pinOverride?: string) => {
    if (!username.trim()) { setError('أدخل اسم المستخدم'); triggerShake(); return; }
    
    if (mode === 'recovery') {
      if (!recoveryCodeInput.trim()) { setError('أدخل كود الاسترجاع'); triggerShake(); return; }
      setLoading(true);
      const res = await recoverPin(username.trim(), recoveryCodeInput.trim());
      setLoading(false);
      if (res.success) {
        setRecoveredPin(res.pin!);
      } else {
        setError(res.error || 'خطأ في الاسترجاع');
        triggerShake();
      }
      return;
    }

    const pin = pinOverride || digits.join('');
    if (pin.length < 4) { setError('أدخل 4 أرقام'); triggerShake(); return; }
    
    setLoading(true);
    let res;
    if (mode === 'signup') {
      res = await signup(username.trim(), pin);
      setLoading(false);
      if (res.success) {
        setSignupRecoveryCode(res.recoveryCode!);
      } else {
        setError(res.error || 'اسم المستخدم محجوز، اختر اسماً آخر');
        triggerShake();
        setDigits(['', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } else {
      res = await login(username.trim(), pin);
      setLoading(false);
      if (res.success) {
        setSuccess(true);
        setTimeout(() => navigate('/dashboard'), 600);
      } else {
        setError(res.error || 'الرقم السري خاطئ أو اسم المستخدم غير صحيح');
        triggerShake();
        setDigits(['', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    }
  };

  const triggerShake = () => { setShake(true); setTimeout(() => setShake(false), 600); };

  const resetForm = (newMode: AuthMode) => {
    setMode(newMode);
    setError('');
    setDigits(['', '', '', '']);
    setRecoveryCodeInput('');
    setSignupRecoveryCode(null);
    setRecoveredPin(null);
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
        {signupRecoveryCode ? (
          <div className="flex flex-col gap-6">
            <div className="animate-float text-6xl mb-2">🎉</div>
            <h2 className="text-white text-2xl font-bold leading-normal">تم إنشاء الحساب بنجاح!</h2>
            
            <div className="bg-red-400/10 border border-red-400/50 rounded-xl p-5">
              <p className="text-red-300 text-sm font-bold m-0 leading-relaxed">
                ⚠️ تحذير هام: احتفظ بهذا الكود في مكان آمن جداً. إذا فقدت الرقم السري، فهذا الكود هو الطريقة الوحيدة لاسترجاع حسابك وتغيير رقمك السري لاحقاً!
              </p>
            </div>

            <div className="bg-white/10 p-5 rounded-xl text-3xl sm:text-4xl tracking-[4px] font-black text-emerald-400 select-all flex justify-center items-center">
              {signupRecoveryCode}
            </div>
            
            <button onClick={() => {
              navigator.clipboard.writeText(signupRecoveryCode);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }} className="flex items-center justify-center gap-2 w-full p-4 rounded-xl border border-emerald-400/40 bg-emerald-400/10 text-emerald-400 text-base font-bold cursor-pointer mb-2 transition-all">
              {copied ? 'تم النسخ ✓' : <><Copy size={18} /> نسخ الكود</>}
            </button>

            <button onClick={() => {
              resetForm('login');
              handleSubmit(digits.join(''));
            }} className="w-full p-4 rounded-xl border-none bg-gradient-to-r from-emerald-400 to-emerald-600 text-black text-lg font-black cursor-pointer">
              دخول للوحة التحكم →
            </button>
          </div>
        ) : recoveredPin ? (
          <div className="flex flex-col gap-6">
            <div className="animate-float text-6xl mb-2">🔓</div>
            <h2 className="text-white text-2xl font-bold leading-normal">تم استرجاع الرقم السري</h2>
            <div className="bg-white/10 p-5 rounded-xl text-4xl tracking-[8px] font-black text-cyan-400">
              {recoveredPin}
            </div>
            <button onClick={() => resetForm('login')} className="w-full p-4 rounded-xl border-none bg-gradient-to-r from-cyan-400 to-cyan-600 text-black text-lg font-black cursor-pointer">
              العودة لتسجيل الدخول
            </button>
          </div>
        ) : (
          <>
            <div className="animate-float text-6xl block leading-none">
              {mode === 'signup' ? '✨' : mode === 'recovery' ? '🔑' : '🔐'}
            </div>

            <div>
              <h1 className="font-black mb-3 leading-tight text-3xl sm:text-4xl" style={{
                background: 'linear-gradient(135deg, #00D4FF, #A78BFA)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>
                {mode === 'signup' ? 'إنشاء حساب جديد' : mode === 'recovery' ? 'استرجاع الرقم السري' : 'تسجيل دخول'}
              </h1>
              <p className="text-slate-400 text-base sm:text-lg">AI Engineer Roadmap · نظام شخصي</p>
            </div>

            {/* Username input */}
            <div>
              <input
                ref={usernameRef}
                type="text"
                placeholder="User_Name"
                value={username}
                onChange={e => setUsername(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (mode === 'recovery') {
                      (document.querySelector('input[placeholder*="كود الاسترجاع"]') as HTMLInputElement)?.focus();
                    } else {
                      inputRefs.current[0]?.focus();
                    }
                  }
                }}
                className="w-full px-5 py-4 rounded-xl bg-[#0D1525]/90 border-2 border-white/10 text-white text-lg outline-none transition-all text-center"
                onFocus={e => { e.target.style.border='2px solid #00D4FF'; }}
                onBlur={e => { e.target.style.border='2px solid rgba(255,255,255,0.08)'; }}
              />
            </div>

            {mode === 'recovery' ? (
              <div>
                <input
                  type="text"
                  placeholder="كود الاسترجاع (6 رموز)"
                  maxLength={6}
                  value={recoveryCodeInput}
                  onChange={e => setRecoveryCodeInput(e.target.value)}
                  className="w-full px-5 py-4 rounded-xl bg-[#0D1525]/90 border-2 border-white/10 text-white text-lg outline-none tracking-[2px] text-center transition-all"
                  onFocus={e => { e.target.style.border='2px solid #A78BFA'; }}
                  onBlur={e => { e.target.style.border='2px solid rgba(255,255,255,0.08)'; }}
                />
              </div>
            ) : (
              /* PIN inputs */
              <div className="flex gap-4 justify-center ltr">
                {digits.map((digit, i) => (
                  <input key={i}
                    ref={el => { inputRefs.current[i] = el; }}
                    type="password" inputMode="numeric" maxLength={1}
                    value={digit}
                    onChange={e => handlePinChange(i, e.target.value)}
                    onKeyDown={e => handleKeyDown(i, e)}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#0D1525]/90 text-cyan-400 text-3xl sm:text-4xl font-black text-center outline-none transition-all caret-cyan-400"
                    style={{
                      border: digit ? '2px solid #00D4FF' : error ? '2px solid #F87171' : '2px solid rgba(255,255,255,0.08)',
                      boxShadow: digit ? '0 0 20px rgba(0,212,255,0.35)' : 'none',
                    }}
                    onFocus={e => { e.target.style.border='2px solid #00D4FF'; e.target.style.boxShadow='0 0 24px rgba(0,212,255,0.5)'; }}
                    onBlur={e => { if (!digit) { e.target.style.border= error ? '2px solid #F87171' : '2px solid rgba(255,255,255,0.08)'; e.target.style.boxShadow='none'; } }}
                  />
                ))}
              </div>
            )}

            {error && <p className="text-red-400 text-sm font-semibold">{error}</p>}

            <button onClick={() => handleSubmit()} disabled={loading}
              className="w-full py-4 px-6 rounded-xl border-none text-black text-xl font-bold cursor-pointer transition-all"
              style={{
                background: success ? 'linear-gradient(135deg,#34D399,#059669)' : 'linear-gradient(135deg,#00D4FF,#0099BB)',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 24px rgba(0,212,255,0.4)', opacity: loading ? 0.7 : 1,
              }}>
              {loading ? '⏳ جاري التحميل...' : success ? '✅ جاي...' : mode === 'signup' ? 'إنشاء حساب' : mode === 'recovery' ? 'استرجاع الـ PIN' : 'دخول →'}
            </button>

            <div className="flex flex-col gap-4 mt-2">
              {mode === 'login' ? (
                <>
                  <button onClick={() => resetForm('signup')} className="bg-none border-none text-cyan-400 text-base cursor-pointer underline">ليس لديك حساب؟ إنشاء حساب جديد</button>
                  <button onClick={() => resetForm('recovery')} className="bg-none border-none text-slate-400 text-base cursor-pointer">نسيت الرقم السري؟</button>
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
