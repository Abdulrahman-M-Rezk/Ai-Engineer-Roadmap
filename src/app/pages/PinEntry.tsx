import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';

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
  
  // Modals / Success states
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
    <div dir="rtl" className="noise-bg" style={{
      minHeight: '100vh', background: '#060A12',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Cairo', sans-serif", position: 'relative', overflow: 'hidden',
    }}>
      {/* Background glows */}
      <div style={{ position:'absolute', top:'20%', left:'50%', transform:'translateX(-50%)', width:600, height:600, background:'radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'10%', right:'10%', width:400, height:400, background:'radial-gradient(circle, rgba(167,139,250,0.06) 0%, transparent 70%)', pointerEvents:'none' }} />

      {/* Card */}
      <div className={`glass-card ${shake ? 'animate-shake' : ''}`} style={{
        width: '100%', maxWidth: 440, margin: '0 1rem', borderRadius: 24,
        border: `1px solid ${success ? 'rgba(52,211,153,0.4)' : 'rgba(0,212,255,0.15)'}`,
        padding: '48px 40px', textAlign: 'center', position: 'relative',
        boxShadow: success
          ? '0 0 60px rgba(52,211,153,0.3), 0 0 120px rgba(52,211,153,0.1)'
          : '0 0 40px rgba(0,212,255,0.08), 0 20px 60px rgba(0,0,0,0.5)',
        transition: 'box-shadow 0.4s ease',
      }}>
        {signupRecoveryCode ? (
          <div>
            <div className="animate-float" style={{ fontSize:64, marginBottom:20 }}>🎉</div>
            <h2 style={{ color:'#fff', fontSize:22, marginBottom:16 }}>تم إنشاء الحساب بنجاح!</h2>
            <p style={{ color:'#94A3B8', fontSize:14, marginBottom:24 }}>
              يرجى الاحتفاظ بكود الاسترجاع التالي في مكان آمن. ستحتاجه إذا نسيت الرقم السري.
            </p>
            <div style={{
              background:'rgba(255,255,255,0.1)', padding:'16px', borderRadius:12,
              fontSize:32, letterSpacing:4, fontWeight:900, color:'#34D399', marginBottom:32,
              userSelect:'all'
            }}>
              {signupRecoveryCode}
            </div>
            <button onClick={() => {
              // Auto-login after generating recovery code
              resetForm('login');
              handleSubmit(digits.join(''));
            }} style={{
              width:'100%', padding:'16px', borderRadius:14, border:'none',
              background: 'linear-gradient(135deg,#34D399,#059669)',
              color:'#000', fontSize:18, fontWeight:800, cursor:'pointer', fontFamily:"'Cairo', sans-serif"
            }}>
              دخول للوحة التحكم →
            </button>
          </div>
        ) : recoveredPin ? (
          <div>
            <div className="animate-float" style={{ fontSize:64, marginBottom:20 }}>🔓</div>
            <h2 style={{ color:'#fff', fontSize:22, marginBottom:16 }}>تم استرجاع الرقم السري</h2>
            <div style={{
              background:'rgba(255,255,255,0.1)', padding:'16px', borderRadius:12,
              fontSize:36, letterSpacing:8, fontWeight:900, color:'#00D4FF', marginBottom:32,
            }}>
              {recoveredPin}
            </div>
            <button onClick={() => resetForm('login')} style={{
              width:'100%', padding:'16px', borderRadius:14, border:'none',
              background: 'linear-gradient(135deg,#00D4FF,#0099BB)',
              color:'#000', fontSize:18, fontWeight:800, cursor:'pointer', fontFamily:"'Cairo', sans-serif"
            }}>
              العودة لتسجيل الدخول
            </button>
          </div>
        ) : (
          <>
            <div className="animate-float" style={{ fontSize:64, marginBottom:20, display:'block', lineHeight:1 }}>
              {mode === 'signup' ? '✨' : mode === 'recovery' ? '🔑' : '🔐'}
            </div>

            <h1 style={{
              background: 'linear-gradient(135deg, #00D4FF, #A78BFA)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              fontSize: 26, fontWeight: 800, marginBottom: 8, lineHeight: 1.4,
            }}>
              {mode === 'signup' ? 'إنشاء حساب جديد' : mode === 'recovery' ? 'استرجاع الرقم السري' : 'تسجيل دخول'}
            </h1>
            <p style={{ color:'#64748B', fontSize:14, marginBottom:36 }}>AI Engineer Roadmap · نظام شخصي</p>

            {/* Username input */}
            <div style={{ marginBottom: 20 }}>
              <input
                ref={usernameRef}
                type="text"
                placeholder="اسم المستخدم"
                value={username}
                onChange={e => setUsername(e.target.value)}
                style={{
                  width:'100%', padding:'14px 16px', borderRadius:14,
                  background: 'rgba(13,21,37,0.9)', border: '2px solid rgba(255,255,255,0.08)',
                  color:'#fff', fontSize:16, fontFamily:"'Cairo', sans-serif", outline:'none',
                  transition:'all 0.2s ease', 
                }}
                onFocus={e => { e.target.style.border='2px solid #00D4FF'; }}
                onBlur={e => { e.target.style.border='2px solid rgba(255,255,255,0.08)'; }}
              />
            </div>

            {mode === 'recovery' ? (
              <div style={{ marginBottom: 28 }}>
                <input
                  type="text"
                  placeholder="كود الاسترجاع (6 رموز)"
                  maxLength={6}
                  value={recoveryCodeInput}
                  onChange={e => setRecoveryCodeInput(e.target.value)}
                  style={{
                    width:'100%', padding:'14px 16px', borderRadius:14,
                    background: 'rgba(13,21,37,0.9)', border: '2px solid rgba(255,255,255,0.08)',
                    color:'#fff', fontSize:16, fontFamily:"'Cairo', sans-serif", outline:'none',
                    letterSpacing: 2, textAlign: 'center', transition:'all 0.2s ease', 
                  }}
                  onFocus={e => { e.target.style.border='2px solid #A78BFA'; }}
                  onBlur={e => { e.target.style.border='2px solid rgba(255,255,255,0.08)'; }}
                />
              </div>
            ) : (
              /* PIN inputs */
              <div style={{ display:'flex', gap:14, justifyContent:'center', marginBottom:28, direction:'ltr' }}>
                {digits.map((digit, i) => (
                  <input key={i}
                    ref={el => { inputRefs.current[i] = el; }}
                    type="password" inputMode="numeric" maxLength={1}
                    value={digit}
                    onChange={e => handlePinChange(i, e.target.value)}
                    onKeyDown={e => handleKeyDown(i, e)}
                    style={{
                      width:72, height:72, borderRadius:16,
                      background: 'rgba(13,21,37,0.9)',
                      border: digit ? '2px solid #00D4FF' : error ? '2px solid #F87171' : '2px solid rgba(255,255,255,0.08)',
                      color:'#00D4FF', fontSize:28, fontWeight:800, textAlign:'center',
                      fontFamily:"'Cairo', sans-serif", outline:'none', transition:'all 0.2s ease',
                      boxShadow: digit ? '0 0 20px rgba(0,212,255,0.35)' : 'none',
                      caretColor:'#00D4FF',
                    }}
                    onFocus={e => { e.target.style.border='2px solid #00D4FF'; e.target.style.boxShadow='0 0 24px rgba(0,212,255,0.5)'; }}
                    onBlur={e => { if (!digit) { e.target.style.border= error ? '2px solid #F87171' : '2px solid rgba(255,255,255,0.08)'; e.target.style.boxShadow='none'; } }}
                  />
                ))}
              </div>
            )}

            {error && <p style={{ color:'#F87171', fontSize:13, marginBottom:16, fontWeight:600 }}>{error}</p>}

            <button onClick={() => handleSubmit()} disabled={loading}
              style={{
                width:'100%', padding:'16px', borderRadius:14, border:'none',
                background: success ? 'linear-gradient(135deg,#34D399,#059669)' : 'linear-gradient(135deg,#00D4FF,#0099BB)',
                color:'#000', fontSize:18, fontWeight:800, fontFamily:"'Cairo', sans-serif",
                cursor: loading ? 'not-allowed' : 'pointer', transition:'all 0.3s ease',
                boxShadow:'0 4px 24px rgba(0,212,255,0.4)', opacity: loading ? 0.7 : 1,
              }}>
              {loading ? '⏳ جاري التحميل...' : success ? '✅ جاي...' : mode === 'signup' ? 'إنشاء حساب' : mode === 'recovery' ? 'استرجاع الـ PIN' : 'دخول →'}
            </button>

            <div style={{ marginTop:20, display:'flex', flexDirection:'column', gap:10 }}>
              {mode === 'login' ? (
                <>
                  <button onClick={() => resetForm('signup')} style={{ background:'none', border:'none', color:'#00D4FF', fontSize:13, cursor:'pointer', textDecoration:'underline', fontFamily:"'Cairo', sans-serif" }}>ليس لديك حساب؟ إنشاء حساب جديد</button>
                  <button onClick={() => resetForm('recovery')} style={{ background:'none', border:'none', color:'#94A3B8', fontSize:13, cursor:'pointer', fontFamily:"'Cairo', sans-serif" }}>نسيت الرقم السري؟</button>
                </>
              ) : (
                <button onClick={() => resetForm('login')} style={{ background:'none', border:'none', color:'#94A3B8', fontSize:13, cursor:'pointer', fontFamily:"'Cairo', sans-serif" }}>العودة لتسجيل الدخول</button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
