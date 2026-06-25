// src/components/home/HeroSlider.jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import batteryImage from '../../assets/images/battery-damage.png';
import waterImage from '../../assets/images/water-damage.png';
import crackedImage from '../../assets/images/cracked-screen.png';
import chargingImage from '../../assets/images/charging-port.png';
import cameraImage from '../../assets/images/camera-damage.png';
import motherbdImage from '../../assets/images/motherboard.png';

const heroImages = [
  { src: batteryImage,  alt: 'Battery Damage Repair',  title: 'Battery Replacement' },
  { src: waterImage,    alt: 'Water Damage Repair',    title: 'Water Damage Repair' },
  { src: crackedImage,  alt: 'Cracked Screen Repair',  title: 'Screen Replacement' },
  { src: chargingImage, alt: 'Charging Port Repair',   title: 'Charging Port Fix' },
  { src: cameraImage,   alt: 'Camera Damage Repair',   title: 'Camera Repair' },
  { src: motherbdImage, alt: 'Motherboard Repair',     title: 'Motherboard Repair' },
];

export const HeroSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % heroImages.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  }, []);

  const goToSlide = (index) => setCurrentIndex(index);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (!isHovered) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % heroImages.length);
      }, 3000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isHovered]);

  return (
    <div
      className="relative w-full rounded-[36px] overflow-hidden shadow-[0_32px_80px_rgba(29,78,216,0.18),0_12px_32px_rgba(0,0,0,0.1)] animate-float"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slide Container — bg-black so no blue flash between slides */}
      <div className="relative w-full h-[clamp(280px,45vw,550px)] overflow-hidden bg-black">

        {/* All slides stacked — only current is visible */}
        {heroImages.map((image, index) => (
          <motion.div
            key={index}
            className="absolute inset-0 w-full h-full"
            animate={{
              opacity: index === currentIndex ? 1 : 0,
              zIndex: index === currentIndex ? 1 : 0,
            }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            // No scale — scale causes the gap/flash
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.style.backgroundColor = '#111';
              }}
            />
          </motion.div>
        ))}

        {/* Bottom gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none z-[5]" />

        {/* Slide title */}
        <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none z-10">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="text-white text-sm md:text-base font-semibold bg-black/40 backdrop-blur-sm inline-block px-4 py-1.5 rounded-full"
            >
              {heroImages[currentIndex].title}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex
                ? 'w-2 h-2 bg-white scale-125'
                : 'w-2 h-2 bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Arrows */}
      <button
        onClick={prevSlide}
        className={`absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white transition-all duration-300 z-20 hover:bg-black/50 hover:scale-110 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
        aria-label="Previous slide"
      >
        <i className="fas fa-chevron-left text-sm md:text-base"></i>
      </button>

      <button
        onClick={nextSlide}
        className={`absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white transition-all duration-300 z-20 hover:bg-black/50 hover:scale-110 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
        aria-label="Next slide"
      >
        <i className="fas fa-chevron-right text-sm md:text-base"></i>
      </button>
    </div>
  );
};