import { useState, useEffect, useRef } from 'react';
import { Modal } from '../shared/Modal';
import { Input } from '../shared/Input';
import { Button } from '../shared/Button';
import adminApi from '../../services/adminApi';
import { useUI } from '../../hooks/useUI';
import { useData } from '../../hooks/useData';

const EMPTY_FORM = {
  category_id: '', brand_id: '', customer_name: '', model_name: '',
  problem_title: '', problem_description: '', mobile_no: '',
  alternate_mobile: '', house_no: '', building_name: '',
  full_address: '', landmark: '', city: '', state: '', pincode: '',
};

const CustomSelect = ({ label, value, onChange, options = [], disabled = false }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = options.find((o) => String(o.value) === String(value));

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (opt) => {
    onChange({ target: { value: opt.value } });
    setOpen(false);
  };

  return (
    <div ref={ref} style={{ display: 'flex', flexDirection: 'column', gap: '6px', position: 'relative' }}>
      {label && (
        <label style={{
          fontFamily: "'Manrope', sans-serif", fontSize: '11px', fontWeight: 800,
          color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em'
        }}>
          {label}
        </label>
      )}

      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((p) => !p)}
        style={{
          width: '100%', padding: '11px 36px 11px 16px',
          borderRadius: '8px', border: `1.5px solid ${open ? '#1d4ed8' : '#e2e8f0'}`,
          fontFamily: "'Manrope', sans-serif", fontSize: '14px', fontWeight: 500,
          color: selected && selected.value !== '' ? '#000000' : '#94a3b8',
          background: open ? '#ffffff' : '#f8fafc',
          boxShadow: open ? '0 0 0 4px rgba(29,78,216,0.1)' : 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          textAlign: 'left', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span>
          {selected ? selected.label : (options[0]?.label || 'Select')}
        </span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 4l4 4 4-4" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && (
        <>
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 9998,
            }}
            onClick={() => setOpen(false)}
          />
          
          <div style={{
            position: 'absolute', 
            top: 'calc(100% + 4px)', 
            left: 0, 
            right: 0,
            background: '#ffffff',
            border: '1.5px solid #cbd5e1',
            borderRadius: '10px', 
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)',
            zIndex: 9999, 
            maxHeight: '250px', 
            overflowY: 'auto',
            padding: '6px',
          }}>
            {options.length === 0 ? (
              <div style={{
                padding: '12px',
                textAlign: 'center',
                color: '#000000',
                fontFamily: "'Manrope', sans-serif",
                fontSize: '13px'
              }}>
                No options available
              </div>
            ) : (
              options.map((opt) => {
                const isSelected = String(value) === String(opt.value);
                const isEmptyOption = opt.value === '';
                
                return (
                  <div
                    key={opt.value}
                    onClick={() => !isEmptyOption && handleSelect(opt)}
                    style={{
                      padding: '10px 12px',
                      marginBottom: '2px',
                      borderRadius: '8px',
                      fontFamily: "'Manrope', sans-serif",
                      fontSize: '13.5px',
                      fontWeight: 500,
                      color: '#000000',
                      backgroundColor: isSelected ? '#dbeafe' : '#ffffff',
                      cursor: isEmptyOption ? 'default' : 'pointer',
                      transition: 'all 0.15s',
                      borderBottom: '1px solid #f0f0f0',
                    }}
                    onMouseEnter={(e) => {
                      if (!isEmptyOption && !isSelected) {
                        e.currentTarget.style.backgroundColor = '#f1f5f9';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isEmptyOption && !isSelected) {
                        e.currentTarget.style.backgroundColor = '#ffffff';
                      }
                    }}
                  >
                    {isSelected && !isEmptyOption && (
                      <span style={{ 
                        marginRight: '10px', 
                        color: '#2563eb',
                        fontWeight: 'bold',
                        display: 'inline-block'
                      }}>✓</span>
                    )}
                    <span style={{ color: '#000000', fontWeight: 500 }}>
                      {opt.label}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default function WalkingOrderModal({ isOpen, onClose, onSuccess }) {
  const { showToast } = useUI();
  const { categories, brands, fetchBrands, isLoadingBrands } = useData();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    if (!isOpen) setForm(EMPTY_FORM);
  }, [isOpen]);

  useEffect(() => {
    if (form.category_id) {
      fetchBrands(form.category_id);
      setForm((prev) => ({ ...prev, brand_id: '' }));
    }
  }, [form.category_id, fetchBrands]);

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleClose = () => { setForm(EMPTY_FORM); onClose(); };

  const handleSubmit = async () => {
    if (!form.customer_name.trim()) return showToast('Customer name is required', 'error');
    if (!form.mobile_no.trim())     return showToast('Mobile number is required', 'error');
    if (!form.category_id)          return showToast('Please select a category', 'error');
    if (!form.brand_id)             return showToast('Please select a brand', 'error');

    setLoading(true);
    try {
      const res = await adminApi.createWalkingOrder(form);
      if (res.data?.status === 'error') throw new Error(res.data.message);
      showToast('Walk-in order created successfully!', 'success');
      setForm(EMPTY_FORM);
      onSuccess?.();
      onClose();
    } catch (err) {
      showToast(err.message || 'Failed to create order', 'error');
    } finally {
      setLoading(false);
    }
  };


  const categoryOptions = [
    { value: '', label: 'Select category' },
    ...(categories?.map((c) => ({ 
      value: c.id, 
      label: c.category_name  // ← FIXED: category_name
    })) ?? []),
  ];

  const brandOptions = isLoadingBrands
    ? [{ value: '', label: 'Loading brands...' }]
    : [
        { value: '', label: form.category_id ? 'Select brand' : 'Select category first' },
        ...(brands?.map((b) => ({ 
          value: b.id, 
          label: b.brand_name  // ← FIXED: brand_name
        })) ?? []),
      ];

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="New Walk-in Order" size="xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <CustomSelect 
          label="CATEGORY" 
          value={form.category_id} 
          onChange={set('category_id')} 
          options={categoryOptions} 
        />
        <CustomSelect 
          label="BRAND" 
          value={form.brand_id} 
          onChange={set('brand_id')} 
          options={brandOptions} 
          disabled={!form.category_id || isLoadingBrands} 
        />

        <Input label="Model Name" value={form.model_name} onChange={set('model_name')} placeholder="e.g. iPhone 14" />
        <Input label="Customer Name" value={form.customer_name} onChange={set('customer_name')} placeholder="Full name" />
        <Input label="Mobile No." value={form.mobile_no} onChange={set('mobile_no')} placeholder="10-digit number" />
        <Input label="Alternate Mobile" value={form.alternate_mobile} onChange={set('alternate_mobile')} placeholder="Optional" />

        <Input label="Problem Title" value={form.problem_title} onChange={set('problem_title')} placeholder="e.g. Screen cracked" containerClassName="col-span-2" />
        <Input label="Problem Description" value={form.problem_description} onChange={set('problem_description')} placeholder="Describe the issue in detail" containerClassName="col-span-2" />

        <Input label="House No." value={form.house_no} onChange={set('house_no')} placeholder="Flat / House no." />
        <Input label="Building Name" value={form.building_name} onChange={set('building_name')} placeholder="Society / Building" />
        <Input label="Full Address" value={form.full_address} onChange={set('full_address')} placeholder="Street, area" containerClassName="col-span-2" />
        <Input label="Landmark" value={form.landmark} onChange={set('landmark')} placeholder="Near..." />
        <Input label="City" value={form.city} onChange={set('city')} placeholder="City" />
        <Input label="State" value={form.state} onChange={set('state')} placeholder="State" />
        <Input label="Pincode" value={form.pincode} onChange={set('pincode')} placeholder="6-digit pincode" />
      </div>

      <div className="flex justify-end gap-2 mt-5">
        <Button variant="ghost" onClick={handleClose} disabled={loading}>Cancel</Button>
        <Button onClick={handleSubmit} loading={loading}>Create Order</Button>
      </div>
    </Modal>
  );
}