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
      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-extrabold border-2 border-ink transition-all duration-150 cursor-pointer ${
        active
          ? 'bg-accent text-ink shadow-hard-sm'
          : 'bg-surface text-ink hover:bg-accent-soft'
      } ${className}`}
    >
      {children}
    </button>
  );
}
