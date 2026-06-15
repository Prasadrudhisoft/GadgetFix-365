// src/components/home/CTASection.jsx';
import { motion } from 'framer-motion';

export const CTASection = ({ onBookRepair }) => {
  return (
    <section className="py-[110px] px-[5%] bg-bg2">
      <div className="max-w-[1200px] mx-auto">
        <div className="bg-gradient-brand rounded-[40px] px-[60px] py-20 relative overflow-hidden shadow-[0_28px_90px_rgba(29,78,216,0.44)]">
          {/* Decorative Blobs */}
          <div className="absolute top-[-40%] right-[-10%] w-[600px] h-[600px] bg-[radial-gradient(circle,_rgba(255,255,255,0.12)_0%,_transparent_70%)] pointer-events-none" />
          <div className="absolute bottom-[-30%] left-[-8%] w-[400px] h-[400px] bg-[radial-gradient(circle,_rgba(255,255,255,0.07)_0%,_transparent_70%)] pointer-events-none" />

          {/* Content */}
          <div className="relative z-[1] flex items-center justify-between gap-10 flex-wrap">
            <div className="max-w-[600px]">
              <h2 className="font-sora text-[clamp(26px,4vw,42px)] font-extrabold text-white tracking-[-1.5px] mb-3.5 leading-[1.1]">
                Ready to Fix Your Device?
              </h2>
              <p className="font-manrope text-[16.5px] text-white/85 leading-[1.75] font-medium">
                Book your repair today and get 10% off on your first service. Fast, reliable, and backed by our lifetime warranty.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3.5 flex-wrap">
              <motion.button
                onClick={onBookRepair}
                className="px-9 py-4 rounded-xl font-manrope text-[15px] font-extrabold text-brand bg-white shadow-[0_8px_36px_rgba(0,0,0,0.22)] flex items-center gap-2.5"
                whileHover={{ y: -4, scale: 1.02, boxShadow: '0 18px 52px rgba(0, 0, 0, 0.28)' }}
                whileTap={{ scale: 0.98 }}
              >
                <i className="fas fa-calendar-check"></i> Book Now — Get 10% Off
              </motion.button>

              <motion.button
                className="px-[30px] py-4 rounded-xl font-manrope text-[15px] font-bold text-white bg-transparent border-2 border-white/42 cursor-pointer"
                whileHover={{ backgroundColor: 'rgba(255,255,255,0.16)', borderColor: 'white', y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <i className="fas fa-phone"></i> Call Us
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};