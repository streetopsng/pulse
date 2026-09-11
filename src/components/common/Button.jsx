export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  title,
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center font-extrabold transition-all duration-150 cursor-pointer select-none whitespace-nowrap focus-visible:outline-3 focus-visible:outline-accent focus-visible:outline-offset-2';

  let variantStyles = '';
  if (variant === 'primary') {
    variantStyles =
      'bg-accent text-ink border-[2.5px] border-ink rounded-full shadow-hard-sm hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#1B1224]';
  } else if (variant === 'dark') {
    variantStyles =
      'bg-ink text-white border-[2.5px] border-ink rounded-full shadow-hard-sm hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#1B1224]';
  } else if (variant === 'mint') {
    variantStyles =
      'bg-mint text-white border-[2.5px] border-ink rounded-full shadow-hard-sm hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#1B1224]';
  } else if (variant === 'ghost') {
    variantStyles =
      'bg-surface text-ink border-2 border-line-soft rounded-full hover:border-ink shadow-none';
  } else if (variant === 'icon') {
    variantStyles =
      'w-9 h-9 p-0 rounded-full bg-surface text-ink border-2 border-ink shadow-hard-sm hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#1B1224]';
  } else if (variant === 'text') {
    variantStyles =
      'bg-transparent text-ink border-none p-0 text-xs sm:text-sm font-extrabold underline underline-offset-4 decoration-accent decoration-2 hover:text-accent-dark shadow-none';
  }

  let sizeStyles = 'px-6 py-3 text-sm';
  if (size === 'sm') {
    sizeStyles = 'px-4 py-2 text-xs border-2';
  } else if (size === 'lg') {
    sizeStyles = 'px-8 py-3.5 text-base';
  } else if (variant === 'icon' || variant === 'text') {
    sizeStyles = '';
  }

  const disabledStyles = disabled ? 'opacity-40 pointer-events-none' : '';

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      title={title}
      className={`${baseStyles} ${variantStyles} ${sizeStyles} ${disabledStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
