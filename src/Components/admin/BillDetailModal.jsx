import { useState, useEffect } from 'react';
import Modal from '../shared/Modal';
import Badge from '../shared/Badge';
import Spinner from '../shared/Spinner';
import adminApi from '../../services/adminApi';
import { formatCurrency } from '../../utils/adminHelpers';

const BillDetailModal = ({ isOpen, onClose, orderId }) => {
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && orderId) {
      fetchBill();
    }
  }, [isOpen, orderId]);

  const fetchBill = async () => {
    setLoading(true);
    try {
      const { data } = await adminApi.getBill(orderId);
      if (data.status === 'success') {
        setBill(data.bill);
      } else {
        setBill(null);
      }
    } catch (error) {
      console.error('Fetch bill error:', error);
      setBill(null);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setBill(null);
    setLoading(true);
    onClose();
  };

  if (!isOpen) return null;

  const typeLabel = bill?.confirmed_type === 'duplicate' ? '🔄 Duplicate / Alternate' : '✅ Primary';
  const services = Array.isArray(bill?.services) && bill.services.length ? bill.services : [];

  return (
    <>
      <style>{`
        /* ============================================
           BILL DETAIL MODAL - FULLY RESPONSIVE
           Desktop → Tablet → Mobile (all breakpoints)
        ============================================ */
        
        /* Base responsive container */
        .bdm-container {
          width: 100%;
          max-width: 100%;
        }

        /* ─── GRID: 2 columns on desktop, 1 column on mobile ──────────────── */
        .bdm-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 20px;
        }

        /* Tablet (768px - 1023px): still 2 columns but smaller gap */
        @media (max-width: 1023px) and (min-width: 768px) {
          .bdm-grid {
            gap: 10px;
          }
        }

        /* Mobile (below 768px) → 1 column */
        @media (max-width: 767px) {
          .bdm-grid {
            grid-template-columns: 1fr;
            gap: 10px;
          }
        }

        /* Very small mobile (below 480px) → tighter gap */
        @media (max-width: 480px) {
          .bdm-grid {
            gap: 8px;
          }
        }

        /* ─── FIELD STYLES (touch-friendly) ───────────────────────────────── */
        .bdm-field {
          background: #f0f4ff;
          border-radius: 14px;
          padding: 12px 14px;
          border: 1px solid rgba(37, 99, 235, 0.09);
          transition: all 0.2s ease;
          word-break: break-word;
        }

        /* Hover effect only on devices that support hover (desktop) */
        @media (hover: hover) {
          .bdm-field:hover {
            border-color: rgba(37, 99, 235, 0.25);
            background: #f8faff;
            transform: translateY(-1px);
          }
        }

        .bdm-field.full-width {
          grid-column: 1 / -1;
        }

        /* Mobile: slightly reduced padding for compactness */
        @media (max-width: 767px) {
          .bdm-field {
            padding: 10px 12px;
          }
        }

        @media (max-width: 480px) {
          .bdm-field {
            padding: 9px 11px;
          }
        }

        .bdm-field-label {
          font-size: 10px;
          font-weight: 800;
          color: #7a9cc4;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          display: block;
          margin-bottom: 5px;
        }

        /* Tablet+ font size stays, mobile slightly smaller */
        .bdm-field-value {
          font-size: 14px;
          font-weight: 700;
          color: #0a1628;
          word-break: break-word;
          line-height: 1.4;
        }

        @media (max-width: 767px) {
          .bdm-field-value {
            font-size: 13px;
          }
        }

        @media (max-width: 480px) {
          .bdm-field-value {
            font-size: 12.5px;
          }
        }

        /* ─── SECTION LABEL ───────────────────────────────────────────────── */
        .bdm-section-label {
          font-size: 11px;
          font-weight: 800;
          color: #7a9cc4;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .bdm-section-label::before {
          content: '';
          width: 4px;
          height: 16px;
          background: linear-gradient(135deg, #1d4ed8, #2563eb);
          border-radius: 4px;
          display: inline-block;
        }

        @media (max-width: 480px) {
          .bdm-section-label {
            font-size: 10px;
            margin-bottom: 10px;
          }
        }

        /* ─── SERVICES TABLE (fully responsive with horizontal scroll) ────── */
        .bdm-table-wrap {
          width: 100%;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          border-radius: 14px;
          margin-bottom: 16px;
          /* subtle shadow on edges to indicate scrollability on mobile */
          background: linear-gradient(to right, white 30%, rgba(255,255,255,0)),
                      linear-gradient(to left, white 30%, rgba(255,255,255,0));
          background-position: 0 0, 100% 0;
          background-repeat: no-repeat;
          background-size: 0px 0px;
        }

        /* Shadow indicators for scroll on mobile (optional, but nice) */
        @media (max-width: 767px) {
          .bdm-table-wrap {
            background-size: 20px 100%, 20px 100%;
            background-attachment: local, local;
          }
        }

        .bdm-table {
          width: 100%;
          min-width: 480px; /* Prevents columns from becoming too narrow on desktop, but allows scroll on mobile */
          border-collapse: collapse;
          font-size: 13px;
        }

        /* For very small screens, adjust min-width to be more compact */
        @media (max-width: 550px) {
          .bdm-table {
            min-width: 420px;
          }
        }

        @media (max-width: 420px) {
          .bdm-table {
            min-width: 360px;
          }
        }

        .bdm-th {
          background: #ecfdf5;
          padding: 11px 12px;
          text-align: left;
          font-size: 11px;
          font-weight: 800;
          color: #065f46;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          white-space: nowrap;
        }

        .bdm-th.center { text-align: center; }
        .bdm-th.right  { text-align: right; }

        .bdm-td {
          padding: 11px 12px;
          border-bottom: 1px solid #a7f3d0;
          color: #1e3a5f;
          font-size: 13px;
          transition: background 0.2s;
        }

        /* Row hover effect (desktop only) */
        @media (hover: hover) {
          .bdm-table tbody tr:hover .bdm-td {
            background: #f0fdfa;
          }
        }

        .bdm-td.center { text-align: center; }
        .bdm-td.right  { text-align: right; }
        .bdm-td.bold   { font-weight: 700; }

        /* Mobile: adjust padding */
        @media (max-width: 767px) {
          .bdm-th, .bdm-td {
            padding: 9px 10px;
            font-size: 12px;
          }
        }

        @media (max-width: 480px) {
          .bdm-th, .bdm-td {
            padding: 8px 8px;
            font-size: 11.5px;
          }
        }

        /* ─── TOTALS BOX ───────────────────────────────────────────────────── */
        .bdm-totals {
          background: #ecfdf5;
          border-radius: 16px;
          border: 2px solid #a7f3d0;
          padding: 16px 18px;
          margin-bottom: 20px;
        }

        @media (max-width: 767px) {
          .bdm-totals {
            padding: 14px 16px;
          }
        }

        @media (max-width: 480px) {
          .bdm-totals {
            padding: 12px 14px;
          }
        }

        .bdm-total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13.5px;
          padding: 6px 0;
          flex-wrap: wrap;
        }

        .bdm-total-row.grand {
          font-size: 15px;
          font-weight: 800;
          color: #065f46;
          border-top: 2px dashed #6ee7b7;
          padding-top: 12px;
          margin-top: 8px;
        }

        .bdm-total-label {
          font-weight: 600;
          color: #4b6a9b;
        }

        .bdm-total-label.grand {
          font-weight: 800;
          color: #065f46;
        }

        .bdm-total-value {
          font-weight: 700;
          color: #0a1628;
        }

        @media (max-width: 480px) {
          .bdm-total-row {
            font-size: 12.5px;
            padding: 5px 0;
          }
          .bdm-total-row.grand {
            font-size: 14px;
            padding-top: 10px;
          }
        }

        /* ─── CLOSE BUTTON (fully responsive, touch-optimized) ────────────── */
        .bdm-close-wrap {
          text-align: right;
          margin-top: 8px;
        }

        .bdm-close-btn {
          display: inline-block;
          padding: 12px 26px;
          border-radius: 14px;
          background: white;
          color: #4b6a9b;
          font-size: 14px;
          font-weight: 700;
          border: 1.5px solid rgba(37, 99, 235, 0.18);
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
          -webkit-tap-highlight-color: transparent;
          text-align: center;
        }

        /* On mobile, make button full width for easier tapping */
        @media (max-width: 767px) {
          .bdm-close-wrap {
            text-align: center;
          }
          .bdm-close-btn {
            display: block;
            width: 100%;
            padding: 14px 20px;
            font-size: 15px;
          }
        }

        @media (hover: hover) {
          .bdm-close-btn:hover {
            background: #f0f4ff;
            border-color: #2563eb;
            transform: translateY(-1px);
          }
        }

        .bdm-close-btn:active {
          transform: scale(0.97);
        }

        /* ─── LOADING & EMPTY STATES ───────────────────────────────────────── */
        .bdm-spinner-container {
          padding: 60px 20px;
          text-align: center;
        }

        .bdm-empty-state {
          padding: 50px 20px;
          text-align: center;
          color: #7a9cc4;
          font-size: 14px;
          font-weight: 600;
        }

        @media (max-width: 480px) {
          .bdm-spinner-container {
            padding: 40px 16px;
          }
          .bdm-empty-state {
            padding: 40px 16px;
            font-size: 13px;
          }
        }

        /* ─── BADGE OVERRIDES FOR PAYMENT STATUS (ensures consistency) ─────── */
        .badge-paid {
          background: #ecfdf5;
          color: #059669;
          border: 1px solid #a7f3d0;
        }
        .badge-unpaid, .badge-pending {
          background: #fffbeb;
          color: #b45309;
          border: 1px solid #fde68a;
        }
      `}</style>

      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Bill Details"
        subtitle={
          bill
            ? `Bill #${(bill.bill_id || '').slice(0, 8).toUpperCase()} · ${new Date(bill.created_at).toLocaleDateString('en-IN')}`
            : 'Loading...'
        }
        size="large"
        headerColor="green"
      >
        {loading ? (
          <div className="bdm-spinner-container">
            <Spinner size="large" />
          </div>
        ) : !bill ? (
          <div className="bdm-empty-state">
            Bill not found for this order.
          </div>
        ) : (
          <div className="bdm-container">
            {/* Bill Info Grid - fully responsive */}
            <div className="bdm-grid">
              <BillField label="Customer" value={bill.user_name || '—'} />
              <BillField label="Mobile" value={bill.mobile_no || '—'} />
              <BillField label="Device Model" value={bill.model_name || '—'} />
              <BillField
                label="Category / Brand"
                value={`${bill.category_name || '—'} / ${bill.brand_name || '—'}`}
              />
              <BillField label="Quotation Type" value={typeLabel} />
              <BillField label="Payment Status">
                <PaymentBadge status={bill.payment_status} />
              </BillField>
              <BillField
                label="Address"
                fullWidth
                value={[
                  bill.house_no,
                  bill.building_name,
                  bill.full_address,
                  bill.landmark ? `Near ${bill.landmark}` : '',
                  bill.city,
                  bill.state,
                  bill.pincode
                ].filter(Boolean).join(', ') || '—'}
              />
              <BillField label="Problem" value={bill.problem_title || '—'} fullWidth />
            </div>

            {/* Services Section */}
            <div className="bdm-section-label">Services / Parts</div>

            {/* Horizontally scrollable table wrapper */}
            <div className="bdm-table-wrap">
              <table className="bdm-table">
                <thead>
                  <tr>
                    <th className="bdm-th">Service / Part</th>
                    <th className="bdm-th center">Qty</th>
                    <th className="bdm-th right">Unit Price</th>
                    <th className="bdm-th right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {services.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="bdm-empty-state" style={{ background: 'transparent', padding: '24px' }}>
                        No services listed
                      </td>
                    </tr>
                  ) : (
                    services.map((service, index) => (
                      <tr key={index}>
                        <td className="bdm-td">{service.service || '—'}</td>
                        <td className="bdm-td center">{service.quantity || 1}</td>
                        <td className="bdm-td right">{formatCurrency(service.price_per_q || 0)}</td>
                        <td className="bdm-td right bold">{formatCurrency(service.total_price || 0)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Totals Section */}
            <div className="bdm-totals">
              <div className="bdm-total-row">
                <span className="bdm-total-label">Subtotal</span>
                <span className="bdm-total-value">{formatCurrency(bill.subtotal || 0)}</span>
              </div>
              <div className="bdm-total-row">
                <span className="bdm-total-label">Tax ({bill.tax_percent || 0}%)</span>
                <span className="bdm-total-value">{formatCurrency(bill.tax_amount || 0)}</span>
              </div>
              <div className="bdm-total-row grand">
                <span className="bdm-total-label grand">Total Payable</span>
                <span className="bdm-total-value">{formatCurrency(bill.total_amount || 0)}</span>
              </div>
            </div>

            {/* Close Button - full width on mobile, inline on desktop */}
            <div className="bdm-close-wrap">
              <button className="bdm-close-btn" onClick={handleClose}>
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

// Helper component for responsive Bill Field
const BillField = ({ label, value, children, fullWidth }) => (
  <div className={`bdm-field${fullWidth ? ' full-width' : ''}`}>
    <label className="bdm-field-label">{label}</label>
    <div className="bdm-field-value">{children || value}</div>
  </div>
);

// Payment badge with proper responsive styling
const PaymentBadge = ({ status }) => {
  const normalized = (status || '').toLowerCase();
  let displayText = (status || 'UNPAID').toUpperCase();
  let badgeClass = 'badge-unpaid';

  if (normalized === 'paid') {
    badgeClass = 'badge-paid';
    displayText = 'PAID';
  } else if (normalized === 'pending') {
    badgeClass = 'badge-pending';
    displayText = 'PENDING';
  } else if (normalized === 'unpaid') {
    badgeClass = 'badge-unpaid';
    displayText = 'UNPAID';
  }

  return (
    <span className={`badge ${badgeClass}`} style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      padding: '4px 12px',
      borderRadius: '9999px',
      fontSize: '11px',
      fontWeight: '800',
      whiteSpace: 'nowrap'
    }}>
      {displayText}
    </span>
  );
};

export default BillDetailModal;