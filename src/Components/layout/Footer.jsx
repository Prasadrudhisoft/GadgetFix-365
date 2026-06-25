// src/components/layout/Footer.jsx
import { motion } from 'framer-motion';
import logoImage from '@assets/images/logo.png';

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
            {/* Logo — white background pill so it pops on dark footer */}
            <div className="mb-5">
              <img
                src={logoImage}
                alt="GadgetFix 365"
                className="w-[160px] h-auto object-contain bg-white rounded-xl px-3 py-2"
              />
            </div>
            <p className="font-manrope text-[13.5px] text-white/50 leading-relaxed font-medium mb-5">
              Your trusted partner for professional mobile device repairs. Quality
              service, transparent pricing, and upto 180 Days Warranty on all repairs.
            </p>

            {/* Contact Info */}
            <div className="flex flex-col gap-3 mb-5">
              <a
                href="tel:7796955011"
                className="flex items-center gap-3 group"
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-gradient-brand group-hover:border-transparent transition-all duration-300">
                  <i className="fas fa-phone text-white/50 text-xs group-hover:text-white transition-colors duration-300"></i>
                </div>
                <span className="font-manrope text-[13.5px] text-white/50 font-medium group-hover:text-white transition-colors duration-200">
                  +91 77969 55011
                </span>
              </a>
              <a
                href="https://maps.google.com/?q=SS+Mobile+Shop+No+1+Vasant+Chhaya+Complex+Near+Vision+Hospital+College+Road+Nashik"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-gradient-brand group-hover:border-transparent transition-all duration-300">
                  <i className="fas fa-location-dot text-white/50 text-xs group-hover:text-white transition-colors duration-300"></i>
                </div>
                <span className="font-manrope text-[13px] text-white/50 font-medium leading-relaxed group-hover:text-white transition-colors duration-200">
                  SS Mobile, Shop No. 1, Vasant-Chhaya Complex,<br />
                  Near Vision Hospital, College Road, Nashik.
                </span>
              </a>
            </div>

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