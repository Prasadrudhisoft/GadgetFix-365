import { STATUS_STEPS } from './constants';

export const normalizeStatus = (status) => {
  if (!status) return 'Requested';
  
  const normalized = String(status).toLowerCase().trim();
  const map = {
    'requested': 'Requested',
    'in_review': 'In_Review',
    'quotation_sent': 'quotation_sent',
    'confirmed': 'Confirmed',
    'picked_up': 'Picked Up',
    'picked up': 'Picked Up',
    'reviewed': 'Reviewed',
    'final_quotation_sent': 'final_quotation_sent',
    'final_confirmed': 'Final_Confirmed',
    'repairing': 'Repairing',
    'repair_done': 'Repair Done',
    'repair done': 'Repair Done',
    'delivered': 'Delivered',
    'completed': 'Completed',
    'cancelled': 'Cancelled'
  };
  
  return map[normalized] || (normalized.charAt(0).toUpperCase() + normalized.slice(1));
};

export const getNextStatuses = (currentStatus) => {
  const preConfirmStatuses = ['Requested', 'quotation_sent'];
  
  if (preConfirmStatuses.includes(currentStatus)) return ['Cancelled'];
  
  if (currentStatus === 'Confirmed') return ['Picked Up', 'Cancelled'];
  if (currentStatus === 'Picked Up') return ['Reviewed', 'Cancelled'];
  if (currentStatus === 'Reviewed') return ['Cancelled'];
  if (currentStatus === 'final_quotation_sent') return ['Cancelled'];
  if (currentStatus === 'Final_Confirmed') return ['Repairing', 'Cancelled'];
  if (currentStatus === 'Repairing') return ['Repair Done', 'Cancelled'];
  if (currentStatus === 'Repair Done') return ['Delivered', 'Cancelled'];
  if (currentStatus === 'Delivered') return ['Cancelled'];
  
  if (currentStatus === 'Completed' || currentStatus === 'Cancelled') return [];
  
  return ['Cancelled'];
};

export const getStatusIndex = (status) => {
  return STATUS_STEPS.indexOf(normalizeStatus(status));
};

export const isVideoFile = (url) => {
  const ext = url.split('.').pop().toLowerCase();
  return ['mp4', 'mov', 'avi', 'webm', 'mkv'].includes(ext);
};

export const formatCurrency = (value) => {
  return '₹ ' + (parseFloat(value) || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

export const getInitials = (name) => {
  return name?.trim().split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'A';
};