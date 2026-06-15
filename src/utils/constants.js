// src/utils/constants.js

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export const STATUS_STEPS = [
  'Requested',
  'quotation_sent',
  'Confirmed',
  'Picked Up',
  'Reviewed',
  'final_quotation_sent',
  'Final_Confirmed',
  'Repairing',
  'Repair Done',
  'Delivered',
  'Completed'
];

export const STATUS_ICONS = {
  'Requested': '⏳',
  'quotation_sent': '💬',
  'Confirmed': '👍',
  'Picked Up': '🚗',
  'Reviewed': '🔍',
  'final_quotation_sent': '📋',
  'Final_Confirmed': '✅',
  'Repairing': '🔧',
  'Repair Done': '🛠️',
  'Delivered': '📦',
  'Completed': '🎉',
  'Cancelled': '✕'
};

export const TIMELINE_LABELS = [
  'Received',
  'Quoted',
  'Confirmed',
  'Picked Up',
  'Reviewed',
  'Final Quote',
  'F.Confirmed',
  'Repairing',
  'Repaired',
  'Delivered',
  'Done'
];

export const TIMELINE_ICONS = [
  '📋', '💬', '👍', '🚗', '🔍', '📋', '✅', '🔧', '🛠️', '📦', '🎉'
];

export const VIDEO_EXTENSIONS = ['mp4', 'mov', 'avi', 'webm', 'mkv'];

export const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

export const VIDEO_TYPES = [
  'video/mp4',
  'video/quicktime',
  'video/x-msvideo',
  'video/webm'
];

export const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
export const MAX_VIDEO_SIZE = 20 * 1024 * 1024; // 20MB
export const MAX_FILES = 5;

export const ORDERS_FETCH_COOLDOWN = 2000; // ms

export const CAT_IMAGES = [
  'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&q=80&fit=crop',
  'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80&fit=crop',
  'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80&fit=crop',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80&fit=crop',
];

export const PAGE_SIZE = 15;

export const DEBOUNCE_DELAY = 2000;