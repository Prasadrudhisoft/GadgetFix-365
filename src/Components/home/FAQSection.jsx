// src/components/home/FAQSection.jsx';
import { motion } from 'framer-motion';
import { Accordion } from '@components/shared/Accordion';

const faqItems = [
  {
    question: 'How long does a typical repair take?',
    answer: 'Most common repairs like screen replacements and battery changes are completed within 30-45 minutes. More complex repairs such as motherboard issues may take 24-48 hours. We\'ll always provide you with an accurate time estimate before starting the repair.',
  },
  {
    question: 'What warranty do you offer on repairs?',
    answer: "We offer a upto 180 Days Warranty on all parts and labor for the specific repair performed. If the same issue recurs, we'll fix it free of charge. This warranty covers manufacturing defects and installation issues, giving you complete peace of mind.",
  },
  {
    question: 'Do you use original parts?',
    answer: 'We use OEM-grade (Original Equipment Manufacturer) parts that meet or exceed original specifications. For certain repairs, we also offer genuine original parts at a premium. You can choose the option that best fits your budget and needs.',
  },
  {
    question: 'Is my data safe during the repair?',
    answer: 'Absolutely! We prioritize data privacy and security. Our technicians never access your personal data. However, we recommend backing up your device before any repair as a precaution. For water damage repairs, data recovery is attempted with your explicit consent.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major payment methods including cash, credit/debit cards, UPI (Google Pay, PhonePe, Paytm), net banking, and EMI options for repairs above ₹5,000. Payment is required only after you\'re satisfied with the repair.',
  },
  {
    question: 'Do you offer pickup and delivery?',
    answer: 'Yes! We offer free pickup and delivery services within city limits for repairs above ₹2,000. For other repairs, a nominal fee of ₹99 applies. You can schedule pickup during booking or opt to visit our service center directly.',
  },
];

export const FAQSection = () => {
  return (
    <section id="faq" className="py-[110px] px-[5%] bg-white">
      <div className="max-w-[1280px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-[18px] py-2 bg-brand-light border border-border2 rounded-full font-manrope text-[11px] font-extrabold text-brand uppercase tracking-[1.5px] mb-5">
            <i className="fas fa-circle-question"></i> FAQ
          </div>
          <h2 className="font-sora text-[clamp(28px,4vw,48px)] font-extrabold text-text tracking-[-1.8px] leading-[1.1] mb-3.5">
            Frequently Asked Questions
          </h2>
          <p className="font-manrope text-[16.5px] text-text-3 leading-[1.78] max-w-[530px] mx-auto font-medium">
            Got questions? We've got answers. Find everything you need to know about our services.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-[760px] mx-auto">
          <Accordion items={faqItems} />
        </div>
      </div>
    </section>
  );
};