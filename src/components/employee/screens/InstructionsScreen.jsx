import { Button } from '../../common/Button';
import { usePulse } from '../../../context/PulseContext';

export function InstructionsScreen() {
  const { activePulse, empStart } = usePulse();

  if (!activePulse) return null;

  const mins = Math.max(1, Math.round(activePulse.questions.length * 0.4 * 10) / 10);

  return (
    <div className="text-center py-6 sm:py-10 max-w-xl mx-auto">
      <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-3 leading-snug">
        {activePulse.name || "How's work going?"}
      </h2>

      <p className="text-sm sm:text-base text-slate-600 mb-6 leading-relaxed max-w-lg mx-auto">
        {activePulse.description ||
          "We'd like to understand how you're experiencing work right now."}
      </p>

      {/* Meta Row */}
      <div className="inline-flex items-center gap-3 text-xs font-semibold text-slate-600 bg-slate-100/80 px-4 py-1.5 rounded-full border border-slate-200/80 mb-8">
        <span>{activePulse.questions.length} questions</span>
        <span className="text-slate-300">·</span>
        <span>~{mins} min</span>
      </div>

      {/* Instructions list */}
      <div className="max-w-md mx-auto mb-8 bg-slate-50/70 border border-slate-200/70 rounded-2xl p-5 text-left space-y-3">
        <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-2 shrink-0" />
          <span>Answer candidly — responses are aggregated to help improve the team environment.</span>
        </div>
        <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-2 shrink-0" />
          <span>You can navigate back and adjust answers at any time prior to final submission.</span>
        </div>
      </div>

      <div className="max-w-xs mx-auto mb-6">
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={empStart}
        >
          Begin Survey →
        </Button>
      </div>

      {/* Privacy Notice */}
      <div className="inline-flex items-center gap-2 text-xs font-medium text-slate-600 bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-2xs">
        {activePulse.privacy === 'anonymous' ? (
          <>
            <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Responses are fully anonymous</span>
          </>
        ) : (
          <>
            <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Responses are attributed to your email</span>
          </>
        )}
      </div>
    </div>
  );
}
