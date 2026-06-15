// src/components/home/HeroFloatingCard.jsx
import { motion } from 'framer-motion';
import clsx from 'clsx';

const colorClasses = {
  purple: 'bg-brand-light text-brand',
  green: 'bg-green-light text-green',
  orange: 'bg-orange-light text-orange',
};

export const HeroFloatingCard = ({ icon, color, title, subtitle, position, delay = 0 }) => {
  const positionClasses = {
    'card-1': 'top-[20%] left-[-60px] lg:left-[-60px]',
    'card-2': 'bottom-[25%] right-[-40px] lg:right-[-40px]',
    'card-3': 'top-[60%] left-[-40px] lg:left-[-40px]',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 + delay * 0.3, duration: 0.5 }}
      className={clsx(
        'absolute hidden md:flex bg-[rgba(255,255,255,0.97)] backdrop-blur-xl rounded-lg p-3.5 shadow-xl items-center gap-3',
        'border border-[rgba(29,78,216,0.1)]',
        'animate-float-card',
        positionClasses[position]
      )}
      style={{ animationDelay: `${delay}s` }}
    >
      <div
        className={clsx(
          'w-[42px] h-[42px] rounded-lg flex items-center justify-center text-[17px] flex-shrink-0',
          colorClasses[color]
        )}
      >
        <i className={icon}></i>
      </div>
      <div>
        <h4 className="font-sora text-xs font-bold text-text mb-0.5">{title}</h4>
        <p className="text-[11px] text-text-4 font-medium">{subtitle}</p>
      </div>
    </motion.div>
  );
};