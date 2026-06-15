// src/components/modals/QuotationModal.jsx
import { useState, useEffect } from 'react';
import { Modal } from '@components/shared/Modal';
import { Button } from '@components/shared/Button';
import { Spinner } from '@components/shared/Spinner';
import { useUI } from '@hooks/useUI';
import { ordersAPI } from '@services/api';
import { formatCurrency } from '@utils/formatters';
import { escapeHtml } from '@utils/helpers';
import clsx from 'clsx';

export const QuotationModal = ({ isOpen, onClose, orderId, onConfirmSuccess }) => {
  const { showToast } = useUI();
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirming, setIsConfirming] = useState(false);
  const [quotation, setQuotation] = useState(null);
  const [selectedType, setSelectedType] = useState('original');

  useEffect(() => {
    if (isOpen && orderId) {
      fetchQuotation();
    }
  }, [isOpen, orderId]);

  const fetchQuotation = async () => {
    setIsLoading(true);
    try {
      const data = await ordersAPI.getQuotation(orderId);
      if (data.status === 'success' && data.quotation) {
        setQuotation(data.quotation);
      } else {
        showToast(data.message || 'Quotation not available yet.', 'error');
        onClose();
      }
    } catch (error) {
      showToast('❌ Could not load quotation. Please try again.', 'error');
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      const result = await ordersAPI.confirmOrder(orderId, selectedType);
      if (result.status === 'success') {
        showToast(`✅ Order confirmed with ${selectedType} parts!`, 'success');
        onConfirmSuccess?.();
        onClose();
      } else {
        showToast(`❌ ${result.message || 'Could not confirm order.'}`, 'error');
      }
    } catch (error) {
      showToast('❌ Network error. Please try again.', 'error');
    } finally {
      setIsConfirming(false);
    }
  };

  if (!quotation && !isLoading) return null;

  const isOriginal = selectedType === 'original';
  const services = isOriginal ? (quotation?.service || []) : (quotation?.duplicate_service || []);
  const subtotal = parseFloat(isOriginal ? quotation?.total_amount : quotation?.duplicate_total_amount) || 0;
  const grand = parseFloat(isOriginal ? quotation?.total_amount_inc_tax : quotation?.duplicate_total_inc_tax) || 0;
  const taxPct = isOriginal ? quotation?.tax_percent : quotation?.duplicate_tax_percent;
  const taxAmt = grand - subtotal;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" showCloseButton={false}>
      {/* Header */}
      <div className="bg-gradient-brand px-7 py-6 text-white sticky top-0 z-10">
        <h2 className="font-sora text-xl font-extrabold mb-0.5 tracking-tight">
          Review Quotation
        </h2>
        <p className="font-manrope text-[13px] opacity-85 font-medium">
          Choose your preferred parts type to confirm
        </p>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-[34px] h-[34px] rounded-full bg-white/20 flex items-center justify-center transition-all hover:bg-white/30 hover:rotate-90"
        >
          <i className="fas fa-times"></i>
        </button>
      </div>

      {/* Body */}
      <div className="p-7 max-h-[calc(90vh-220px)] overflow-y-auto custom-scrollbar">
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="space-y-5">
            {/* Device & Customer Info */}
            <div>
              <div className="text-[11px] font-extrabold text-text-4 uppercase tracking-wide mb-2 font-manrope">
                Device & Customer
              </div>
              <div className="bg-bg2 border border-border rounded-lg p-3 font-manrope text-xs text-text-2 leading-relaxed">
                <strong>{escapeHtml(quotation.name || '—')}</strong> · 📞 {escapeHtml(quotation.mobile_no || '—')}<br />
                📱 {escapeHtml(quotation.brand_name || '')} {escapeHtml(quotation.model_name || '—')} ({escapeHtml(quotation.category_name || '—')})<br />
                🔧 {escapeHtml(quotation.problem_title || '—')}
                {quotation.problem_as_per_technician && (
                  <>
                    <br />🛠️ <em>Tech: {escapeHtml(quotation.problem_as_per_technician)}</em>
                  </>
                )}
              </div>
            </div>

            {/* Parts Type Selection */}
            <div>
              <div className="text-[11px] font-extrabold text-text-4 uppercase tracking-wide mb-2 font-manrope">
                Choose Parts Type
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  onClick={() => setSelectedType('original')}
                  className={clsx(
                    'border-2 rounded-lg p-4 transition-all',
                    selectedType === 'original'
                      ? 'border-brand bg-brand-light shadow-md'
                      : 'border-border hover:border-brand'
                  )}
                >
                  <div className="text-[10.5px] font-extrabold text-text-3 uppercase tracking-wide mb-1.5 font-manrope">
                    Original / OEM Parts
                  </div>
                  <div className="font-sora text-[21px] font-black text-text tracking-tight mb-1">
                    {formatCurrency(parseFloat(quotation?.total_amount_inc_tax) || 0)}
                  </div>
                  <span className="inline-block text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-brand-light text-brand">
                    Genuine OEM
                  </span>
                </button>

                <button
                  onClick={() => setSelectedType('duplicate')}
                  className={clsx(
                    'border-2 rounded-lg p-4 transition-all',
                    selectedType === 'duplicate'
                      ? 'border-accent bg-accent-light shadow-md'
                      : 'border-border hover:border-accent'
                  )}
                >
                  <div className="text-[10.5px] font-extrabold text-text-3 uppercase tracking-wide mb-1.5 font-manrope">
                    Duplicate / Compatible
                  </div>
                  <div className="font-sora text-[21px] font-black text-text tracking-tight mb-1">
                    {formatCurrency(parseFloat(quotation?.duplicate_total_inc_tax) || 0)}
                  </div>
                  <span className="inline-block text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-accent-light text-accent">
                    Compatible
                  </span>
                </button>
              </div>
            </div>

            {/* Services Table */}
            <div>
              <div className="text-[11px] font-extrabold text-text-4 uppercase tracking-wide mb-2 font-manrope">
                Services ({isOriginal ? 'Original' : 'Duplicate'})
              </div>
              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-bg2">
                    <tr>
                      <th className="px-3 py-2 text-left text-[10px] font-extrabold text-text-4 uppercase tracking-wide w-8">#</th>
                      <th className="px-3 py-2 text-left text-[10px] font-extrabold text-text-4 uppercase tracking-wide">Service</th>
                      <th className="px-3 py-2 text-right text-[10px] font-extrabold text-text-4 uppercase tracking-wide">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.length > 0 ? (
                      services.map((s, i) => (
                        <tr key={i} className="border-b border-border last:border-b-0">
                          <td className="px-3 py-2 text-muted text-xs">{i + 1}</td>
                          <td className="px-3 py-2 text-text text-xs font-medium">{escapeHtml(s.service || '—')}</td>
                          <td className="px-3 py-2 text-right text-text text-xs font-bold">{formatCurrency(s.total_price || 0)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="px-3 py-4 text-center text-muted text-xs">
                          No services listed
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals */}
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="flex justify-between px-4 py-2.5 border-b border-border text-xs font-manrope font-semibold">
                <span className="text-text-3">Subtotal</span>
                <span className="text-text">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between px-4 py-2.5 border-b border-border text-xs font-manrope font-semibold">
                <span className="text-text-3">Tax ({escapeHtml(String(taxPct || 0))}%)</span>
                <span className="text-text">{formatCurrency(taxAmt)}</span>
              </div>
              <div className="flex justify-between px-4 py-3 bg-brand-light text-sm font-manrope font-extrabold">
                <span className="text-brand">Grand Total</span>
                <span className="text-brand">{formatCurrency(grand)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      {!isLoading && (
        <div className="px-7 py-4 border-t border-border bg-bg2 flex gap-2.5 justify-end sticky bottom-0">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            loading={isConfirming}
            icon={<i className="fas fa-check"></i>}
          >
            {isConfirming ? 'Confirming...' : '✅ Confirm Order'}
          </Button>
        </div>
      )}
    </Modal>
  );
};