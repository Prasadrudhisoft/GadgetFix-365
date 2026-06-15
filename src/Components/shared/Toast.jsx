// src/components/shared/Toast.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { useUI } from '@hooks/useUI';
import clsx from 'clsx';

const toastIcons = {
  success: '✅',
  error: '❌',
  warning: '⚠️',
  info: 'ℹ️',
};

const toastColors = {
  success: 'border-l-green-2',
  error: 'border-l-danger-2',
  warning: 'border-l-warning-2',
  info: 'border-l-brand-3',
};

export const Toast = () => {
  const { toasts } = useUI();

  return (
    <div className="fixed bottom-6 right-6 z-[99999] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className={clsx(
              'bg-white text-text px-5 py-4 rounded-lg font-manrope text-sm font-bold shadow-xl',
              'flex items-center gap-3 min-w-[280px] max-w-[380px] border-[1.5px] border-border border-l-4',
              'pointer-events-auto',
              toastColors[toast.type]
            )}
          >
            <span className="text-xl flex-shrink-0">{toastIcons[toast.type]}</span>
            <span className="flex-1">{toast.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};