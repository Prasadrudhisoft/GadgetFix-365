import { useState, useEffect, useCallback } from 'react';
import adminApi from '../../services/adminApi';
import WalkingOrderModal from '../modals/WalkingOrderModal';
import WalkingOrderDetailModal from './WalkingOrderDetailModal';
import BillDetailModal from './BillDetailModal';
import ViewTempQuotationModal from './ViewTempQuotationModal';
import ViewFinalQuotationModal from './ViewFinalQuotationModal';
import FinalQuotationAdminModal from './FinalQuotationAdminModal';
import MarkPaidModal from './MarkPaidModal';
import { Spinner } from '../shared/Spinner';
import { useUI } from '../../hooks/useUI';

const statusColor = (status) => {
  const map = {
    Requested:            { bg: '#eff6ff', color: '#1d4ed8' },
    quotation_sent:       { bg: '#fefce8', color: '#a16207' },
    Confirmed:            { bg: '#f0fdf4', color: '#15803d' },
    'Picked Up':          { bg: '#fff7ed', color: '#c2410c' },
    Reviewed:             { bg: '#fdf4ff', color: '#7e22ce' },
    final_quotation_sent: { bg: '#fefce8', color: '#a16207' },
    Final_Confirmed:      { bg: '#f0fdf4', color: '#15803d' },
    Repairing:            { bg: '#fff7ed', color: '#ea580c' },
    'Repair Done':        { bg: '#ecfdf5', color: '#059669' },
    Delivered:            { bg: '#eff6ff', color: '#2563eb' },
    Completed:            { bg: '#f0fdf4', color: '#16a34a' },
    Cancelled:            { bg: '#fef2f2', color: '#dc2626' },
  };
  return map[status] || { bg: '#f1f5f9', color: '#475569' };
};

