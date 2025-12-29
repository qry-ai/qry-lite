interface ICheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  label?: string;
  variant?: 'default' | 'primary' | 'success' | 'error' | 'warning';
}

const Checkbox = ({
  checked = false,
  onChange,
  disabled = false,
  className = "",
  label,
  variant = 'default',
  ...props
}: ICheckboxProps) => {
  const baseClasses = `
    relative w-5 h-5 rounded-md border
    transition-all duration-300 ease-out
    focus:outline-none focus:ring-2
  `;

  const variantClasses = {
    default: `
      border-slate-200/60 bg-white-50/80 dark:bg-slate-50/80 backdrop-blur-sm
      ${checked ? 'bg-slate-700 border-slate-700' : 'hover:bg-slate-100/90 hover:border-slate-300/80'}
      focus:ring-slate-300/50
    `,
    primary: `
      ${checked ? 'bg-blue-600 border-blue-600' : 'border-slate-200/60 bg-slate-50/80 hover:bg-blue-50 hover:border-blue-300'}
      focus:ring-blue-500/50
    `,
    success: `
      ${checked ? 'bg-green-600 border-green-600' : 'border-slate-200/60 bg-slate-50/80 hover:bg-green-50 hover:border-green-300'}
      focus:ring-green-500/50
    `,
    error: `
      ${checked ? 'bg-red-600 border-red-600' : 'border-slate-200/60 bg-slate-50/80 hover:bg-red-50 hover:border-red-300'}
      focus:ring-red-500/50
    `,
    warning: `
      ${checked ? 'bg-amber-500 border-amber-500' : 'border-slate-200/60 bg-slate-50/80 hover:bg-amber-50 hover:border-amber-300'}
      focus:ring-amber-500/50
    `,
  };

  const disabledClasses = disabled
    ? "opacity-40 cursor-not-allowed"
    : "cursor-pointer";

  const checkboxClasses = `${baseClasses} ${variantClasses[variant]} ${disabledClasses}`.trim();

  const labelClasses = `
    ml-2 text-sm font-medium text-white/80 light:text-slate-700
    transition-colors duration-300
    ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
  `;

  const handleChange = () => {
    if (!disabled && onChange) {
      onChange(!checked);
    }
  };

  return (
    <label className={`flex items-center ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        className="sr-only"
        {...props}
      />
      <div className={checkboxClasses}>
        {checked && (
          <svg
            className="absolute inset-0 w-full h-full p-0.5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      {label && <span className={labelClasses}>{label}</span>}
    </label>
  );
};

export { Checkbox };