import { usePulse } from '../../../context/PulseContext';

export function AlreadyScreen() {
  const { activePulse } = usePulse();

  return (
    <div className="text-center py-8 sm:py-10 max-w-sm mx-auto">
      <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 mx-auto mb-4">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-2">
        Already Completed
      </h2>
      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
        You've already submitted your feedback for {activePulse ? `"${activePulse.name}"` : 'this session'}. No further actions are required.
      </p>
    </div>
  );
}
