// src/utils/helpers.js

export const escapeHtml = (str) => {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

export const getDeviceIcon = (modelName) => {
  const text = (modelName || '').toLowerCase();
  if (
    text.includes('iphone') ||
    text.includes('samsung') ||
    text.includes('redmi') ||
    text.includes('oneplus') ||
    text.includes('vivo') ||
    text.includes('oppo') ||
    text.includes('realme')
  ) {
    return '📱';
  }
  if (text.includes('laptop') || text.includes('macbook') || text.includes('notebook')) {
    return '💻';
  }
  if (text.includes('battery')) return '🔋';
  if (text.includes('screen') || text.includes('display')) return '🖥️';
  if (text.includes('camera')) return '📸';
  return '🔧';
};

export const getInitials = (name) => {
  if (!name) return '?';
  return name
    .trim()
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
};

export const scrollToSection = (id) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

export const isVideoFile = (url) => {
  const ext = url.split('.').pop().toLowerCase();
  return ['mp4', 'mov', 'avi', 'webm', 'mkv'].includes(ext);
};

export const getStatusBadgeColor = (status) => {
  const colors = {
    'Requested': 'bg-yellow-100 text-yellow-900 border-yellow-200',
    'quotation_sent': 'bg-blue-50 text-blue-900 border-blue-200',
    'Confirmed': 'bg-green-100 text-green-900 border-green-300',
    'Picked Up': 'bg-cyan-50 text-cyan-900 border-cyan-200',
    'Reviewed': 'bg-indigo-50 text-indigo-900 border-indigo-200',
    'final_quotation_sent': 'bg-purple-50 text-purple-900 border-purple-200',
    'Final_Confirmed': 'bg-emerald-100 text-emerald-900 border-emerald-300',
    'Repairing': 'bg-orange-100 text-orange-900 border-orange-200',
    'Repair Done': 'bg-teal-100 text-teal-900 border-teal-300',
    'Delivered': 'bg-sky-50 text-sky-900 border-sky-200',
    'Completed': 'bg-green-100 text-green-900 border-green-300',
    'Cancelled': 'bg-red-100 text-red-900 border-red-200',
  };
  return colors[status] || 'bg-gray-100 text-gray-900 border-gray-200';
};