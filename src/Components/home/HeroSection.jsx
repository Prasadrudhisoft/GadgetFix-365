// src/components/home/HeroSection.jsx
import { motion } from 'framer-motion';
import { scrollToSection } from '@utils/helpers';
import { HeroSlider } from './HeroSlider';

const fadeInUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: 'easeOut' },
  }),
};

// Floating animation variants for cards
const floatAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: (delay) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.6, ease: "easeOut" }
  }),
  float: {
    y: [-8, 8, -8],
    transition: {
      duration: 4,
      repeat: Infinity,
      repeatType: "loop",
      ease: "easeInOut"
    }
  }
};

export const HeroSection = ({ onBookRepair }) => {
  return (
    <section className="min-h-screen flex items-center pt-[110px] pb-20 px-[5%] relative overflow-hidden bg-gradient-hero">
      {/* Decorative Blobs */}
      <div className="absolute w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,_rgba(29,78,216,0.06)_0%,_transparent_70%)] top-[-250px] right-[-250px] pointer-events-none animate-blob-float" />
      <div className="absolute w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,_rgba(2,132,199,0.05)_0%,_transparent_70%)] bottom-[-200px] left-[-150px] pointer-events-none animate-blob-float" style={{ animationDirection: 'reverse' }} />

      <div className="max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-[1]">
        {/* Left Content */}
        <div className="relative z-[2] text-center lg:text-left">
          {/* Badge */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-white border-[1.5px] border-border2 rounded-full font-manrope text-[13px] font-bold text-text-2 shadow-md mb-7"
          >
            <div className="w-2 h-2 rounded-full bg-green-2 shadow-[0_0_12px_rgba(16,185,129,0.7)] animate-pulse" />
            Available 7 days a week — <span className="text-gradient-brand">Book Today!</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="font-sora text-[clamp(36px,5vw,68px)] font-extrabold leading-[1.08] tracking-[-2.5px] text-text mb-5"
          >
            Expert{' '}
            <span className="relative inline-block">
              <span className="relative z-[1]">Phone Repair</span>
              <span className="absolute bottom-1 left-0 right-0 h-3 bg-[linear-gradient(135deg,rgba(29,78,216,0.2),rgba(37,99,235,0.2))] rounded z-0" />
            </span>
            <br />
            <span className="text-gradient-brand">Fast & Reliable</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="font-manrope text-[17px] text-text-3 leading-[1.85] max-w-[500px] mb-10 font-medium mx-auto lg:mx-0"
          >
            Professional mobile device repair services with certified technicians.
            From cracked screens to battery replacements — we fix it all with a upto 180 Days Warranty on parts.
          </motion.p>

          {/* Actions */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={3}
            className="flex gap-3.5 flex-wrap mb-14 justify-center lg:justify-start"
          >
            <motion.button
              onClick={onBookRepair}
              className="px-9 py-4 rounded-xl font-manrope text-[15px] font-extrabold text-white bg-gradient-brand shadow-[0_8px_36px_rgba(29,78,216,0.42)] relative overflow-hidden flex items-center gap-2.5 group"
              whileHover={{ y: -4, scale: 1.02, boxShadow: '0 18px 52px rgba(29, 78, 216, 0.52)' }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.15),transparent)] opacity-0 group-hover:opacity-100 transition-opacity" />
              Schedule Repair 
              <i className="fas fa-arrow-right text-sm transition-transform group-hover:translate-x-1"></i>
            </motion.button>

            <motion.button
              onClick={() => scrollToSection('how-it-works')}
              className="px-[30px] py-4 rounded-xl font-manrope text-[15px] font-bold text-text bg-white border-[1.5px] border-border2 shadow-md flex items-center gap-2.5"
              whileHover={{ y: -3, borderColor: '#1d4ed8', color: '#1d4ed8', backgroundColor: '#eff6ff' }}
              whileTap={{ scale: 0.98 }}
            >
              <i className="fas fa-play-circle"></i> Watch How It Works
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={4}
            className="flex gap-11 flex-wrap justify-center lg:justify-start"
          >
            {[
              { value: '50K+', label: 'Devices Repaired' },
              { value: '4.9★', label: 'Customer Rating' },
              { value: '30 Min', label: 'Average Repair' },
            ].map((stat, idx) => (
              <div key={idx} className="text-left">
                <div className="font-sora text-[32px] font-extrabold text-gradient-brand leading-[1.15] tracking-[-1.5px]">
                  {stat.value}
                </div>
                <div className="font-manrope text-xs text-text-4 font-bold mt-1 tracking-wider uppercase">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right Visual - With Slider */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={2}
          className="relative flex justify-center items-center"
        >
          <div className="relative w-full max-w-[480px]">
            {/* Hero Slider Component */}
            <HeroSlider />

            {/* Floating Card 1 - Warranty */}
            <motion.div
              custom={0.6}
              variants={floatAnimation}
              initial="initial"
              animate={["animate", "float"]}
              className="absolute -left-8 top-[15%] hidden lg:flex items-center gap-3 bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-xl border border-border z-10"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center text-brand">
                <i className="fas fa-award text-lg"></i>
              </div>
              <div>
                <h4 className="font-sora text-sm font-bold text-text">upto 180 Days Warranty</h4>
                <p className="text-xs text-text-4 font-medium">On all repairs</p>
              </div>
            </motion.div>

            {/* Floating Card 2 - Repair Complete */}
            <motion.div
              custom={0.8}
              variants={floatAnimation}
              initial="initial"
              animate={["animate", "float"]}
              className="absolute -right-8 bottom-[30%] hidden lg:flex items-center gap-3 bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-xl border border-border z-10"
            >
              <div className="w-10 h-10 rounded-xl bg-green-light flex items-center justify-center text-green">
                <i className="fas fa-check-circle text-lg"></i>
              </div>
              <div>
                <h4 className="font-sora text-sm font-bold text-text">Repair Complete!</h4>
                <p className="text-xs text-text-4 font-medium">iPhone 15 Pro</p>
              </div>
            </motion.div>

            {/* Floating Card 3 - Express Service */}
            <motion.div
              custom={1.0}
              variants={floatAnimation}
              initial="initial"
              animate={["animate", "float"]}
              className="absolute -left-6 bottom-[20%] hidden lg:flex items-center gap-3 bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-xl border border-border z-10"
            >
              <div className="w-10 h-10 rounded-xl bg-orange-light flex items-center justify-center text-orange">
                <i className="fas fa-bolt text-lg"></i>
              </div>
              <div>
                <h4 className="font-sora text-sm font-bold text-text">Express Service</h4>
                <p className="text-xs text-text-4 font-medium">Ready in 30 mins</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};