// src/components/modals/BillModal.jsx
import { useState, useEffect } from 'react';
import { Modal } from '@components/shared/Modal';
import { Spinner } from '@components/shared/Spinner';
import { useUI } from '@hooks/useUI';
import { ordersAPI } from '@services/api';
import { formatCurrency, formatDate } from '@utils/formatters';
import { escapeHtml } from '@utils/helpers';
import clsx from 'clsx';

export const BillModal = ({ isOpen, onClose, orderId }) => {
  const { showToast } = useUI();
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [bill, setBill] = useState(null);

  useEffect(() => {
    if (isOpen && orderId) fetchBill();
  }, [isOpen, orderId]);

  const fetchBill = async () => {
    setIsLoading(true);
    try {
      const data = await ordersAPI.getBill(orderId);
      if (data.status === 'success' && data.bill) {
        setBill(data.bill);
      } else {
        showToast(data.message || 'Bill not found.', 'error');
        onClose();
      }
    } catch (error) {
      showToast('❌ Could not load bill. Please try again.', 'error');
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const downloadBill = () => {
    if (!bill) return;
    setIsDownloading(true);
    const billHTML = generateBillHTML(bill);
    const blob = new Blob([billHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Bill_${bill.bill_id || orderId}_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setIsDownloading(false);
    showToast('✅ Bill downloaded successfully!', 'success');
  };

  const generateBillHTML = (bill) => {
    const services = bill?.services || [];
    const isPaid = (bill?.payment_status || '').toLowerCase() === 'paid';
    const date = formatDate(bill.created_at);
    const billNo = bill.bill_id || 'N/A';

    const serviceRows = services.map((s, i) => `
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 12px; text-align: center; color: #6b7280; font-size: 14px;">${i + 1}</td>
        <td style="padding: 12px; color: #1f2937; font-size: 14px;">${escapeHtml(s.service || '—')}</td>
        <td style="padding: 12px; text-align: right; color: #1f2937; font-size: 14px; font-weight: 600;">${formatCurrency(s.total_price || 0)}</td>
      </tr>
    `).join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bill - ${billNo}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; background: #f3f4f6; padding: 40px 20px; }
    .bill-container { max-width: 800px; margin: 0 auto; background: white; border-radius: 16px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); overflow: hidden; }
    .bill-header { background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%); padding: 30px; color: white; text-align: center; }
    .bill-header h1 { font-size: 28px; font-weight: 800; margin-bottom: 8px; }
    .bill-header p { font-size: 14px; opacity: 0.9; }
    .bill-body { padding: 30px; }
    .payment-status { display: flex; align-items: center; gap: 12px; padding: 15px; border-radius: 12px; margin-bottom: 24px; background: ${isPaid ? '#ecfdf5' : '#fffbeb'}; border: 1px solid ${isPaid ? '#bbf7d0' : '#fde68a'}; color: ${isPaid ? '#065f46' : '#92400e'}; font-weight: 600; }
    .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 24px; }
    .info-card { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 12px 16px; }
    .info-label { font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
    .info-value { font-size: 14px; font-weight: 700; color: #1f2937; word-break: break-word; }
    .services-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; }
    .services-table th { background: #f9fafb; padding: 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; }
    .services-table th:last-child { text-align: right; }
    .totals { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; margin-bottom: 24px; }
    .total-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; }
    .total-row.grand { border-top: 2px dashed #e5e7eb; margin-top: 8px; padding-top: 12px; font-size: 18px; font-weight: 800; color: #1d4ed8; }
    .address-box { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; font-size: 13px; color: #4b5563; line-height: 1.6; }
    .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb; }
    @media print { body { background: white; padding: 0; } .no-print { display: none; } }
  </style>
</head>
<body>
  <div class="bill-container">
    <div class="bill-header">
      <h1>🧾 GADGETFIX365</h1>
      <p>Professional Mobile Repair Services</p>
      <p style="margin-top: 8px; font-size: 12px;">📍 India's #1 Mobile Repair Service</p>
    </div>
    <div class="bill-body">
      <div class="payment-status">
        <span style="font-size: 24px;">${isPaid ? '✅' : '⏳'}</span>
        <span>Payment Status: <strong>${escapeHtml(bill.payment_status || 'Pending')}</strong></span>
      </div>
      <div class="info-grid">
        <div class="info-card"><div class="info-label">Bill ID</div><div class="info-value">${escapeHtml(billNo)}</div></div>
        <div class="info-card"><div class="info-label">Date</div><div class="info-value">${date}</div></div>
        <div class="info-card"><div class="info-label">Customer</div><div class="info-value">${escapeHtml(bill.user_name || '—')}</div></div>
        <div class="info-card"><div class="info-label">Mobile</div><div class="info-value">${escapeHtml(bill.mobile_no || '—')}</div></div>
        <div class="info-card"><div class="info-label">Device</div><div class="info-value">${escapeHtml(bill.brand_name || '')} ${escapeHtml(bill.model_name || '—')}</div></div>
        <div class="info-card"><div class="info-label">Parts Type</div><div class="info-value" style="text-transform: capitalize;">${escapeHtml(bill.confirmed_type || '—')}</div></div>
      </div>
      <table class="services-table">
        <thead><tr><th style="width: 50px;">Srno</th><th>Service</th><th style="text-align: right;">Amount</th></tr></thead>
        <tbody>${serviceRows}</tbody>
      </table>
      <div class="totals">
        <div class="total-row"><span>Subtotal</span><span style="font-weight: 600;">${formatCurrency(bill.subtotal)}</span></div>
        <div class="total-row"><span>Tax (${escapeHtml(String(bill.tax_percent || 0))}%)</span><span style="font-weight: 600; color: #d97706;">${formatCurrency(bill.tax_amount)}</span></div>
        <div class="total-row grand"><span>Total Amount</span><span>${formatCurrency(bill.total_amount)}</span></div>
      </div>
      <div class="address-box">
        <strong>📍 Delivery Address</strong><br><br>
        ${[bill.house_no, bill.building_name, bill.full_address, bill.city, bill.state, bill.pincode].filter(Boolean).map(part => escapeHtml(part)).join(', ')}
      </div>
    </div>
    <div class="footer">
      <p>Thank you for choosing Gadgetfix365!</p>
      <p style="margin-top: 4px;">For any queries, contact us at support@gadgetfix365.com | 📞 +91 80709 00800</p>
      <p style="margin-top: 8px; font-size: 10px;">This is a computer generated invoice. No signature required.</p>
    </div>
  </div>
  <div class="no-print" style="text-align: center; margin-top: 20px;">
    <button onclick="window.print()" style="background: #1d4ed8; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; margin: 0 8px;">🖨️ Print Bill</button>
    <button onclick="window.close()" style="background: #6b7280; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; margin: 0 8px;">✕ Close</button>
  </div>
</body>
</html>`;
  };

  if (!bill && !isLoading) return null;

  const services = bill?.services || [];
  const isPaid = (bill?.payment_status || '').toLowerCase() === 'paid';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      showCloseButton={false}
      fullBleed
      className="!bg-white"
    >
      <div className="flex flex-col min-h-0 h-full bg-white">

        {/* ── Header ── */}
        <div
          className="relative flex-shrink-0 px-4 py-4 sm:px-7 sm:py-5"
          style={{
            background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <div className="flex justify-between items-center pr-10">
            <div>
              <h2 className="font-sora text-lg sm:text-xl font-extrabold text-white mb-0.5 tracking-tight flex items-center gap-2">
                <i className="fas fa-file-invoice-dollar"></i> Your Bill
              </h2>
              <p className="font-manrope text-[12px] sm:text-[13px] font-medium" style={{ color: 'rgba(255,255,255,0.75)' }}>
                Repair invoice details
              </p>
            </div>

            {/* Download Button */}
            <button
              onClick={downloadBill}
              disabled={isDownloading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all disabled:opacity-50"
              style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
            >
              {isDownloading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm font-semibold">Downloading...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-download text-sm"></i>
                  <span className="text-sm font-semibold">Download</span>
                </>
              )}
            </button>
          </div>

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 w-[34px] h-[34px] rounded-full flex items-center justify-center transition-all duration-200"
            style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
            aria-label="Close"
          >
            <i className="fas fa-times text-[13px]"></i>
          </button>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto min-h-0 custom-scroll p-4 sm:p-7 bg-white">
          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <Spinner size="lg" />
            </div>
          ) : (
            <div className="space-y-5">

              {/* Payment Status */}
              <div className={clsx(
                'flex items-center gap-3 px-4 py-3 rounded-xl font-manrope text-[13px] font-bold',
                isPaid
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : 'bg-amber-50 border border-amber-200 text-amber-800'
              )}>
                <span className="text-2xl">{isPaid ? '✅' : '⏳'}</span>
                <span>
                  Payment Status:{' '}
                  <strong className={isPaid ? 'text-green-700' : 'text-amber-700'}>
                    {bill.payment_status || 'Pending'}
                  </strong>
                </span>
              </div>

              {/* Bill Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InfoCard label="Bill ID" value={bill.bill_id || '—'} mono />
                <InfoCard label="Date" value={formatDate(bill.created_at)} />
                <InfoCard label="Customer" value={bill.user_name || '—'} />
                <InfoCard label="Mobile" value={bill.mobile_no || '—'} />
                <InfoCard label="Device" value={`${bill.brand_name || ''} ${bill.model_name || '—'}`.trim()} />
                <InfoCard label="Parts Type" value={bill.confirmed_type || '—'} capitalize />
              </div>

              {/* Services Table */}
              <div>
                <div className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wide mb-2 font-manrope">
                  Services Breakdown
                </div>
                <div className="border border-gray-200 rounded-xl overflow-hidden overflow-x-auto bg-white">
                  <table className="w-full min-w-[280px]">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-[10px] font-extrabold text-gray-500 uppercase tracking-wide w-12">Srno</th>
                        <th className="px-4 py-3 text-left text-[10px] font-extrabold text-gray-500 uppercase tracking-wide">Service</th>
                        <th className="px-4 py-3 text-right text-[10px] font-extrabold text-gray-500 uppercase tracking-wide whitespace-nowrap">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {services.length > 0 ? services.map((s, i) => (
                        <tr key={i} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-gray-600 text-xs font-medium">{i + 1}</td>
                          <td className="px-4 py-3 text-gray-800 text-xs font-medium break-words">{s.service || '—'}</td>
                          <td className="px-4 py-3 text-right text-gray-800 text-xs font-bold whitespace-nowrap">{formatCurrency(s.total_price || 0)}</td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan="3" className="px-4 py-8 text-center text-gray-400 text-sm">No services found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totals */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <div className="flex justify-between font-manrope text-sm py-2 font-medium text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-800">{formatCurrency(bill.subtotal)}</span>
                </div>
                <div className="flex justify-between font-manrope text-sm py-2 font-medium text-gray-600 border-b border-gray-200 pb-3">
                  <span>Tax ({bill.tax_percent || 0}%)</span>
                  <span className="font-bold text-amber-600">{formatCurrency(bill.tax_amount)}</span>
                </div>
                <div className="flex justify-between font-manrope text-base pt-3 font-extrabold">
                  <span className="text-brand-dark">Total Amount</span>
                  <span className="text-brand text-lg">{formatCurrency(bill.total_amount)}</span>
                </div>
              </div>

              {/* Address */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5 font-manrope text-xs text-gray-700 leading-relaxed break-words">
                <span className="font-bold text-gray-500 block mb-1 text-[10px] uppercase tracking-wide">📍 Delivery Address</span>
                {[bill.house_no, bill.building_name, bill.full_address, bill.city, bill.state, bill.pincode]
                  .filter(Boolean).map(part => escapeHtml(part)).join(', ')}
              </div>

            </div>
          )}
        </div>

      </div>
    </Modal>
  );
};

/* Reusable info card */
const InfoCard = ({ label, value, mono, capitalize }) => (
  <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-200 hover:border-brand-light hover:shadow-sm transition-all">
    <div className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wide mb-1 font-manrope">
      {label}
    </div>
    <div className={clsx(
      'font-manrope text-sm font-bold text-gray-900 break-all',
      mono && 'font-mono text-xs',
      capitalize && 'capitalize'
    )}>
      {value || '—'}
    </div>
  </div>
);