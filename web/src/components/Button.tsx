interface IButtonProps {
  href?: string;
  children?: any;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  variant?: 'default' | 'primary' | 'success' | 'error' | 'warning';
}

const Button = ({
  children,
  href,
  onClick,
  disabled = false,
  className = "",
  variant = 'default',
  ...props
}: IButtonProps) => {
  const baseClasses = `
    flex items-center justify-center px-6 py-3
    font-medium text-sm rounded-xl border
    transition-all duration-300 ease-out
    active:scale-[0.98]
    focus:outline-none focus:ring-2
  `;

  const variantClasses = {
    default: `
      text-slate-700 border-slate-200/60
      bg-slate-50/80 backdrop-blur-sm
      hover:bg-slate-100/90 hover:border-slate-300/80 hover:text-slate-800
      active:bg-slate-200/70
      focus:ring-slate-300/50
    `,
    primary: `
      text-white border-blue-600
      bg-blue-600
      hover:bg-blue-700 hover:border-blue-700
      active:bg-blue-800
      focus:ring-blue-500/50
    `,
    success: `
      text-white border-green-600
      bg-green-600
      hover:bg-green-700 hover:border-green-700
      active:bg-green-800
      focus:ring-green-500/50
    `,
    error: `
      text-white border-red-600
      bg-red-600
      hover:bg-red-700 hover:border-red-700
      active:bg-red-800
      focus:ring-red-500/50
    `,
    warning: `
      text-white border-amber-500
      bg-amber-500
      hover:bg-amber-600 hover:border-amber-600
      active:bg-amber-700
      focus:ring-amber-500/50
    `,
  };

  const disabledClasses = disabled
    ? "opacity-40 cursor-not-allowed hover:bg-opacity-100 active:scale-100"
    : "cursor-pointer";

  const finalClasses = `${baseClasses} ${variantClasses[variant]} ${disabledClasses} ${className}`.trim();

  if (href && !disabled) {
    return (
      <a href={href} className={finalClasses} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button
      className={finalClasses}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export { Button };