import { usePulse } from '../../../context/PulseContext';

export function AlreadyScreen() {
  const { activePulse } = usePulse();

  return (
    <div className="text-center py-8 sm:py-10 max-w-sm mx-auto">
      <div className="text-4xl mb-4">✓</div>
      <h2 className="font-display font-black text-2xl sm:text-3xl text-ink mb-2">
        Already completed
      </h2>
      <p className="text-xs sm:text-sm text-ink-soft leading-relaxed">
        You've already submitted {activePulse ? `"${activePulse.name}"` : 'this pulse'}. There's nothing more to do here.
      </p>
    </div>
  );
}
