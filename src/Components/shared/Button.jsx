// src/components/shared/Button.jsx
import { motion } from 'framer-motion';
import clsx from 'clsx';

const variants = {
  primary: 'bg-gradient-brand text-white shadow-brand hover:shadow-[0_14px_42px_rgba(29,78,216,0.48)]',
  secondary: 'bg-brand-light text-brand border-[1.5px] border-border2 hover:bg-brand hover:text-white hover:border-brand',
  ghost: 'bg-transparent text-text-3 hover:text-brand hover:bg-brand-light',
  danger: 'bg-danger-light text-danger border border-danger/20 hover:bg-danger hover:text-white hover:border-danger',
  success: 'bg-gradient-success text-white shadow-[0_4px_14px_rgba(5,150,105,0.32)] hover:opacity-90',
  outline: 'bg-white text-text-3 border-[1.5px] border-border2 hover:bg-bg2 hover:border-brand hover:text-brand',
};

const sizes = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
  xl: 'px-8 py-4 text-base',
};

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  onClick,
  type = 'button',
  ...props
}) => {
  const baseClasses = 'rounded-lg font-manrope font-bold transition-all duration-300 inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed';

  return (
    <motion.button
      type={type}
      className={clsx(
        baseClasses,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || loading}
      onClick={onClick}
      whileHover={{ y: disabled || loading ? 0 : -2, scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      {...props}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      )}
      {!loading && icon && iconPosition === 'left' && <span>{icon}</span>}
      <span>{children}</span>
      {!loading && icon && iconPosition === 'right' && <span>{icon}</span>}
    </motion.button>
  );
};

export default Button;