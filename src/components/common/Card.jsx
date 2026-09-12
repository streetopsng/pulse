export function Card({
  children,
  className = '',
  hoverEffect = false,
  onClick,
  ...props
}) {
  const hoverStyles = hoverEffect
    ? 'cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-accent/40'
    : '';

  return (
    <div
      onClick={onClick}
      className={`bg-surface border border-ink/10 rounded-2xl shadow-sm ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
