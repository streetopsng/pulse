import { Button } from '../../common/Button';
import { usePulse } from '../../../context/PulseContext';

export function InviteScreen() {
  const { activePulse, setEmpScreen } = usePulse();

  const isLive = activePulse?.delivery === 'live';

  return (
    <div className="text-center py-6 sm:py-10 max-w-sm mx-auto">
      <div className="text-4xl sm:text-5xl mb-3">✉️</div>

      <div className="inline-flex items-center gap-1.5 font-extrabold text-xs tracking-wider uppercase text-accent-dark bg-accent-soft border-2 border-ink px-3.5 py-1.5 rounded-full mb-3">
        New message
      </div>

      <h2 className="font-display font-black text-2xl sm:text-3xl text-ink mb-2 leading-snug">
        You've been invited to a pulse
      </h2>
      <p className="text-xs sm:text-sm text-ink-soft mb-8 leading-relaxed">
        {isLive
          ? 'Your host is running this one live and will see responses as they come in. It only takes a couple of minutes.'
          : 'Your team lead would like to hear how work is going. Answer whenever works for you — it only takes a couple of minutes.'}
      </p>

      <Button
        variant="primary"
        size="lg"
        className="w-full"
        onClick={() => setEmpScreen('verify-email')}
      >
        Open Pulse
      </Button>
    </div>
  );
}
