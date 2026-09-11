import { CheckIcon } from './Icons';

export function Stepper({ currentStepIndex = 0 }) {
  const steps = ['Create', 'Build', 'Configure', 'Deploy'];

  return (
    <nav aria-label="Progress" className="mb-8">
      <ol className="flex items-center flex-wrap gap-2 sm:gap-3">
        {steps.map((label, i) => {
          const isDone = i < currentStepIndex;
          const isCurrent = i === currentStepIndex;

          return (
            <li key={label} className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2">
                <span
                  className={`w-6 h-6 rounded-full border-2 border-ink text-[11px] font-black flex items-center justify-center select-none transition-colors shrink-0 ${
                    isDone
                      ? 'bg-mint text-white'
                      : isCurrent
                      ? 'bg-accent text-white'
                      : 'bg-surface text-ink-faint border-ink/40'
                  }`}
                >
                  {isDone ? <CheckIcon className="w-3 h-3 text-white" /> : i + 1}
                </span>
                <span
                  className={`text-xs font-black uppercase tracking-wider ${
                    isCurrent ? 'text-ink' : isDone ? 'text-ink-soft' : 'text-ink-faint'
                  }`}
                >
                  {label}
                </span>
              </div>

              {i < steps.length - 1 && (
                <span className="w-4 sm:w-8 h-[2px] bg-ink/20 shrink-0" aria-hidden="true" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
