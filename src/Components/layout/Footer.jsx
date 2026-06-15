// src/components/layout/Footer.jsx
import { motion } from 'framer-motion';

export const Footer = () => {
  const footerLinks = {
    services: [
      'Screen Repair',
      'Battery Replacement',
      'Water Damage',
      'Camera Repair',
      'Motherboard Repair',
    ],
    company: ['About Us', 'Careers', 'Press Kit', 'Blog', 'Contact'],
    support: [
      'Help Center',
      'Track Repair',
      'Warranty Info',
      'Pricing',
      'Locations',
    ],
  };

  const socialLinks = [
    { icon: 'fab fa-facebook-f', url: '#' },
    { icon: 'fab fa-twitter', url: '#' },
    { icon: 'fab fa-instagram', url: '#' },
    { icon: 'fab fa-youtube', url: '#' },
  ];

  return (
    <footer className="bg-[#050c1a] pt-22 pb-10 px-[5%] text-white relative overflow-hidden">
      {/* Top border gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-2/60 to-transparent" />

      {/* Background blob */}
      <div className="absolute top-[-300px] right-[-300px] w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,_rgba(29,78,216,0.07)_0%,_transparent_70%)] pointer-events-none" />

      <div className="max-w-[1280px] mx-auto relative z-[1]">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-14 mb-14">
          {/* Brand Column */}
          <div className="max-w-[300px]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-[42px] h-[42px] rounded-[13px] bg-gradient-brand flex items-center justify-center text-lg shadow-[0_4px_18px_rgba(29,78,216,0.38)]">
                <i className="fas fa-mobile-screen-button"></i>
              </div>
              <span className="font-sora text-[21px] font-extrabold tracking-tight">
                Gadgetfix365
              </span>
            </div>
            <p className="font-manrope text-[13.5px] text-white/50 leading-relaxed font-medium mb-5">
              Your trusted partner for professional mobile device repairs. Quality
              service, transparent pricing, and upto 180 Days Warranty on all repairs.
            </p>
            <div className="flex gap-2.5">
              {socialLinks.map((social, idx) => (
                <motion.a
                  key={idx}
                  href={social.url}
                  className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/60 text-sm transition-all duration-300 hover:bg-gradient-brand hover:border-transparent hover:text-white hover:shadow-brand"
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <i className={social.icon}></i>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="font-sora text-[11.5px] font-bold text-white/90 uppercase tracking-[2px] mb-5">
              Services
            </h4>
            {footerLinks.services.map((link, idx) => (
              <a
                key={idx}
                href="#"
                className="block font-manrope text-[13.5px] text-white/50 font-medium mb-3 transition-all duration-200 hover:text-white hover:translate-x-1"
              >
                {link}
              </a>
            ))}
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-sora text-[11.5px] font-bold text-white/90 uppercase tracking-[2px] mb-5">
              Company
            </h4>
            {footerLinks.company.map((link, idx) => (
              <a
                key={idx}
                href="#"
                className="block font-manrope text-[13.5px] text-white/50 font-medium mb-3 transition-all duration-200 hover:text-white hover:translate-x-1"
              >
                {link}
              </a>
            ))}
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-sora text-[11.5px] font-bold text-white/90 uppercase tracking-[2px] mb-5">
              Support
            </h4>
            {footerLinks.support.map((link, idx) => (
              <a
                key={idx}
                href="#"
                className="block font-manrope text-[13.5px] text-white/50 font-medium mb-3 transition-all duration-200 hover:text-white hover:translate-x-1"
              >
                {link}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-7 flex flex-col sm:flex-row justify-between items-center gap-4 flex-wrap">
          <p className="font-manrope text-sm text-white/40 font-medium">
            © 2026 Gadgetfix365. All rights reserved.
          </p>
          <div className="flex gap-5 flex-wrap justify-center">
            <a
              href="#"
              className="font-manrope text-sm text-white/40 font-medium transition-colors duration-200 hover:text-white"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="font-manrope text-sm text-white/40 font-medium transition-colors duration-200 hover:text-white"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="font-manrope text-sm text-white/40 font-medium transition-colors duration-200 hover:text-white"
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};