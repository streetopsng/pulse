import { Button } from '../../common/Button';
import { returnToGummyGum } from '../../../lib/gummygumSession';

export function SessionEndedScreen() {
  return (
    <div className="text-center py-8 sm:py-10 max-w-sm mx-auto">
      <div className="w-14 h-14 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 mx-auto mb-4 shadow-xs">
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.2}
            d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
          />
        </svg>
      </div>

      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-2">
        Session Ended
      </h2>
      <p className="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
        The host has ended this pulse session. Any response you already submitted has been
        saved — no further action is needed.
      </p>

      <Button variant="primary" size="sm" onClick={() => returnToGummyGum()}>
        Return to GummyGum
      </Button>
    </div>
  );
}
