import { useState, useEffect, useRef } from 'react';
import adminApi from '../../services/adminApi';

const AddBrandModal = ({ isOpen, onClose, categories = [], onSuccess }) => {
  const [categoryId, setCategoryId] = useState('');
  const [brandName, setBrandName] = useState('');
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);
  const firstFieldRef = useRef(null);

  useEffect(() => {
    if (isOpen && firstFieldRef.current) {
      setTimeout(() => firstFieldRef.current?.focus(), 80);
    }
  }, [isOpen]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape' && isOpen) handleClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // ✅ console.log काढले

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) {
      setFile(null);
      setFilePreview('');
      return;
    }
    if (selected.size > 2 * 1024 * 1024) {
      setError('File too large. Maximum size is 2MB.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowed.includes(selected.type)) {
      setError('Only JPEG, PNG, or WebP images are allowed.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    setFile(selected);
    setFilePreview(`✅ ${selected.name} (${(selected.size / 1024).toFixed(1)} KB)`);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!categoryId) { setError('Please select a category.'); return; }
    if (!brandName.trim()) { setError('Brand name is required.'); return; }
    if (!file) { setError('Please upload a brand logo.'); return; }

    setLoading(true);

    const formData = new FormData();
    formData.append('category_id', categoryId);
    formData.append('brand_name', brandName.trim());
    formData.append('file', file);

    try {
      const response = await adminApi.addBrand(formData);
      if (response.data.status === 'success') {
        setSuccess('✅ Brand added successfully!');
        if (onSuccess) onSuccess();
        setTimeout(handleClose, 1600);
      } else {
        setError(response.data.message || 'Failed to add brand. Please try again.');
      }
    } catch (err) {
      console.error('Add brand error:', err);
      setError(err.response?.data?.message || '❌ Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCategoryId('');
    setBrandName('');
    setFile(null);
    setFilePreview('');
    setError('');
    setSuccess('');
    setLoading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        .abm-overlay {
          position: fixed; inset: 0;
          background: rgba(6, 16, 31, 0.60);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          z-index: 2000;
          display: flex; align-items: flex-end; justify-content: center;
          padding: 12px 12px calc(12px + env(safe-area-inset-bottom, 0px));
        }
        @media (min-width: 640px) {
          .abm-overlay { align-items: center; padding: 24px; }
        }
        .abm-box {
          background: #fff; width: 100%; border-radius: 20px;
          max-height: calc(100vh - 24px - env(safe-area-inset-bottom, 0px));
          overflow-y: auto; overflow-x: hidden;
          display: flex; flex-direction: column;
          animation: abmSlideUp 0.32s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @media (min-width: 640px) {
          .abm-box { width: 480px; max-width: 480px; max-height: 90vh; animation: abmFadeIn 0.28s cubic-bezier(0.34, 1.56, 0.64, 1); }
        }
        @keyframes abmSlideUp {
          from { opacity: 0; transform: translateY(40px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes abmFadeIn {
          from { opacity: 0; transform: scale(0.95) translateY(12px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .abm-box::-webkit-scrollbar { width: 4px; }
        .abm-box::-webkit-scrollbar-thumb { background: #bfdbfe; border-radius: 3px; }
        .abm-handle { width: 40px; height: 4px; background: #d1d5db; border-radius: 99px; margin: 10px auto 0; flex-shrink: 0; }
        @media (min-width: 640px) { .abm-handle { display: none; } }
        .abm-head {
          background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%);
          padding: 16px; border-radius: 20px 20px 0 0;
          display: flex; align-items: flex-start; justify-content: space-between;
          flex-shrink: 0; gap: 10px;
        }
        .abm-head-text { flex: 1; min-width: 0; }
        .abm-head-text h3 {
          font-size: 16px; font-weight: 700; color: #fff; letter-spacing: -0.3px;
          display: flex; align-items: center; gap: 8px; margin: 0;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .abm-head-text p { font-size: 12px; color: rgba(255,255,255,0.75); margin-top: 3px; font-weight: 400; }
        .abm-close {
          width: 32px; height: 32px; min-width: 32px; border-radius: 50%;
          background: rgba(255,255,255,0.20); border: none; cursor: pointer;
          color: #fff; font-size: 15px; display: flex; align-items: center;
          justify-content: center; flex-shrink: 0;
          transition: background 0.2s, transform 0.25s; margin-top: 1px;
        }
        .abm-close:hover { background: rgba(255,255,255,0.32); transform: rotate(90deg); }
        .abm-body { padding: 16px 16px 4px; flex: 1; min-width: 0; }
        .abm-alert {
          padding: 10px 13px; border-radius: 10px; font-size: 13px; font-weight: 600;
          margin-bottom: 14px; display: flex; align-items: flex-start;
          gap: 7px; line-height: 1.45; word-break: break-word;
        }
        .abm-alert-error { background: #fef2f2; color: #dc2626; border: 1.5px solid #fca5a5; }
        .abm-alert-success { background: #ecfdf5; color: #059669; border: 1.5px solid #a7f3d0; }
        .abm-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
        .abm-label { font-size: 11px; font-weight: 800; color: #4b6a9b; text-transform: uppercase; letter-spacing: 0.6px; }
        .abm-select, .abm-input {
          padding: 12px 13px; border-radius: 12px;
          border: 1.5px solid rgba(37,99,235,0.18);
          font-size: 16px; font-weight: 500; color: #0a1628;
          background: #f0f4ff; outline: none; width: 100%; box-sizing: border-box;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          font-family: inherit; -webkit-appearance: none; appearance: none;
        }
        .abm-select:focus, .abm-input:focus {
          border-color: #2563eb; background: #fff;
          box-shadow: 0 0 0 3px rgba(29,78,216,0.12);
        }
        .abm-select:disabled, .abm-input:disabled { opacity: 0.55; cursor: not-allowed; }
        .abm-input::placeholder { color: #7a9cc4; }
        .abm-select {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%234b6a9b' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat; background-position: right 13px center; padding-right: 36px;
        }
        .abm-upload {
          border: 2px dashed rgba(37,99,235,0.25); border-radius: 14px;
          padding: 18px 14px 14px; text-align: center; cursor: pointer;
          background: #f0f4ff; transition: border-color 0.2s, background 0.2s;
          width: 100%; box-sizing: border-box;
        }
        .abm-upload:active { background: #eff6ff; border-color: #2563eb; }
        @media (hover: hover) { .abm-upload:hover { border-color: #2563eb; background: #eff6ff; } }
        .abm-upload-icon { font-size: 26px; color: #2563eb; margin-bottom: 5px; }
        .abm-upload-title { font-size: 13px; color: #4b6a9b; font-weight: 600; }
        .abm-upload-hint { font-size: 11px; color: #2563eb; margin-top: 3px; }
        .abm-upload-preview { font-size: 12px; color: #059669; font-weight: 700; margin-top: 8px; min-height: 16px; word-break: break-all; }
        .abm-footer { display: flex; gap: 10px; padding: 16px; flex-wrap: nowrap; flex-shrink: 0; }
        .abm-btn {
          flex: 1; padding: 14px 10px; border-radius: 13px; font-size: 15px; font-weight: 700;
          cursor: pointer; border: none; display: flex; align-items: center; justify-content: center;
          gap: 8px; transition: opacity 0.18s, transform 0.18s; font-family: inherit;
          min-height: 50px; min-width: 0; white-space: nowrap; -webkit-tap-highlight-color: transparent;
        }
        .abm-btn:active:not(:disabled) { transform: scale(0.97); opacity: 0.88; }
        .abm-btn-cancel { background: #f0f4ff; color: #4b6a9b; border: 1.5px solid rgba(37,99,235,0.20); flex: 0.8; }
        .abm-btn-save { background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%); color: #fff; flex: 1.2; }
        .abm-btn-save:disabled { opacity: 0.60; cursor: not-allowed; }
        .abm-spinner {
          width: 16px; height: 16px;
          border: 2.5px solid rgba(255,255,255,0.30); border-top-color: #fff;
          border-radius: 50%; animation: abmSpin 0.65s linear infinite; flex-shrink: 0;
        }
        @keyframes abmSpin { to { transform: rotate(360deg); } }
      `}</style>

      <div
        className="abm-overlay"
        role="dialog"
        aria-modal="true"
        aria-labelledby="abm-title"
        onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
      >
        <div className="abm-box">
          <div className="abm-handle" aria-hidden="true" />

          <div className="abm-head">
            <div className="abm-head-text">
              <h3 id="abm-title">🏷️ Add New Brand</h3>
              <p>Add a supported device brand</p>
            </div>
            <button className="abm-close" onClick={handleClose} aria-label="Close modal">✕</button>
          </div>

          <div className="abm-body">
            {error && (
              <div className="abm-alert abm-alert-error" role="alert">⚠️ {error}</div>
            )}
            {success && (
              <div className="abm-alert abm-alert-success" role="status">{success}</div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="abm-field">
                <label className="abm-label" htmlFor="abm-cat">Select Category</label>
                <select
                  id="abm-cat"
                  ref={firstFieldRef}
                  className="abm-select"
                  value={categoryId}
                  onChange={(e) => { setCategoryId(e.target.value); setError(''); }}
                  disabled={loading}
                  required
                >
                  <option value="">-- Select Category --</option>
                  {categories.length === 0 && (
                    <option value="" disabled>⚠️ No categories available. Please add a category first.</option>
                  )}
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.category_name}</option>
                  ))}
                </select>
                {categories.length === 0 && (
                  <p style={{ fontSize: '11px', color: '#dc2626', marginTop: '4px' }}>
                    ⚠️ No categories found. Please add a category first.
                  </p>
                )}
              </div>

              <div className="abm-field">
                <label className="abm-label" htmlFor="abm-brand">Brand Name</label>
                <input
                  id="abm-brand"
                  type="text"
                  className="abm-input"
                  placeholder="e.g. Samsung, Apple, OnePlus"
                  value={brandName}
                  onChange={(e) => { setBrandName(e.target.value); setError(''); }}
                  disabled={loading}
                  maxLength={80}
                  autoComplete="off"
                  required
                />
              </div>

              <div className="abm-field">
                <label className="abm-label">Brand Logo</label>
                <div
                  className="abm-upload"
                  onClick={() => !loading && fileInputRef.current?.click()}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      fileInputRef.current?.click();
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label="Upload brand logo"
                >
                  <div className="abm-upload-icon">🖼️</div>
                  <div className="abm-upload-title">
                    {filePreview ? 'Tap to change logo' : 'Tap to upload brand logo'}
                  </div>
                  <div className="abm-upload-hint">JPEG / PNG / WebP · Max 2MB</div>
                  <div className="abm-upload-preview">{filePreview}</div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,image/webp"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                    disabled={loading}
                  />
                </div>
              </div>
            </form>
          </div>

          <div className="abm-footer">
            <button type="button" className="abm-btn abm-btn-cancel" onClick={handleClose} disabled={loading}>
              Cancel
            </button>
            <button type="button" className="abm-btn abm-btn-save" disabled={loading} onClick={handleSubmit}>
              {loading ? (
                <><span className="abm-spinner" />Saving...</>
              ) : (
                'Save Brand'
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddBrandModal;