import { useState, useRef, useEffect } from 'react';
import { Button } from '../../common/Button';
import { usePulse } from '../../../context/PulseContext';

export function JoinScreen() {
  const { setEmpScreen, loadPulseByCode } = usePulse();
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  function handleDigitChange(index, val) {
    const clean = val.replace(/\D/g, '');
    if (!clean) {
      const next = [...digits];
      next[index] = '';
      setDigits(next);
      return;
    }

    // Handle single character or pasted characters
    const chars = clean.split('');
    const next = [...digits];

    for (let i = 0; i < chars.length && index + i < 6; i++) {
      next[index + i] = chars[i];
    }
    setDigits(next);
    setError(null);

    // Focus next empty field
    const nextFocus = Math.min(index + chars.length, 5);
    inputRefs.current[nextFocus]?.focus();

    // Auto submit if all 6 filled
    if (next.every((d) => d !== '')) {
      submitCode(next.join(''));
    }
  }

  function handleKeyDown(index, e) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e) {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;

    const next = [...digits];
    for (let i = 0; i < pasted.length; i++) {
      next[i] = pasted[i];
    }
    setDigits(next);
    setError(null);

    if (pasted.length === 6) {
      submitCode(pasted);
    } else {
      inputRefs.current[pasted.length]?.focus();
    }
  }

  async function submitCode(codeToTest) {
    const fullCode = codeToTest || digits.join('');
    if (fullCode.length !== 6) {
      setError('Please enter all 6 digits of the session PIN.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const found = await loadPulseByCode(fullCode);
      if (found) {
        setEmpScreen('invite');
      } else {
        setError('No active pulse survey found for PIN ' + fullCode + '. Please verify with your host.');
      }
    } catch {
      setError('Unable to verify session PIN. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="text-center py-6 sm:py-8 max-w-sm mx-auto">
      <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto mb-4 shadow-xs">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      </div>

      <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full mb-3">
        Session PIN
      </div>

      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-2 leading-snug">
        Enter 6-digit Code
      </h2>
      <p className="text-xs sm:text-sm text-slate-500 mb-6">
        Your meeting host or manager will display this code on the presentation screen.
      </p>

      {/* 6 PIN Input Boxes */}
      <div className="flex justify-center items-center gap-2 mb-4" onPaste={handlePaste}>
        {digits.map((digit, idx) => (
          <input
            key={idx}
            ref={(el) => (inputRefs.current[idx] = el)}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            onChange={(e) => handleDigitChange(idx, e.target.value)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            className="w-11 h-13 text-center text-xl font-mono font-bold border border-slate-300 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 shadow-xs transition-all"
          />
        ))}
      </div>

      {error && (
        <div className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 px-3.5 py-1.5 rounded-lg mb-4 text-left">
          <svg className="w-3.5 h-3.5 text-rose-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <Button
        variant="primary"
        size="lg"
        className="w-full mt-2"
        disabled={loading || digits.some((d) => d === '')}
        onClick={() => submitCode()}
      >
        {loading ? 'Verifying PIN...' : 'Join Pulse Session →'}
      </Button>

      <button
        type="button"
        onClick={() => setEmpScreen('entry')}
        className="mt-4 text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
      >
        ← Back to Access Options
      </button>
    </div>
  );
}
