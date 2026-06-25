// src/components/modals/BookRepairModal.jsx
import { useState, useEffect } from 'react';
import { Modal } from '@components/shared/Modal';
import { Button } from '@components/shared/Button';
import { Input } from '@components/shared/Input';
import { Select } from '@components/shared/Select';
import { Textarea } from '@components/shared/Textarea';
import { FileUpload } from '@components/shared/FileUpload';
import { useData } from '@hooks/useData';
import { useUI } from '@hooks/useUI';
import { useOrders } from '@hooks/useOrders';
import { ordersAPI } from '@services/api';

export const BookRepairModal = ({
  isOpen,
  onClose,
  preselectedCategoryId,
  preselectedBrandId,
}) => {
  const { categories, fetchBrands, brands, isLoadingBrands } = useData();
  const { showToast } = useUI();
  const { fetchOrders } = useOrders();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    category_id: '',
    brand_id: '',
    model_name: '',
    problem_title: '',
    problem_description: '',
    alternate_mobile: '',
    house_no: '',
    building_name: '',
    full_address: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (isOpen) {
      if (preselectedCategoryId) {
        setFormData((prev) => ({ ...prev, category_id: preselectedCategoryId }));
        fetchBrands(preselectedCategoryId);
      }
      if (preselectedBrandId) {
        setFormData((prev) => ({ ...prev, brand_id: preselectedBrandId }));
      }
    }
  }, [isOpen, preselectedCategoryId, preselectedBrandId, fetchBrands]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCategoryChange = (categoryId) => {
    handleChange('category_id', categoryId);
    handleChange('brand_id', '');
    if (categoryId) fetchBrands(categoryId);
  };

  const handleFileChange = (selectedFiles) => setFiles(selectedFiles);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category_id) { showToast('⚠️ Please select a device category.', 'error'); return; }
    if (!formData.brand_id)    { showToast('⚠️ Please select a brand.', 'error'); return; }
    if (!formData.pincode || formData.pincode.length !== 6) { showToast('⚠️ Please enter a valid 6-digit pincode.', 'error'); return; }
    if (files.length === 0)    { showToast('⚠️ Please upload at least one photo of your device.', 'error'); return; }
    if (files.length > 5)      { showToast('⚠️ Maximum 5 photos allowed.', 'error'); return; }

    setIsLoading(true);
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => formDataToSend.append(key, value));
      files.forEach((file) => formDataToSend.append('files', file));

      const result = await ordersAPI.bookOrder(formDataToSend);
      if (result.status === 'success') {
        showToast('✅ Repair request submitted! Our team will review shortly.', 'success');
        onClose();
        setFormData({
          category_id: '', brand_id: '', model_name: '', problem_title: '',
          problem_description: '', alternate_mobile: '', house_no: '',
          building_name: '', full_address: '', landmark: '', city: '', state: '', pincode: '',
        });
        setFiles([]);
        fetchOrders(true);
      }
    } catch (error) {
      showToast(`❌ ${error.message || 'Submission failed. Please try again.'}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const categoryOptions = [
    { value: '', label: 'Select Category...' },
    ...categories.map((cat) => ({ value: String(cat.id), label: cat.category_name })),
  ];

  const brandOptions = [
    { value: '', label: formData.category_id ? (isLoadingBrands ? 'Loading brands...' : 'Select Brand...') : 'Select category first' },
    ...brands.map((brand) => ({ value: String(brand.id), label: brand.brand_name })),
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      showCloseButton={false}
      fullBleed
      className="!bg-white"
    >
      <div className="flex flex-col min-h-0 h-full bg-white">

        {/* ── Header ── */}
        <div
          className="relative px-7 py-6 flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <h2 className="font-sora text-xl font-extrabold text-white mb-0.5 tracking-tight">
            Book Your Repair
          </h2>
          <p className="font-manrope text-[13px] font-medium" style={{ color: 'rgba(255,255,255,0.75)' }}>
            Fill in the details and we'll get back to you shortly
          </p>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-[34px] h-[34px] rounded-full flex items-center justify-center transition-all duration-200 hover:rotate-90"
            style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
          >
            <i className="fas fa-times text-[13px]"></i>
          </button>
        </div>

        {/* ── Body ── */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto min-h-0 custom-scroll px-7 py-6 bg-white"
        >
          <div className="space-y-4">

            {/* Category & Brand */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Device Category *"
                options={categoryOptions}
                value={formData.category_id}
                onChange={(e) => handleCategoryChange(e.target.value)}
                required
              />
              <Select
                label="Brand *"
                options={brandOptions}
                value={formData.brand_id}
                onChange={(e) => handleChange('brand_id', e.target.value)}
                required
                disabled={!formData.category_id}
              />
            </div>

            <Input
              label="Device Model *"
              type="text"
              placeholder="e.g. iPhone 15 Pro Max"
              value={formData.model_name}
              onChange={(e) => handleChange('model_name', e.target.value)}
              required
            />

            <Input
              label="Problem Title *"
              type="text"
              placeholder="e.g. Screen cracked"
              value={formData.problem_title}
              onChange={(e) => handleChange('problem_title', e.target.value)}
              required
            />

            <Textarea
              label="Describe the Problem *"
              placeholder="Tell us more about the issue with your device..."
              value={formData.problem_description}
              onChange={(e) => handleChange('problem_description', e.target.value)}
              required
            />

            <Input
              label="Alternate Mobile"
              type="tel"
              placeholder="Optional alternate number"
              maxLength={10}
              value={formData.alternate_mobile}
              onChange={(e) => handleChange('alternate_mobile', e.target.value)}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="House / Flat No. *"
                type="text"
                placeholder="House/Flat No."
                value={formData.house_no}
                onChange={(e) => handleChange('house_no', e.target.value)}
                required
              />
              <Input
                label="Building Name *"
                type="text"
                placeholder="Building / Society Name"
                value={formData.building_name}
                onChange={(e) => handleChange('building_name', e.target.value)}
                required
              />
            </div>

            <Textarea
              label="Full Address *"
              placeholder="Street, Area, Colony..."
              value={formData.full_address}
              onChange={(e) => handleChange('full_address', e.target.value)}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Landmark"
                type="text"
                placeholder="Near landmark"
                value={formData.landmark}
                onChange={(e) => handleChange('landmark', e.target.value)}
              />
              <Input
                label="Pincode *"
                type="text"
                placeholder="6-digit pincode"
                maxLength={6}
                value={formData.pincode}
                onChange={(e) => handleChange('pincode', e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="City *"
                type="text"
                placeholder="City"
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                required
              />
              <Input
                label="State *"
                type="text"
                placeholder="State"
                value={formData.state}
                onChange={(e) => handleChange('state', e.target.value)}
                required
              />
            </div>

            <FileUpload
              label="Upload device photo (required)"
              onChange={handleFileChange}
              multiple
              maxFiles={5}
            />
          </div>
        </form>

        {/* ── Footer ── */}
        <div
          className="flex-shrink-0 px-7 py-4 flex gap-2.5 justify-end"
          style={{ borderTop: '1px solid #e5e7eb', background: '#f9fafb' }}
        >
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            loading={isLoading}
            icon={<i className="fas fa-arrow-right"></i>}
            iconPosition="right"
          >
            {isLoading ? 'Submitting...' : 'Submit Request'}
          </Button>
        </div>

      </div>
    </Modal>
  );
};