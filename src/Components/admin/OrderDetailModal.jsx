// src/components/admin/OrderDetailModal.jsx
import { useState, useEffect } from 'react';
import Modal from '../shared/Modal';
import Input from '../shared/Input';
import Textarea from '../shared/Textarea';
import Select from '../shared/Select';
import Button from '../shared/Button';
import Badge from '../shared/Badge';
import Spinner from '../shared/Spinner';
import StatusTimeline from './StatusTimeline';
import QuotationForm from './QuotationForm';
import ImageLightbox from './ImageLightbox';
import adminApi from '../../services/adminApi';
import { useAdmin } from '../../hooks/useAdmin';
import { useToast } from '../../hooks/useUI';
import { normalizeStatus, getNextStatuses, isVideoFile } from '../../utils/adminHelpers';
import { DEBOUNCE_DELAY } from '../../utils/constants';

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const OrderDetailModal = ({
  isOpen,
  onClose,
  order,
  onViewBill,
  onViewTempQuotation,
  onViewFinalQuotation,
  onSendFinalQuotation,
  onMarkPaid
}) => {
  const [confirmTypes, setConfirmTypes] = useState({ t_type: null, f_type: null });
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [sendingQuotation, setSendingQuotation] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState('');

  // Confirmation Popup State
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [pendingStatus, setPendingStatus] = useState('');

  // Quotation form state
  const [activeTab, setActiveTab] = useState('primary');
  const [problemTech, setProblemTech] = useState('');
  const [problemDescTech, setProblemDescTech] = useState('');
  const [primaryServices, setPrimaryServices] = useState([]);
  const [primaryTax, setPrimaryTax] = useState(0);
  const [duplicateServices, setDuplicateServices] = useState([]);
  const [duplicateTax, setDuplicateTax] = useState(0);

  // Lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const { fetchOrders } = useAdmin();
  const { showToast } = useToast();

  useEffect(() => {
    if (isOpen && order) {
      fetchConfirmTypes();
      resetQuotationForm();
      setSelectedStatus('');
    }
  }, [isOpen, order?.id]);

  const fetchConfirmTypes = async () => {
    if (!order?.id) return;

    try {
      const { data } = await adminApi.getConfirmTypes(order.id);
      if (data.status === 'success') {
        setConfirmTypes({ t_type: data.t_type, f_type: data.f_type });
      }
    } catch (error) {
      console.error('Fetch confirm types error:', error);
    }
  };

  const resetQuotationForm = () => {
    setProblemTech('');
    setProblemDescTech('');
    setPrimaryServices([]);
    setPrimaryTax(0);
    setDuplicateServices([]);
    setDuplicateTax(0);
    setActiveTab('primary');
  };

  // Open confirmation popup before updating status
  const openStatusConfirmPopup = () => {
    if (!selectedStatus) {
      showToast('⚠️ Please select a status to update', 'warning');
      return;
    }
    setPendingStatus(selectedStatus);
    setShowConfirmPopup(true);
  };

  // Actual status update function
  const handleUpdateStatus = async () => {
    if (updatingStatus) {
      showToast('Please wait, status update in progress...', 'warning');
      return;
    }

    const now = Date.now();
    if (now - lastUpdateTime < DEBOUNCE_DELAY) {
      showToast('Please wait a moment before updating again...', 'warning');
      return;
    }

    setUpdatingStatus(true);
    setLastUpdateTime(now);
    setShowConfirmPopup(false);

    try {
      const { data } = await adminApi.updateOrderStatus(order.id, pendingStatus);

      if (data.status === 'success') {
        showToast(`✅ Status updated to "${pendingStatus}"`, 'success');
        setSelectedStatus('');
        setPendingStatus('');

        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        showToast(`❌ ${data.message || 'Update failed'}`, 'error');
      }
    } catch (error) {
      console.error('Update status error:', error);
      showToast('❌ Network error. Please try again.', 'error');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleSendQuotation = async () => {
    if (sendingQuotation) {
      showToast('Please wait, quotation is being sent...', 'warning');
      return;
    }

    if (!problemTech.trim()) {
      showToast('⚠️ Enter problem as per technician', 'error');
      return;
    }

    if (!primaryServices.length || !primaryServices.some(s => s.service && s.quantity > 0 && s.price_per_q > 0)) {
      showToast('⚠️ Add at least one valid service in Primary Quotation', 'error');
      return;
    }

    setSendingQuotation(true);

    const primarySubtotal = primaryServices.reduce((sum, s) => sum + (s.total_price || 0), 0);
    const primaryGrand = primarySubtotal + (primarySubtotal * primaryTax / 100);

    const duplicateSubtotal = duplicateServices.reduce((sum, s) => sum + (s.total_price || 0), 0);
    const duplicateGrand = duplicateSubtotal + (duplicateSubtotal * duplicateTax / 100);

    const payload = {
      order_id: order.id,
      problem_as_per_technician: problemTech.trim(),
      problem_description_as_per_technician: problemDescTech.trim(),
      services: primaryServices.filter(s => s.service && s.quantity > 0),
      total_amount: parseFloat(primarySubtotal.toFixed(2)),
      tax_percentage: primaryTax,
      total_amount_inc_tax: parseFloat(primaryGrand.toFixed(2)),
      duplicate_service: duplicateServices.filter(s => s.service && s.quantity > 0),
      duplicate_total_amount: parseFloat(duplicateSubtotal.toFixed(2)),
      duplicate_tax_percentage: duplicateTax,
      duplicate_total_inc_tax: parseFloat(duplicateGrand.toFixed(2))
    };

    try {
      const { data } = await adminApi.sendQuotation(payload);

      if (data.status === 'success') {
        showToast(`✅ Quotation sent! Total: ₹${primaryGrand.toFixed(2)}`, 'success');

        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        showToast(`❌ ${data.message || 'Failed to send quotation'}`, 'error');
      }
    } catch (error) {
      console.error('Send quotation error:', error);
      showToast('❌ Network error while sending quotation', 'error');
    } finally {
      setSendingQuotation(false);
    }
  };

  const openLightbox = (images, index) => {
    setLightboxImages(images);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  if (!isOpen || !order) return null;

  const currentStatus = normalizeStatus(order.status);
  const nextStatuses = getNextStatuses(currentStatus);
  const canSendQuote = currentStatus === 'Requested';
  const alreadyQuoted = currentStatus === 'quotation_sent';

  // Prepare media
  const photos = Array.isArray(order.photo_path) ? order.photo_path : (order.photo_path ? [order.photo_path] : []);
  const imageUrls = [];
  const videoUrls = [];

  photos.forEach(p => {
    const url = p.startsWith('http') ? p : `${API_BASE}${p}`;
    if (isVideoFile(url)) {
      videoUrls.push(url);
    } else {
      imageUrls.push(`${url}?_=${Date.now()}`);
    }
  });

  const address = [
    order.house_no,
    order.building_name,
    order.full_address,
    order.landmark ? `Near ${order.landmark}` : '',
    order.city,
    order.state,
    order.pincode
  ].filter(Boolean).join(', ');

  // Filter next statuses - remove Cancel if it's not appropriate
  const availableStatuses = nextStatuses.filter(s => {
    if (currentStatus === 'Requested' && s === 'Cancel') return false;
    if (currentStatus === 'final_quotation_sent' && s === 'Cancel') return false;
    return true;
  });

  // Get status color for popup
  const getStatusColor = (status) => {
    const colors = {
      'Confirmed': '#10b981',
      'Picked Up': '#3b82f6',
      'Reviewed': '#8b5cf6',
      'Final_Confirmed': '#059669',
      'Repairing': '#f59e0b',
      'Repair Done': '#06b6d4',
      'Delivered': '#6366f1',
      'Completed': '#22c55e',
      'Cancelled': '#ef4444'
    };
    return colors[status] || '#1d4ed8';
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={`📋 Order — ${order.model_name || 'Device'}`}
        size="xlarge"
      >
        <div style={{ maxHeight: '80vh', overflowY: 'auto', padding: '4px' }}>

          {/* Timeline */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{
              fontSize: '11px',
              fontWeight: 800,
              color: '#4b6a9b',
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              marginBottom: '13px',
              paddingBottom: '9px',
              borderBottom: '2px solid rgba(37, 99, 235, 0.09)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{
                width: '4px',
                height: '16px',
                background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #1e40af 100%)',
                borderRadius: '10px'
              }} />
              Repair Progress
            </div>
            <StatusTimeline currentStatus={currentStatus} />
            <div style={{ textAlign: 'center', marginTop: '8px' }}>
              <Badge status={currentStatus} />
            </div>
          </div>

          {/* Two Column Layout */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '22px',
            marginBottom: '20px'
          }}>

            {/* Device Info */}
            <Section title="Device Information">
              <InfoGrid>
                <InfoField label="Category" value={order.category_name || '—'} />
                <InfoField label="Brand" value={order.brand_name || '—'} />
                <InfoField label="Model" value={order.model_name || '—'} fullWidth />
                <InfoField
                  label="Order Date"
                  value={order.created_at ? new Date(order.created_at).toLocaleString('en-IN') : '—'}
                  fullWidth
                />

                {confirmTypes.t_type && (
                  <InfoField label="Temporary Parts Selected by User" fullWidth>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '3px 10px',
                      borderRadius: '20px',
                      background: confirmTypes.t_type === 'original' ? '#eff6ff' : '#f0f9ff',
                      color: confirmTypes.t_type === 'original' ? '#1d4ed8' : '#0284c7',
                      border: `1px solid ${confirmTypes.t_type === 'original' ? '#bfdbfe' : '#bae6fd'}`,
                      fontSize: '12px',
                      fontWeight: 800
                    }}>
                      🔩 {confirmTypes.t_type.charAt(0).toUpperCase() + confirmTypes.t_type.slice(1)}
                    </span>
                  </InfoField>
                )}

                {confirmTypes.f_type && (
                  <InfoField label="Final Parts Confirmed" fullWidth>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '3px 10px',
                      borderRadius: '20px',
                      background: '#f0fdf4',
                      color: '#059669',
                      border: '1px solid #bbf7d0',
                      fontSize: '12px',
                      fontWeight: 800
                    }}>
                      ✅ Final: {confirmTypes.f_type.charAt(0).toUpperCase() + confirmTypes.f_type.slice(1)}
                    </span>
                  </InfoField>
                )}
              </InfoGrid>
            </Section>

            {/* Customer Info */}
            <Section title="Customer Information">
              <InfoGrid>
                <InfoField label="Name" value={order.user_name || '—'} />
                <InfoField label="Mobile" value={order.mobile_no || '—'} />
                <InfoField label="Alternate Mobile" value={order.alternate_mobile || '—'} fullWidth />
                <InfoField label="Address" value={address} fullWidth />
              </InfoGrid>
            </Section>
          </div>

          {/* Problem Details */}
          <Section title="Problem Details" fullWidth>
            <InfoGrid>
              <InfoField label="Problem Title" value={order.problem_title || '—'} fullWidth />
              <InfoField label="Description" value={order.problem_description || '—'} fullWidth />
            </InfoGrid>

            {/* Media */}
            {(imageUrls.length > 0 || videoUrls.length > 0) && (
              <div style={{ marginTop: '12px' }}>
                <div style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  color: '#4b6a9b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '8px'
                }}>
                  📷 Device Media — click image to zoom
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {imageUrls.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt={`Device ${i + 1}`}
                      onClick={() => openLightbox(imageUrls, i)}
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '10px',
                        objectFit: 'cover',
                        cursor: 'pointer',
                        border: '2px solid transparent',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: '0 2px 8px rgba(29, 78, 216, 0.07), 0 1px 3px rgba(0, 0, 0, 0.04)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.borderColor = '#1d4ed8';
                        e.target.style.transform = 'scale(1.06)';
                        e.target.style.boxShadow = '0 4px 16px rgba(29, 78, 216, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.borderColor = 'transparent';
                        e.target.style.transform = 'scale(1)';
                        e.target.style.boxShadow = '0 2px 8px rgba(29, 78, 216, 0.07), 0 1px 3px rgba(0, 0, 0, 0.04)';
                      }}
                    />
                  ))}

                  {videoUrls.map((url, i) => (
                    <video
                      key={i}
                      src={url}
                      controls
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '10px',
                        objectFit: 'cover',
                        background: '#000',
                        boxShadow: '0 2px 8px rgba(29, 78, 216, 0.07), 0 1px 3px rgba(0, 0, 0, 0.04)'
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </Section>

          {/* Status Update Box */}
          <Section title="🔄 Update Order Status" fullWidth>
            <div style={{ marginBottom: '12px', fontSize: '13px', color: '#4b6a9b', fontWeight: 600 }}>
              Current Status: <strong style={{ color: '#1d4ed8' }}>{currentStatus}</strong>
            </div>

            {/* Status Dropdown */}
            {availableStatuses.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#4b6a9b',
                  display: 'block',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Change Status To:
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  disabled={updatingStatus}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    background: '#f0f4ff',
                    border: '1.5px solid rgba(37, 99, 235, 0.15)',
                    fontFamily: "'Manrope', sans-serif",
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#0a1628',
                    cursor: 'pointer',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    marginBottom: '12px'
                  }}
                >
                  <option value="">-- Select Status --</option>
                  {availableStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>

                <Button
                  onClick={openStatusConfirmPopup}
                  disabled={!selectedStatus || updatingStatus}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #1d4ed8, #2563eb)',
                    boxShadow: '0 4px 14px rgba(29, 78, 216, 0.3)'
                  }}
                >
                  {updatingStatus ? 'Updating...' : 'Update Status →'}
                </Button>
              </div>
            )}

            {availableStatuses.length === 0 && !updatingStatus && (
              <div style={{
                fontSize: '13px',
                color: '#7a9cc4',
                padding: '12px',
                background: '#f0f4ff',
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                {currentStatus === 'Completed' ? '✅ Order is completed.' :
                  currentStatus === 'Cancelled' ? '❌ Order is cancelled.' :
                    'No further updates available.'}
              </div>
            )}

            {/* Info Messages */}
            {currentStatus === 'Requested' && (
              <InfoBox color="warning" style={{ marginTop: '12px' }}>
                ℹ️ Please send a quotation first. Status can be updated after customer confirms.
              </InfoBox>
            )}

            {currentStatus === 'quotation_sent' && (
              <InfoBox color="warning" style={{ marginTop: '12px' }}>
                ℹ️ Waiting for customer to confirm the quotation. Status will update automatically after confirmation.
              </InfoBox>
            )}

            {currentStatus === 'Reviewed' && (
              <InfoBox color="warning" style={{ marginTop: '12px' }}>
                ℹ️ Please send the <strong>Final Quotation</strong> first using the button below.
                Status cannot be changed until the customer confirms it.
              </InfoBox>
            )}

            {currentStatus === 'final_quotation_sent' && (
              <InfoBox color="warning" style={{ marginTop: '12px' }}>
                ℹ️ Waiting for customer to confirm the final quotation. Status will update automatically after confirmation.
              </InfoBox>
            )}

            {currentStatus === 'Repair Done' && (
              <InfoBox color="success" style={{ marginTop: '12px' }}>
                ✅ Repair is done! Update status to <strong>Delivered</strong> when device is handed over.
              </InfoBox>
            )}
          </Section>

          {/* Quick Actions */}
          <div style={{
            display: 'flex',
            gap: '10px',
            flexWrap: 'wrap',
            marginBottom: '20px'
          }}>
            <Button
              variant="success"
              onClick={() => onViewBill(order.id)}
              style={{ flex: 1 }}
            >
              🧾 View Bill
            </Button>

            {['quotation_sent', 'Confirmed', 'Picked Up', 'Reviewed', 'final_quotation_sent',
              'Final_Confirmed', 'Repairing', 'Repair Done', 'Delivered', 'Completed'].includes(currentStatus) && (
                <Button
                  variant="secondary"
                  onClick={() => onViewTempQuotation(order.id)}
                  style={{ flex: 1, background: 'linear-gradient(135deg, #db2777, #9d174d)', color: '#fff' }}
                >
                  📄 View Initial Quotation
                </Button>
              )}

            {currentStatus === 'Delivered' && (
              <Button
                onClick={() => onMarkPaid(order.id)}
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #7C3AED, #6D28D9)',
                  boxShadow: '0 4px 15px rgba(124, 58, 237, 0.35)'
                }}
              >
                💰 Mark Bill Paid
              </Button>
            )}

            {currentStatus === 'Reviewed' && (
              <Button
                onClick={() => onSendFinalQuotation(order.id)}
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #9D174D, #BE185D)'
                }}
              >
                📋 Send Final Quotation
              </Button>
            )}

            {['final_quotation_sent', 'Final_Confirmed', 'Repairing', 'Repair Done', 'Delivered', 'Completed'].includes(currentStatus) && (
              <Button
                variant="secondary"
                onClick={() => onViewFinalQuotation(order.id)}
                style={{ flex: 1, background: 'linear-gradient(135deg, #374151, #1F2937)', color: '#fff' }}
              >
                👁 View Final Quotation
              </Button>
            )}
          </div>

          {/* Quotation Form */}
          {(canSendQuote || alreadyQuoted) && (
            <div style={{
              background: 'linear-gradient(135deg, #fdf2f8, #fce7f3)',
              border: '2px solid #fbcfe8',
              borderRadius: '22px',
              padding: '20px',
              marginBottom: '20px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '14px',
                paddingBottom: '11px',
                borderBottom: '2px dashed #fbcfe8'
              }}>
                <h4 style={{
                  fontFamily: "'Sora', sans-serif",
                  fontSize: '15px',
                  fontWeight: 800,
                  color: '#9d174d',
                  margin: 0
                }}>
                  💬 Send Quotation
                </h4>
                <span style={{
                  background: 'linear-gradient(135deg, #9d174d, #be185d)',
                  color: '#fff',
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: '9px',
                  fontWeight: 800,
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  letterSpacing: '0.5px'
                }}>
                  ORDER #{order.id}
                </span>
              </div>

              {alreadyQuoted && (
                <div style={{
                  padding: '11px 13px',
                  background: '#ecfdf5',
                  border: '2px solid #a7f3d0',
                  borderRadius: '16px',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#059669',
                  marginBottom: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  ✅ Quotation has already been sent for this order.
                </div>
              )}

              <div style={{ marginBottom: '10px', fontSize: '11px', fontWeight: 800, color: '#9d174d', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                Technician Diagnosis
              </div>

              <Input
                label="Problem as per Technician"
                value={problemTech}
                onChange={(e) => setProblemTech(e.target.value)}
                placeholder="e.g. Cracked display, faulty battery connector"
                disabled={alreadyQuoted}
              />

              <Textarea
                label="Technician's Notes"
                value={problemDescTech}
                onChange={(e) => setProblemDescTech(e.target.value)}
                placeholder="Detailed technical findings..."
                disabled={alreadyQuoted}
              />

              <div style={{ height: '2px', background: 'linear-gradient(90deg, transparent, #fbcfe8, transparent)', margin: '12px 0' }} />

              {/* Tabs */}
              <div style={{
                display: 'flex',
                border: '2px solid #fbcfe8',
                borderRadius: '16px',
                overflow: 'hidden',
                marginBottom: '14px'
              }}>
                <button
                  type="button"
                  onClick={() => setActiveTab('primary')}
                  disabled={alreadyQuoted}
                  style={{
                    flex: 1,
                    padding: '10px',
                    textAlign: 'center',
                    fontFamily: "'Manrope', sans-serif",
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: alreadyQuoted ? 'not-allowed' : 'pointer',
                    border: 'none',
                    background: activeTab === 'primary' ? 'linear-gradient(135deg, #9d174d, #be185d)' : '#fff',
                    color: activeTab === 'primary' ? '#fff' : '#9d174d',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  Primary Quotation
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('duplicate')}
                  disabled={alreadyQuoted}
                  style={{
                    flex: 1,
                    padding: '10px',
                    textAlign: 'center',
                    fontFamily: "'Manrope', sans-serif",
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: alreadyQuoted ? 'not-allowed' : 'pointer',
                    border: 'none',
                    background: activeTab === 'duplicate' ? 'linear-gradient(135deg, #9d174d, #be185d)' : '#fff',
                    color: activeTab === 'duplicate' ? '#fff' : '#9d174d',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  Duplicate / Alternate
                </button>
              </div>

              {/* Quotation Forms */}
              {activeTab === 'primary' && (
                <QuotationForm
                  type="primary"
                  services={primaryServices}
                  onChange={setPrimaryServices}
                  taxPercent={primaryTax}
                  onTaxChange={setPrimaryTax}
                />
              )}

              {activeTab === 'duplicate' && (
                <QuotationForm
                  type="duplicate"
                  services={duplicateServices}
                  onChange={setDuplicateServices}
                  taxPercent={duplicateTax}
                  onTaxChange={setDuplicateTax}
                />
              )}

              {!alreadyQuoted && (
                <Button
                  onClick={handleSendQuotation}
                  loading={sendingQuotation}
                  style={{
                    width: '100%',
                    marginTop: '14px',
                    background: 'linear-gradient(135deg, #9d174d, #be185d)',
                    boxShadow: '0 4px 14px rgba(157, 23, 77, 0.3)'
                  }}
                >
                  💬 Send Quotation to Customer
                </Button>
              )}
            </div>
          )}

          {!canSendQuote && !alreadyQuoted && currentStatus !== 'Requested' && (
            <InfoBox color="info">
              Quotation can be sent when order is in <strong>Requested</strong> status.
            </InfoBox>
          )}

        </div>
      </Modal>

      {/* Confirmation Popup Modal */}
      {showConfirmPopup && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'fadeIn 0.2s ease'
        }} onClick={() => setShowConfirmPopup(false)}>
          <div style={{
            background: 'white',
            borderRadius: '24px',
            maxWidth: '420px',
            width: '90%',
            padding: '28px',
            textAlign: 'center',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            animation: 'slideUp 0.3s ease'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{
              width: '64px',
              height: '64px',
              background: `linear-gradient(135deg, ${getStatusColor(pendingStatus)}20, ${getStatusColor(pendingStatus)}10)`,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <i className="fas fa-question-circle" style={{
                fontSize: '32px',
                color: getStatusColor(pendingStatus)
              }}></i>
            </div>

            <h3 style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: '20px',
              fontWeight: 800,
              color: '#0a1628',
              marginBottom: '8px'
            }}>
              Update Order Status?
            </h3>

            <p style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: '14px',
              color: '#4b6a9b',
              marginBottom: '20px',
              lineHeight: 1.6
            }}>
              Are you sure you want to change the status from<br />
              <strong style={{ color: '#1d4ed8' }}>“{currentStatus}”</strong> to<br />
              <strong style={{ color: getStatusColor(pendingStatus) }}>“{pendingStatus}”</strong>?
            </p>

            <div style={{
              display: 'flex',
              gap: '12px',
              marginTop: '8px'
            }}>
              <button
                onClick={() => setShowConfirmPopup(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '14px',
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: '14px',
                  fontWeight: 700,
                  background: '#f0f4ff',
                  border: '1.5px solid rgba(37, 99, 235, 0.09)',
                  color: '#4b6a9b',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#e4ecff';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#f0f4ff';
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStatus}
                disabled={updatingStatus}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '14px',
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: '14px',
                  fontWeight: 700,
                  background: `linear-gradient(135deg, ${getStatusColor(pendingStatus)}, ${getStatusColor(pendingStatus)}cc)`,
                  border: 'none',
                  color: 'white',
                  cursor: updatingStatus ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  opacity: updatingStatus ? 0.7 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {updatingStatus ? (
                  <>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid white',
                      borderTopColor: 'transparent',
                      borderRadius: '50%',
                      animation: 'spin 0.6s linear infinite'
                    }} />
                    Updating...
                  </>
                ) : (
                  <>
                    <i className="fas fa-check-circle"></i>
                    Yes, Update Status
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Lightbox */}
      <ImageLightbox
        images={lightboxImages}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        startIndex={lightboxIndex}
      />

      {/* Add CSS animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

// Helper components
const Section = ({ title, children, fullWidth }) => (
  <div style={{ gridColumn: fullWidth ? '1 / -1' : 'auto' }}>
    <div style={{
      fontSize: '11px',
      fontWeight: 800,
      color: '#4b6a9b',
      textTransform: 'uppercase',
      letterSpacing: '0.8px',
      marginBottom: '13px',
      paddingBottom: '9px',
      borderBottom: '2px solid rgba(37, 99, 235, 0.09)',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }}>
      <span style={{
        width: '4px',
        height: '16px',
        background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #1e40af 100%)',
        borderRadius: '10px'
      }} />
      {title}
    </div>
    {children}
  </div>
);

const InfoGrid = ({ children }) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '11px'
  }}>
    {children}
  </div>
);

const InfoField = ({ label, value, children, fullWidth }) => (
  <div style={{
    background: '#f0f4ff',
    borderRadius: '16px',
    padding: '13px 15px',
    border: '1.5px solid rgba(37, 99, 235, 0.09)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    gridColumn: fullWidth ? '1 / -1' : 'auto'
  }}>
    <label style={{
      fontFamily: "'Manrope', sans-serif",
      fontSize: '10px',
      fontWeight: 800,
      color: '#7a9cc4',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      display: 'block',
      marginBottom: '5px'
    }}>
      {label}
    </label>
    <span style={{
      fontFamily: "'Manrope', sans-serif",
      fontSize: '13.5px',
      fontWeight: 700,
      color: '#0a1628',
      wordBreak: 'break-word'
    }}>
      {children || value}
    </span>
  </div>
);

const InfoBox = ({ children, color = 'info', style }) => {
  const colors = {
    info: { bg: '#eff6ff', border: '#bfdbfe', text: '#1d4ed8' },
    warning: { bg: '#fffbeb', border: '#fde68a', text: '#b45309' },
    success: { bg: '#f0fdf4', border: '#bbf7d0', text: '#059669' },
    error: { bg: '#fef2f2', border: '#fca5a5', text: '#dc2626' }
  };

  const c = colors[color];

  return (
    <div style={{
      padding: '10px 14px',
      background: c.bg,
      border: `1.5px solid ${c.border}`,
      borderRadius: '10px',
      fontSize: '12px',
      color: c.text,
      fontFamily: "'Manrope', sans-serif",
      fontWeight: 600,
      lineHeight: 1.5,
      ...style
    }}>
      {children}
    </div>
  );
};

export default OrderDetailModal;