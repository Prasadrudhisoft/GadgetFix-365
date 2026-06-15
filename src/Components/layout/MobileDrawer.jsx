// src/components/layout/MobileDrawer.jsx
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@hooks/useAuth';
import { useUI } from '@hooks/useUI';
import { useScrollLock } from '@hooks/useScrollLock';
import { scrollToSection, getInitials } from '@utils/helpers';

export const MobileDrawer = ({ onBookRepair, onOpenAuth }) => {
  const { isLoggedIn, user, logout } = useAuth();
  const { isMobileMenuOpen, closeMobileMenu, openPanel } = useUI();

  // ── FIX: use the shared counter-based hook instead of raw body.style ──
  useScrollLock(isMobileMenuOpen);

  const navLinks = [
    { label: 'Services',     id: 'services'    },
    { label: 'How It Works', id: 'how-it-works' },
    { label: 'Why Us',       id: 'why-us'       },
    { label: 'Reviews',      id: 'testimonials' },
    { label: 'FAQ',          id: 'faq'          },
  ];

  const handleNavClick    = (id)  => { closeMobileMenu(); setTimeout(() => scrollToSection(id),    200); };
  const handleOpenOrders  = ()    => { closeMobileMenu(); setTimeout(() => openPanel('orders'),    200); };
  const handleOpenProfile = ()    => { closeMobileMenu(); setTimeout(() => openPanel('profile'),   200); };
  const handleBookRepair  = ()    => { closeMobileMenu(); setTimeout(() => onBookRepair?.(),       200); };
  const handleOpenAuth    = (tab) => { closeMobileMenu(); setTimeout(() => onOpenAuth?.(tab),      200); };
  const handleLogout      = ()    => { logout(); closeMobileMenu(); };

  return (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeMobileMenu}
            className="lg:hidden fixed inset-0 z-[998] bg-black/30"
          />

          {/* Drawer */}
          <motion.div
            key="drawer-panel"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="lg:hidden fixed top-[70px] left-0 right-0 bg-[rgba(255,255,255,0.99)] backdrop-blur-strong border-b border-border z-[999] px-[5%] py-3 pb-6 flex flex-col gap-0.5 shadow-lg max-h-[calc(100vh-70px)] overflow-y-auto"
          >
            {navLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => handleNavClick(link.id)}
                className="font-manrope text-[15px] font-semibold text-text-2 px-4 py-3.5 rounded-lg transition-all duration-200 hover:text-brand hover:bg-brand-light text-left flex items-center w-full"
              >
                {link.label}
              </button>
            ))}

            {!isLoggedIn && (
              <div className="flex gap-2.5 mt-3.5 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => handleOpenAuth('login')}
                  className="flex-1 px-4 py-3.5 rounded-lg font-manrope text-sm font-bold text-brand bg-brand-light border-[1.5px] border-border2 transition-all duration-200 hover:bg-brand hover:text-white hover:border-brand cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={handleBookRepair}
                  className="flex-1 px-4 py-3.5 rounded-lg font-manrope text-sm font-extrabold text-white bg-gradient-brand shadow-brand flex items-center justify-center gap-2 cursor-pointer"
                >
                  <i className="fas fa-wrench"></i>
                  Book Repair
                </button>
              </div>
            )}

            {isLoggedIn && (
              <div className="mt-3.5 pt-4 border-t border-border">
                <div className="flex items-center gap-3.5 px-4 py-3.5 bg-brand-light rounded-lg border border-border2 mb-2.5">
                  <div className="w-11 h-11 rounded-full bg-gradient-brand text-white font-sora text-base font-extrabold flex items-center justify-center flex-shrink-0 shadow-brand">
                    {getInitials(user?.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-sora text-[15px] font-bold text-text truncate">
                      {user?.name || 'User'}
                    </div>
                    <div className="font-manrope text-xs text-text-3 font-medium">
                      {user?.role === 'admin' ? 'Administrator' : 'Customer'}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <button type="button" onClick={handleOpenOrders}
                    className="flex items-center gap-2.5 px-4 py-3 font-manrope text-sm font-semibold text-text-2 rounded-lg transition-all duration-200 hover:bg-brand-light hover:text-brand text-left w-full cursor-pointer">
                    📋 My Orders
                  </button>
                  <button type="button" onClick={handleOpenProfile}
                    className="flex items-center gap-2.5 px-4 py-3 font-manrope text-sm font-semibold text-text-2 rounded-lg transition-all duration-200 hover:bg-brand-light hover:text-brand text-left w-full cursor-pointer">
                    👤 My Profile
                  </button>
                  <button type="button" onClick={handleLogout}
                    className="flex items-center gap-2.5 px-4 py-3 font-manrope text-sm font-semibold text-danger rounded-lg transition-all duration-200 hover:bg-danger-light text-left w-full cursor-pointer">
                    ⏻ Logout
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};