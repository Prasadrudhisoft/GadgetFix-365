// src/components/layout/UserDropdown.jsx
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@hooks/useAuth';
import { useUI } from '@hooks/useUI';
import { getInitials } from '@utils/helpers';

// Props:
//   user     — user object from useAuth
//   mobile   — pass true when rendered inside MobileDrawer so the
//              avatar is always visible (removes the hidden lg:block guard)
export const UserDropdown = ({ user, mobile = false }) => {
  const { logout } = useAuth();
  const { openPanel } = useUI();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close on click/touch outside
  useEffect(() => {
    const handleOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    // mousedown for desktop, touchstart for mobile
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchstart', handleOutside);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
    };
  }, []);

  const initials = getInitials(user?.name);

  const handleOpenOrders = () => {
    openPanel('orders');
    setIsOpen(false);
  };

  const handleOpenProfile = () => {
    openPanel('profile');
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    // `hidden lg:block` only when used in the desktop Navbar.
    // When mobile=true (inside MobileDrawer) the wrapper is always visible.
    <div
      className={mobile ? 'relative' : 'relative hidden lg:block'}
      ref={dropdownRef}
    >
      <motion.button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-10 h-10 rounded-full bg-gradient-brand text-white text-sm font-extrabold border-[2.5px] border-brand-light shadow-brand flex items-center justify-center font-sora cursor-pointer"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
      >
        {initials}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            // On mobile the dropdown opens upward to avoid going off-screen
            className={`absolute ${mobile ? 'bottom-[calc(100%+10px)]' : 'top-[calc(100%+14px)]'} right-0 bg-white border border-border rounded-lg p-2 min-w-[228px] shadow-xl z-[1001]`}
          >
            {/* Header */}
            <div className="px-3.5 py-3 border-b border-border mb-1.5">
              <div className="font-sora text-sm font-bold text-text">
                {user?.name || 'User'}
              </div>
              <div className="text-xs text-text-4 font-medium mt-0.5">
                {user?.role === 'admin' ? 'Administrator' : 'Customer'}
              </div>
            </div>

            <button
              type="button"
              onClick={handleOpenOrders}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 font-manrope text-[13.5px] font-semibold text-text-2 rounded-lg transition-all duration-200 hover:bg-brand-light hover:text-brand text-left cursor-pointer"
            >
              📋 My Orders
            </button>

            <button
              type="button"
              onClick={handleOpenProfile}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 font-manrope text-[13.5px] font-semibold text-text-2 rounded-lg transition-all duration-200 hover:bg-brand-light hover:text-brand text-left cursor-pointer"
            >
              👤 My Profile
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 font-manrope text-[13.5px] font-semibold text-danger rounded-lg transition-all duration-200 hover:bg-danger-light hover:text-danger text-left cursor-pointer"
            >
              ⏻ Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};