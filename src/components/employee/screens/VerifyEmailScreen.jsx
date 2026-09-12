import { Button } from '../../common/Button';
import { usePulse } from '../../../context/PulseContext';

export function VerifyEmailScreen() {
  const { activePulse, emailInput, setEmailInput, emailError, empEmailSubmit } =
    usePulse();

  if (!activePulse) return null;

  const hintEmail = activePulse.invitedEmployees?.[0]?.email || 'alex.kim@gummygum.com';

  function handleSubmit(e) {
    e.preventDefault();
    empEmailSubmit();
  }

  return (
    <div className="text-center py-6 sm:py-8 max-w-sm mx-auto">
      <div className="inline-flex items-center gap-1.5 font-extrabold text-xs tracking-wider uppercase text-accent-dark bg-accent-soft border-2 border-ink px-3.5 py-1.5 rounded-full mb-4">
        Confirm it's you
      </div>

      <h2 className="font-display font-black text-2xl sm:text-3xl text-ink mb-2 leading-snug">
        Enter the email this was sent to
      </h2>

      <form onSubmit={handleSubmit} className="mt-4">
        <input
          type="email"
          required
          autoFocus
          placeholder="you@gummygum.com"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          className="w-full text-center text-sm sm:text-base font-semibold border-2 border-ink rounded-xl px-4 py-3.5 bg-surface text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-accent mb-3"
        />

        {emailError && (
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-ink bg-gray-soft px-3.5 py-2 rounded-full border border-ink mb-4">
            <span>⚠️</span>
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

      <p className="text-xs text-ink-faint font-semibold mt-4">
        Hint: try{' '}
        <button
          type="button"
          onClick={() => setEmailInput(hintEmail)}
          className="font-bold text-ink underline cursor-pointer hover:text-accent-dark"
        >
          {hintEmail}
        </button>
      </p>
    </div>
  );
}
