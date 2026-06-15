// src/components/home/TestimonialsSection.jsx
import { motion } from 'framer-motion';

const testimonials = [
  {
    text: 'Absolutely amazing service! My iPhone screen was completely shattered, and they fixed it in just 25 minutes. Looks brand new now. Highly recommended!',
    author: 'XYZ',
    device: 'iPhone 15 Pro Max Repair',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
  },
  {
    text: "My Samsung had water damage and I thought it was gone forever. Gadgetfix365 saved it! The team was professional and kept me updated throughout the process.",
    author: 'ABC',
    device: 'Samsung S24 Ultra Repair',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
  },
  {
    text: "Best repair experience ever! Fair pricing, quick service, and the lifetime warranty gives me peace of mind. Will definitely come back for any future repairs.",
    author: 'PQR',
    device: 'Google Pixel 8 Pro Repair',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
  },
];

const stars = Array(5).fill('fas fa-star');

export const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-[110px] px-[5%] bg-gradient-to-b from-bg2 to-bg">
      <div className="max-w-[1280px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-[18px] py-2 bg-brand-light border border-border2 rounded-full font-manrope text-[11px] font-extrabold text-brand uppercase tracking-[1.5px] mb-5">
            <i className="fas fa-heart"></i> Testimonials
          </div>
          <h2 className="font-sora text-[clamp(28px,4vw,48px)] font-extrabold text-text tracking-[-1.8px] leading-[1.1] mb-3.5">
            Loved by Thousands
          </h2>
          <p className="font-manrope text-[16.5px] text-text-3 leading-[1.78] max-w-[530px] mx-auto font-medium">
            Don't just take our word for it. Here's what our customers have to say about their experience.
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="bg-white rounded-xl p-7 border-[1.5px] border-border transition-all duration-[0.38s] relative shadow-sm hover:-translate-y-2.5 hover:shadow-xl hover:border-brand-2"
            >
              {/* Quote Mark */}
              <span className="absolute top-3.5 right-6 font-sora text-[85px] font-extrabold text-bg3 leading-none pointer-events-none">
                "
              </span>

              {/* Stars */}
              <div className="flex gap-0.5 mb-3.5">
                {stars.map((star, i) => (
                  <i key={i} className={`${star} text-[#f59e0b] text-[13px]`}></i>
                ))}
              </div>

              {/* Text */}
              <p className="font-manrope text-sm text-text-2 leading-[1.88] mb-5.5 relative z-[1] font-medium">
                {testimonial.text}
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-[3px] border-brand-light flex-shrink-0">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-sora text-[13.5px] font-bold text-text">
                    {testimonial.author}
                  </h4>
                  <p className="font-manrope text-xs text-text-4 font-medium mt-0.5">
                    {testimonial.device}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};