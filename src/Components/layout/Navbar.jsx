// src/components/layout/Navbar.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@hooks/useAuth';
import { useUI } from '@hooks/useUI';
import { scrollToSection } from '@utils/helpers';
import { UserDropdown } from './UserDropdown';
import clsx from 'clsx';
import logoImage from '@assets/images/logo.png';

export const Navbar = ({ onBookRepair, onOpenAuth }) => {
  const { isLoggedIn, user } = useAuth();
  const { toggleMobileMenu, isMobileMenuOpen } = useUI(); // ✅ Using context
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Services', id: 'services' },
    { label: 'How It Works', id: 'how-it-works' },
    { label: 'Why Us', id: 'why-us' },
    { label: 'Reviews', id: 'testimonials' },
    { label: 'FAQ', id: 'faq' },
  ];

  return (
    <nav
      className={clsx(
        'fixed top-0 left-0 right-0 z-[1000] h-[80px] sm:h-[90px] lg:h-[100px] flex items-center justify-between px-[5%] gap-5',
        'bg-[rgba(248,250,255,0.94)] backdrop-blur-strong border-b border-border',
        'transition-all duration-300',
        scrolled && 'h-[70px] sm:h-[78px] lg:h-[84px] bg-[rgba(255,255,255,0.98)] shadow-[0_4px_30px_rgba(29,78,216,0.1)] border-b-border2'
      )}
    >
      {/* Logo */}
      <a href="#" className="flex items-center gap-2.5 no-underline flex-shrink-0">
        <motion.img
          src={logoImage}
          alt="GadgetFix 365"
          className={clsx(
            // Mobile: 52px, tablet: 58px, desktop: 64px
            'h-[64px] sm:h-[72px] lg:h-[80px]',
            // Cap width so it never overflows on small screens
            'w-auto max-w-[200px] sm:max-w-[260px] lg:max-w-[320px]',
            // Keep proportions intact, align to left edge
            'object-contain object-left',
            // Shrink height when scrolled
            scrolled && 'h-[56px] sm:h-[64px] lg:h-[72px]'
          )}
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        />
      </a>

      {/* Center Links — desktop only */}
      <div className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
        {navLinks.map((link) => (
          <button
            key={link.id}
            type="button"
            onClick={() => scrollToSection(link.id)}
            className="font-manrope text-[13.5px] font-semibold text-text-3 px-3.5 py-2 rounded-full transition-all duration-200 hover:text-brand hover:bg-brand-light whitespace-nowrap"
          >
            {link.label}
          </button>
        ))}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2.5 flex-shrink-0">
        {/* Desktop auth — hidden on mobile */}
        {!isLoggedIn ? (
          <div className="hidden lg:flex items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenAuth?.('login')}
              className="px-[18px] py-[9px] rounded-lg font-manrope text-[13.5px] font-bold text-text-3 bg-transparent border-none transition-all duration-200 hover:text-brand hover:bg-brand-light whitespace-nowrap cursor-pointer"
            >
              Login
            </button>
            <motion.button
              type="button"
              onClick={() => onBookRepair?.()}
              className="px-[22px] py-[10px] rounded-lg font-manrope text-[13.5px] font-extrabold text-white bg-gradient-brand border-none shadow-brand flex items-center gap-2 whitespace-nowrap cursor-pointer"
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <i className="fas fa-wrench"></i>
              <span>Book Repair</span>
            </motion.button>
          </div>
        ) : (
          <UserDropdown user={user} />
        )}

        {/* Hamburger — mobile only */}
        <button
          type="button"
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileMenuOpen}
          onClick={toggleMobileMenu}
          className={clsx(
            'lg:hidden flex flex-col justify-center items-center gap-[5px]',
            'w-[42px] h-[42px] bg-brand-light border-[1.5px] border-border2 rounded-lg',
            'transition-all duration-200 hover:border-brand hover:bg-bg3 cursor-pointer'
          )}
        >
          <span className={clsx('w-[18px] h-[2px] bg-brand rounded-sm transition-all duration-300 origin-center', isMobileMenuOpen && 'rotate-45 translate-y-[7px]')} />
          <span className={clsx('w-[18px] h-[2px] bg-brand rounded-sm transition-all duration-300', isMobileMenuOpen && 'opacity-0 scale-x-0')} />
          <span className={clsx('w-[18px] h-[2px] bg-brand rounded-sm transition-all duration-300 origin-center', isMobileMenuOpen && '-rotate-45 -translate-y-[7px]')} />
        </button>
      </div>
    </nav>
  );
};