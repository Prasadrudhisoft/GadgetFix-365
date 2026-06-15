// Components/modals/FinalQuotationModal.jsx
import { useState, useEffect } from 'react';
import Modal from '../shared/Modal';
import Button from '../shared/Button';
import Spinner from '../shared/Spinner';
import { useUI } from '../../hooks/useUI';
import { ordersAPI } from '../../services/api';
import { formatCurrency } from '../../utils/formatters';
import { escapeHtml, isVideoFile } from '../../utils/helpers';
import { getImageUrl } from '../../services/api';

export const FinalQuotationModal = ({ isOpen, onClose, orderId, onConfirmSuccess }) => {
  const { showToast } = useUI();
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirming, setIsConfirming] = useState(false);
  const [quotation, setQuotation] = useState(null);
  const [selectedType, setSelectedType] = useState('original');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && orderId) {
      fetchFinalQuotation();
    }
  }, [isOpen, orderId]);

  const safeParseJSON = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (typeof data === 'string') {
      try {
        const parsed = JSON.parse(data);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  const fetchFinalQuotation = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await ordersAPI.getFinalQuotation(orderId);
      if (data.status === 'success' && data.final_quotation) {
        let q = data.final_quotation;
        q.service = safeParseJSON(q.service);
        q.duplicate_service = safeParseJSON(q.duplicate_service);
        q.device_media = safeParseJSON(q.device_media);
        setQuotation(q);
      } else {
        setError(data.message || 'Final quotation not available.');
        showToast(data.message || 'Final quotation not available.', 'error');
        onClose();
      }
    } catch (error) {
      console.error('Fetch final quotation error:', error);
      setError('Could not load final quotation. Please try again.');
      showToast('❌ Could not load final quotation. Please try again.', 'error');
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      const result = await ordersAPI.confirmFinalOrder(orderId, selectedType);
      if (result.status === 'success') {
        showToast(`✅ Final order confirmed with ${selectedType} parts!`, 'success');
        if (onConfirmSuccess) onConfirmSuccess();
        onClose();
      } else {
        showToast(`❌ ${result.message || 'Could not confirm final order.'}`, 'error');
      }
    } catch (error) {
      console.error('Confirm final order error:', error);
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
  const mediaArr = Array.isArray(quotation?.device_media) ? quotation.device_media : [];

  return (
   <Modal isOpen={isOpen} onClose={onClose} size="lg" showCloseButton={false}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #9d174d, #be185d)',
        padding: '24px 28px',
        color: '#fff',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        borderRadius: '16px 16px 0 0',
      }}>
        <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: '20px', fontWeight: 800, margin: 0, letterSpacing: '-0.3px' }}>
          Final Quotation
        </h2>
        <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: '13px', opacity: 0.85, fontWeight: 500, margin: '4px 0 0' }}>
          Quotation sent after device inspection
        </p>
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '14px', right: '14px',
            width: '34px', height: '34px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)', border: 'none',
            color: '#fff', cursor: 'pointer', fontSize: '14px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <i className="fas fa-times"></i>
        </button>
      </div>

      {/* Body */}
      <div style={{
        padding: '24px 28px',
        maxHeight: 'calc(90vh - 220px)',
        overflowY: 'auto',
        background: '#f5f7fa',
      }}>
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '64px 0' }}>
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '64px 0', color: '#7a9cc4' }}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>⚠️</div>
            <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: '14px' }}>{error}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Warning Banner */}
            <div style={{
              background: '#fffbeb',
              border: '1px solid rgba(245,158,11,0.3)',
              borderRadius: '12px',
              padding: '14px 16px',
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-start',
            }}>
              <span style={{ fontSize: '22px', flexShrink: 0 }}>🔍</span>
              <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: '13px', color: '#b45309', fontWeight: 600, lineHeight: 1.6 }}>
                This is the <strong>final quotation</strong> after your device was physically inspected by our technician. Please review carefully before confirming.
              </span>
            </div>

            {/* Device & Customer Info */}
            <div>
              <div style={sectionLabelStyle}>Device & Customer</div>
              <div style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '12px 14px',
                fontFamily: "'Manrope', sans-serif",
                fontSize: '12px',
                color: '#334155',
                lineHeight: 1.8,
              }}>
                <strong>{escapeHtml(quotation.name || '—')}</strong> · 📞 {escapeHtml(quotation.mobile_no || '—')}<br />
                📱 {escapeHtml(quotation.brand_name || '')} {escapeHtml(quotation.model_name || '—')} ({escapeHtml(quotation.category_name || '—')})<br />
                🔧 {escapeHtml(quotation.problem_title || '—')}
                {quotation.problem_as_per_technician && (
                  <><br />🛠️ <em>Tech: {escapeHtml(quotation.problem_as_per_technician)}</em></>
                )}
                {quotation.problem_description_as_per_technician && (
                  <><br />📝 {escapeHtml(quotation.problem_description_as_per_technician)}</>
                )}
              </div>
            </div>

            {/* Device Media */}
            {mediaArr.length > 0 && (
              <div>
                <div style={sectionLabelStyle}>Device Media (by Technician)</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {mediaArr.map((media, idx) => {
                    const url = getImageUrl(media);
                    const isVideo = isVideoFile(url);
                    return isVideo ? (
                      <video key={idx} src={url} controls
                        style={{ width: '100px', height: '80px', objectFit: 'cover', borderRadius: '10px', background: '#000' }} />
                    ) : (
                      <img key={idx} src={url} alt="Device photo"
                        style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '10px', cursor: 'pointer' }}
                        onClick={() => window.open(url, '_blank')}
                        onError={(e) => { e.target.style.display = 'none'; }} />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Parts Type Selection */}
            <div>
              <div style={sectionLabelStyle}>Choose Parts Type</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>

                {/* Original / OEM */}
                <button
                  onClick={() => setSelectedType('original')}
                  style={{
                    border: `2px solid ${selectedType === 'original' ? '#be185d' : '#e2e8f0'}`,
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    background: selectedType === 'original' ? '#fdf2f8' : '#ffffff',
                    boxShadow: selectedType === 'original' ? '0 4px 12px rgba(190,24,93,0.12)' : 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '6px', fontFamily: "'Manrope', sans-serif" }}>
                    Original / OEM Parts
                  </div>
                  <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '22px', fontWeight: 900, color: '#0f172a', marginBottom: '6px' }}>
                    {formatCurrency(parseFloat(quotation?.total_amount_inc_tax) || 0)}
                  </div>
                  <span style={{
                    fontSize: '10px', fontWeight: 800, padding: '3px 10px', borderRadius: '999px',
                    background: selectedType === 'original' ? '#fdf2f8' : '#f1f5f9',
                    color: selectedType === 'original' ? '#be185d' : '#64748b',
                    border: `1px solid ${selectedType === 'original' ? '#fbcfe8' : '#e2e8f0'}`,
                    fontFamily: "'Manrope', sans-serif",
                  }}>
                    Genuine OEM
                  </span>
                </button>

                {/* Duplicate / Compatible */}
                <button
                  onClick={() => setSelectedType('duplicate')}
                  style={{
                    border: `2px solid ${selectedType === 'duplicate' ? '#0284c7' : '#e2e8f0'}`,
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    background: selectedType === 'duplicate' ? '#f0f9ff' : '#ffffff',
                    boxShadow: selectedType === 'duplicate' ? '0 4px 12px rgba(2,132,199,0.12)' : 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '6px', fontFamily: "'Manrope', sans-serif" }}>
                    Duplicate / Compatible
                  </div>
                  <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '22px', fontWeight: 900, color: '#0f172a', marginBottom: '6px' }}>
                    {formatCurrency(parseFloat(quotation?.duplicate_total_inc_tax) || 0)}
                  </div>
                  <span style={{
                    fontSize: '10px', fontWeight: 800, padding: '3px 10px', borderRadius: '999px',
                    background: selectedType === 'duplicate' ? '#f0f9ff' : '#f1f5f9',
                    color: selectedType === 'duplicate' ? '#0284c7' : '#64748b',
                    border: `1px solid ${selectedType === 'duplicate' ? '#bae6fd' : '#e2e8f0'}`,
                    fontFamily: "'Manrope', sans-serif",
                  }}>
                    Compatible
                  </span>
                </button>

              </div>
            </div>

            {/* Services Table */}
            <div>
              <div style={sectionLabelStyle}>
                Services ({isOriginal ? 'Original' : 'Duplicate'})
              </div>
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                  <thead>
                    <tr style={{ background: '#f1f5f9' }}>
                      <th style={thStyle}>#</th>
                      <th style={thStyle}>Service</th>
                      <th style={{ ...thStyle, textAlign: 'right' }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.length > 0 ? (
                      services.map((s, i) => (
                        <tr key={i} style={{
                          background: i % 2 === 0 ? '#ffffff' : '#f8fafc',
                          borderBottom: '1px solid #e2e8f0',
                        }}>
                          <td style={tdStyle}>{i + 1}</td>
                          <td style={{ ...tdStyle, fontWeight: 500 }}>{s.service || '—'}</td>
                          <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 700 }}>{formatCurrency(s.total_price || 0)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr style={{ background: '#f8fafc' }}>
                        <td colSpan="3" style={{ padding: '16px', textAlign: 'center', color: '#94a3b8', fontSize: '12px' }}>
                          No services listed
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals */}
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={totalRowStyle}>
                <span style={{ color: '#64748b' }}>Subtotal</span>
                <span style={{ color: '#0f172a', fontWeight: 700 }}>{formatCurrency(subtotal)}</span>
              </div>
              <div style={{ ...totalRowStyle, borderBottom: 'none' }}>
                <span style={{ color: '#64748b' }}>Tax ({escapeHtml(String(taxPct || 0))}%)</span>
                <span style={{ color: '#0f172a', fontWeight: 700 }}>{formatCurrency(taxAmt)}</span>
              </div>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '14px 16px',
                background: '#fdf2f8',
                fontFamily: "'Manrope', sans-serif",
                fontSize: '14px', fontWeight: 800,
              }}>
                <span style={{ color: '#be185d' }}>Grand Total</span>
                <span style={{ color: '#be185d' }}>{formatCurrency(grand)}</span>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Footer */}
      {!isLoading && !error && (
        <div style={{
          padding: '14px 28px',
          borderTop: '1px solid #e2e8f0',
          background: '#f5f7fa',
          display: 'flex',
          gap: '10px',
          justifyContent: 'flex-end',
          position: 'sticky',
          bottom: 0,
          borderRadius: '0 0 16px 16px',
        }}>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={isConfirming}
          >
            {isConfirming ? 'Confirming...' : '✅ Confirm Final Order'}
          </Button>
        </div>
      )}

    </Modal>
  );
};

export default FinalQuotationModal;

// ── Shared style objects ──────────────────────────────────────────────────────

const sectionLabelStyle = {
  fontSize: '11px',
  fontWeight: 800,
  color: '#94a3b8',
  textTransform: 'uppercase',
  letterSpacing: '0.6px',
  marginBottom: '8px',
  fontFamily: "'Manrope', sans-serif",
};

const thStyle = {
  padding: '9px 12px',
  textAlign: 'left',
  fontSize: '10px',
  fontWeight: 800,
  color: '#64748b',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  fontFamily: "'Manrope', sans-serif",
};

const tdStyle = {
  padding: '9px 12px',
  color: '#1e293b',
  fontFamily: "'Manrope', sans-serif",
  fontSize: '12px',
};

const totalRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '10px 16px',
  borderBottom: '1px solid #e2e8f0',
  background: '#f8fafc',
  fontFamily: "'Manrope', sans-serif",
  fontSize: '12px',
  fontWeight: 600,
};