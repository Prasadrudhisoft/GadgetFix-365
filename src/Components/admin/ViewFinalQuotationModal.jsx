import { useState, useEffect } from 'react';
import Modal from '../shared/Modal';
import Spinner from '../shared/Spinner';
import adminApi from '../../services/adminApi';
import { formatCurrency, isVideoFile } from '../../utils/adminHelpers';

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const ViewFinalQuotationModal = ({ isOpen, onClose, orderId }) => {
  const [quotation, setQuotation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && orderId) {
      fetchQuotation();
    }
  }, [isOpen, orderId]);

  const fetchQuotation = async () => {
    setLoading(true);
    try {
      const { data } = await adminApi.getFinalQuotation(orderId);
      if (data.status === 'success' && data.final_quotation) {
        setQuotation(data.final_quotation);
      } else {
        setQuotation(null);
      }
    } catch (error) {
      console.error('Fetch final quotation error:', error);
      setQuotation(null);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setQuotation(null);
    setLoading(true);
    onClose();
  };

  if (!isOpen) return null;

  // ✅ FIX: color-aware styles passed per table type
  const getThStyle = (color) => ({
    padding: '9px 11px',
    textAlign: 'left',
    fontSize: '10px',
    fontWeight: 800,
    color: color === 'green' ? '#065f46' : '#1e40af',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  });

  const getTdStyle = (color) => ({
    padding: '9px 11px',
    borderBottom: `1px solid ${color === 'green' ? '#a7f3d0' : '#bfdbfe'}`,
    color: '#1e3a5f',
  });

  const renderServicesTable = (services, title, color) => {
    if (!services || !services.length) {
      return (
        <p style={{ color: '#7a9cc4', fontSize: '12px', textAlign: 'center', marginBottom: '14px' }}>
          No services
        </p>
      );
    }

    const thS = getThStyle(color);
    const tdS = getTdStyle(color);

    return (
      <>
        {/* ✅ FIX: label color matches table type */}
        <div style={{
          fontSize: '11px',
          fontWeight: 700,
          color: color === 'green' ? '#059669' : '#1d4ed8',
          textTransform: 'uppercase',
          marginBottom: '6px',
          letterSpacing: '0.5px',
        }}>
          {title}
        </div>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '13px',
          marginBottom: '8px',
          borderRadius: '16px',
          overflow: 'hidden',
        }}>
          <thead>
            <tr style={{ background: color === 'green' ? '#ecfdf5' : '#eff6ff' }}>
              <th style={thS}>#</th>
              <th style={thS}>Service</th>
              <th style={{ ...thS, textAlign: 'right' }}>Qty</th>
              <th style={{ ...thS, textAlign: 'right' }}>Unit</th>
              <th style={{ ...thS, textAlign: 'right' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s, i) => (
              // ✅ FIX: alternating row bg tinted to match table color
              <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : (color === 'green' ? '#f0fdf4' : '#f5f9ff') }}>
                <td style={tdS}>{i + 1}</td>
                <td style={tdS}>{s.service || '—'}</td>
                <td style={{ ...tdS, textAlign: 'right' }}>{s.quantity || 1}</td>
                <td style={{ ...tdS, textAlign: 'right' }}>{formatCurrency(s.price_per_q || 0)}</td>
                <td style={{ ...tdS, textAlign: 'right', fontWeight: 700 }}>{formatCurrency(s.total_price || 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Final Quotation Details"
      subtitle="Quotation sent after device inspection"
      size="large"
      headerColor="gray"
    >
      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center' }}>
          <Spinner size="large" />
        </div>
      ) : !quotation ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#7a9cc4' }}>
          Final quotation not found.
        </div>
      ) : (
        <>
          {/* Info Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '11px',
            marginBottom: '14px',
          }}>
            <InfoField label="Customer" value={quotation.name || '—'} />
            <InfoField label="Mobile" value={quotation.mobile_no || '—'} />
            <InfoField label="Device" value={`${quotation.brand_name || ''} ${quotation.model_name || '—'}`} />
            <InfoField label="Category" value={quotation.category_name || '—'} />
            <InfoField label="Problem (Technician)" value={quotation.problem_as_per_technician || '—'} fullWidth />
            {quotation.problem_description_as_per_technician && (
              <InfoField label="Tech Notes" value={quotation.problem_description_as_per_technician} fullWidth />
            )}
          </div>

          {/* Media */}
          {quotation.device_media?.length > 0 && (
            <div style={{ marginBottom: '14px' }}>
              <div style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#7a9cc4',
                textTransform: 'uppercase',
                marginBottom: '8px',
              }}>
                Device Media
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {quotation.device_media.map((url, i) => {
                  const fullUrl = url.startsWith('http') ? url : `${API_BASE}${url}`;
                  if (isVideoFile(fullUrl)) {
                    return (
                      <video
                        key={i}
                        src={fullUrl}
                        controls
                        style={{ width: '80px', height: '80px', borderRadius: '10px', objectFit: 'cover', background: '#000' }}
                      />
                    );
                  }
                  return (
                    <img
                      key={i}
                      src={fullUrl}
                      alt={`Media ${i + 1}`}
                      style={{ width: '80px', height: '80px', borderRadius: '10px', objectFit: 'cover' }}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Primary / Blue Table */}
          {renderServicesTable(quotation.service, 'Primary / Original Services', 'blue')}

          <div style={{
            background: '#eff6ff',
            borderRadius: '16px',
            padding: '14px',
            marginBottom: '14px',
            border: '2px solid #bfdbfe',
          }}>
            <TotalRow label="Subtotal" value={formatCurrency(quotation.total_amount)} />
            <TotalRow
              label={`Tax (${quotation.tax_percent || 0}%)`}
              value={formatCurrency(
                (parseFloat(quotation.total_amount_inc_tax) || 0) - (parseFloat(quotation.total_amount) || 0)
              )}
            />
            <TotalRow label="Grand Total" value={formatCurrency(quotation.total_amount_inc_tax)} isGrand color="#1d4ed8" borderColor="#bfdbfe" />
          </div>

          {/* Duplicate / Green Table */}
          {renderServicesTable(quotation.duplicate_service, 'Duplicate / Alternate Services', 'green')}

          {quotation.duplicate_service?.length > 0 && (
            <div style={{
              background: '#ecfdf5',
              borderRadius: '16px',
              padding: '14px',
              border: '2px solid #a7f3d0',
              marginBottom: '14px',
            }}>
              <TotalRow label="Subtotal" value={formatCurrency(quotation.duplicate_total_amount)} />
              <TotalRow
                label={`Tax (${quotation.duplicate_tax_percent || 0}%)`}
                value={formatCurrency(
                  (parseFloat(quotation.duplicate_total_inc_tax) || 0) - (parseFloat(quotation.duplicate_total_amount) || 0)
                )}
              />
              <TotalRow label="Grand Total" value={formatCurrency(quotation.duplicate_total_inc_tax)} isGrand color="#059669" borderColor="#6ee7b7" />
            </div>
          )}

          <div style={{ marginTop: '16px', textAlign: 'right' }}>
            <button
              onClick={handleClose}
              style={{
                padding: '10px 18px',
                borderRadius: '16px',
                background: 'white',
                color: '#4b6a9b',
                fontFamily: "'Manrope', sans-serif",
                fontSize: '13px',
                fontWeight: 700,
                border: '1.5px solid rgba(37, 99, 235, 0.18)',
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
        </>
      )}
    </Modal>
  );
};

const InfoField = ({ label, value, fullWidth }) => (
  <div style={{
    background: '#f0f4ff',
    borderRadius: '16px',
    padding: '11px 13px',
    border: '1px solid rgba(37, 99, 235, 0.09)',
    gridColumn: fullWidth ? '1 / -1' : 'auto',
  }}>
    <label style={{
      fontFamily: "'Manrope', sans-serif",
      fontSize: '10px',
      fontWeight: 800,
      color: '#7a9cc4',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      display: 'block',
      marginBottom: '4px',
    }}>
      {label}
    </label>
    <span style={{
      fontFamily: "'Manrope', sans-serif",
      fontSize: '13px',
      fontWeight: 700,
      color: '#0a1628',
    }}>
      {value}
    </span>
  </div>
);

// ✅ FIX: accepts borderColor prop for dashed separator line
const TotalRow = ({ label, value, isGrand, color = '#0a1628', borderColor = '#e2e8f0' }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    fontFamily: "'Manrope', sans-serif",
    fontSize: isGrand ? '15px' : '13px',
    padding: '4px 0',
    color: isGrand ? color : '#0a1628',
    ...(isGrand && {
      fontWeight: 800,
      borderTop: `2px dashed ${borderColor}`,
      paddingTop: '9px',
      marginTop: '7px',
    }),
  }}>
    <span style={{ fontWeight: isGrand ? 800 : 600 }}>{label}</span>
    <span style={{ fontWeight: 700 }}>{value}</span>
  </div>
);

export default ViewFinalQuotationModal;