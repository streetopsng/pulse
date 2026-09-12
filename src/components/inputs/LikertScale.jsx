import { LIKERT_OPTIONS } from '../../constants/questionTypes';
import { LIKERT_EMOJI } from '../../constants/directory';

export function LikertScale({ value, onChange }) {
  return (
    <div className="flex flex-col gap-2.5 w-full">
      {LIKERT_OPTIONS.map((opt, i) => {
        const isPicked = value === i;
        const emoji = LIKERT_EMOJI[i] || '';
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(i)}
            className={`flex items-center gap-3.5 p-3.5 sm:p-4 rounded-xl border text-left font-medium text-sm sm:text-base transition-all duration-150 cursor-pointer ${
              isPicked
                ? 'bg-purple-50/60 border-purple-600 ring-1 ring-purple-600/40 shadow-2xs'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/40 shadow-2xs'
            }`}
          >
            <span
              className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                isPicked ? 'border-purple-600 bg-purple-600' : 'border-slate-300 bg-white'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full bg-white transition-opacity ${
                  isPicked ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </span>
            <span className="text-base leading-none shrink-0 select-none">{emoji}</span>
            <span className="text-slate-900 font-semibold">{opt}</span>
          </button>
        );
      })}
    </div>
  );
}
