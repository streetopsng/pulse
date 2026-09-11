import { Button } from '../../common/Button';
import { usePulse } from '../../../context/PulseContext';

export function InviteScreen() {
  const { setEmpScreen } = usePulse();

  return (
    <div className="text-center py-6 sm:py-10 max-w-sm mx-auto">
      <div className="text-4xl sm:text-5xl mb-3">✉️</div>

      <div className="inline-flex items-center gap-1.5 font-extrabold text-xs tracking-wider uppercase text-accent-dark bg-accent-soft border-2 border-ink px-3 py-1 rounded-full mb-3">
        New invitation
      </div>

      <h2 className="font-display font-black text-2xl sm:text-3xl text-ink mb-2">
        You've been invited
      </h2>
      <p className="text-xs sm:text-sm text-ink-soft mb-8 leading-relaxed">
        Your team lead would like to hear how work is going. It only takes a couple of minutes to share your feedback.
      </p>

      <Button
        variant="primary"
        size="lg"
        className="w-full"
        onClick={() => setEmpScreen('welcome')}
      >
        Open Pulse Survey
      </Button>
    </div>
  );
}
