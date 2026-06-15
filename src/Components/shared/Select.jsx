// src/components/shared/Select.jsx
import { forwardRef } from 'react';
import clsx from 'clsx';

export const Select = forwardRef(({
  label,
  error,
  options = [],
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
      <select
        ref={ref}
        className={clsx(
          'w-full px-4 py-3 rounded-lg bg-bg2 border-[1.5px] border-border2',
          'font-manrope text-sm font-medium text-text',
          'focus:outline-none focus:border-brand focus:bg-white focus:shadow-[0_0_0_4px_rgba(29,78,216,0.1)]',
          'transition-all duration-200',
          error && 'border-danger',
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <span className="text-xs text-danger font-manrope font-semibold">
          {error}
        </span>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;