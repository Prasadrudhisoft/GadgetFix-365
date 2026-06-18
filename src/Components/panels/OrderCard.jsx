// src/components/panels/OrderCard.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Badge from '@components/shared/Badge';
import { OrderTimeline } from './OrderTimeline';
import { formatDate } from '@utils/formatters';
import { escapeHtml, getDeviceIcon, isVideoFile } from '@utils/helpers';
import { getImageUrl } from '@services/api';

export const OrderCard = ({
  order,
  onOpenQuotation,
  onOpenFinalQuotation,
  onOpenCancel,
  onOpenBill,
  onOpenReceipt,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    id,
    model_name,
    problem_title,
    problem_description,
    status,
    house_no,
    building_name,
    full_address,
    landmark,
    city,
    state,
    pincode,
    photo_path,
    mobile_no,
    created_at,
    confirmed_type,
    final_confirmed_type,
  } = order;

  const date = created_at ? formatDate(created_at) : '—';
  const icon = getDeviceIcon(model_name);
  const photos = Array.isArray(photo_path) ? photo_path : (photo_path ? [photo_path] : []);

 
  const addressParts = [
    house_no && building_name ? `${escapeHtml(house_no)}, ${escapeHtml(building_name)}` : '',
    full_address ? escapeHtml(full_address) : '',
    landmark ? `Near ${escapeHtml(landmark)}` : '',
    city ? escapeHtml(city) : '',
    state ? escapeHtml(state) : '',
    pincode ? escapeHtml(pincode) : '',
  ].filter(Boolean);

  // Case insensitive status check
  const statusLower = (status || '').toLowerCase();

  // Button visibility
  const showQuotation = statusLower === 'quotation_sent';
  const showFinalQuotation = statusLower === 'final_quotation_sent';
  const showCancel = ['requested', 'quotation_sent', 'final_quotation_sent', 'in review'].includes(statusLower);

  const showBill = [
    'final_confirmed',
    'repairing',
    'repair done',
    'delivered',
    'completed'
  ].includes(statusLower);

  const showReceipt = statusLower === 'completed';

  // Shared classes for action buttons: full-width + centered on mobile,
  // auto-width + left-aligned content from sm breakpoint up.
  const actionBtnBase =
    'w-full sm:w-auto px-4 py-2 rounded-xl font-manrope text-xs font-bold transition-all flex items-center justify-center sm:justify-start gap-2 whitespace-nowrap';

  return (
    <div className="bg-white border-[1.5px] border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
      <div className="p-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        {/* Left Section */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center text-lg flex-shrink-0">
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-sora text-sm font-bold text-text break-words sm:truncate">
              {escapeHtml(model_name || '—')} — {escapeHtml(problem_title || '—')}
            </h3>
            <div className="font-manrope text-[11px] text-text-4 font-medium mt-1 flex flex-wrap gap-x-3 gap-y-1">
              <span>📅 {date}</span>
              <span>📞 {escapeHtml(mobile_no || '—')}</span>
              {confirmed_type && (
                <span className="px-2 py-0.5 bg-brand-light text-brand rounded-full text-[10px] font-bold">
                  Temp Device Parts: {confirmed_type}
                </span>
              )}
              {final_confirmed_type && (
                <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-[10px] font-bold">
                  Final Device Parts: {final_confirmed_type}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Section - Buttons */}
        <div className="flex flex-col w-full sm:w-auto items-stretch sm:items-end gap-2">
          <div className="flex justify-start sm:justify-end">
            <Badge status={status} />
          </div>

          {showQuotation && (
            <button
              onClick={() => onOpenQuotation(id)}
              className={`${actionBtnBase} bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-sm`}
            >
              <i className="fas fa-eye text-[11px]"></i>
              View Quotation & Confirm
            </button>
          )}

          {showFinalQuotation && (
            <button
              onClick={() => onOpenFinalQuotation(id)}
              className={`${actionBtnBase} bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 shadow-sm`}
            >
              <i className="fas fa-check-double text-[11px]"></i>
              View Final & Confirm
            </button>
          )}

          {showBill && (
            <button
              onClick={() => onOpenBill(id)}
              className={`${actionBtnBase} bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 shadow-sm`}
            >
              <i className="fas fa-file-invoice text-[11px]"></i>
              View Bill
            </button>
          )}

          {showReceipt && (
            <button
              onClick={() => onOpenReceipt?.(id)}
              className={`${actionBtnBase} bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 shadow-sm`}
            >
              <i className="fas fa-receipt text-[11px]"></i>
              Download Receipt
            </button>
          )}

          {showCancel && (
            <button
              onClick={() => onOpenCancel(id)}
              className={`${actionBtnBase} bg-red-50 border border-red-200 text-red-600 hover:bg-red-100`}
            >
              <i className="fas fa-times text-[11px]"></i>
              Cancel Order
            </button>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`${actionBtnBase} bg-gray-100 border border-gray-200 text-gray-600 hover:bg-brand-light hover:text-brand hover:border-brand`}
          >
            <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'} text-[10px]`}></i>
            {isExpanded ? 'Hide Details' : 'Show Details'}
          </button>
        </div>
      </div>

      {/* Expandable Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-border"
          >
            <div className="p-4 space-y-3 bg-gray-50">
              <OrderTimeline status={status} />

              {status === 'quotation_sent' && (
                <div className="flex items-start sm:items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl p-3">
                  <div className="text-2xl">💰</div>
                  <div>
                    <h4 className="font-sora text-xs font-bold text-blue-800 mb-0.5">
                      Quotation Received!
                    </h4>
                    <p className="font-manrope text-[11px] text-blue-700">
                      Click on <strong>"View Quotation & Confirm"</strong> to see the quotation and confirm your order.
                    </p>
                  </div>
                </div>
              )}

              {status === 'final_quotation_sent' && (
                <div className="flex items-start sm:items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                  <div className="text-2xl">✅</div>
                  <div>
                    <h4 className="font-sora text-xs font-bold text-emerald-800 mb-0.5">
                      Final Quotation Ready!
                    </h4>
                    <p className="font-manrope text-[11px] text-emerald-700">
                      Click on <strong>"View Final & Confirm"</strong> to review and confirm.
                    </p>
                  </div>
                </div>
              )}

              {status === 'Completed' && (
                <div className="flex items-start sm:items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-3">
                  <div className="text-2xl">🎉</div>
                  <div>
                    <h4 className="font-sora text-xs font-bold text-green-800 mb-0.5">
                      Repair Completed Successfully!
                    </h4>
                    <p className="font-manrope text-[11px] text-green-700">
                      Download your receipt using the button above.
                    </p>
                  </div>
                </div>
              )}

              {showBill && status !== 'Completed' && (
                <div className="flex items-start sm:items-center gap-3 bg-purple-50 border border-purple-200 rounded-xl p-3">
                  <div className="text-2xl">📄</div>
                  <div>
                    <h4 className="font-sora text-xs font-bold text-purple-800 mb-0.5">
                      Bill Available!
                    </h4>
                    <p className="font-manrope text-[11px] text-purple-700">
                      Click on <strong>"View Bill"</strong> to see your invoice.
                    </p>
                  </div>
                </div>
              )}

              {(status === 'Requested' || status === 'In Review') && (
                <div className="bg-brand-light border border-border2 rounded-xl p-3">
                  <p className="font-manrope text-xs text-brand font-semibold">
                    🔍 Our team is reviewing your request. You'll receive a quotation soon.
                  </p>
                </div>
              )}

              {!['Completed', 'Requested', 'In Review', 'quotation_sent', 'final_quotation_sent'].includes(status) && !showBill && (
                <div className="bg-brand-light border border-border2 rounded-xl p-3">
                  <p className="font-manrope text-xs text-brand font-semibold">
                    📋 <strong>Problem:</strong> {escapeHtml(problem_description || problem_title || '—')}
                  </p>
                </div>
              )}

              { }
              <div className="bg-white rounded-xl p-3 border border-border">
                <p className="font-manrope text-xs text-gray-700 leading-relaxed break-words">
                  📍 <strong>{escapeHtml(house_no)}, {escapeHtml(building_name)}</strong>
                  {addressParts.slice(2).map((part, i) => (
                    <span key={i}>, {part}</span>
                  ))}
                </p>
              </div>

              {photos.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {photos.map((photo, idx) => {
                    const url = getImageUrl(photo);
                    const isVideo = isVideoFile(url);
                    return isVideo ? (
                      <video key={idx} src={url} className="w-24 h-20 object-cover rounded-lg bg-black" controls />
                    ) : (
                      <img key={idx} src={url} alt="Device" className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform shadow-sm" onClick={() => window.open(url, '_blank')} />
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};