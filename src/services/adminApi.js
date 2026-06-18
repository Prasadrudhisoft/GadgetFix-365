import axiosInstance from './axios.config';

const adminApi = {
  // Orders
  getOrders: () => axiosInstance.get('/get_orders'),

  updateOrderStatus: (orderId, status) =>
    axiosInstance.post('/update_order_status', { order_id: orderId, status }),

  getConfirmTypes: (orderId) =>
    axiosInstance.get(`/confirm_type/${orderId}`),

  // Quotations
  sendQuotation: (data) =>
    axiosInstance.post('/send_quotation', data),

  sendFinalQuotation: (formData) =>
    axiosInstance.post('/send_final_quotation', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  getTempQuotation: (orderId) =>
    axiosInstance.get(`/get_temp_quotation/${orderId}`),

  getFinalQuotation: (orderId) =>
    axiosInstance.get(`/get_final_quotation_admin/${orderId}`),

  // Bills
  getAllBills: () => axiosInstance.get('/get_all_bills'),

  getBill: (orderId) =>
    axiosInstance.get(`/get_bill?order_id=${orderId}`),

  markBillPaid: (orderId) =>
    axiosInstance.post('/mark_bill_paid', { order_id: orderId }),

  // Categories
  getCategories: () => axiosInstance.get('/get_categories'),

  addCategory: (formData) =>
    axiosInstance.post('/add_category', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  // Brands
  getBrands: () => axiosInstance.get('/get_brands'),

  addBrand: (formData) =>
    axiosInstance.post('/add_brands', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  // Walking orders
  createWalkingOrder: (data) =>
    axiosInstance.post('/walking_orders', data),

  getWalkingOrders: () =>
    axiosInstance.get('/walking_my_orders'),

  getWalkingQuotation: (orderId) =>
    axiosInstance.get(`/walking_get_quotation/${orderId}`),

  confirmWalkingOrder: (orderId, quotationType) =>
    axiosInstance.post('/walking_confirm_order', { order_id: orderId, quotation_type: quotationType }),

  cancelWalkingOrder: (orderId) =>
    axiosInstance.post('/walking_cancel_order', { order_id: orderId }),

  getWalkingBill: (orderId) =>
    axiosInstance.get(`/walking_my_bill?order_id=${orderId}`),

  getWalkingFinalQuotation: (orderId) =>
    axiosInstance.get(`/walking_get_final_quotation/${orderId}`),

  confirmWalkingFinalOrder: (orderId, quotationType) =>
    axiosInstance.post('/walking_confirm_final_order', { order_id: orderId, quotation_type: quotationType }),

  getWalkingConfirmType: (orderId) =>
    axiosInstance.get(`/walking_confirm_type/${orderId}`),
};

export default adminApi;