export default function WalkingOrdersPage() {
  const { showToast } = useUI();
  const [orders, setOrders]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [search, setSearch]         = useState('');

  const [detailOpen, setDetailOpen]           = useState(false);
  const [selectedOrder, setSelectedOrder]     = useState(null);
  const [billOpen, setBillOpen]               = useState(false);
  const [selectedBillId, setSelectedBillId]   = useState(null);
  const [tempQuoteOpen, setTempQuoteOpen]     = useState(false);
  const [selectedTempId, setSelectedTempId]   = useState(null);
  const [finalQuoteOpen, setFinalQuoteOpen]   = useState(false);
  const [selectedFinalId, setSelectedFinalId] = useState(null);
  const [sendFinalOpen, setSendFinalOpen]     = useState(false);
  const [selectedSendId, setSelectedSendId]   = useState(null);
  const [markPaidOpen, setMarkPaidOpen]       = useState(false);
  const [selectedPaidId, setSelectedPaidId]   = useState(null);

  const fetchWalkingOrders = useCallback(async () => {
    setLoading(true);
    try {
      // Try dedicated walking orders endpoint first
      let walking = [];
      try {
        const res = await adminApi.getWalkingOrders();
        const payload = res.data;
        walking = payload?.my_orders || payload?.orders || payload?.data || [];
        if (!Array.isArray(walking)) walking = [];
      } catch {
        // Fallback: filter from all orders
        const res = await adminApi.getOrders();
        const all = res.data?.orders || res.data?.data || [];
        walking = (Array.isArray(all) ? all : []).filter(o =>
          o.order_type === 'walking' || o.is_walking === true || o.is_walking === 1
        );
      }
      setOrders(Array.isArray(walking) ? walking : []);
    } catch {
      showToast('Failed to load walking orders', 'error');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { fetchWalkingOrders(); }, [fetchWalkingOrders]);

  const filtered = orders.filter(o => {
    if (!search) return true;
    const t = search.toLowerCase();
    return (
      o.model_name?.toLowerCase().includes(t)   ||
      o.user_name?.toLowerCase().includes(t)     ||
      o.customer_name?.toLowerCase().includes(t) ||
      o.mobile_no?.includes(t)                   ||
      o.problem_title?.toLowerCase().includes(t) ||
      o.brand_name?.toLowerCase().includes(t)    ||
      o.category_name?.toLowerCase().includes(t)
    );
  });

  const handleViewOrder = (order) => { setSelectedOrder(order); setDetailOpen(true); };

  return (
    <>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: '22px', fontWeight: 800, color: '#0a1628', letterSpacing: '-0.5px', margin: 0 }}>
            Walk-in Orders
          </h2>
          <p style={{ fontFamily: "'Manrope',sans-serif", fontSize: '13px', color: '#7a9cc4', marginTop: '3px', fontWeight: 500 }}>
            Orders placed directly at the store — managed entirely by admin
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <i className="fas fa-search" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '13px' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search orders..."
              style={{ paddingLeft: '34px', paddingRight: '14px', paddingTop: '10px', paddingBottom: '10px', border: '1.5px solid #e2e8f0', borderRadius: '12px', fontFamily: "'Manrope',sans-serif", fontSize: '13px', fontWeight: 500, color: '#1e3a5f', background: '#fff', outline: 'none', width: '220px', transition: 'border-color 0.2s' }}
              onFocus={e => e.target.style.borderColor = '#1d4ed8'}
              onBlur={e  => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          <button
            onClick={() => setCreateOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '12px', background: 'linear-gradient(135deg,#1d4ed8,#2563eb)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: "'Manrope',sans-serif", fontSize: '13.5px', fontWeight: 700, boxShadow: '0 4px 16px rgba(29,78,216,0.3)', transition: 'all 0.22s', whiteSpace: 'nowrap' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(29,78,216,0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)';   e.currentTarget.style.boxShadow = '0 4px 16px rgba(29,78,216,0.3)'; }}
          >
            <i className="fas fa-plus" /> New Walk-in Order
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: '22px', border: '1.5px solid rgba(37,99,235,0.09)', boxShadow: '0 2px 8px rgba(29,78,216,0.07)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center' }}><Spinner size="large" /></div>
        ) : (
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
              <thead>
                <tr style={{ background: '#f0f4ff' }}>
                  {['#','Device','Customer','Problem','Date','Status','Actions'].map(h => (
                    <th key={h} style={{ padding: '13px 16px', textAlign: 'left', fontFamily: "'Manrope',sans-serif", fontSize: '11px', fontWeight: 800, color: '#4b6a9b', textTransform: 'uppercase', letterSpacing: '0.8px', borderBottom: '2px solid rgba(37,99,235,0.18)', whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '50px 16px', color: '#7a9cc4', fontFamily: "'Manrope',sans-serif", fontSize: '14px' }}>
                      {search ? 'No orders match your search.' : 'No walk-in orders yet. Create one above!'}
                    </td>
                  </tr>
                ) : filtered.map((order, idx) => {
                  const sc = statusColor(order.status);
                  return (
                    <tr key={order.id} style={{ transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#eff6ff'}
                      onMouseLeave={e => e.currentTarget.style.background = ''}
                    >
                      <td style={{ padding: '14px 16px', borderBottom: '1px solid rgba(37,99,235,0.09)', fontFamily: "'Manrope',sans-serif", fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>{idx + 1}</td>
                      <td style={{ padding: '14px 16px', borderBottom: '1px solid rgba(37,99,235,0.09)' }}>
                        <div style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 700, fontSize: '13px', color: '#1e3a5f' }}>{order.model_name || '—'}</div>
                        <div style={{ fontFamily: "'Manrope',sans-serif", fontSize: '11px', color: '#7a9cc4', marginTop: '2px' }}>{order.category_name || ''}{order.brand_name ? ` · ${order.brand_name}` : ''}</div>
                      </td>
                      <td style={{ padding: '14px 16px', borderBottom: '1px solid rgba(37,99,235,0.09)' }}>
                        <div style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 700, fontSize: '13px', color: '#1e3a5f' }}>{order.customer_name || order.user_name || '—'}</div>
                        <div style={{ fontFamily: "'Manrope',sans-serif", fontSize: '11px', color: '#7a9cc4', marginTop: '2px' }}>{order.mobile_no || ''}</div>
                      </td>
                      <td style={{ padding: '14px 16px', borderBottom: '1px solid rgba(37,99,235,0.09)', fontFamily: "'Manrope',sans-serif", fontSize: '13px', color: '#1e3a5f', maxWidth: '180px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {order.problem_title || '—'}
                      </td>
                      <td style={{ padding: '14px 16px', borderBottom: '1px solid rgba(37,99,235,0.09)', fontFamily: "'Manrope',sans-serif", fontSize: '12px', color: '#4b6a9b', whiteSpace: 'nowrap' }}>
                        {order.created_at ? new Date(order.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                      </td>
                      <td style={{ padding: '14px 16px', borderBottom: '1px solid rgba(37,99,235,0.09)' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', padding: '5px 12px', borderRadius: '9999px', fontSize: '11px', fontWeight: 800, background: sc.bg, color: sc.color, fontFamily: "'Manrope',sans-serif", whiteSpace: 'nowrap' }}>
                          {order.status || 'Requested'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', borderBottom: '1px solid rgba(37,99,235,0.09)' }}>
                        <button
                          onClick={() => handleViewOrder(order)}
                          style={{ padding: '6px 12px', borderRadius: '10px', background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: "'Manrope',sans-serif", transition: 'all 0.2s', whiteSpace: 'nowrap' }}
                          onMouseEnter={e => { e.currentTarget.style.background='#1d4ed8'; e.currentTarget.style.color='#fff'; e.currentTarget.style.borderColor='#1d4ed8'; }}
                          onMouseLeave={e => { e.currentTarget.style.background='#eff6ff'; e.currentTarget.style.color='#1d4ed8'; e.currentTarget.style.borderColor='#bfdbfe'; }}
                        >
                          👁 View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div style={{ padding: '12px 20px', borderTop: '1px solid rgba(37,99,235,0.09)', fontFamily: "'Manrope',sans-serif", fontSize: '12px', color: '#7a9cc4', fontWeight: 500 }}>
            Showing {filtered.length} of {orders.length} walk-in order{orders.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* ── Modals ──────────────────────────────────────────── */}

      <WalkingOrderModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={() => { setCreateOpen(false); fetchWalkingOrders(); }}
      />

      <WalkingOrderDetailModal
        isOpen={detailOpen}
        onClose={() => { setDetailOpen(false); setSelectedOrder(null); }}
        order={selectedOrder}
        onViewBill={(id)              => { setSelectedBillId(id);   setBillOpen(true);       }}
        onViewTempQuotation={(id)     => { setSelectedTempId(id);   setTempQuoteOpen(true);  }}
        onViewFinalQuotation={(id)    => { setSelectedFinalId(id);  setFinalQuoteOpen(true); }}
        onSendFinalQuotation={(id)    => { setSelectedSendId(id);   setSendFinalOpen(true);  }}
        onMarkPaid={(id)              => { setSelectedPaidId(id);   setMarkPaidOpen(true);   }}
      />

      <BillDetailModal
        isOpen={billOpen}
        onClose={() => { setBillOpen(false); setSelectedBillId(null); }}
        orderId={selectedBillId}
      />

      <ViewTempQuotationModal
        isOpen={tempQuoteOpen}
        onClose={() => { setTempQuoteOpen(false); setSelectedTempId(null); }}
        orderId={selectedTempId}
      />

      <ViewFinalQuotationModal
        isOpen={finalQuoteOpen}
        onClose={() => { setFinalQuoteOpen(false); setSelectedFinalId(null); }}
        orderId={selectedFinalId}
      />

      <FinalQuotationAdminModal
        isOpen={sendFinalOpen}
        onClose={() => { setSendFinalOpen(false); setSelectedSendId(null); }}
        orderId={selectedSendId}
      />

      <MarkPaidModal
        isOpen={markPaidOpen}
        onClose={() => { setMarkPaidOpen(false); setSelectedPaidId(null); }}
        orderId={selectedPaidId}
      />
    </>
  );
}