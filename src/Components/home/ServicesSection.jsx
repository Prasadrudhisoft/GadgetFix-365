// src/components/home/ServicesSection.jsx

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@hooks/useAuth';
import { useData } from '@hooks/useData';
import { useUI } from '@hooks/useUI';
import { getImageUrl } from '@services/api';
import { CAT_IMAGES } from '@utils/constants';
import clsx from 'clsx';

const serviceCards = [
  { icon: 'fas fa-mobile-screen', color: 'purple', title: 'Screen Replacement', desc: 'Premium OLED & LCD replacements with perfect color accuracy and touch responsiveness.', price: '₹1,999' },
  { icon: 'fas fa-battery-full', color: 'green', title: 'Battery Replacement', desc: "Restore your phone's battery life with genuine batteries and professional installation.", price: '₹999' },
  { icon: 'fas fa-droplet', color: 'cyan', title: 'Water Damage Repair', desc: 'Expert water damage assessment and recovery to save your device from liquid damage.', price: '₹1,499' },
  { icon: 'fas fa-camera', color: 'orange', title: 'Camera Repair', desc: 'Fix blurry photos, broken lenses, or camera software issues with specialized repairs.', price: '₹1,299' },
  { icon: 'fas fa-microchip', color: 'pink', title: 'Motherboard Repair', desc: 'Advanced micro-soldering and chip-level repairs for complex motherboard issues.', price: '₹2,499' },
  { icon: 'fas fa-plug', color: 'blue', title: 'Charging Port Repair', desc: 'Fix loose connections, slow charging, or complete port failures with quality parts.', price: '₹799' },
];

const iconColorClasses = {
  purple: 'bg-gradient-to-br from-brand to-brand-2 text-white',
  green:  'bg-gradient-to-br from-green to-green-2 text-white',
  cyan:   'bg-gradient-to-br from-accent to-[#22d3ee] text-white',
  orange: 'bg-gradient-to-br from-orange to-[#fb923c] text-white',
  pink:   'bg-gradient-to-br from-pink to-[#f472b6] text-white',
  blue:   'bg-gradient-to-br from-brand-2 to-[#60a5fa] text-white',
};

