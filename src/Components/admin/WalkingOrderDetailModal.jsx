// src/components/admin/WalkingOrderDetailModal.jsx
// NEW FLOW: Requested → Final Quotation → Original/Duplicate Confirm → Repairing → Repair Done → Delivered → Completed
import { useState, useEffect } from 'react';
import Modal from '../shared/Modal';
import Button from '../shared/Button';
import Badge from '../shared/Badge';
import StatusTimeline from './StatusTimeline';
import ImageLightbox from './ImageLightbox';
import adminApi from '../../services/adminApi';
import { useAdmin } from '../../hooks/useAdmin';
import { useToast } from '../../hooks/useUI';
import { normalizeStatus, isVideoFile } from '../../utils/adminHelpers';
import { DEBOUNCE_DELAY } from '../../utils/constants';

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

// New simplified walking flow — no initial quotation
const getWalkingNextStatuses = (currentStatus) => {
  if (currentStatus === 'Requested')            return ['Cancelled'];                    // must send final quotation first
  if (currentStatus === 'final_quotation_sent') return ['Cancelled'];                    // must confirm via inline panel
  if (currentStatus === 'Final_Confirmed')      return ['Repairing', 'Cancelled'];
  if (currentStatus === 'Repairing')            return ['Repair Done', 'Cancelled'];
  if (currentStatus === 'Repair Done')          return ['Delivered', 'Cancelled'];
  if (currentStatus === 'Delivered')            return ['Completed', 'Cancelled'];
  if (currentStatus === 'Completed' || currentStatus === 'Cancelled') return [];
  return ['Cancelled'];
};

