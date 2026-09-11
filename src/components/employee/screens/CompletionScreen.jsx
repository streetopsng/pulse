import { Button } from '../../common/Button';
import { usePulse } from '../../../context/PulseContext';

export function CompletionScreen() {
  const { activePulse, setEmpScreen } = usePulse();

  return (
    <div className="text-center py-6 sm:py-8 max-w-sm mx-auto">
      {/* Animated Check */}
      <div className="w-16 h-16 rounded-full bg-accent border-[2.5px] border-ink flex items-center justify-center text-3xl font-black text-ink mx-auto mb-4 shadow-hard-sm">
        ✓
      </div>

      <h2 className="font-display font-black text-2xl sm:text-3xl text-ink mb-2">
        Thanks for sharing.
      </h2>
      <p className="text-xs sm:text-sm text-ink-soft mb-6">
        Your response has been recorded and will help the team improve.
      </p>

      {activePulse?.privacy === 'anonymous' && (
        <div className="inline-flex items-center gap-2 text-xs font-bold text-ink bg-gray-soft px-4 py-2 rounded-full border border-ink mb-6">
          <span>🕶️</span>
          <span>Your response is completely anonymous</span>
        </div>
      )}

      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setEmpScreen('already')}
        >
          Done
        </Button>
      </div>
    </div>
  );
}
