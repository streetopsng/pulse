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
    'inline-flex items-center justify-center font-semibold transition-all duration-150 cursor-pointer select-none whitespace-nowrap focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2';

  let variantStyles = '';
  if (variant === 'primary') {
    variantStyles =
      'bg-accent hover:bg-accent-dark text-white rounded-xl shadow-sm shadow-purple-600/25 hover:shadow-md hover:shadow-purple-600/35 hover:-translate-y-0.5 active:translate-y-0 transition-all border border-accent-dark/40';
  } else if (variant === 'dark') {
    variantStyles =
      'bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all border border-slate-900';
  } else if (variant === 'mint') {
    variantStyles =
      'bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm shadow-emerald-600/20 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all border border-emerald-700/40';
  } else if (variant === 'ghost') {
    variantStyles =
      'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-semibold border border-slate-200 hover:border-slate-300 rounded-xl shadow-2xs hover:shadow-xs transition-all';
  } else if (variant === 'icon') {
    variantStyles =
      'w-9 h-9 p-0 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 shadow-2xs hover:shadow-xs transition-all';
  } else if (variant === 'text') {
    variantStyles =
      'bg-transparent text-slate-500 hover:text-purple-600 font-semibold p-0 text-xs sm:text-sm transition-colors underline-offset-4 hover:underline';
  }

  let sizeStyles = 'px-5 py-2.5 text-sm';
  if (size === 'sm') {
    sizeStyles = 'px-3.5 py-1.5 text-xs';
  } else if (size === 'lg') {
    sizeStyles = 'px-7 py-3 text-base';
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
