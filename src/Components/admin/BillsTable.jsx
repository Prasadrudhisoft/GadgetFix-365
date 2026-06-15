import { useState, useEffect } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import { usePagination } from '../../hooks/usePagination';
import Badge from '../shared/Badge';
import Pagination from './Pagination';
import Spinner from '../shared/Spinner';

const BillsTable = ({ onViewBill }) => {
  const { bills, loading, fetchBills } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    if (bills.length === 0) {
      fetchBills();
    }
  }, [bills.length, fetchBills]);

  // Filter bills
  const filteredBills = bills.filter(bill => {
    if (activeFilter !== 'all' && bill.payment_status !== activeFilter) {
      return false;
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        bill.bill_id?.toLowerCase().includes(term) ||
        bill.user_name?.toLowerCase().includes(term) ||
        bill.mobile_no?.includes(term) ||
        bill.model_name?.toLowerCase().includes(term) ||
        bill.category_name?.toLowerCase().includes(term) ||
        bill.brand_name?.toLowerCase().includes(term)
      );
    }

    return true;
  });

  const { currentPage, totalPages, paginatedItems, goToPage, showing, resetPage } =
    usePagination(filteredBills);

  useEffect(() => {
    resetPage();
  }, [activeFilter, searchTerm, resetPage]);

  const filterCounts = {
    all: bills.length,
    paid: bills.filter(b => b.payment_status === 'paid').length,
    unpaid: bills.filter(b => b.payment_status === 'unpaid').length,
    pending: bills.filter(b => b.payment_status === 'pending').length
  };

  const filters = ['all', 'paid', 'unpaid', 'pending'];

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center' }}>
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <div className="bills-table-container">
      <style>{`
        /* ============================================
           BILLS TABLE - FULLY RESPONSIVE STYLES
           Desktop → Tablet → Mobile (all breakpoints)
        ============================================ */
        
        .bills-table-container {
          width: 100%;
          max-width: 100%;
        }

        /* Responsive Header */
        .bills-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 12px;
        }

        .bills-title h2 {
          font-family: 'Sora', sans-serif;
          font-size: 22px;
          font-weight: 800;
          color: #0a1628;
          letter-spacing: -0.5px;
          margin: 0;
        }

        .bills-title p {
          font-family: 'Manrope', sans-serif;
          font-size: 13px;
          color: #7a9cc4;
          margin-top: 3px;
          font-weight: 500;
        }

        /* Responsive Search Input */
        .bills-search {
          padding: 10px 16px;
          border-radius: 16px;
          border: 1.5px solid rgba(37, 99, 235, 0.18);
          font-family: 'Manrope', sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: #0a1628;
          outline: none;
          width: 240px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background: white;
        }

        .bills-search:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
        }

        /* Responsive Filters Row */
        .bills-filters {
          display: flex;
          gap: 7px;
          flex-wrap: wrap;
          margin-bottom: 18px;
        }

        /* Mobile filters scroll (when many filters) */
        @media (max-width: 500px) {
          .bills-filters {
            flex-wrap: nowrap;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            padding-bottom: 8px;
            scrollbar-width: thin;
          }
          .bills-filters::-webkit-scrollbar {
            height: 3px;
          }
          .bills-filters::-webkit-scrollbar-thumb {
            background: #bfdbfe;
            border-radius: 3px;
          }
        }

        /* Table Container */
        .bills-table-wrapper {
          background: #ffffff;
          border-radius: 22px;
          border: 1.5px solid rgba(37, 99, 235, 0.09);
          box-shadow: 0 2px 8px rgba(29, 78, 216, 0.07), 0 1px 3px rgba(0, 0, 0, 0.04);
          overflow: hidden;
        }

        /* Scrollable table wrapper for horizontal scroll on small screens */
        .bills-table-scroll {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          width: 100%;
        }

        .bills-table-scroll::-webkit-scrollbar {
          height: 4px;
        }

        .bills-table-scroll::-webkit-scrollbar-track {
          background: #f0f4ff;
        }

        .bills-table-scroll::-webkit-scrollbar-thumb {
          background: #bfdbfe;
          border-radius: 4px;
        }

        .bills-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 800px;
        }

        /* For medium tablets, reduce min-width slightly */
        @media (max-width: 900px) {
          .bills-table {
            min-width: 720px;
          }
        }

        /* Hide non-critical columns on very small screens via media queries */
        @media (max-width: 680px) {
          .bills-table .hide-on-mobile {
            display: none;
          }
        }

        @media (max-width: 550px) {
          .bills-table {
            min-width: 550px;
          }
        }

        /* Table Header */
        .bills-th {
          background: #f0f4ff;
          padding: 13px 16px;
          text-align: left;
          font-family: 'Manrope', sans-serif;
          font-size: 11px;
          font-weight: 800;
          color: #4b6a9b;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          border-bottom: 2px solid rgba(37, 99, 235, 0.18);
          white-space: nowrap;
        }

        /* Table Cells */
        .bills-td {
          padding: 15px 16px;
          border-bottom: 1px solid rgba(37, 99, 235, 0.09);
          font-family: 'Manrope', sans-serif;
          font-size: 13px;
          color: #1e3a5f;
          vertical-align: middle;
        }

        /* Responsive table cell padding */
        @media (max-width: 767px) {
          .bills-th, .bills-td {
            padding: 11px 12px;
          }
        }

        @media (max-width: 480px) {
          .bills-th, .bills-td {
            padding: 9px 10px;
            font-size: 12px;
          }
        }

        /* View Button */
        .bills-view-btn {
          padding: 7px 13px;
          border-radius: 10px;
          background: #ecfdf5;
          color: #059669;
          border: 1px solid #a7f3d0;
          font-family: 'Manrope', sans-serif;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          white-space: nowrap;
        }

        @media (hover: hover) {
          .bills-view-btn:hover {
            background: #059669;
            color: #fff;
            box-shadow: 0 4px 14px rgba(5, 150, 105, 0.35);
            transform: translateY(-1px);
          }
        }

        .bills-view-btn:active {
          transform: scale(0.97);
        }

        /* Mobile: make view button slightly larger for easier tapping */
        @media (max-width: 480px) {
          .bills-view-btn {
            padding: 8px 14px;
            font-size: 12px;
          }
        }

        /* Type Badge */
        .bills-type-badge {
          background: #EEF3FF;
          color: #1d4ed8;
          padding: 5px 12px;
          border-radius: 9999px;
          font-size: 11px;
          font-weight: 800;
          display: inline-block;
          white-space: nowrap;
        }

        @media (max-width: 480px) {
          .bills-type-badge {
            padding: 4px 10px;
            font-size: 10px;
          }
        }

        /* Empty State */
        .bills-empty {
          padding: 60px 20px;
          text-align: center;
          color: #7a9cc4;
          font-size: 14px;
          font-weight: 600;
        }

        @media (max-width: 480px) {
          .bills-empty {
            padding: 40px 16px;
            font-size: 13px;
          }
        }

        /* Device info in cell */
        .bills-device-name {
          font-family: 'Sora', sans-serif;
          font-weight: 700;
          font-size: 13px;
          color: #0a1628;
        }

        .bills-device-meta {
          font-size: 11px;
          color: #7a9cc4;
          margin-top: 3px;
        }

        /* Customer info */
        .bills-customer-name {
          font-weight: 600;
          font-size: 12px;
        }

        .bills-customer-mobile {
          font-size: 11px;
          color: #c8d9ef;
        }
      `}</style>

      {/* Header Section */}
      <div className="bills-header">
        <div className="bills-title">
          <h2>Bills</h2>
          <p>View all generated bills and payment status</p>
        </div>

        <input
          type="text"
          className="bills-search"
          placeholder="🔍 Search bills..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Filters Section */}
      <div className="bills-filters">
        {filters.map(filter => (
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
              boxShadow: filter === activeFilter ? '0 4px 14px rgba(29, 78, 216, 0.3)' : 'none',
              textTransform: 'capitalize',
              flexShrink: 0
            }}
          >
            {filter === 'all' ? 'All' : filter} ({filterCounts[filter] || 0})
          </button>
        ))}
      </div>

      {/* Table Section */}
      <div className="bills-table-wrapper">
        <div className="bills-table-scroll">
          <table className="bills-table">
            <thead>
              <tr>
                <th className="bills-th">Bill ID</th>
                <th className="bills-th">Customer</th>
                <th className="bills-th">Device / Model</th>
                <th className="bills-th hide-on-mobile">Type</th>
                <th className="bills-th">Amount</th>
                <th className="bills-th">Payment</th>
                <th className="bills-th hide-on-mobile">Date</th>
                <th className="bills-th">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan="8" className="bills-empty">
                    🧾 No bills found
                  </td>
                </tr>
              ) : (
                paginatedItems.map((bill, index) => {
                  const typeLabel = bill.confirmed_type === 'duplicate' ? '🔄 Duplicate' : '✅ Primary';

                  return (
                    <tr
                      key={bill.bill_id || index}
                      style={{ transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
                      onMouseEnter={(e) => {
                        if (window.innerWidth > 768) {
                          e.currentTarget.style.background = '#eff6ff';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (window.innerWidth > 768) {
                          e.currentTarget.style.background = 'transparent';
                        }
                      }}
                    >
                      <td className="bills-td" style={{ fontSize: '11px', color: '#c8d9ef', fontFamily: 'monospace' }}>
                        {(bill.bill_id || '').slice(0, 8)}…
                      </td>
                      <td className="bills-td">
                        <div className="bills-customer-name">{bill.user_name || '—'}</div>
                        <div className="bills-customer-mobile">📞 {bill.mobile_no || ''}</div>
                      </td>
                      <td className="bills-td">
                        <div className="bills-device-name">{bill.model_name || '—'}</div>
                        <div className="bills-device-meta">
                          {bill.category_name || ''} · {bill.brand_name || ''}
                        </div>
                      </td>
                      <td className="bills-td hide-on-mobile">
                        <span className="bills-type-badge">{typeLabel}</span>
                      </td>
                      <td className="bills-td" style={{ fontWeight: 700, color: '#0a1628' }}>
                        ₹ {parseFloat(bill.total_amount || 0).toFixed(2)}
                      </td>
                      <td className="bills-td">
                        <Badge status={bill.payment_status} type="payment" />
                      </td>
                      <td className="bills-td hide-on-mobile" style={{ whiteSpace: 'nowrap', fontSize: '12px', color: '#c8d9ef' }}>
                        {bill.created_at ? new Date(bill.created_at).toLocaleDateString('en-IN') : '—'}
                      </td>
                      <td className="bills-td">
                        <button
                          onClick={() => onViewBill(bill.order_id)}
                          className="bills-view-btn"
                        >
                          🧾 View
                        </button>
                      </td>
                    </tr>
                  );
                })
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
    </div>
  );
};

export default BillsTable;