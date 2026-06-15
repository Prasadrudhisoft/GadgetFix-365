import { useState, useEffect } from 'react';
import Modal from '../shared/Modal';
import Spinner from '../shared/Spinner';
import adminApi from '../../services/adminApi';
import { formatCurrency } from '../../utils/adminHelpers';

const ViewTempQuotationModal = ({ isOpen, onClose, orderId }) => {
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
      const { data } = await adminApi.getTempQuotation(orderId);
      if (data.status === 'success' && data.primary_quotation) {
        setQuotation(data.primary_quotation);
      } else {
        setQuotation(null);
      }
    } catch (error) {
      console.error('Fetch temp quotation error:', error);
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

  const renderServicesTable = (services, title) => {
    if (!services || !services.length) {
      return (
        <p style={{ color: '#7a9cc4', fontSize: '12px', textAlign: 'center', padding: '10px 0' }}>
          No services listed
        </p>
      );
    }

    const hasWarranty = services.some(s => s.warranty);

    return (
      <>
        <div style={{
          fontSize: '11px',
          fontWeight: 800,
          color: '#4b6a9b',
          textTransform: 'uppercase',
          letterSpacing: '0.6px',
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span style={{
            width: '3px',
            height: '14px',
            background: 'linear-gradient(135deg, #db2777, #9d174d)',
            borderRadius: '10px',
            display: 'inline-block'
          }} />
          {title}
        </div>

        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginBottom: '8px',
          fontSize: '12px'
        }}>
          <thead>
            <tr style={{ background: '#f0f4ff' }}>
              <th style={thStyle}>#</th>
              <th style={thStyle}>Service / Part</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Qty</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Unit Price</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Total</th>
              {hasWarranty && <th style={{ ...thStyle, textAlign: 'right' }}>Warranty</th>}
            </tr>
          </thead>
          <tbody>
            {services.map((service, index) => (
              <tr key={index}>
                <td style={tdStyle}>{index + 1}</td>
                <td style={tdStyle}>{service.service || '—'}</td>
                <td style={{ ...tdStyle, textAlign: 'right' }}>{service.quantity || 1}</td>
                <td style={{ ...tdStyle, textAlign: 'right' }}>{formatCurrency(service.price_per_q || 0)}</td>
                <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 700 }}>{formatCurrency(service.total_price || 0)}</td>
                {hasWarranty && (
                  <td style={{ ...tdStyle, textAlign: 'right' }}>
                    {service.warranty ? `${service.warranty} days` : '—'}
                  </td>
                )}
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
      title="Initial Quotation Details"
      subtitle="Quotation sent before device pickup"
      size="large"
      headerColor="pink"
    >
      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center' }}>
          <Spinner size="large" />
        </div>
      ) : !quotation ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#7a9cc4' }}>
          Initial quotation not found.
        </div>
      ) : (
        <>
          {/* Info Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '11px',
            marginBottom: '14px'
          }}>
            <InfoField label="Device Model" value={quotation.model_name || '—'} />
            <InfoField
              label="Category / Brand"
              value={`${quotation.category_name || '—'} / ${quotation.brand_name || '—'}`}
            />
            <InfoField label="Mobile" value={quotation.mobile_no || '—'} />
            {quotation.alternate_mobile && (
              <InfoField label="Alternate Mobile" value={quotation.alternate_mobile} />
            )}
            <InfoField label="Problem Reported" value={quotation.problem_title || '—'} fullWidth />
            {quotation.problem_description && (
              <InfoField label="Problem Description" value={quotation.problem_description} fullWidth />
            )}
            {quotation.problem_as_per_technician && (
              <InfoField label="Technician's Diagnosis" value={quotation.problem_as_per_technician} fullWidth />
            )}
          </div>

          {/* Primary Services */}
          {renderServicesTable(quotation.service, 'Primary Services / Parts')}

          <div style={{
            background: '#fdf2f8',
            borderRadius: '16px',
            border: '2px solid #fbcfe8',
            padding: '14px',
            marginBottom: quotation.duplicate_service?.length ? '18px' : '0'
          }}>
            <TotalRow label="Subtotal" value={formatCurrency(quotation.total_amount)} />
            <TotalRow
              label={`Tax (${quotation.tax_percent || 0}%)`}
              value={formatCurrency((parseFloat(quotation.total_amount_inc_tax) || 0) - (parseFloat(quotation.total_amount) || 0))}
            />
            <TotalRow
              label="Total Payable"
              value={formatCurrency(quotation.total_amount_inc_tax)}
              isGrand
            />
          </div>

          {/* Duplicate Services */}
          {quotation.duplicate_service?.length > 0 && (
            <>
              {renderServicesTable(quotation.duplicate_service, 'Duplicate / Alternate Services')}

              <div style={{
                background: '#f0f9ff',
                borderRadius: '16px',
                border: '2px solid #bae6fd',
                padding: '14px'
              }}>
                <TotalRow label="Subtotal" value={formatCurrency(quotation.duplicate_total_amount)} />
                <TotalRow
                  label={`Tax (${quotation.duplicate_tax_percent || 0}%)`}
                  value={formatCurrency((parseFloat(quotation.duplicate_total_inc_tax) || 0) - (parseFloat(quotation.duplicate_total_amount) || 0))}
                />
                <TotalRow
                  label="Total Payable"
                  value={formatCurrency(quotation.duplicate_total_inc_tax)}
                  isGrand
                />
              </div>
            </>
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
                cursor: 'pointer'
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
      marginBottom: '4px'
    }}>
      {label}
    </label>
    <span style={{
      fontFamily: "'Manrope', sans-serif",
      fontSize: '13px',
      fontWeight: 700,
      color: '#0a1628'
    }}>
      {value}
    </span>
  </div>
);

const TotalRow = ({ label, value, isGrand }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    fontFamily: "'Manrope', sans-serif",
    fontSize: isGrand ? '14px' : '13px',
    padding: '4px 0',
    ...(isGrand && {
      fontWeight: 800,
      color: '#9d174d',
      borderTop: '2px dashed #fbcfe8',
      paddingTop: '9px',
      marginTop: '5px'
    })
  }}>
    <span style={{ fontWeight: isGrand ? 800 : 600 }}>{label}</span>
    <span style={{ fontWeight: 700 }}>{value}</span>
  </div>
);

const thStyle = {
  padding: '8px 10px',
  textAlign: 'left',
  fontSize: '10px',
  fontWeight: 800,
  color: '#4b6a9b',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  borderBottom: '2px solid rgba(37, 99, 235, 0.18)'
};

const tdStyle = {
  padding: '8px 10px',
  borderBottom: '1px solid rgba(37, 99, 235, 0.09)',
  color: '#1e3a5f'
};

export default ViewTempQuotationModal;