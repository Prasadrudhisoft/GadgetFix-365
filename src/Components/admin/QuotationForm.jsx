import { useState, useEffect } from 'react';
import Input from '../shared/Input';
import Textarea from '../shared/Textarea';
import Button from '../shared/Button';
import { formatCurrency } from '../../utils/adminHelpers';

const QuotationForm = ({
  type = 'primary',
  services = [],
  onChange,
  taxPercent = 0,
  onTaxChange
}) => {
  const [servicesList, setServicesList] = useState(services.length ? services : [createEmptyService()]);

  useEffect(() => {
    if (services.length) {
      setServicesList(services);
    }
  }, [services]);

  function createEmptyService() {
    return {
      id: Date.now() + Math.random(),
      service: '',
      quantity: 1,
      price_per_q: 0,
      warranty: 0,
      total_price: 0
    };
  }

  const handleServiceChange = (id, field, value) => {
    const updated = servicesList.map(s => {
      if (s.id === id) {
        const newService = { ...s, [field]: value };

        // Auto-calculate total
        if (field === 'quantity' || field === 'price_per_q') {
          const qty = field === 'quantity' ? parseFloat(value) || 0 : parseFloat(newService.quantity) || 0;
          const price = field === 'price_per_q' ? parseFloat(value) || 0 : parseFloat(newService.price_per_q) || 0;
          newService.total_price = parseFloat((qty * price).toFixed(2));
        }

        return newService;
      }
      return s;
    });

    setServicesList(updated);
    onChange?.(updated);
  };

  const addService = () => {
    const updated = [...servicesList, createEmptyService()];
    setServicesList(updated);
    onChange?.(updated);
  };

  const removeService = (id) => {
    if (servicesList.length === 1) return; // Keep at least one
    const updated = servicesList.filter(s => s.id !== id);
    setServicesList(updated);
    onChange?.(updated);
  };

  const subtotal = servicesList.reduce((sum, s) => sum + (s.total_price || 0), 0);
  const taxAmount = subtotal * (taxPercent / 100);
  const grandTotal = subtotal + taxAmount;

  return (
    <div>
      {/* Services List */}
      <div style={{ marginBottom: '14px' }}>
        {servicesList.map((service, index) => (
          <div
            key={service.id}
            style={{
              background: '#fff',
              border: '1.5px solid #fbcfe8',
              borderRadius: '16px',
              padding: '13px',
              marginBottom: '9px',
              boxShadow: '0 2px 8px rgba(157, 23, 77, 0.06)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
              gap: '8px',
              alignItems: 'end'
            }}>
              <Input
                label="Service / Part Name"
                value={service.service}
                onChange={(e) => handleServiceChange(service.id, 'service', e.target.value)}
                placeholder="e.g. Display Replacement"
                size="small"
              />

              <Input
                label="Qty"
                type="number"
                value={service.quantity}
                onChange={(e) => handleServiceChange(service.id, 'quantity', e.target.value)}
                min="1"
                size="small"
              />

              <Input
                label="Price/Unit (₹)"
                type="number"
                value={service.price_per_q}
                onChange={(e) => handleServiceChange(service.id, 'price_per_q', e.target.value)}
                min="0"
                step="0.01"
                size="small"
              />

              <Input
                label="Warranty (days)"
                type="number"
                value={service.warranty}
                onChange={(e) => handleServiceChange(service.id, 'warranty', e.target.value)}
                min="0"
                size="small"
              />

              <Input
                label="Total (₹)"
                type="number"
                value={service.total_price.toFixed(2)}
                readOnly
                size="small"
                style={{ background: '#F8FAFD' }}
              />

              <button
                type="button"
                onClick={() => removeService(service.id)}
                disabled={servicesList.length === 1}
                style={{
                  background: servicesList.length === 1 ? '#fef2f2' : '#fef2f2',
                  border: 'none',
                  color: servicesList.length === 1 ? '#fca5a5' : '#dc2626',
                  width: '34px',
                  height: '40px',
                  borderRadius: '10px',
                  cursor: servicesList.length === 1 ? 'not-allowed' : 'pointer',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  opacity: servicesList.length === 1 ? 0.5 : 1
                }}
                title={servicesList.length === 1 ? "At least one service required" : "Remove"}
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Service Button */}
      <button
        type="button"
        onClick={addService}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '7px',
          padding: '10px 14px',
          borderRadius: '16px',
          background: '#fdf2f8',
          color: '#9d174d',
          border: '2px dashed #fbcfe8',
          fontFamily: "'Manrope', sans-serif",
          fontSize: '13px',
          fontWeight: 700,
          cursor: 'pointer',
          marginBottom: '11px',
          width: '100%',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'linear-gradient(135deg, #9d174d, #be185d)';
          e.currentTarget.style.color = '#fff';
          e.currentTarget.style.borderStyle = 'solid';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#fdf2f8';
          e.currentTarget.style.color = '#9d174d';
          e.currentTarget.style.borderStyle = 'dashed';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        <i className="fas fa-plus"></i> Add Service / Part
      </button>

      {/* Tax Input */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <Input
          label="Tax %"
          type="number"
          value={taxPercent}
          onChange={(e) => onTaxChange?.(parseFloat(e.target.value) || 0)}
          min="0"
          max="100"
          step="0.1"
          placeholder="0"
        />

        <Input
          label="Total incl. Tax (₹)"
          type="number"
          value={grandTotal > 0 ? grandTotal.toFixed(2) : ''}
          readOnly
          style={{ background: '#F8FAFD' }}
        />
      </div>

      {/* Totals Box */}
      <div style={{
        background: '#fff',
        border: '2px solid #fbcfe8',
        borderRadius: '16px',
        padding: '14px',
        marginBottom: '12px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontFamily: "'Manrope', sans-serif",
          fontSize: '13px',
          padding: '4px 0'
        }}>
          <span style={{ color: '#4b6a9b', fontWeight: 600 }}>Subtotal</span>
          <span style={{ fontWeight: 700, color: '#0a1628' }}>{formatCurrency(subtotal)}</span>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontFamily: "'Manrope', sans-serif",
          fontSize: '13px',
          padding: '4px 0'
        }}>
          <span style={{ color: '#4b6a9b', fontWeight: 600 }}>Tax ({taxPercent}%)</span>
          <span style={{ fontWeight: 700, color: '#0a1628' }}>{formatCurrency(taxAmount)}</span>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontFamily: "'Manrope', sans-serif",
          fontSize: '14.5px',
          padding: '9px 0 4px',
          marginTop: '5px',
          borderTop: '2px dashed #fbcfe8',
          fontWeight: 800,
          color: '#9d174d'
        }}>
          <span>Total Payable</span>
          <span>{formatCurrency(grandTotal)}</span>
        </div>
      </div>
    </div>
  );
};

export default QuotationForm;