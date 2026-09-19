import { Button } from '../../common/Button';
import { usePulse } from '../../../context/PulseContext';

export function VerifyEmailScreen() {
  const { activePulse, emailInput, setEmailInput, emailError, empEmailSubmit } =
    usePulse();

  if (!activePulse) return null;

  function handleSubmit(e) {
    e.preventDefault();
    empEmailSubmit();
  }

  return (
    <div className="text-center py-6 sm:py-8 max-w-sm mx-auto">
      <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full mb-4">
        Verification
      </div>

      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-2 leading-snug">
        Verify your email
      </h2>
      <p className="text-xs sm:text-sm text-slate-500 mb-5">
        Enter the email address your invitation was sent to.
      </p>

      <form onSubmit={handleSubmit} className="mt-2">
        <input
          type="email"
          required
          autoFocus
          placeholder="you@company.com"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          className="w-full text-center text-sm font-medium border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all mb-3 shadow-xs"
        />

        {emailError && (
          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 px-3.5 py-1.5 rounded-lg mb-4">
            <svg className="w-3.5 h-3.5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{emailError}</span>
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full mt-2"
        >
          Continue
        </Button>
      </form>

      <p className="text-xs text-slate-400 font-medium mt-4">
        Your email is used to confirm survey access and maintain data integrity.
      </p>
    </div>
  );
}
