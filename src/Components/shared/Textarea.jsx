// src/components/shared/Textarea.jsx
import { forwardRef } from 'react';
import clsx from 'clsx';

export const Textarea = forwardRef(({
  label,
  error,
  rows = 4,
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
      <textarea
        ref={ref}
        rows={rows}
        className={clsx(
          'w-full px-4 py-3 rounded-lg bg-bg2 border-[1.5px] border-border2',
          'font-manrope text-sm font-medium text-text',
          'placeholder:text-text-4',
          'focus:outline-none focus:border-brand focus:bg-white focus:shadow-[0_0_0_4px_rgba(29,78,216,0.1)]',
          'transition-all duration-200 resize-vertical',
          error && 'border-danger',
          className
        )}
        {...props}
      />
      {error && (
        <span className="text-xs text-danger font-manrope font-semibold">
          {error}
        </span>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;