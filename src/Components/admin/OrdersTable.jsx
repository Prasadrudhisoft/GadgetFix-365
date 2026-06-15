import { useState, useEffect } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import { useFilters } from '../../hooks/useFilters';
import { usePagination } from '../../hooks/usePagination';
import Badge from '../shared/Badge';
import Pagination from './Pagination';
import { Spinner } from '../shared/Spinner';
import { STATUS_STEPS } from '../../utils/constants';

const OrdersTable = ({ onViewOrder, onViewBill }) => {
  const { orders, loading } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  // Filter orders
  const filteredOrders = orders.filter(order => {
    // Status filter
    if (activeFilter !== 'all' && order.status !== activeFilter) {
      return false;
    }

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        order.model_name?.toLowerCase().includes(term) ||
        order.user_name?.toLowerCase().includes(term) ||
        order.mobile_no?.includes(term) ||
        order.problem_title?.toLowerCase().includes(term) ||
        order.brand_name?.toLowerCase().includes(term) ||
        order.category_name?.toLowerCase().includes(term)
      );
    }

    return true;
  });

  // Pagination
  const { currentPage, totalPages, paginatedItems, goToPage, showing, resetPage } =
    usePagination(filteredOrders);

  // Reset page when filters change
  useEffect(() => {
    resetPage();
  }, [activeFilter, searchTerm, resetPage]);

  // Filter counts
  const filterCounts = {
    all: orders.length,
    ...STATUS_STEPS.reduce((acc, status) => {
      acc[status] = orders.filter(o => o.status === status).length;
      return acc;
    }, {}),
    Cancelled: orders.filter(o => o.status === 'Cancelled').length
  };

  const allFilters = ['all', ...STATUS_STEPS, 'Cancelled'];

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center' }}>
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <h2 style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: '22px',
            fontWeight: 800,
            color: '#0a1628',
            letterSpacing: '-0.5px',
            margin: 0
          }}>
            All Orders
          </h2>
          <p style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: '13px',
            color: '#7a9cc4',
            marginTop: '3px',
            fontWeight: 500
          }}>
            Manage and update all repair requests
          </p>
        </div>

        <input
          type="text"
          placeholder="🔍 Search orders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '10px 16px',
            borderRadius: '16px',
            border: '1.5px solid rgba(37, 99, 235, 0.18)',
            fontFamily: "'Manrope', sans-serif",
            fontSize: '13px',
            fontWeight: 500,
            color: '#0a1628',
            outline: 'none',
            width: '240px',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            background: 'white'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#1d4ed8';
            e.target.style.boxShadow = '0 0 0 4px rgba(29, 78, 216, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(37, 99, 235, 0.18)';
            e.target.style.boxShadow = 'none';
          }}
        />
      </div>

      {/* Filters */}
      <div style={{
        display: 'flex',
        gap: '7px',
        flexWrap: 'wrap',
        marginBottom: '18px',
        overflowX: 'auto',
        paddingBottom: '6px'
      }}>
        {allFilters.map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            style={{
              padding: '8px 16px',
              borderRadius: '9999px',
              fontFamily: "'Manrope', sans-serif",
              fontSize: '12px',
              fontWeight: 700,
              border: '1.5px solid',
              borderColor: filter === activeFilter ? 'transparent' : 'rgba(37, 99, 235, 0.18)',
              background: filter === activeFilter
                ? 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #1e40af 100%)'
                : 'white',
              color: filter === activeFilter ? '#fff' : '#4b6a9b',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: filter === activeFilter ? '0 4px 14px rgba(29, 78, 216, 0.3)' : 'none'
            }}
            onMouseEnter={(e) => {
              if (filter !== activeFilter) {
                e.currentTarget.style.borderColor = '#1d4ed8';
                e.currentTarget.style.color = '#1d4ed8';
                e.currentTarget.style.background = '#eff6ff';
              }
            }}
            onMouseLeave={(e) => {
              if (filter !== activeFilter) {
                e.currentTarget.style.borderColor = 'rgba(37, 99, 235, 0.18)';
                e.currentTarget.style.color = '#4b6a9b';
                e.currentTarget.style.background = 'white';
              }
            }}
          >
            {filter === 'all' ? 'All' : filter} ({filterCounts[filter] || 0})
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{
        background: '#ffffff',
        borderRadius: '22px',
        border: '1.5px solid rgba(37, 99, 235, 0.09)',
        boxShadow: '0 2px 8px rgba(29, 78, 216, 0.07), 0 1px 3px rgba(0, 0, 0, 0.04)',
        overflow: 'hidden'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f0f4ff' }}>
                <th style={thStyle}>Device / Model</th>
                <th style={thStyle}>Customer</th>
                <th style={thStyle}>Problem</th>
                <th style={thStyle}>Category / Brand</th>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ padding: '60px 20px', textAlign: 'center', color: '#7a9cc4' }}>
                    📋 No orders match your filter
                  </td>
                </tr>
              ) : (
                paginatedItems.map(order => (
                  <tr
                    key={order.id}
                    style={{
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#eff6ff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <td style={tdStyle}>
                      <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, color: '#0a1628', fontSize: '13px' }}>
                        {order.model_name || '—'}
                      </div>
                      <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: '11px', color: '#7a9cc4', marginTop: '3px', fontWeight: 500 }}>
                        {order.brand_name || ''}
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ fontWeight: 600, fontSize: '12px' }}>{order.user_name || '—'}</div>
                      <div style={{ fontSize: '11px', color: '#c8d9ef' }}>📞 {order.mobile_no || ''}</div>
                    </td>
                    <td style={{ ...tdStyle, maxWidth: '180px' }}>
                      <div style={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        fontSize: '12px'
                      }}>
                        {order.problem_title || '—'}
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ fontSize: '12px' }}>{order.category_name || '—'}</div>
                      <div style={{ fontSize: '11px', color: '#c8d9ef' }}>{order.brand_name || ''}</div>
                    </td>
                    <td style={{ ...tdStyle, whiteSpace: 'nowrap', fontSize: '12px', color: '#c8d9ef' }}>
                      {order.created_at ? new Date(order.created_at).toLocaleDateString('en-IN') : '—'}
                    </td>
                    <td style={tdStyle}>
                      <Badge status={order.status} />
                    </td>
                    <td style={{ ...tdStyle, display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => onViewOrder(order)}
                        style={actionBtnStyle('#eff6ff', '#1d4ed8')}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#1d4ed8';
                          e.currentTarget.style.color = '#fff';
                          e.currentTarget.style.boxShadow = '0 4px 14px rgba(29, 78, 216, 0.35)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#eff6ff';
                          e.currentTarget.style.color = '#1d4ed8';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        👁 View
                      </button>
                      <button
                        onClick={() => onViewBill(order.id)}
                        style={actionBtnStyle('#ecfdf5', '#059669')}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#059669';
                          e.currentTarget.style.color = '#fff';
                          e.currentTarget.style.boxShadow = '0 4px 14px rgba(5, 150, 105, 0.35)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#ecfdf5';
                          e.currentTarget.style.color = '#059669';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        🧾 Bill
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {paginatedItems.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            showing={showing}
            onPageChange={goToPage}
          />
        )}
      </div>
    </>
  );
};

const thStyle = {
  background: '#f0f4ff',
  padding: '13px 16px',
  textAlign: 'left',
  fontFamily: "'Manrope', sans-serif",
  fontSize: '11px',
  fontWeight: 800,
  color: '#4b6a9b',
  textTransform: 'uppercase',
  letterSpacing: '0.8px',
  borderBottom: '2px solid rgba(37, 99, 235, 0.18)'
};

const tdStyle = {
  padding: '15px 16px',
  borderBottom: '1px solid rgba(37, 99, 235, 0.09)',
  fontFamily: "'Manrope', sans-serif",
  fontSize: '13px',
  color: '#1e3a5f',
  verticalAlign: 'middle'
};

const actionBtnStyle = (bg, color) => ({
  padding: '7px 13px',
  borderRadius: '10px',
  fontFamily: "'Manrope', sans-serif",
  fontSize: '12px',
  fontWeight: 700,
  cursor: 'pointer',
  border: '1px solid',
  borderColor: color + '33',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '5px',
  background: bg,
  color: color
});

export default OrdersTable;