import { Button } from '../../common/Button';
import { usePulse } from '../../../context/PulseContext';

export function InviteScreen() {
  const { activePulse, setEmpScreen } = usePulse();

  const isLive = activePulse?.delivery === 'live';

  return (
    <div className="text-center py-6 sm:py-10 max-w-sm mx-auto">
      <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 mx-auto mb-4 shadow-xs">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>

      <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-purple-700 bg-purple-50 border border-purple-200 px-3 py-1 rounded-full mb-3">
        Pulse Invitation
      </div>

      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-2 leading-snug">
        You're invited to share feedback
      </h2>
      <p className="text-xs sm:text-sm text-slate-500 mb-8 leading-relaxed">
        {isLive
          ? 'Your team lead is running this pulse live in realtime. It takes less than two minutes.'
          : 'Your team lead would like your feedback on the work experience. Answer whenever works best for you.'}
      </p>

      <Button
        variant="primary"
        size="lg"
        className="w-full"
        onClick={() => setEmpScreen('verify-email')}
      >
        Open Pulse Survey
      </Button>
    </div>
  );
}
