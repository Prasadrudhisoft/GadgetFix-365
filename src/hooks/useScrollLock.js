// src/hooks/useScrollLock.js
import { useEffect } from 'react';

// Global lock counter — lives outside React so it survives re-renders
// and is shared across every component using this hook
let lockCount = 0;

const lockScroll = () => {
  lockCount++;
  if (lockCount === 1) {
    // Only apply on the first lock request
    document.body.style.overflow = 'hidden';
  }
};

const unlockScroll = () => {
  lockCount = Math.max(0, lockCount - 1); // never go below 0
  if (lockCount === 0) {
    // Only release when ALL locks are gone
    document.body.style.overflow = '';
  }
};

export const useScrollLock = (isLocked) => {
  useEffect(() => {
    if (!isLocked) return;

    lockScroll();
    return () => unlockScroll();
  }, [isLocked]);
};