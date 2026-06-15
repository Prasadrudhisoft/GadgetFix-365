// src/components/home/HeroSlider.jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

// Import images correctly - EKACH VELA import kar
import batteryImage from '../../assets/images/battery-damage.png';
import waterImage from '../../assets/images/water-damage.png';
import crackedImage from '../../assets/images/cracked-screen.png';
import chargingImage from '../../assets/images/charging-port.png';
import cameraImage from '../../assets/images/camera-damage.png';

const heroImages = [
  {
    src: batteryImage,
    alt: 'Battery Damage Repair',
    title: 'Battery Replacement'
  },
  {
    src: waterImage,
    alt: 'Water Damage Repair',
    title: 'Water Damage Repair'
  },
  {
    src: crackedImage,
    alt: 'Cracked Screen Repair',
    title: 'Screen Replacement'
  },
  {
    src: chargingImage,
    alt: 'Charging Port Repair',
    title: 'Charging Port Fix'
  },
  {
    src: cameraImage,
    alt: 'Camera Damage Repair',
    title: 'Camera Repair'
  }
];

export const HeroSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef(null);

  // Function to go to next slide
  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
  }, []);

  // Function to go to previous slide
  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + heroImages.length) % heroImages.length);
  }, []);

  // Go to specific slide
  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Auto-change images every 3 seconds
  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Only start auto-slide if not hovered
    if (!isHovered) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
      }, 3000);
    }

    // Cleanup on unmount or when dependencies change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isHovered]);

  return (
    <div 
      className="relative w-full rounded-[36px] overflow-hidden shadow-[0_32px_80px_rgba(29,78,216,0.18),0_12px_32px_rgba(0,0,0,0.1)] animate-float"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slide Container */}
      <div className="relative w-full h-[clamp(280px,45vw,550px)] overflow-hidden bg-gradient-to-br from-brand-dark to-brand">
        {heroImages.map((image, index) => (
          <motion.div
            key={index}
            className="absolute inset-0 w-full h-full"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ 
              opacity: index === currentIndex ? 1 : 0,
              scale: index === currentIndex ? 1 : 1.1,
              zIndex: index === currentIndex ? 1 : 0
            }}
   transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error('Image failed to load:', image.src);
                e.target.style.display = 'none';
                // Add fallback background color
                e.target.parentElement.style.backgroundColor = '#1d4ed8';
              }}
            />
          </motion.div>
        ))}

        {/* Image overlay with title */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none z-5" />
        
        <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none z-10">
          <motion.p 
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-white text-sm md:text-base font-semibold bg-black/40 backdrop-blur-sm inline-block px-4 py-1.5 rounded-full"
          >
            {heroImages[currentIndex].title}
          </motion.p>
        </div>
      </div>

      {/* Navigation Dots - Clean version */}
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

      {/* Navigation Arrows - Only visible on hover */}
      <button
        onClick={prevSlide}
        className={`absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white transition-all duration-300 z-20 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        } hover:bg-black/50 hover:scale-110`}
        aria-label="Previous slide"
      >
        <i className="fas fa-chevron-left text-sm md:text-base"></i>
      </button>

      <button
        onClick={nextSlide}
        className={`absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white transition-all duration-300 z-20 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        } hover:bg-black/50 hover:scale-110`}
        aria-label="Next slide"
      >
        <i className="fas fa-chevron-right text-sm md:text-base"></i>
      </button>
    </div>
  );
};