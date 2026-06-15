// src/components/home/WhyChooseUsSection.jsx
import { motion } from 'framer-motion';
import repairImage from '../../assets/images/repair.png';

const features = [
  {
    icon: 'fas fa-shield-halved',
    color: 'purple',
    title: 'upto 180 Days Warranty',
    description: 'All our repairs come with a upto 180 Days Warranty on parts and labor. Peace of mind guaranteed.',
  },
  {
    icon: 'fas fa-certificate',
    color: 'green',
    title: 'Certified Technicians',
    description: 'Our team is trained and certified by leading manufacturers. Your device is in expert hands.',
  },
  {
    icon: 'fas fa-bolt',
    color: 'orange',
    title: 'Express Service',
    description: 'Most repairs completed within 30 minutes. Same-day service available for urgent repairs.',
  },
  {
    icon: 'fas fa-gem',
    color: 'cyan',
    title: 'Premium Parts',
    description: 'We use only OEM-grade parts that match original specifications for lasting quality.',
  },
];

const colorClasses = {
  purple: 'bg-brand-light text-brand',
  green: 'bg-green-light text-green',
  orange: 'bg-orange-light text-orange',
  cyan: 'bg-accent-light text-accent',
};

export const WhyChooseUsSection = () => {
  return (
    <section id="why-us" className="py-[110px] px-[5%] bg-white">
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          {/* Left Content */}
          <div className="max-w-[520px]">
            <div className="inline-flex items-center gap-2 px-[18px] py-2 bg-brand-light border border-border2 rounded-full font-manrope text-[11px] font-extrabold text-brand uppercase tracking-[1.5px] mb-5">
              <i className="fas fa-star"></i> Why Choose Us
            </div>
            <h2 className="font-sora text-[clamp(28px,4vw,48px)] font-extrabold text-text tracking-[-1.8px] leading-[1.1] mb-3.5">
              The Gadgetfix365 Advantage
            </h2>
            <p className="font-manrope text-[16.5px] text-text-3 leading-[1.78] font-medium">
              We're not just another repair shop. We're your trusted partners in keeping your devices running perfectly.
            </p>

            {/* Features */}
            <div className="flex flex-col gap-3.5 mt-9">
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex gap-4 p-5 bg-bg rounded-lg border-[1.5px] border-border shadow-xs transition-all duration-300 hover:bg-white hover:border-brand hover:shadow-lg hover:translate-x-2"
                >
                  <div
                    className={`w-[50px] h-[50px] rounded-lg flex items-center justify-center text-[21px] flex-shrink-0 transition-transform duration-300 ${colorClasses[feature.color]}`}
                  >
                    <i className={feature.icon}></i>
                  </div>
                  <div>
                    <h4 className="font-sora text-[15px] font-bold text-text mb-1 tracking-tight">
                      {feature.title}
                    </h4>
                    <p className="font-manrope text-[13px] text-text-3 leading-[1.7] font-medium">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-[40px] overflow-hidden shadow-xl">
              <img
                src={repairImage}
                alt="Expert Phone Repair Technician"
                className="w-full object-cover block transition-transform duration-500 hover:scale-[1.04]"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};