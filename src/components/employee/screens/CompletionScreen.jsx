import { useState } from 'react';
import { Button } from '../../common/Button';
import { usePulse } from '../../../context/PulseContext';
import { useGummyGum } from '../../../context/GummyGumContext';

export function CompletionScreen() {
  const { activePulse, setEmpScreen } = usePulse();
  const { ggSession } = useGummyGum();
  const [showThanksModal, setShowThanksModal] = useState(false);
  const isGummyGumParticipant = ggSession && !ggSession.isHost;

  function handleFinish() {
    if (isGummyGumParticipant) {
      window.close();
      setTimeout(() => setShowThanksModal(true), 400);
      return;
    }
    setEmpScreen('already');
  }

  return (
    <div className="text-center py-6 sm:py-8 max-w-sm mx-auto">
      {/* Checkmark Icon */}
      <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mx-auto mb-4 shadow-xs">
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-2">
        Thank you for your feedback
      </h2>
      <p className="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
        Your response has been recorded and aggregated to help improve the team experience.
      </p>

      {activePulse?.privacy === 'anonymous' && (
        <div className="inline-flex items-center gap-2 text-xs font-medium text-slate-600 bg-slate-100/80 px-4 py-1.5 rounded-full border border-slate-200/80 mb-6">
          <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>Your submission is completely anonymous</span>
        </div>
      )}

      <div>
        <Button
          variant="primary"
          size="sm"
          onClick={handleFinish}
        >
          {isGummyGumParticipant ? 'Done — You can close this tab' : 'Finish Session'}
        </Button>
      </div>

      {showThanksModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-5">
          <div className="bg-white border border-slate-200 rounded-2xl p-7 max-w-sm w-full text-center shadow-xl">
            <h3 className="font-bold text-lg text-slate-900 mb-2">Thanks for participating!</h3>
            <p className="text-slate-500 text-sm">You can close this tab now.</p>
          </div>
        </div>
      )}
    </div>
  );
}
