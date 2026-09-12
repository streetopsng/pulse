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
              className={`flex-1 aspect-square max-w-[64px] rounded-xl border flex items-center justify-center transition-all duration-150 cursor-pointer ${
                isPicked
                  ? 'bg-purple-50 border-purple-600 ring-2 ring-purple-600/25 shadow-xs scale-105'
                  : 'bg-white border-slate-200 hover:border-purple-300 hover:bg-purple-50/20 shadow-2xs'
              }`}
            >
              <span className="text-2xl leading-none select-none">{emoji}</span>
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