const WalkingOrderDetailModal = ({
  isOpen,
  onClose,
  order,
  onViewBill,
  onViewFinalQuotation,
  onSendFinalQuotation,
  onMarkPaid,
}) => {
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState('');

  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [pendingStatus, setPendingStatus]       = useState('');

  // Inline final confirm after sending final quotation
  const [showInlineFinalConfirm, setShowInlineFinalConfirm] = useState(false);
  const [finalConfirmType, setFinalConfirmType]             = useState('original');
  const [confirmingFinal, setConfirmingFinal]               = useState(false);

  const [lightboxOpen, setLightboxOpen]   = useState(false);
  const [lightboxImages, setLightboxImages] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const { fetchOrders } = useAdmin();
  const { showToast }   = useToast();

  useEffect(() => {
    if (isOpen && order) {
      setSelectedStatus('');
      setShowInlineFinalConfirm(false);
    }
  }, [isOpen, order?.id]);

  const openStatusConfirmPopup = () => {
    if (!selectedStatus) {
      showToast('⚠️ Please select a status to update', 'warning');
      return;
    }
    setPendingStatus(selectedStatus);
    setShowConfirmPopup(true);
  };

  const handleUpdateStatus = async () => {
    if (updatingStatus) return;
    const now = Date.now();
    if (now - lastUpdateTime < DEBOUNCE_DELAY) {
      showToast('Please wait a moment before updating again...', 'warning');
      return;
    }
    setUpdatingStatus(true);
    setLastUpdateTime(now);
    setShowConfirmPopup(false);
    try {
      let data;
      if (pendingStatus === 'Cancelled') {
        const res = await adminApi.cancelWalkingOrder(order.id);
        data = res.data;
      } else {
        const res = await adminApi.updateOrderStatus(order.id, pendingStatus);
        data = res.data;
      }
      if (data.status === 'success') {
        showToast(`✅ Status updated to "${pendingStatus}"`, 'success');
        setSelectedStatus('');
        setPendingStatus('');
        setTimeout(() => window.location.reload(), 1500);
      } else {
        showToast(`❌ ${data.message || 'Update failed'}`, 'error');
      }
    } catch {
      showToast('❌ Network error. Please try again.', 'error');
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Called from WalkingOrdersPage after FinalQuotationAdminModal saves successfully
  const handleShowFinalConfirm = () => {
    setFinalConfirmType('original');
    setShowInlineFinalConfirm(true);
  };

  const handleInlineFinalConfirm = async () => {
    if (confirmingFinal) return;
    setConfirmingFinal(true);
    try {
      const res = await adminApi.confirmWalkingFinalOrder(order.id, finalConfirmType);
      if (res.data.status === 'success') {
        showToast(`✅ Order confirmed with ${finalConfirmType} quotation!`, 'success');
        setShowInlineFinalConfirm(false);
        setTimeout(() => window.location.reload(), 1200);
      } else {
        showToast(`❌ ${res.data.message || 'Confirm failed'}`, 'error');
      }
    } catch {
      showToast('❌ Network error during confirm', 'error');
    } finally {
      setConfirmingFinal(false);
    }
  };

  const openLightbox = (images, index) => {
    setLightboxImages(images);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  if (!isOpen || !order) return null;

  const currentStatus    = normalizeStatus(order.status);
  const nextStatuses     = getWalkingNextStatuses(currentStatus);
  const canSendFinalQuote = currentStatus === 'Requested';
  const finalQuoteSent   = currentStatus === 'final_quotation_sent';

  // Media
  const photos    = Array.isArray(order.photo_path) ? order.photo_path : (order.photo_path ? [order.photo_path] : []);
  const imageUrls = [];
  const videoUrls = [];
  photos.forEach(p => {
    const url = p.startsWith('http') ? p : `${API_BASE}${p}`;
    if (isVideoFile(url)) videoUrls.push(url);
    else imageUrls.push(`${url}?_=${Date.now()}`);
  });

  const address = [
    order.house_no, order.building_name, order.full_address,
    order.landmark ? `Near ${order.landmark}` : '',
    order.city, order.state, order.pincode,
  ].filter(Boolean).join(', ');

  const availableStatuses = nextStatuses.filter(s => s !== 'Cancel');

  const getStatusColor = (status) => {
    const colors = {
      Final_Confirmed: '#059669', Repairing: '#f59e0b', 'Repair Done': '#06b6d4',
      Delivered: '#6366f1', Completed: '#22c55e', Cancelled: '#ef4444',
    };
    return colors[status] || '#1d4ed8';
  };

  const walkingInfoMessage = () => {
    if (currentStatus === 'Requested')            return { color: 'warning', msg: '📋 Send Final Quotation using the button below. After sending, select Original or Duplicate to confirm directly.' };
    if (currentStatus === 'final_quotation_sent') return { color: 'info',    msg: '✅ Final quotation sent. Confirm directly by selecting Original or Duplicate below — no customer action needed.' };
    if (currentStatus === 'Final_Confirmed')      return { color: 'info',    msg: '🔧 Quotation confirmed. Update status to "Repairing" to begin repair.' };
    if (currentStatus === 'Repair Done')          return { color: 'success', msg: '🛠️ Repair done! Update to "Delivered" when device is handed to the customer.' };
    if (currentStatus === 'Delivered')            return { color: 'success', msg: '📦 Device delivered. Mark the bill paid and set status to "Completed".' };
    return null;
  };

  const info = walkingInfoMessage();

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={`🚶 Walk-in Order — ${order.model_name || 'Device'}`}
        size="xlarge"
      >
        {/* Walking badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          padding: '4px 12px', borderRadius: '9999px', marginBottom: '16px',
          background: 'linear-gradient(135deg,#1d4ed820,#2563eb10)',
          border: '1.5px solid #bfdbfe',
          fontFamily: "'Manrope',sans-serif", fontSize: '11px', fontWeight: 800,
          color: '#1d4ed8', letterSpacing: '0.3px',
        }}>
          <i className="fas fa-person-walking" /> WALK-IN ORDER — Admin Managed
        </div>

        <div style={{ maxHeight: '80vh', overflowY: 'auto', padding: '4px' }}>

          {/* Timeline */}
          <div style={{ marginBottom: '20px' }}>
            <SectionTitle>Repair Progress</SectionTitle>
            <StatusTimeline currentStatus={currentStatus} />
            <div style={{ textAlign: 'center', marginTop: '8px' }}>
              <Badge status={currentStatus} />
            </div>
          </div>

          {/* Two Column */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '22px', marginBottom: '20px' }}>
            <Section title="Device Information">
              <InfoGrid>
                <InfoField label="Category"  value={order.category_name || '—'} />
                <InfoField label="Brand"      value={order.brand_name    || '—'} />
                <InfoField label="Model"      value={order.model_name    || '—'} fullWidth />
                <InfoField label="Order Date" value={order.created_at ? new Date(order.created_at).toLocaleString('en-IN') : '—'} fullWidth />
              </InfoGrid>
            </Section>

            <Section title="Customer Information">
              <InfoGrid>
                <InfoField label="Name"             value={order.customer_name || order.user_name || '—'} />
                <InfoField label="Mobile"           value={order.mobile_no    || '—'} />
                <InfoField label="Alternate Mobile" value={order.alternate_mobile || '—'} fullWidth />
                <InfoField label="Address"          value={address || '—'} fullWidth />
              </InfoGrid>
            </Section>
          </div>

          {/* Problem Details */}
          <Section title="Problem Details" fullWidth>
            <InfoGrid>
              <InfoField label="Problem Title" value={order.problem_title       || '—'} fullWidth />
              <InfoField label="Description"   value={order.problem_description || '—'} fullWidth />
            </InfoGrid>

            {(imageUrls.length > 0 || videoUrls.length > 0) && (
              <div style={{ marginTop: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: 700, color: '#4b6a9b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                  📷 Device Media — click image to zoom
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {imageUrls.map((url, i) => (
                    <img key={i} src={url} alt={`Device ${i + 1}`}
                      onClick={() => openLightbox(imageUrls, i)}
                      style={{ width: '80px', height: '80px', borderRadius: '10px', objectFit: 'cover', cursor: 'pointer', border: '2px solid transparent', transition: 'all 0.3s', boxShadow: '0 2px 8px rgba(29,78,216,0.07)' }}
                      onMouseEnter={e => { e.target.style.borderColor='#1d4ed8'; e.target.style.transform='scale(1.06)'; }}
                      onMouseLeave={e => { e.target.style.borderColor='transparent'; e.target.style.transform='scale(1)'; }}
                    />
                  ))}
                  {videoUrls.map((url, i) => (
                    <video key={i} src={url} controls
                      style={{ width: '80px', height: '80px', borderRadius: '10px', objectFit: 'cover', background: '#000' }}
                    />
                  ))}
                </div>
              </div>
            )}
          </Section>

          {/* ── Final Quotation Section (Requested or final_quotation_sent) ── */}
          {(canSendFinalQuote || finalQuoteSent || showInlineFinalConfirm) && (
            <div style={{ background: 'linear-gradient(135deg,#fdf2f8,#fce7f3)', border: '2px solid #fbcfe8', borderRadius: '22px', padding: '20px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', paddingBottom: '11px', borderBottom: '2px dashed #fbcfe8' }}>
                <h4 style={{ fontFamily: "'Sora',sans-serif", fontSize: '15px', fontWeight: 800, color: '#9d174d', margin: 0 }}>
                  📋 Final Quotation
                </h4>
                <span style={{ background: 'linear-gradient(135deg,#9d174d,#be185d)', color: '#fff', fontFamily: "'Manrope',sans-serif", fontSize: '9px', fontWeight: 800, padding: '3px 10px', borderRadius: '9999px' }}>
                  ORDER #{order.id}
                </span>
              </div>

              {/* Step 1: Send Final Quotation button */}
              {canSendFinalQuote && !showInlineFinalConfirm && (
                <>
                  <InfoBox color="warning" style={{ marginBottom: '13px' }}>
                    📋 Fill in the final quotation details below and send. You can then confirm directly with Original or Duplicate.
                  </InfoBox>
                  <Button
                    onClick={() => onSendFinalQuotation(order.id)}
                    style={{ width: '100%', background: 'linear-gradient(135deg,#9d174d,#be185d)', boxShadow: '0 4px 14px rgba(157,23,77,0.3)' }}
                  >
                    📋 Fill &amp; Send Final Quotation
                  </Button>
                </>
              )}

              {/* Step 2: After final quotation sent — inline confirm */}
              {(finalQuoteSent || showInlineFinalConfirm) && (
                <>
                  <InfoBox color="success" style={{ marginBottom: '14px' }}>
                    ✅ Final quotation sent. Select which quotation the customer agreed to and confirm directly.
                  </InfoBox>

                  <div style={{ marginBottom: '8px', fontFamily: "'Manrope',sans-serif", fontSize: '11px', fontWeight: 800, color: '#9d174d', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Confirm With Which Quotation?
                  </div>
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
                    {['original', 'duplicate'].map(opt => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setFinalConfirmType(opt)}
                        style={{
                          flex: 1, padding: '13px', borderRadius: '14px',
                          fontFamily: "'Manrope',sans-serif", fontSize: '13px', fontWeight: 700,
                          cursor: 'pointer', textTransform: 'capitalize',
                          border: finalConfirmType === opt ? '2px solid #9d174d' : '1.5px solid #fbcfe8',
                          background: finalConfirmType === opt ? 'linear-gradient(135deg,#9d174d,#be185d)' : '#fff',
                          color: finalConfirmType === opt ? '#fff' : '#9d174d',
                          transition: 'all 0.2s',
                        }}
                      >
                        {opt === 'original' ? '🟢 Original Quotation' : '🔵 Duplicate / Alternate'}
                      </button>
                    ))}
                  </div>

                  <Button
                    onClick={handleInlineFinalConfirm}
                    loading={confirmingFinal}
                    style={{ width: '100%', background: 'linear-gradient(135deg,#059669,#047857)', boxShadow: '0 4px 14px rgba(5,150,105,0.3)' }}
                  >
                    ✅ Confirm Order with {finalConfirmType === 'original' ? 'Original' : 'Duplicate'} Quotation → Start Repairing
                  </Button>
                </>
              )}
            </div>
          )}

          {/* Status Update */}
          <Section title="🔄 Update Order Status" fullWidth>
            <div style={{ marginBottom: '12px', fontSize: '13px', color: '#4b6a9b', fontWeight: 600 }}>
              Current Status: <strong style={{ color: '#1d4ed8' }}>{currentStatus}</strong>
            </div>

            {availableStatuses.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontFamily: "'Manrope',sans-serif", fontSize: '11px', fontWeight: 700, color: '#4b6a9b', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Change Status To:
                </label>
                <select
                  value={selectedStatus}
                  onChange={e => setSelectedStatus(e.target.value)}
                  disabled={updatingStatus}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: '#f0f4ff', border: '1.5px solid rgba(37,99,235,0.15)', fontFamily: "'Manrope',sans-serif", fontSize: '13px', fontWeight: 600, color: '#0a1628', cursor: 'pointer', outline: 'none', marginBottom: '12px' }}
                >
                  <option value="">-- Select Status --</option>
                  {availableStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>

                <Button
                  onClick={openStatusConfirmPopup}
                  disabled={!selectedStatus || updatingStatus}
                  style={{ width: '100%', background: 'linear-gradient(135deg,#1d4ed8,#2563eb)', boxShadow: '0 4px 14px rgba(29,78,216,0.3)' }}
                >
                  {updatingStatus ? 'Updating...' : 'Update Status →'}
                </Button>
              </div>
            )}

            {availableStatuses.length === 0 && (
              <div style={{ fontSize: '13px', color: '#7a9cc4', padding: '12px', background: '#f0f4ff', borderRadius: '12px', textAlign: 'center' }}>
                {currentStatus === 'Completed' ? '✅ Order is completed.' : currentStatus === 'Cancelled' ? '❌ Order is cancelled.' : 'No further updates available.'}
              </div>
            )}

            {info && <InfoBox color={info.color} style={{ marginTop: '12px' }}>{info.msg}</InfoBox>}
          </Section>

          {/* Quick Actions */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
            <Button variant="success" onClick={() => onViewBill(order.id)} style={{ flex: 1 }}>
              🧾 View Bill
            </Button>

            {['final_quotation_sent','Final_Confirmed','Repairing','Repair Done','Delivered','Completed'].includes(currentStatus) && (
              <Button
                variant="secondary"
                onClick={() => onViewFinalQuotation(order.id)}
                style={{ flex: 1, background: 'linear-gradient(135deg,#374151,#1F2937)', color: '#fff' }}
              >
                👁 View Final Quotation
              </Button>
            )}

            {(currentStatus === 'Delivered' || currentStatus === 'Completed') && (
              <Button
                onClick={() => onMarkPaid(order.id)}
                style={{ flex: 1, background: 'linear-gradient(135deg,#7C3AED,#6D28D9)', boxShadow: '0 4px 15px rgba(124,58,237,0.35)' }}
              >
                💰 Mark Bill Paid
              </Button>
            )}
          </div>

        </div>
      </Modal>

      {/* Confirm Status Popup */}
      {showConfirmPopup && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setShowConfirmPopup(false)}
        >
          <div
            style={{ background: '#fff', borderRadius: '24px', maxWidth: '420px', width: '90%', padding: '28px', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ width: '64px', height: '64px', background: `${getStatusColor(pendingStatus)}20`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <i className="fas fa-question-circle" style={{ fontSize: '32px', color: getStatusColor(pendingStatus) }} />
            </div>
            <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: '20px', fontWeight: 800, color: '#0a1628', marginBottom: '8px' }}>Update Order Status?</h3>
            <p style={{ fontFamily: "'Manrope',sans-serif", fontSize: '14px', color: '#4b6a9b', marginBottom: '20px', lineHeight: 1.6 }}>
              Change status from <strong style={{ color: '#1d4ed8' }}>"{currentStatus}"</strong> to <strong style={{ color: getStatusColor(pendingStatus) }}>"{pendingStatus}"</strong>?
            </p>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowConfirmPopup(false)}
                style={{ flex: 1, padding: '12px', borderRadius: '14px', fontFamily: "'Manrope',sans-serif", fontSize: '14px', fontWeight: 700, background: '#f0f4ff', border: '1.5px solid rgba(37,99,235,0.09)', color: '#4b6a9b', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStatus}
                disabled={updatingStatus}
                style={{ flex: 1, padding: '12px', borderRadius: '14px', fontFamily: "'Manrope',sans-serif", fontSize: '14px', fontWeight: 700, background: `linear-gradient(135deg,${getStatusColor(pendingStatus)},${getStatusColor(pendingStatus)}cc)`, border: 'none', color: '#fff', cursor: updatingStatus ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                {updatingStatus ? (
                  <><div style={{ width: '16px', height: '16px', border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} /> Updating...</>
                ) : (
                  <><i className="fas fa-check-circle" /> Yes, Update</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <ImageLightbox images={lightboxImages} isOpen={lightboxOpen} onClose={() => setLightboxOpen(false)} startIndex={lightboxIndex} />

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
};

// ── Helper components ─────────────────────────────────────────────────────────

const SectionTitle = ({ children }) => (
  <div style={{ fontSize: '11px', fontWeight: 800, color: '#4b6a9b', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '13px', paddingBottom: '9px', borderBottom: '2px solid rgba(37,99,235,0.09)', display: 'flex', alignItems: 'center', gap: '8px' }}>
    <span style={{ width: '4px', height: '16px', background: 'linear-gradient(135deg,#1d4ed8,#2563eb,#1e40af)', borderRadius: '10px' }} />
    {children}
  </div>
);

const Section = ({ title, children, fullWidth }) => (
  <div style={{ gridColumn: fullWidth ? '1 / -1' : 'auto', marginBottom: '20px' }}>
    <SectionTitle>{title}</SectionTitle>
    {children}
  </div>
);

const InfoGrid = ({ children }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '11px' }}>
    {children}
  </div>
);

const InfoField = ({ label, value, children, fullWidth }) => (
  <div style={{ background: '#f0f4ff', borderRadius: '16px', padding: '13px 15px', border: '1.5px solid rgba(37,99,235,0.09)', gridColumn: fullWidth ? '1 / -1' : 'auto' }}>
    <label style={{ fontFamily: "'Manrope',sans-serif", fontSize: '10px', fontWeight: 800, color: '#7a9cc4', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '5px' }}>
      {label}
    </label>
    <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: '13.5px', fontWeight: 700, color: '#0a1628', wordBreak: 'break-word' }}>
      {children || value}
    </span>
  </div>
);

const InfoBox = ({ children, color = 'info', style }) => {
  const colors = {
    info:    { bg: '#eff6ff', border: '#bfdbfe', text: '#1d4ed8' },
    warning: { bg: '#fffbeb', border: '#fde68a', text: '#b45309' },
    success: { bg: '#f0fdf4', border: '#bbf7d0', text: '#059669' },
    error:   { bg: '#fef2f2', border: '#fca5a5', text: '#dc2626' },
  };
  const c = colors[color];
  return (
    <div style={{ padding: '10px 14px', background: c.bg, border: `1.5px solid ${c.border}`, borderRadius: '10px', fontSize: '12px', color: c.text, fontFamily: "'Manrope',sans-serif", fontWeight: 600, lineHeight: 1.5, ...style }}>
      {children}
    </div>
  );
};

export default WalkingOrderDetailModal;