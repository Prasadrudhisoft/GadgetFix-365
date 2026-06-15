// src/components/panels/PanelOverlay.jsx
import { motion, AnimatePresence } from 'framer-motion';

export const PanelOverlay = ({ onClick }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClick}
        className="fixed inset-0 bg-[rgba(5,12,26,0.5)] backdrop-blur-light z-[3000]"
      />
    </AnimatePresence>
  );
};