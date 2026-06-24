import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

const ImageLightbox = ({ images = [], isOpen, onClose, startIndex = 0 }) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const MIN_SCALE = 0.5;
  const MAX_SCALE = 4;

  useEffect(() => {
    setCurrentIndex(startIndex);
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [startIndex, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
      if (e.key === '+' || e.key === '=') zoom(0.25);
      if (e.key === '-') zoom(-0.25);
    };

    const handleWheel = (e) => {
      e.preventDefault();
      zoom(e.deltaY < 0 ? 0.15 : -0.15);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [isOpen, currentIndex, scale]);

  const navigate = (direction) => {
    if (images.length <= 1) return;
    setCurrentIndex((prev) => (prev + direction + images.length) % images.length);
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const zoom = (delta) => {
    setScale((prev) => Math.max(MIN_SCALE, Math.min(MAX_SCALE, prev + delta)));
  };

  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (!isOpen || images.length === 0) return null;

  return createPortal(
    <div
      style={{
        display: 'flex',
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.92)',
        zIndex: 9000,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '14px',
        animation: 'fadeIn 0.18s ease'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Image Container */}
      <div
        style={{
          position: 'relative',
          width: '90vw',
          height: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'visible',
          borderRadius: '16px',
          background: 'transparent',
          cursor: isDragging ? 'grabbing' : scale > 1 ? 'grab' : 'default'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <img
          src={images[currentIndex]}
          alt={`View ${currentIndex + 1}`}
          style={{
            maxWidth: '85vw',
            maxHeight: '78vh',
            objectFit: 'contain',
            borderRadius: '16px',
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transition: isDragging ? 'none' : 'transform 0.2s ease',
            userSelect: 'none',
            pointerEvents: 'none',
            transformOrigin: 'center center'
          }}
          draggable={false}
        />

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => navigate(-1)}
              style={{
                position: 'absolute',
                top: '50%',
                left: '-54px',
                transform: 'translateY(-50%)',
                background: 'rgba(255, 255, 255, 0.14)',
                border: 'none',
                color: '#fff',
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                fontSize: '20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                backdropFilter: 'blur(8px)',
                zIndex: 1
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.26)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.14)';
              }}
            >
              ‹
            </button>

            <button
              onClick={() => navigate(1)}
              style={{
                position: 'absolute',
                top: '50%',
                right: '-54px',
                transform: 'translateY(-50%)',
                background: 'rgba(255, 255, 255, 0.14)',
                border: 'none',
                color: '#fff',
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                fontSize: '20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                backdropFilter: 'blur(8px)',
                zIndex: 1
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.26)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.14)';
              }}
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button onClick={() => zoom(-0.25)} style={controlBtnStyle}>
          <i className="fas fa-magnifying-glass-minus"></i> Zoom Out
        </button>

        <span style={{
          fontFamily: "'Sora', sans-serif",
          color: 'rgba(255, 255, 255, 0.55)',
          fontSize: '12px',
          fontWeight: 700,
          minWidth: '48px',
          textAlign: 'center'
        }}>
          {Math.round(scale * 100)}%
        </span>

        <button onClick={() => zoom(0.25)} style={controlBtnStyle}>
          <i className="fas fa-magnifying-glass-plus"></i> Zoom In
        </button>

        <button onClick={resetZoom} style={controlBtnStyle}>
          <i className="fas fa-expand"></i> Reset
        </button>

        {images.length > 1 && (
          <span style={{
            fontFamily: "'Manrope', sans-serif",
            color: 'rgba(255, 255, 255, 0.45)',
            fontSize: '12px'
          }}>
            {currentIndex + 1} / {images.length}
          </span>
        )}

        <button onClick={onClose} style={{
          ...controlBtnStyle,
          background: 'rgba(220, 38, 38, 0.2)',
          borderColor: 'rgba(220, 38, 38, 0.38)'
        }}>
          <i className="fas fa-times"></i> Close
        </button>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>,
    document.body
  );
};

const controlBtnStyle = {
  background: 'rgba(255, 255, 255, 0.1)',
  border: '1.5px solid rgba(255, 255, 255, 0.15)',
  color: '#fff',
  padding: '9px 16px',
  borderRadius: '16px',
  cursor: 'pointer',
  fontFamily: "'Manrope', sans-serif",
  fontSize: '13px',
  fontWeight: 700,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  backdropFilter: 'blur(10px)'
};

export default ImageLightbox;