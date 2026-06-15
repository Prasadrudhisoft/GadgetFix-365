// src/components/shared/Spinner.jsx
import clsx from 'clsx';

export const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-[5px]',
  };

  return (
    <div
      className={clsx(
        'border-border border-t-brand rounded-full animate-spin',
        sizes[size],
        className
      )}
    />
  );
};

export default Spinner;