export const ServicesSection = ({ onBookRepair, onOpenAuth }) => {
  const { isLoggedIn } = useAuth();
  const { categories, fetchBrands, isLoadingBrands, brands } = useData();
  const { showToast } = useUI();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showBrandModal, setShowBrandModal] = useState(false);

  const handleCategoryClick = useCallback(
    async (category) => {
      if (!isLoggedIn) {
        onOpenAuth('login');
        return;
      }
      setSelectedCategory(category);
      await fetchBrands(category.id);
      setShowBrandModal(true);
    },
    [isLoggedIn, onOpenAuth, fetchBrands]
  );

  const handleBrandClick = useCallback(
    (brandId) => {
      if (!isLoggedIn) {
        onOpenAuth('login');
        return;
      }
      setShowBrandModal(false);
      onBookRepair(String(selectedCategory?.id), String(brandId));
    },
    [isLoggedIn, onOpenAuth, onBookRepair, selectedCategory]
  );

  const closeModal = useCallback(() => {
    setShowBrandModal(false);
  }, []);

  return (
    <>
      <section
        id="services"
        className="py-[110px] px-[5%] relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0f1e3d 0%, #1a2f5e 40%, #1d4ed8 100%)',
        }}
      >
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1600&auto=format&fit=crop')] bg-cover bg-center opacity-[0.05] z-0 pointer-events-none" />

        {/* Ambient glow — top right */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,150,255,0.12) 0%, transparent 70%)',
            top: '-200px',
            right: '-200px',
          }}
        />

        {/* Ambient glow — bottom left */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)',
            bottom: '-150px',
            left: '-150px',
          }}
        />

        <div className="max-w-[1280px] mx-auto relative z-[2]">

          {/* Section heading */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-[18px] py-[7px] rounded-full font-manrope text-[11px] font-extrabold uppercase tracking-[1.8px] mb-5"
              style={{
                background: 'rgba(99,150,255,0.12)',
                border: '1px solid rgba(99,150,255,0.22)',
                color: '#93c5fd',
              }}
            >
              <i className="fas fa-layer-group"></i> Our Categories
            </div>
            <h2 className="font-sora text-[clamp(28px,4vw,48px)] font-extrabold text-white tracking-[-1.8px] leading-[1.1] mb-3.5">
              Browse Repair Categories
            </h2>
            <p className="font-manrope text-[16px] leading-[1.8] max-w-[520px] mx-auto font-medium"
              style={{ color: 'rgba(255,255,255,0.52)' }}>
              Wide range of repairs for smartphones, tablets, laptops, and other gadgets — done right, every time.
            </p>
          </div>

          {/* Category cards — dynamic or fallback */}
          {categories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-4">
              {categories.map((cat, idx) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08, duration: 0.4, ease: 'easeOut' }}
                  onClick={() => handleCategoryClick(cat)}
                  className="group relative rounded-2xl cursor-pointer overflow-hidden"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease, border-color 0.3s ease',
                  }}
                  whileHover={{
                    y: -6,
                    transition: { duration: 0.25 },
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
                    e.currentTarget.style.borderColor = 'rgba(99,150,255,0.30)';
                    e.currentTarget.style.boxShadow = '0 24px 60px rgba(0,0,0,0.35), 0 0 0 1px rgba(99,150,255,0.18)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Lock badge for guests */}
                  {!isLoggedIn && (
                    <div className="absolute top-3.5 right-3.5 z-10">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center"
                        style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(6px)' }}>
                        <i className="fas fa-lock text-[11px]" style={{ color: 'rgba(255,255,255,0.7)' }}></i>
                      </div>
                    </div>
                  )}

                  {/* Image area */}
                  <div className="w-full h-[148px] overflow-hidden"
                    style={{ background: 'rgba(0,0,0,0.18)' }}>
                    {cat.photo_path ? (
                      <img
                        src={getImageUrl(cat.photo_path)}
                        alt={cat.category_name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => { e.target.src = CAT_IMAGES[idx % CAT_IMAGES.length]; }}
                      />
                    ) : (
                      <img
                        src={CAT_IMAGES[idx % CAT_IMAGES.length]}
                        alt={cat.category_name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                  </div>

                  {/* Card body */}
                  <div className="p-5">
                    <h3 className="font-sora text-[16px] font-bold text-white mb-1.5 tracking-tight">
                      {cat.category_name}
                    </h3>
                    <p className="font-manrope text-[13px] leading-relaxed flex items-center gap-1.5"
                      style={{ color: 'rgba(255,255,255,0.48)' }}>
                      {isLoggedIn ? (
                        <>
                          <i className="fas fa-arrow-right text-[10px]" style={{ color: 'rgba(99,150,255,0.8)' }}></i>
                          Tap to view brands
                        </>
                      ) : (
                        <>
                          <i className="fas fa-lock text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}></i>
                          Login to view brands & book
                        </>
                      )}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            /* Fallback static service cards */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-4">
              {serviceCards.map((service, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08, duration: 0.4, ease: 'easeOut' }}
                  className="group relative rounded-2xl p-6 overflow-hidden"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  }}
                  whileHover={{ y: -6, transition: { duration: 0.25 } }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
                    e.currentTarget.style.borderColor = 'rgba(99,150,255,0.28)';
                    e.currentTarget.style.boxShadow = '0 24px 60px rgba(0,0,0,0.32)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div className={clsx(
                    'w-[52px] h-[52px] rounded-xl flex items-center justify-center text-[20px] mb-5',
                    iconColorClasses[service.color]
                  )}>
                    <i className={service.icon}></i>
                  </div>
                  <h3 className="font-sora text-[17px] font-bold text-white mb-2.5 tracking-tight">
                    {service.title}
                  </h3>
                  <p className="font-manrope text-[13px] leading-[1.8] mb-5"
                    style={{ color: 'rgba(255,255,255,0.52)' }}>
                    {service.desc}
                  </p>
                  <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg font-manrope font-bold text-[12px]"
                    style={{
                      background: 'rgba(29,78,216,0.22)',
                      border: '1px solid rgba(99,150,255,0.22)',
                      color: '#93c5fd',
                    }}>
                    <i className="fas fa-tag text-[10px]"></i> Starting at {service.price}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* Brand Selection Modal — rendered outside section to avoid overflow:hidden clipping */}
      <AnimatePresence>
        {showBrandModal && selectedCategory && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(5, 12, 30, 0.72)', backdropFilter: 'blur(8px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
        className="relative w-full max-w-[520px] rounded-2xl overflow-hidden"
style={{
  background: 'linear-gradient(135deg, #0f1e3d 0%, #1a2f5e 40%, #1d4ed8 100%)',
  border: '1px solid rgba(99,150,255,0.18)',
  boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,150,255,0.1)',
}}
              onClick={e => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className="px-6 pt-6 pb-5"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="flex items-start justify-between">
                  <div>
                    {/* Category pill */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-3 font-manrope text-[11px] font-extrabold uppercase tracking-[1.4px]"
                      style={{
                        background: 'rgba(99,150,255,0.14)',
                        border: '1px solid rgba(99,150,255,0.22)',
                        color: '#93c5fd',
                      }}>
                      <i className="fas fa-layer-group text-[9px]"></i>
                      {selectedCategory.category_name}
                    </div>
                    <h3 className="font-sora text-[19px] font-bold text-white tracking-tight leading-tight">
                      Select a brand
                    </h3>
                    <p className="font-manrope text-[13px] mt-1"
                      style={{ color: 'rgba(255,255,255,0.44)' }}>
                      Choose your device brand to continue booking
                    </p>
                  </div>

                  {/* Close button */}
                  <button
                    onClick={closeModal}
                    className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 flex-shrink-0 mt-0.5"
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: 'rgba(255,255,255,0.55)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
                      e.currentTarget.style.color = '#fff';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                      e.currentTarget.style.color = 'rgba(255,255,255,0.55)';
                    }}
                  >
                    <i className="fas fa-times text-[13px]"></i>
                  </button>
                </div>
              </div>

              {/* Modal body */}
              <div className="px-6 py-5">
                {isLoadingBrands ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <div className="w-8 h-8 rounded-full border-[2.5px] animate-spin"
                      style={{ borderColor: 'rgba(99,150,255,0.2)', borderTopColor: '#6396ff' }} />
                    <p className="font-manrope text-[13px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
                      Loading brands…
                    </p>
                  </div>
                ) : brands.length > 0 ? (
                  <div
                    className="grid gap-3 overflow-y-auto"
                    style={{
                      gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                      maxHeight: '300px',
                    }}
                  >
                    {brands.map((brand) => (
                      <motion.div
                        key={brand.id}
                        onClick={() => handleBrandClick(brand.id)}
                        className="flex flex-col items-center gap-2 rounded-xl p-3.5 cursor-pointer"
                        style={{
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          transition: 'background 0.2s ease, border-color 0.2s ease',
                        }}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = 'rgba(99,150,255,0.12)';
                          e.currentTarget.style.borderColor = 'rgba(99,150,255,0.36)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                        }}
                      >
                        {brand.photo_path ? (
                          <img
                            src={getImageUrl(brand.photo_path)}
                            alt={brand.brand_name}
                            className="w-10 h-10 object-contain"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        ) : (
                          <div className="text-[26px] leading-none">📱</div>
                        )}
                        <span className="font-manrope text-[11.5px] font-bold text-center leading-tight"
                          style={{ color: 'rgba(255,255,255,0.82)' }}>
                          {brand.brand_name}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <div className="text-3xl">🔍</div>
                    <p className="font-manrope text-[13px] font-semibold text-center"
                      style={{ color: 'rgba(255,255,255,0.38)' }}>
                      No brands available for {selectedCategory.category_name} yet.
                    </p>
                  </div>
                )}
              </div>

              {/* Modal footer */}
              <div className="px-6 pb-5">
                <button
                  onClick={closeModal}
                  className="w-full py-2.5 rounded-xl font-manrope text-[13px] font-semibold transition-all duration-200"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.09)',
                    color: 'rgba(255,255,255,0.45)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.09)';
                    e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.color = 'rgba(255,255,255,0.45)';
                  }}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};