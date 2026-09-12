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
            className={`flex items-center gap-3.5 p-3.5 sm:p-4 rounded-xl border text-left font-medium text-sm sm:text-base transition-all duration-150 cursor-pointer ${
              isPicked
                ? 'bg-purple-50/60 border-purple-600 ring-1 ring-purple-600/40 shadow-2xs'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/40 shadow-2xs'
            }`}
          >
            <span
              className={`w-4 h-4 border flex items-center justify-center shrink-0 transition-colors ${
                multi ? 'rounded' : 'rounded-full'
              } ${isPicked ? 'border-purple-600 bg-purple-600 text-white' : 'border-slate-300 bg-white'}`}
            >
              {isPicked && (
                <span className="text-[10px] font-bold select-none">
                  ✓
                </span>
              )}
            </span>
            <span className="text-slate-900 font-semibold">{opt}</span>
          </button>
        );
      })}
    </div>
  );
}
