// src/components/shared/Input.jsx
import { forwardRef } from 'react';
import clsx from 'clsx';

export const Input = forwardRef(({
  label,
  error,
  icon,
  type = 'text',
  className = '',
  containerClassName = '',
  ...props
}, ref) => {
  return (
    <div className={clsx('flex flex-col gap-1.5', containerClassName)}>
      {label && (
        <label className="font-manrope text-xs font-bold text-text-3 uppercase tracking-wide">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-4 text-sm">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={clsx(
            'w-full px-4 py-3 rounded-lg bg-bg2 border-[1.5px] border-border2',
            'font-manrope text-sm font-medium text-text',
            'placeholder:text-text-4',
            'focus:outline-none focus:border-brand focus:bg-white focus:shadow-[0_0_0_4px_rgba(29,78,216,0.1)]',
            'transition-all duration-200',
            icon && 'pl-11',
            error && 'border-danger',
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <span className="text-xs text-danger font-manrope font-semibold">
          {error}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;