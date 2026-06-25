// src/components/home/BrandsMarquee.jsx
import { useEffect, useRef } from 'react';

const staticBrands = [
  { name: 'Apple',        img: 'https://cdn.simpleicons.org/apple/000000' },
  { name: 'Samsung',      img: 'https://cdn.simpleicons.org/samsung/1428A0' },
  { name: 'Google Pixel', img: 'https://cdn.simpleicons.org/google/4285F4' },
  { name: 'OnePlus',      img: 'https://cdn.simpleicons.org/oneplus/F5010C' },
  { name: 'Xiaomi',       img: 'https://cdn.simpleicons.org/xiaomi/FF6900' },
  { name: 'Huawei',       img: 'https://cdn.simpleicons.org/huawei/CF0A2C' },
  { name: 'Realme',       img: 'https://cdn.simpleicons.org/realme/FFD400' },
  { name: 'Vivo',         img: 'https://cdn.simpleicons.org/vivo/415FFF' },
  { name: 'Oppo',         img: 'https://cdn.simpleicons.org/oppo/1D8348' },
  { name: 'Motorola',     img: 'https://cdn.simpleicons.org/motorola/E1140A' },
];

export const BrandsMarquee = () => {
  const marqueeRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee) return;

    let position = 0;
    const speed = 0.8;

    const totalWidth = marquee.scrollWidth;
    const setWidth = totalWidth / 3;

    const animate = () => {
      position -= speed;

      if (Math.abs(position) >= setWidth) {
        position = 0;
      }

      marquee.style.transform = `translateX(${position}px)`;
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    const container = marquee.parentElement?.parentElement;
    const handleMouseEnter = () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
    const handleMouseLeave = () => {
      animationRef.current = requestAnimationFrame(animate);
    };

    container?.addEventListener('mouseenter', handleMouseEnter);
    container?.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
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
            {[...staticBrands, ...staticBrands, ...staticBrands].map((brand, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 px-[15px] py-2 bg-bg2 rounded-lg border-[1.5px] border-border transition-all duration-[0.28s] cursor-pointer whitespace-nowrap hover:border-brand hover:bg-brand-light hover:shadow-md hover:-translate-y-0.5"
              >
                <img
                  src={brand.img}
                  alt={brand.name}
                  className="w-5 h-5 object-contain"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
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