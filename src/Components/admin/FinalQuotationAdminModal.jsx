import { useState, useEffect, useRef } from 'react';
import Modal from '../shared/Modal';
import Input from '../shared/Input';
import Textarea from '../shared/Textarea';
import FileUpload from '../shared/FileUpload';
import Button from '../shared/Button';
import adminApi from '../../services/adminApi';
import { useAdmin } from '../../hooks/useAdmin';
import { useToast } from '../../hooks/useUI';
import { formatCurrency } from '../../utils/adminHelpers';

const FinalQuotationAdminModal = ({ isOpen, onClose, orderId }) => {
  const [activeTab, setActiveTab] = useState('primary');
  const [problemTech, setProblemTech] = useState('');
  const [problemDescTech, setProblemDescTech] = useState('');
  const [files, setFiles] = useState([]);
  const [primaryServices, setPrimaryServices] = useState([createEmptyService()]);
  const [primaryTax, setPrimaryTax] = useState(0);
  const [primaryTaxInput, setPrimaryTaxInput] = useState('0');
  const [duplicateServices, setDuplicateServices] = useState([createEmptyService()]);
  const [duplicateTax, setDuplicateTax] = useState(0);
  const [duplicateTaxInput, setDuplicateTaxInput] = useState('0');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fileInputRef = useRef(null);
  const { fetchOrders } = useAdmin();
  const { showToast } = useToast();

  function createEmptyService() {
    return { id: Date.now() + Math.random(), service: '', quantity: 1, price_per_q: 0, warranty: 0, total_price: 0 };
  }

  const handleServiceChange = (type, id, field, value) => {
    const setServices = type === 'primary' ? setPrimaryServices : setDuplicateServices;
    const services = type === 'primary' ? primaryServices : duplicateServices;

    const updated = services.map(s => {
      if (s.id === id) {
        const newService = { ...s, [field]: value };
        if (field === 'quantity' || field === 'price_per_q') {
          const qty = field === 'quantity' ? parseFloat(value) || 0 : parseFloat(newService.quantity) || 0;
          const price = field === 'price_per_q' ? parseFloat(value) || 0 : parseFloat(newService.price_per_q) || 0;
          newService.total_price = parseFloat((qty * price).toFixed(2));
        }
        return newService;
      }
      return s;
    });

    setServices(updated);
  };

  const addService = (type) => {
    const setServices = type === 'primary' ? setPrimaryServices : setDuplicateServices;
    const services = type === 'primary' ? primaryServices : duplicateServices;
    setServices([...services, createEmptyService()]);
  };

  const removeService = (type, id) => {
    const setServices = type === 'primary' ? setPrimaryServices : setDuplicateServices;
    const services = type === 'primary' ? primaryServices : duplicateServices;
    if (services.length === 1) return;
    setServices(services.filter(s => s.id !== id));
  };

  const calculateTotals = (services, tax) => {
    const subtotal = services.reduce((sum, s) => sum + (parseFloat(s.total_price) || 0), 0);
    const taxAmount = subtotal * ((parseFloat(tax) || 0) / 100);
    const grand = subtotal + taxAmount;
    return { subtotal, taxAmount, grand };
  };

  // ✅ FIX: Ensure all numeric fields in services are actual numbers, not strings
  const cleanServices = (services) =>
    services
      .filter(s => s.service && s.service.trim() !== '')
      .map(s => ({
        service: s.service.trim(),
        quantity: parseFloat(s.quantity) || 0,
        price_per_q: parseFloat(s.price_per_q) || 0,
        warranty: parseFloat(s.warranty) || 0,
        total_price: parseFloat(s.total_price) || 0,
      }));

  const handleSubmit = async () => {
    if (!problemTech.trim()) {
      setError('⚠️ Enter problem as per technician');
      return;
    }

    if (!primaryServices.some(s => s.service && s.quantity > 0 && s.price_per_q > 0)) {
      setError('⚠️ Add at least one valid service in Primary Quotation');
      return;
    }

    if (files.length > 5) {
      setError('⚠️ Maximum 5 files allowed');
      return;
    }

    setLoading(true);
    setError('');

    const primaryCalc = calculateTotals(primaryServices, primaryTax);
    const duplicateCalc = calculateTotals(duplicateServices, duplicateTax);

    // ✅ FIX: Parse tax values to float before sending — avoids 'str < int' backend error
    const primaryTaxFloat = parseFloat(primaryTax) || 0;
    const duplicateTaxFloat = parseFloat(duplicateTax) || 0;

    const formData = new FormData();
    formData.append('order_id', orderId);
    formData.append('problem_as_per_technician', problemTech.trim());
    formData.append('problem_description_as_per_technician', problemDescTech.trim());

    // ✅ FIX: Use cleanServices to ensure all numeric fields are numbers, not strings
    formData.append('services', JSON.stringify(cleanServices(primaryServices)));
    formData.append('total_amount', primaryCalc.subtotal.toFixed(2));

    // ✅ FIX: Send tax as number, NOT .toString() — backend compares it numerically
    formData.append('tax_percentage', primaryTaxFloat);
    formData.append('total_amount_inc_tax', primaryCalc.grand.toFixed(2));

    formData.append('duplicate_service', JSON.stringify(cleanServices(duplicateServices)));
    formData.append('duplicate_total_amount', duplicateCalc.subtotal.toFixed(2));

    // ✅ FIX: Same fix for duplicate tax
    formData.append('duplicate_tax_percentage', duplicateTaxFloat);
    formData.append('duplicate_total_inc_tax', duplicateCalc.grand.toFixed(2));

    files.forEach(file => {
      formData.append('files', file);
    });

    try {
      const { data } = await adminApi.sendFinalQuotation(formData);

      if (data.status === 'success') {
        showToast('✅ Final quotation sent successfully!', 'success');
        fetchOrders(false);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        setError(`❌ ${data.message || 'Failed to send final quotation'}`);
      }
    } catch (err) {
      console.error('Send final quotation error:', err);
      setError('❌ Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setProblemTech('');
    setProblemDescTech('');
    setFiles([]);
    setPrimaryServices([createEmptyService()]);
    setPrimaryTax(0);
    setPrimaryTaxInput('0');
    setDuplicateServices([createEmptyService()]);
    setDuplicateTax(0);
    setDuplicateTaxInput('0');
    setError('');
    setActiveTab('primary');
    onClose();
  };

  const primaryCalc = calculateTotals(primaryServices, primaryTax);
  const duplicateCalc = calculateTotals(duplicateServices, duplicateTax);

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Send Final Quotation"
      subtitle="After physical device inspection"
      size="xlarge"
      headerColor="pink"
    >
      <div style={{ maxHeight: '75vh', overflowY: 'auto' }}>
        {error && (
          <div style={{
            padding: '11px 13px',
            borderRadius: '16px',
            fontSize: '13px',
            fontWeight: 700,
            marginBottom: '13px',
            background: '#fef2f2',
            color: '#dc2626',
            border: '1.5px solid #fca5a5'
          }}>
            {error}
          </div>
        )}

        <Input
          label="Problem as per Technician *"
          value={problemTech}
          onChange={(e) => setProblemTech(e.target.value)}
          placeholder="e.g. Cracked display, faulty battery connector"
          required
        />

        <Textarea
          label="Technician's Notes"
          value={problemDescTech}
          onChange={(e) => setProblemDescTech(e.target.value)}
          placeholder="Detailed technical findings..."
        />

        <FileUpload
          label="Upload device photos/videos (optional, max 5)"
          accept="image/*,video/*"
          multiple
          onChange={(selectedFiles) => setFiles(Array.isArray(selectedFiles) ? selectedFiles : [selectedFiles])}
          helpText={`${files.length} file(s) selected`}
        />

        {/* Tabs */}
        <div style={{
          display: 'flex',
          border: '2px solid #fbcfe8',
          borderRadius: '16px',
          overflow: 'hidden',
          marginBottom: '14px',
          marginTop: '14px'
        }}>
          <button
            type="button"
            onClick={() => setActiveTab('primary')}
            style={{
              flex: 1,
              padding: '10px',
              textAlign: 'center',
              fontFamily: "'Manrope', sans-serif",
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
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
            style={{
              flex: 1,
              padding: '10px',
              textAlign: 'center',
              fontFamily: "'Manrope', sans-serif",
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
              background: activeTab === 'duplicate' ? 'linear-gradient(135deg, #9d174d, #be185d)' : '#fff',
              color: activeTab === 'duplicate' ? '#fff' : '#9d174d',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            Duplicate / Alternate
          </button>
        </div>

        {/* Services */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{
            fontSize: '11px',
            fontWeight: 800,
            color: '#9d174d',
            textTransform: 'uppercase',
            letterSpacing: '0.6px',
            marginBottom: '9px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span style={{
              width: '3px',
              height: '14px',
              background: 'linear-gradient(135deg, #9d174d, #be185d)',
              borderRadius: '10px',
              display: 'inline-block'
            }} />
            {activeTab === 'primary' ? 'Services / Parts' : 'Duplicate / Alternate Services'}
          </div>

          {(activeTab === 'primary' ? primaryServices : duplicateServices).map((service, index) => (
            <div key={service.id} style={{
              background: '#fff',
              border: '1.5px solid #fbcfe8',
              borderRadius: '16px',
              padding: '13px',
              marginBottom: '9px',
              boxShadow: '0 2px 8px rgba(157, 23, 77, 0.06)'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: '8px',
                alignItems: 'end'
              }}>
                <Input
                  label="Service / Part Name"
                  value={service.service}
                  onChange={(e) => handleServiceChange(activeTab, service.id, 'service', e.target.value)}
                  placeholder="e.g. Display Replacement"
                  size="small"
                />
                <Input
                  label="Qty"
                  type="number"
                  value={service.quantity}
                  onChange={(e) => handleServiceChange(activeTab, service.id, 'quantity', e.target.value)}
                  min="1"
                  size="small"
                />
                <Input
                  label="Price/Unit (₹)"
                  type="number"
                  value={service.price_per_q}
                  onChange={(e) => handleServiceChange(activeTab, service.id, 'price_per_q', e.target.value)}
                  min="0"
                  step="0.01"
                  size="small"
                />
                <Input
                  label="Warranty (days)"
                  type="number"
                  value={service.warranty}
                  onChange={(e) => handleServiceChange(activeTab, service.id, 'warranty', e.target.value)}
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
                  onClick={() => removeService(activeTab, service.id)}
                  disabled={(activeTab === 'primary' ? primaryServices : duplicateServices).length === 1}
                  style={{
                    background: '#fef2f2',
                    border: 'none',
                    color: '#dc2626',
                    height: '40px',
                    borderRadius: '10px',
                    cursor: (activeTab === 'primary' ? primaryServices : duplicateServices).length === 1 ? 'not-allowed' : 'pointer',
                    opacity: (activeTab === 'primary' ? primaryServices : duplicateServices).length === 1 ? 0.5 : 1
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() => addService(activeTab)}
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
          >
            <i className="fas fa-plus"></i> Add Service / Part
          </button>
        </div>

        {/* Tax and Totals */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
          <Input
            label="Tax %"
            type="number"
            value={activeTab === 'primary' ? primaryTaxInput : duplicateTaxInput}
            onChange={(e) => {
              const raw = e.target.value;
              if (activeTab === 'primary') {
                setPrimaryTaxInput(raw);
                const parsed = parseFloat(raw);
                if (!isNaN(parsed)) setPrimaryTax(parsed);
              } else {
                setDuplicateTaxInput(raw);
                const parsed = parseFloat(raw);
                if (!isNaN(parsed)) setDuplicateTax(parsed);
              }
            }}
            onBlur={(e) => {
              const parsed = parseFloat(e.target.value);
              const val = isNaN(parsed) ? 0 : Math.max(0, Math.min(100, parsed));
              if (activeTab === 'primary') {
                setPrimaryTaxInput(String(val));
                setPrimaryTax(val);
              } else {
                setDuplicateTaxInput(String(val));
                setDuplicateTax(val);
              }
            }}
            min="0"
            max="100"
            step="0.1"
            placeholder="0"
          />
          <Input
            label="Total incl. Tax (₹)"
            type="number"
            value={activeTab === 'primary'
              ? (primaryCalc.grand > 0 ? primaryCalc.grand.toFixed(2) : '')
              : (duplicateCalc.grand > 0 ? duplicateCalc.grand.toFixed(2) : '')}
            readOnly
            style={{ background: '#F8FAFD' }}
          />
        </div>

        <div style={{
          background: '#fff',
          border: '2px solid #fbcfe8',
          borderRadius: '16px',
          padding: '14px',
          marginBottom: '12px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '4px 0' }}>
            <span style={{ color: '#4b6a9b', fontWeight: 600 }}>Subtotal</span>
            <span style={{ fontWeight: 700, color: '#0a1628' }}>
              {formatCurrency(activeTab === 'primary' ? primaryCalc.subtotal : duplicateCalc.subtotal)}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '4px 0' }}>
            <span style={{ color: '#4b6a9b', fontWeight: 600 }}>Tax</span>
            <span style={{ fontWeight: 700, color: '#0a1628' }}>
              {formatCurrency(activeTab === 'primary' ? primaryCalc.taxAmount : duplicateCalc.taxAmount)}
            </span>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '14.5px',
            padding: '9px 0 4px',
            marginTop: '5px',
            borderTop: '2px dashed #fbcfe8',
            fontWeight: 800,
            color: '#9d174d'
          }}>
            <span>Total Payable</span>
            <span>{formatCurrency(activeTab === 'primary' ? primaryCalc.grand : duplicateCalc.grand)}</span>
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          loading={loading}
          style={{
            width: '100%',
            marginTop: '14px',
            background: 'linear-gradient(135deg, #9d174d, #be185d)',
            boxShadow: '0 4px 14px rgba(157, 23, 77, 0.3)'
          }}
        >
          <i className="fas fa-paper-plane"></i> Send Final Quotation
        </Button>
      </div>
    </Modal>
  );
};

export default FinalQuotationAdminModal;