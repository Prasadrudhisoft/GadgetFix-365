// src/contexts/OrdersContext.jsx
import { createContext, useState, useCallback, useContext } from 'react';
import { ordersAPI } from '@services/api';
import { AuthContext } from './AuthContext';
import { ORDERS_FETCH_COOLDOWN } from '@utils/constants';

export const OrdersContext = createContext();

export const OrdersProvider = ({ children }) => {
  const { isLoggedIn } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastFetch, setLastFetch] = useState(0);
  const [activeFilter, setActiveFilter] = useState('all');

  const fetchOrders = useCallback(async (forceRefresh = false) => {
    if (!isLoggedIn) return;

    const now = Date.now();
    if (!forceRefresh && (now - lastFetch) < ORDERS_FETCH_COOLDOWN) {
      return; // Skip if fetched recently
    }

    setIsLoading(true);
    try {
      const data = await ordersAPI.getMyOrders();

      if (data.status === 'success') {
        let ordersData = data.my_orders || [];

        // Fetch confirm types for all orders
        const ordersWithTypes = await Promise.all(
          ordersData.map(async (order) => {
            try {
              const typeData = await ordersAPI.getConfirmType(order.id);
              if (typeData.status === 'success') {
                return {
                  ...order,
                  confirmed_type: typeData.t_type,
                  final_confirmed_type: typeData.f_type,
                };
              }
            } catch (error) {
              console.error('Failed to fetch confirm type:', error);
            }
            return order;
          })
        );

        setOrders(ordersWithTypes);
        setLastFetch(now);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [isLoggedIn, lastFetch]);

  const getOrderById = useCallback((orderId) => {
    return orders.find((order) => order.id === orderId);
  }, [orders]);

  const stats = {
    total: orders.length,
    pending: orders.filter((o) =>
      ['Requested', 'In Review'].includes(o.status)
    ).length,
    progress: orders.filter((o) =>
      [
        'quotation_sent',
        'Confirmed',
        'Picked Up',
        'Reviewed',
        'final_quotation_sent',
        'Final_Confirmed',
        'Repairing',
        'Repair Done',
        'Delivered',
      ].includes(o.status)
    ).length,
    done: orders.filter((o) => o.status === 'Completed').length,
  };

  const filteredOrders = activeFilter === 'all'
    ? orders
    : orders.filter((o) => o.status === activeFilter);

  const value = {
    orders,
    filteredOrders,
    isLoading,
    activeFilter,
    setActiveFilter,
    stats,
    fetchOrders,
    getOrderById,
  };

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
};