// src/components/home/BrandsMarquee.jsx
import { useEffect, useRef } from 'react';

const staticBrands = [
  { name: 'Apple', img: 'https://cdn-icons-png.flaticon.com/512/0/747.png' },
  { name: 'Samsung', img: 'https://cdn-icons-png.flaticon.com/512/882/882747.png' },
  { name: 'Google Pixel', img: 'https://cdn-icons-png.flaticon.com/512/5969/5969346.png' },
  { name: 'OnePlus', img: 'https://cdn-icons-png.flaticon.com/512/5977/5977585.png' },
  { name: 'Xiaomi', img: 'https://cdn-icons-png.flaticon.com/512/5969/5969133.png' },
  { name: 'Huawei', img: 'https://cdn-icons-png.flaticon.com/512/5969/5969214.png' },
  { name: 'Realme', img: 'https://cdn-icons-png.flaticon.com/512/5969/5969133.png' },
  { name: 'Vivo', img: 'https://cdn-icons-png.flaticon.com/512/5969/5969133.png' },
  { name: 'Oppo', img: 'https://cdn-icons-png.flaticon.com/512/5969/5969133.png' },
  { name: 'Motorola', img: 'https://cdn-icons-png.flaticon.com/512/5969/5969133.png' },
];

export const BrandsMarquee = () => {
  const marqueeRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee) return;

    let position = 0;
    const speed = 0.8;
    
    // Get width of one set of brands
    const totalWidth = marquee.scrollWidth;
    const setWidth = totalWidth / 3; // Because we have 3 copies
    
    const animate = () => {
      position -= speed;
      
      // Reset when we've scrolled one full set
      if (Math.abs(position) >= setWidth) {
        position = 0;
      }
      
      marquee.style.transform = `translateX(${position}px)`;
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    // Pause on hover
    const container = marquee.parentElement?.parentElement;
    const handleMouseEnter = () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
    
    const handleMouseLeave = () => {
      animationRef.current = requestAnimationFrame(animate);
    };
    
    container?.addEventListener('mouseenter', handleMouseEnter);
    container?.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      container?.removeEventListener('mouseenter', handleMouseEnter);
      container?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <section className="py-10 bg-white border-t border-b border-border overflow-hidden">
      <div className="text-center mb-5 px-[5%]">
        <p className="font-manrope text-[11px] text-text-4 font-extrabold uppercase tracking-[3px]">
          Trusted by owners of all major brands
        </p>
      </div>

      <div className="relative overflow-hidden">
        {/* Fade Edges - Left */}
        <div className="absolute top-0 bottom-0 left-0 w-[120px] z-[2] pointer-events-none bg-gradient-to-r from-white to-transparent" />
        
        {/* Fade Edges - Right */}
        <div className="absolute top-0 bottom-0 right-0 w-[120px] z-[2] pointer-events-none bg-gradient-to-l from-white to-transparent" />

        {/* Marquee Container */}
        <div className="overflow-hidden">
          <div
            ref={marqueeRef}
            className="flex gap-2.5 w-max py-1.5"
            style={{ whiteSpace: 'nowrap' }}
          >
            {/* 3 copies for seamless loop */}
            {[...staticBrands, ...staticBrands, ...staticBrands].map((brand, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 px-[15px] py-2 bg-bg2 rounded-lg border-[1.5px] border-border transition-all duration-[0.28s] cursor-pointer whitespace-nowrap hover:border-brand hover:bg-brand-light hover:shadow-md hover:-translate-y-0.5"
              >
                <img src={brand.img} alt={brand.name} className="w-5 h-5 object-contain" />
                <span className="font-manrope text-xs font-bold text-text-2 hover:text-brand">
                  {brand.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};