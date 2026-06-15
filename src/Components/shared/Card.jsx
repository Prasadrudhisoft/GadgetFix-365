// src/components/shared/Card.jsx
import { motion } from 'framer-motion';
import clsx from 'clsx';

export const Card = ({
  children,
  className = '',
  hover = true,
  onClick,
  ...props
}) => {
  const Component = onClick ? motion.div : 'div';

  return (
    <Component
      className={clsx(
        'bg-card border-[1.5px] border-border rounded-lg p-6',
        'shadow-sm transition-all duration-300',
        hover && 'hover:shadow-xl hover:border-brand-mid hover:-translate-y-2',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      whileHover={onClick && hover ? { y: -8 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      {...props}
    >
      {children}
    </Component>
  );
};