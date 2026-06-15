// src/services/api.js
import axios from './axios.config';
import { publicAxios } from './axios.config';
import { API_BASE_URL } from '@utils/constants';

// ============ AUTH API ============
export const authAPI = {
  login: async (mobile, password) => {
    const { data } = await axios.post('/login', {
      mobile_no: mobile,
      password,
    });
    return data;
  },

  register: async (userData) => {
    const { data } = await axios.post('/register_users', userData);
    return data;
  },

  verifyRegister: async (mobile, otp) => {
    const { data } = await axios.post('/register_verify', {
      mobile_no: mobile,
      otp,
    });
    return data;
  },

  forgotPasswordRequest: async (mobile, newPassword) => {
    const { data } = await axios.post('/forgot_password_request', {
      mobile_no: mobile,
      new_password: newPassword,
    });
    return data;
  },

  forgotPasswordVerify: async (mobile, otp) => {
    const { data } = await axios.post('/forgot_password_verify', {
      mobile_no: mobile,
      otp,
    });
    return data;
  },
};

// ============ CATALOG API ============
export const catalogAPI = {
  getCategories: async (noCache = false) => {
    const url = noCache ? `/user_get_category?t=${Date.now()}` : '/user_get_category';
    const { data } = await publicAxios.get(url);
    return data;
  },

  getBrands: async (categoryId, noCache = false) => {
    const url = noCache
      ? `/user_get_brands?category_id=${categoryId}&t=${Date.now()}`
      : `/user_get_brands?category_id=${categoryId}`;
    const { data } = await axios.get(url);
    return data;
  },

  getAllBrands: async (noCache = false) => {
    const url = noCache ? `/get_brands?t=${Date.now()}` : '/get_brands';
    const { data } = await publicAxios.get(url);
    return data;
  },
};

// ============ ORDERS API ============
export const ordersAPI = {
  bookOrder: async (formData) => {
    const { data } = await axios.post('/book_order', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  getMyOrders: async () => {
    const { data } = await axios.get('/my_orders');
    return data;
  },

  getQuotation: async (orderId) => {
    const { data } = await axios.get(`/get_quotation/${orderId}`);
    return data;
  },

  getFinalQuotation: async (orderId) => {
    const { data } = await axios.get(`/get_final_quotation/${orderId}`);
    return data;
  },

  confirmOrder: async (orderId, quotationType) => {
    const { data } = await axios.post('/confirm_order', {
      order_id: orderId,
      quotation_type: quotationType,
    });
    return data;
  },

  confirmFinalOrder: async (orderId, quotationType) => {
    const { data } = await axios.post('/confirm_final_order', {
      order_id: orderId,
      quotation_type: quotationType,
    });
    return data;
  },

  cancelOrder: async (orderId) => {
    const { data } = await axios.post('/cancel_order', {
      order_id: orderId,
    });
    return data;
  },

  getBill: async (orderId) => {
    const { data } = await axios.get(`/my_bill?order_id=${orderId}`);
    return data;
  },

  getConfirmType: async (orderId) => {
    const { data } = await axios.get(`/confirm_type/${orderId}`);
    return data;
  },
};

// ============ ADMIN API ============
export const adminAPI = {
  getCategories: async () => {
    const { data } = await axios.get('/get_categories');
    return data;
  },

  addCategory: async (formData) => {
    const { data } = await axios.post('/add_category', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  getBrands: async () => {
    const { data } = await axios.get('/get_brands');
    return data;
  },

  addBrand: async (formData) => {
    const { data } = await axios.post('/add_brands', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  getOrders: async () => {
    const { data } = await axios.get('/get_orders');
    return data;
  },

  updateOrderStatus: async (orderId, status) => {
    const { data } = await axios.post('/update_order_status', { order_id: orderId, status });
    return data;
  },

  getConfirmTypes: async (orderId) => {
    const { data } = await axios.get(`/confirm_type/${orderId}`);
    return data;
  },

  sendQuotation: async (quotationData) => {
    const { data } = await axios.post('/send_quotation', quotationData);
    return data;
  },

  sendFinalQuotation: async (formData) => {
    const { data } = await axios.post('/send_final_quotation', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  getTempQuotation: async (orderId) => {
    const { data } = await axios.get(`/get_temp_quotation/${orderId}`);
    return data;
  },

  getFinalQuotationAdmin: async (orderId) => {
    const { data } = await axios.get(`/get_final_quotation_admin/${orderId}`);
    return data;
  },

  getAllBills: async () => {
    const { data } = await axios.get('/get_all_bills');
    return data;
  },

  getBill: async (orderId) => {
    const { data } = await axios.get(`/get_bill?order_id=${orderId}`);
    return data;
  },

  markBillPaid: async (orderId) => {
    const { data } = await axios.post('/mark_bill_paid', { order_id: orderId });
    return data;
  },
};

// ============ UTILITY ============
export const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL}${path}`;
};