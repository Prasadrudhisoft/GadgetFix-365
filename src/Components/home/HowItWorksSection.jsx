// src/components/home/HowItWorksSection.jsx
import { motion } from 'framer-motion';

const steps = [
  {
    step: 1,
    title: 'Book Online',
    description: 'Schedule your repair appointment online in less than 2 minutes. Choose your preferred time slot.',
  },
  {
    step: 2,
    title: 'Get Diagnosis',
    description: 'Our experts diagnose your device and provide a transparent quote with no hidden charges.',
  },
  {
    step: 3,
    title: 'Quick Repair',
    description: 'Certified technicians repair your device using premium parts. Most repairs done in 30 minutes.',
  },
  {
    step: 4,
    title: 'Collect & Enjoy',
    description: 'Pick up your device or get it delivered. Enjoy upto 180 Days Warranty on all repairs.',
  },
];

export const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-[110px] px-[5%] bg-gradient-surface relative overflow-hidden">
      {/* Background Blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-[radial-gradient(circle,_rgba(29,78,216,0.04)_0%,_transparent_70%)] pointer-events-none" />

      <div className="max-w-[1280px] mx-auto relative z-[1]">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-[18px] py-2 bg-brand-light border border-border2 rounded-full font-manrope text-[11px] font-extrabold text-brand uppercase tracking-[1.5px] mb-5">
            <i className="fas fa-route"></i> Simple Process
          </div>
          <h2 className="font-sora text-[clamp(28px,4vw,48px)] font-extrabold text-text tracking-[-1.8px] leading-[1.1] mb-3.5">
            How It Works
          </h2>
          <p className="font-manrope text-[16.5px] text-text-3 leading-[1.78] max-w-[530px] mx-auto font-medium">
            Get your device repaired in 4 simple steps. Fast, transparent, and hassle-free.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connecting Line */}
          <div className="absolute top-[58px] left-[80px] right-[80px] h-[2px] bg-gradient-to-r from-transparent via-brand-mid to-transparent z-0 hidden lg:block" />

          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="bg-white rounded-xl p-8 text-center border-[1.5px] border-border relative z-[1] transition-all duration-[0.38s] shadow-sm hover:-translate-y-2.5 hover:shadow-xl hover:border-brand-2"
            >
              <motion.div
                className="w-14 h-14 rounded-full bg-gradient-brand text-white font-sora text-[21px] font-extrabold flex items-center justify-center mx-auto mb-5.5 shadow-[0_8px_28px_rgba(29,78,216,0.42)]"
                whileHover={{ scale: 1.14, rotate: 10 }}
              >
                {step.step}
              </motion.div>
              <h3 className="font-sora text-base font-bold text-text mb-2.5 tracking-tight">
                {step.title}
              </h3>
              <p className="font-manrope text-[13.5px] text-text-3 leading-[1.75] font-medium">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};