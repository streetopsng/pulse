export function Chip({
  children,
  active = false,
  onClick,
  className = '',
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
        active
          ? 'bg-slate-900 text-white shadow-xs'
          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
      } ${className}`}
    >
      {children}
    </button>
  );
}
