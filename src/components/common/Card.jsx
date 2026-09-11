export function Card({
  children,
  className = '',
  hoverEffect = false,
  onClick,
  ...props
}) {
  const hoverStyles = hoverEffect
    ? 'cursor-pointer transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard-lg'
    : '';

  return (
    <div
      onClick={onClick}
      className={`bg-surface border-2 border-ink rounded-3xl shadow-hard ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
