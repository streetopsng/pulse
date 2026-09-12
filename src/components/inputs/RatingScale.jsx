import { RATING_EMOJI } from '../../constants/directory';

export function RatingScale({ max = 5, value, onChange }) {
  const numbers = Array.from({ length: max }, (_, i) => i + 1);

  return (
    <div className="w-full">
      <div className="flex gap-2 sm:gap-3 justify-between">
        {numbers.map((n, i) => {
          const isPicked = value === n;
          const emoji = RATING_EMOJI[Math.min(i, RATING_EMOJI.length - 1)];
          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              className={`flex-1 aspect-square max-w-[60px] rounded-2xl border-[2.5px] border-ink font-display font-bold text-xl sm:text-2xl flex items-center justify-center transition-all duration-150 cursor-pointer ${
                isPicked
                  ? 'bg-accent text-ink translate-x-0.5 translate-y-0.5 shadow-[1px_1px_0px_#1B1224]'
                  : 'bg-surface text-ink shadow-hard-sm hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard'
              }`}
            >
              <span className="text-2xl leading-none">{emoji}</span>
            </button>
          );
        })}
      </div>
      <div className="flex justify-between text-xs font-bold text-ink-soft mt-3 px-1">
        <span>😣 Strongly disagree</span>
        <span>😄 Strongly agree</span>
      </div>
    </div>
  );
}
