// src/contexts/AdminContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';
import adminApi from '../services/adminApi';
import { useUI } from '../hooks/useUI';
import { AuthContext } from '@contexts/AuthContext';

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [walkingOrders, setWalkingOrders] = useState([]);
  const [bills, setBills] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, progress: 0, done: 0 });
  const [walkingStats, setWalkingStats] = useState({ pending: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  const { showToast } = useUI();
  const { token, isLoading: authLoading } = useContext(AuthContext);

  const updateStats = (ordersList) => {
    const total = ordersList.length;
    const pending = ordersList.filter((o) => o.status === 'Requested').length;
    const progress = ordersList.filter((o) =>
      ['quotation_sent', 'Confirmed', 'Picked Up', 'Reviewed',
        'final_quotation_sent', 'Final_Confirmed', 'Repairing',
        'Repair Done', 'Delivered'].includes(o.status)
    ).length;
    const done = ordersList.filter((o) => o.status === 'Completed').length;
    setStats({ total, pending, progress, done });
  };

  const fetchOrders = async (showSuccessToast = false) => {
    try {
      setLoading(true);
      const { data } = await adminApi.getOrders();
      if (data.status === 'success') {
        // Separate online vs walking orders
        const all = data.orders || [];
        const onlineOrders  = all.filter(o => !o.is_walking && o.order_type !== 'walking');
        const walkingList   = all.filter(o =>  o.is_walking || o.order_type === 'walking');
        setOrders(onlineOrders);
        updateStats(onlineOrders);
        // Also try dedicated walking endpoint
        if (showSuccessToast) showToast('Orders refreshed', 'success');
      }
    } catch (error) {
      console.error('Fetch orders error:', error);
      if (error?.response?.status !== 401) showToast('Failed to fetch orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchWalkingOrders = async (showSuccessToast = false) => {
    try {
      const { data } = await adminApi.getWalkingOrders();
      const list = data?.my_orders || data?.orders || data?.data || [];
      const arr = Array.isArray(list) ? list : [];
      setWalkingOrders(arr);
      const pending = arr.filter(o => o.status === 'Requested').length;
      const total   = arr.length;
      setWalkingStats({ pending, total });
      if (showSuccessToast) showToast('Walking orders refreshed', 'success');
    } catch (error) {
      console.error('Fetch walking orders error:', error);
    }
  };

  const fetchBills = async (showSuccessToast = false) => {
    try {
      const { data } = await adminApi.getAllBills();
      if (data.status === 'success') {
        setBills(data.bills || []);
        if (showSuccessToast) showToast('Bills refreshed', 'success');
      }
    } catch (error) {
      console.error('Fetch bills error:', error);
      if (error?.response?.status !== 401) showToast('Failed to fetch bills', 'error');
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (token) {
      fetchOrders();
      fetchBills();
      fetchWalkingOrders();
    } else {
      setLoading(false);
    }
  }, [authLoading, token]);

  const value = {
    orders,
    walkingOrders,
    bills,
    stats,
    walkingStats,
    loading,
    fetchOrders,
    fetchBills,
    fetchWalkingOrders,
    setOrders,
    setWalkingOrders,
    setBills,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export default AdminProvider;