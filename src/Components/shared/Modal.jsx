// src/components/shared/Modal.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import clsx from 'clsx';
import { useScrollLock } from '@hooks/useScrollLock';

export const Modal = ({
  isOpen,
  onClose,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  className = '',
  title = '',
  subtitle = '',
  headerColor = 'brand',
  // When true, skip Modal's own padding + scroll wrapper around children.
  // Use this when the modal content owns its own header/body/footer flex
  // layout (flex-shrink-0 header, flex-1 overflow-y-auto body, flex-shrink-0
  // footer) — e.g. receipts, multi-section forms with sticky footers, etc.
  // Without this, nesting a second overflow-y-auto inside Modal's wrapper
  // creates a double-scroll container and breaks edge-to-edge headers/footers.
  fullBleed = false,
}) => {
  useScrollLock(isOpen);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Responsive sizes - smaller on desktop, full width on mobile
  const sizes = {
    sm: 'max-w-[90%] sm:max-w-sm',
    md: 'max-w-[92%] sm:max-w-md lg:max-w-lg',
    lg: 'max-w-[94%] sm:max-w-lg lg:max-w-2xl',
    xl: 'max-w-[95%] sm:max-w-xl lg:max-w-3xl',
    full: 'max-w-[96%] sm:max-w-4xl lg:max-w-5xl',
  };

  const headerColors = {
    brand: 'from-[#1d4ed8] to-[#2563eb]',
    green: 'from-[#059669] to-[#10b981]',
    pink: 'from-[#9d174d] to-[#be185d]',
    purple: 'from-[#7c3aed] to-[#6d28d9]',
    dark: 'from-[#1f2937] to-[#374151]',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className={clsx(
            'fixed inset-0 z-[9000] flex justify-center',
            'items-end sm:items-center',
            'p-3 pb-[calc(12px+env(safe-area-inset-bottom,0px))] sm:p-6 lg:p-8'
          )}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-[rgba(5,12,26,0.65)] backdrop-blur-medium"
            onClick={closeOnOverlayClick ? onClose : undefined}
          />

          {/* Modal box */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className={clsx(
              'relative bg-white w-full flex flex-col',
              'rounded-2xl sm:rounded-xl',
              sizes[size],
              'max-h-[calc(100dvh-24px)] sm:max-h-[calc(100dvh-48px)] lg:max-h-[calc(100dvh-64px)]',
              'shadow-xl overflow-hidden',
              className
            )}
          >
            {/* Optional Header */}
            {(title || subtitle) && (
              <div
                className={clsx(
                  'relative shrink-0',
                  'px-4 py-3 sm:px-6 sm:py-4 lg:px-7 lg:py-5',
                  'bg-gradient-to-r',
                  headerColors[headerColor] || headerColors.brand
                )}
              >
                {title && (
                  <h3 className="font-sora text-base sm:text-lg lg:text-xl font-extrabold text-white tracking-tight pr-8">
                    {title}
                  </h3>
                )}
                {subtitle && (
                  <p className="font-manrope text-xs sm:text-sm text-white/80 mt-1">
                    {subtitle}
                  </p>
                )}
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="absolute top-2 right-2 sm:top-3 sm:right-3 lg:top-4 lg:right-4 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center text-white z-10"
                    aria-label="Close"
                  >
                    <i className="fas fa-times text-xs sm:text-sm"></i>
                  </button>
                )}
              </div>
            )}

            {/* No header case — close button still present */}
            {!title && !subtitle && showCloseButton && (
              <button
                onClick={onClose}
                className="absolute top-2 right-2 sm:top-3 sm:right-3 lg:top-4 lg:right-4 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/10 hover:bg-black/20 transition-colors flex items-center justify-center text-text-2 z-10"
                aria-label="Close"
              >
                <i className="fas fa-times text-xs sm:text-sm"></i>
              </button>
            )}

            {/* Modal Content */}
            {fullBleed ? (
              // Caller owns the full flex-col layout (header / scrollable body / footer).
              // No padding, no extra scroll container — just hand over the space.
              <div className="flex-1 flex flex-col overflow-hidden min-h-0">
                {children}
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto custom-scroll">
                <div className="p-4 sm:p-5 lg:p-6">
                  {children}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// Add global styles
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .custom-scroll::-webkit-scrollbar {
    width: 5px;
  }
  .custom-scroll::-webkit-scrollbar-track {
    background: #f0f4ff;
    border-radius: 10px;
  }
  .custom-scroll::-webkit-scrollbar-thumb {
    background: #bfdbfe;
    border-radius: 10px;
  }
  .custom-scroll::-webkit-scrollbar-thumb:hover {
    background: #3b82f6;
  }
  
  .custom-scroll {
    scrollbar-width: thin;
    scrollbar-color: #bfdbfe #f0f4ff;
  }
  
  .backdrop-blur-medium {
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }
`;
if (!document.querySelector('#modal-styles')) {
  styleSheet.id = 'modal-styles';
  document.head.appendChild(styleSheet);
}

export default Modal;