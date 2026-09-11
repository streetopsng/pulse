export function ChoiceList({ options = [], value, onChange, multi = false }) {
  return (
    <div className="flex flex-col gap-2.5 w-full">
      {options.map((opt, i) => {
        const isPicked = multi
          ? Array.isArray(value) && value.includes(i)
          : value === i;

        return (
          <button
            key={opt + i}
            type="button"
            onClick={() => onChange(i)}
            className={`flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl border-2 border-ink text-left font-bold text-sm sm:text-base transition-all duration-150 cursor-pointer ${
              isPicked
                ? 'bg-accent-soft translate-x-0.5 translate-y-0.5 shadow-[1px_1px_0px_#1B1224]'
                : 'bg-surface shadow-hard-sm hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard'
            }`}
          >
            <span
              className={`w-5 h-5 border-2 border-ink flex items-center justify-center shrink-0 transition-colors ${
                multi ? 'rounded-md' : 'rounded-full'
              } ${isPicked ? 'bg-accent' : 'bg-surface'}`}
            >
              {isPicked && (
                <span className="text-ink text-xs font-black select-none">
                  ✓
                </span>
              )}
            </span>
            <span className="text-ink">{opt}</span>
          </button>
        );
      })}
    </div>
  );
}
