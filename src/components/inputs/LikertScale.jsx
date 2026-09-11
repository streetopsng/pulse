import { LIKERT_OPTIONS } from '../../constants/questionTypes';

export function LikertScale({ value, onChange }) {
  return (
    <div className="flex flex-col gap-2.5 w-full">
      {LIKERT_OPTIONS.map((opt, i) => {
        const isPicked = value === i;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(i)}
            className={`flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl border-2 border-ink text-left font-bold text-sm sm:text-base transition-all duration-150 cursor-pointer ${
              isPicked
                ? 'bg-accent-soft translate-x-0.5 translate-y-0.5 shadow-[1px_1px_0px_#1B1224]'
                : 'bg-surface shadow-hard-sm hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full border-2 border-ink flex items-center justify-center shrink-0 transition-colors ${
                isPicked ? 'bg-accent' : 'bg-surface'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full bg-ink transition-opacity ${
                  isPicked ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </span>
            <span className="text-ink">{opt}</span>
          </button>
        );
      })}
    </div>
  );
}
