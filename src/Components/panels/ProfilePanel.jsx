// src/components/panels/ProfilePanel.jsx
import { motion } from 'framer-motion';
import { useAuth } from '@hooks/useAuth';
import { useOrders } from '@hooks/useOrders';
import { useScrollLock } from '@hooks/useScrollLock';
import { getInitials } from '@utils/helpers';

export const ProfilePanel = ({ onClose }) => {
  const { user } = useAuth();
  const { orders } = useOrders();

  useScrollLock(true);

  const initials = getInitials(user?.name);

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed top-0 right-0 w-full max-w-[560px] h-screen bg-white z-[3001] flex flex-col shadow-xl"
    >
      {/* Header */}
      <div className="px-6 py-5 border-b border-border bg-gradient-brand text-white flex items-center justify-between flex-shrink-0">
        <h2 className="font-sora text-lg font-extrabold tracking-tight">
          👤 My Profile
        </h2>
        <button
          onClick={onClose}
          className="w-[34px] h-[34px] rounded-full bg-white/20 flex items-center justify-center transition-all hover:bg-white/30 hover:rotate-90"
        >
          <i className="fas fa-times"></i>
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        {/* Avatar */}
        <div className="w-[68px] h-[68px] rounded-full bg-gradient-brand text-white font-sora text-[22px] font-extrabold flex items-center justify-center mx-auto mb-3.5 shadow-brand">
          {initials}
        </div>

        {/* Name & Role */}
        <div className="text-center mb-5.5">
          <div className="font-sora text-[19px] font-extrabold text-text tracking-tight">
            {user?.name || 'User'}
          </div>
          <div className="font-manrope text-[13px] text-text-4 font-semibold mt-1">
            {user?.role === 'admin' ? '🔑 Administrator' : '👤 Customer'}
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-bg2 border-[1.5px] border-border rounded-lg p-4.5">
          <div className="flex items-start gap-3.5 py-3 border-b border-border last:border-b-0">
            <div className="text-[17px] text-brand flex-shrink-0 mt-0.5">
              <i className="fas fa-phone"></i>
            </div>
            <div className="flex-1">
              <div className="font-manrope text-[10.5px] font-extrabold text-text-4 uppercase tracking-wide mb-1">
                Mobile
              </div>
              <div className="font-manrope text-[13.5px] font-bold text-text">
                {user?.mobile_no || '—'}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3.5 py-3 border-b border-border last:border-b-0">
            <div className="text-[17px] text-brand flex-shrink-0 mt-0.5">
              <i className="fas fa-id-badge"></i>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-manrope text-[10.5px] font-extrabold text-text-4 uppercase tracking-wide mb-1">
                User ID
              </div>
              <div className="font-manrope text-[11px] font-bold text-text break-all">
                {user?.id || '—'}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3.5 py-3">
            <div className="text-[17px] text-brand flex-shrink-0 mt-0.5">
              <i className="fas fa-clipboard-list"></i>
            </div>
            <div className="flex-1">
              <div className="font-manrope text-[10.5px] font-extrabold text-text-4 uppercase tracking-wide mb-1">
                Total Orders
              </div>
              <div className="font-manrope text-[13.5px] font-bold text-text">
                {orders.length}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};