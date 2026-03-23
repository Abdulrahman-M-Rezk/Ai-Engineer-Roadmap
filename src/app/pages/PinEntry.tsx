import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';

export default function PinEntry() {
  const [digits, setDigits] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { authenticate } = useApp();
  const navigate = useNavigate();
  const isFirstTime = !localStorage.getItem('ai-roadmap-pin');

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
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
    const pin = pinOverride || digits.join('');
    if (pin.length < 4) { setError('أدخل 4 أرقام'); triggerShake(); return; }
    setLoading(true);
    const ok = await authenticate(pin);
    setLoading(false);
    if (ok) {
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 600);
    } else {
      setError('❌ خطأ في الاتصال — جرب تاني');
      triggerShake();
      setDigits(['', '', '', '']);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  };

  const triggerShake = () => { setShake(true); setTimeout(() => setShake(false), 600); };

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
        <div className="animate-float" style={{ fontSize:64, marginBottom:20, display:'block', lineHeight:1 }}>🔐</div>

        <h1 style={{
          background: 'linear-gradient(135deg, #00D4FF, #A78BFA)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          fontSize: 26, fontWeight: 800, marginBottom: 8, lineHeight: 1.4,
        }}>
          أدخل الـ PIN بتاعك
        </h1>
        <p style={{ color:'#64748B', fontSize:14, marginBottom:36 }}>AI Engineer Roadmap · نظام شخصي</p>

        {/* PIN inputs */}
        <div style={{ display:'flex', gap:14, justifyContent:'center', marginBottom:28, direction:'ltr' }}>
          {digits.map((digit, i) => (
            <input key={i}
              ref={el => { inputRefs.current[i] = el; }}
              type="password" inputMode="numeric" maxLength={1}
              value={digit}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              style={{
                width:72, height:72, borderRadius:16,
                background: 'rgba(13,21,37,0.9)',
                border: digit ? '2px solid #00D4FF' : error ? '2px solid #F87171' : '2px solid rgba(255,255,255,0.08)',
                color:'#00D4FF', fontSize:28, fontWeight:800, textAlign:'center',
                fontFamily:"'Cairo', sans-serif", outline:'none', transition:'all 0.2s ease',
                boxShadow: digit ? '0 0 20px rgba(0,212,255,0.35)' : error ? '0 0 15px rgba(248,113,113,0.3)' : 'none',
                caretColor:'#00D4FF',
              }}
              onFocus={e => { e.target.style.border='2px solid #00D4FF'; e.target.style.boxShadow='0 0 24px rgba(0,212,255,0.5)'; }}
              onBlur={e => { if (!digit) { e.target.style.border = error ? '2px solid #F87171' : '2px solid rgba(255,255,255,0.08)'; e.target.style.boxShadow = error ? '0 0 15px rgba(248,113,113,0.3)' : 'none'; } }}
            />
          ))}
        </div>

        {error && <p style={{ color:'#F87171', fontSize:13, marginBottom:16, fontWeight:600 }}>{error}</p>}

        <button onClick={() => handleSubmit()} disabled={loading}
          style={{
            width:'100%', padding:'16px', borderRadius:14, border:'none',
            background: success ? 'linear-gradient(135deg,#34D399,#059669)' : 'linear-gradient(135deg,#00D4FF,#0099BB)',
            color:'#000', fontSize:18, fontWeight:800, fontFamily:"'Cairo', sans-serif",
            cursor: loading ? 'not-allowed' : 'pointer', transition:'all 0.3s ease',
            boxShadow:'0 4px 24px rgba(0,212,255,0.4)', opacity: loading ? 0.7 : 1,
          }}>
          {loading ? '⏳ جاري التحقق...' : success ? '✅ جاي...' : 'دخول →'}
        </button>

        <p style={{ color:'#475569', fontSize:12, marginTop:20, lineHeight:1.7 }}>
          {isFirstTime ? <>أول مرة؟ أدخل أي PIN من 4 أرقام وهيتحفظ ✨</> : <>عندك PIN محفوظ — أدخله للدخول</>}
        </p>
      </div>
    </div>
  );
}
