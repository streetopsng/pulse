import { Button } from '../../common/Button';
import { usePulse } from '../../../context/PulseContext';

export function InstructionsScreen() {
  const { activePulse, empStart } = usePulse();

  if (!activePulse) return null;

  const mins = Math.max(1, Math.round(activePulse.questions.length * 0.4 * 10) / 10);

  return (
    <div className="text-center py-6 sm:py-8 max-w-md mx-auto">
      <h2 className="font-display font-black text-2xl sm:text-3xl text-ink mb-3 leading-snug">
        {activePulse.name || "How's work going?"}
      </h2>

      <p className="text-xs sm:text-sm text-ink-soft mb-5 leading-relaxed">
        {activePulse.description ||
          "We'd like to understand how you're experiencing work right now."}
      </p>

      {/* Meta Row */}
      <div className="inline-flex items-center gap-2.5 text-xs font-black text-ink-soft bg-gray-soft px-4 py-2 rounded-full border border-ink mb-6">
        <span>{activePulse.questions.length} questions</span>
        <span>·</span>
        <span>~{mins} min</span>
      </div>

      {/* Instructions list */}
      <div className="instr-list">
        <div className="instr-item">
          <span className="instr-dot" />
          <span>Answer honestly — there are no right or wrong answers.</span>
        </div>
        <div className="instr-item">
          <span className="instr-dot" />
          <span>You can go back and change an answer before submitting.</span>
        </div>
      </div>

      <div className="mb-6">
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={empStart}
        >
          Begin
        </Button>
      </div>

      {/* Privacy Notice */}
      <div className="inline-flex items-center gap-2 text-xs font-bold text-ink bg-gray-soft px-4 py-2.5 rounded-full border border-ink">
        {activePulse.privacy === 'anonymous' ? (
          <>
            <span>🕶️</span>
            <span>Your response is anonymous</span>
          </>
        ) : (
          <>
            <span>🪪</span>
            <span>Your response will be identified</span>
          </>
        )}
      </div>
    </div>
  );
}
