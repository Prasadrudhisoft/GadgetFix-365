// src/components/shared/Accordion.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

export const AccordionItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div
      className={clsx(
        'bg-bg border-[1.5px] border-border rounded-lg mb-2.5 overflow-hidden',
        'transition-all duration-300 shadow-xs',
        'hover:border-border2',
        isOpen && 'border-brand bg-white shadow-md'
      )}
    >
      <button
        className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left hover:bg-brand-light transition-colors"
        onClick={onClick}
      >
        <span className="font-manrope text-[15px] font-bold text-text flex-1">
          {question}
        </span>
        <div
          className={clsx(
            'w-[30px] h-[30px] rounded-md bg-bg3 flex items-center justify-center text-xs text-text-4',
            'transition-all duration-300',
            isOpen && 'bg-brand text-white rotate-180'
          )}
        >
          <i className="fas fa-chevron-down"></i>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="px-6 pb-5 font-manrope text-sm text-text-3 leading-relaxed font-medium">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Accordion = ({ items }) => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div>
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          question={item.question}
          answer={item.answer}
          isOpen={openIndex === index}
          onClick={() => setOpenIndex(openIndex === index ? null : index)}
        />
      ))}
    </div>
  );
};
export default Accordion;