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
};

export default adminApi;