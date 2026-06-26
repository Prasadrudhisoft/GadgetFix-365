// src/pages/AdminPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useAdmin } from '../hooks/useAdmin';
import { useData } from '../hooks/useData';
import Sidebar from '../components/admin/Sidebar';
import StatCard from '../components/admin/StatCard';
import OrdersTable from '../components/admin/OrdersTable';
import BillsTable from '../components/admin/BillsTable';
import CategoriesGrid from '../components/admin/CategoriesGrid';
import BrandsGrid from '../components/admin/BrandsGrid';
import OrderDetailModal from '../components/admin/OrderDetailModal';
import BillDetailModal from '../components/admin/BillDetailModal';
import AddCategoryModal from '../components/admin/AddCategoryModal';
import AddBrandModal from '../components/admin/AddBrandModal';
import FinalQuotationAdminModal from '../components/admin/FinalQuotationAdminModal';
import ViewFinalQuotationModal from '../components/admin/ViewFinalQuotationModal';
import ViewTempQuotationModal from '../components/admin/ViewTempQuotationModal';
import MarkPaidModal from '../components/admin/MarkPaidModal';
import WalkingOrdersPage from '../components/admin/WalkingOrdersPage';

const AdminPage = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const { stats, orders, walkingStats, fetchWalkingOrders } = useAdmin();
  const { categories, fetchCategories } = useData();

  const [activePage, setActivePage]                     = useState('dashboard');
  const [sidebarOpen, setSidebarOpen]                   = useState(false);
  const [selectedOrder, setSelectedOrder]               = useState(null);
  const [orderDetailOpen, setOrderDetailOpen]           = useState(false);
  const [billDetailOpen, setBillDetailOpen]             = useState(false);
  const [selectedBillOrderId, setSelectedBillOrderId]   = useState(null);
  const [addCategoryOpen, setAddCategoryOpen]           = useState(false);
  const [addBrandOpen, setAddBrandOpen]                 = useState(false);
  const [finalQuotationOpen, setFinalQuotationOpen]     = useState(false);
  const [selectedFinalOrderId, setSelectedFinalOrderId] = useState(null);
  const [viewFinalQuotationOpen, setViewFinalQuotationOpen]   = useState(false);
  const [selectedViewFinalOrderId, setSelectedViewFinalOrderId] = useState(null);
  const [viewTempQuotationOpen, setViewTempQuotationOpen] = useState(false);
  const [selectedTempOrderId, setSelectedTempOrderId]   = useState(null);
  const [markPaidOpen, setMarkPaidOpen]                 = useState(false);
  const [selectedPaidOrderId, setSelectedPaidOrderId]   = useState(null);

  useEffect(() => {
    if (!isLoggedIn)            { navigate('/'); return; }
    if (user?.role !== 'admin') { navigate('/'); return; }
  }, [isLoggedIn, user, navigate]);

  // Close sidebar on route change (mobile)
  useEffect(() => { setSidebarOpen(false); }, [activePage]);

  const handleAddCategorySuccess = () => { fetchCategories(); setAddCategoryOpen(false); };
  const handleAddBrandSuccess     = () => { setAddBrandOpen(false); };

  const handleViewOrder           = (order)   => { setSelectedOrder(order);          setOrderDetailOpen(true); };
  const handleViewBill            = (orderId) => { setSelectedBillOrderId(orderId);  setBillDetailOpen(true); };
  const handleSendFinalQuotation  = (orderId) => { setSelectedFinalOrderId(orderId); setFinalQuotationOpen(true); };
  const handleViewFinalQuotation  = (orderId) => { setSelectedViewFinalOrderId(orderId); setViewFinalQuotationOpen(true); };
  const handleViewTempQuotation   = (orderId) => { setSelectedTempOrderId(orderId);  setViewTempQuotationOpen(true); };
  const handleMarkPaid            = (orderId) => { setSelectedPaidOrderId(orderId);  setMarkPaidOpen(true); };

  const recentOrders = orders.slice(0, 10);

  const pageLabels = {
    dashboard:       'Dashboard',
    orders:          'All Orders',
    'walking-orders':'Walk-in Orders',
    bills:           'Bills',
    categories:      'Categories',
    brands:          'Brands',
  };

  return (
    <div className="ap-root">

      {/* ── Sidebar ─────────────────────────────────── */}
      <Sidebar
        activePage={activePage}
        onPageChange={setActivePage}
        pendingCount={stats.pending}
        walkingPendingCount={walkingStats.pending}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onToggle={() => setSidebarOpen(prev => !prev)}
      />

      {/* ── Backdrop (mobile only) ───────────────────── */}
      {sidebarOpen && (
        <div
          className="ap-backdrop"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Main content ─────────────────────────────── */}
      <main className="ap-main">

        {/* Top-bar (mobile) */}
        <header className="ap-topbar">
          <div className="ap-topbar-left">
            <div className="ap-topbar-logo">
              <span>⚙️</span>
            </div>
            <span className="ap-topbar-title">{pageLabels[activePage] || 'Admin'}</span>
          </div>

          {/* Hamburger — RIGHT side */}
          <button
            className="ap-hamburger"
            onClick={() => setSidebarOpen(prev => !prev)}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? (
              /* X icon */
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              /* Hamburger icon */
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="3" y1="6"  x2="21" y2="6"  />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
            {stats.pending > 0 && !sidebarOpen && (
              <span className="ap-hamburger-badge">{stats.pending}</span>
            )}
          </button>
        </header>

        {/* Page content */}
        <div className="ap-content">

          {/* ── Dashboard ── */}
          {activePage === 'dashboard' && (
            <div className="ap-fadein">

              {/* Stat cards */}
              <div className="ap-stats-grid">
                <StatCard icon="fas fa-clipboard-list"     label="Total Orders"   value={stats.total}    color="#1d4ed8" bgColor="#eff6ff" />
                <StatCard icon="fas fa-hourglass-half"     label="Pending Review" value={stats.pending}  color="#b45309" bgColor="#fffbeb" />
                <StatCard icon="fas fa-screwdriver-wrench" label="In Progress"    value={stats.progress} color="#ea580c" bgColor="#fff7ed" />
                <StatCard icon="fas fa-circle-check"       label="Completed"      value={stats.done}     color="#059669" bgColor="#f0fdf4" />
              </div>

              {/* Recent orders table */}
              <div className="ap-card">
                <div className="ap-card-header">
                  <div>
                    <div className="ap-card-title">Recent Orders</div>
                    <div className="ap-card-sub">Latest 10 repair requests</div>
                  </div>
                  <button
                    className="ap-view-all-btn"
                    onClick={() => setActivePage('orders')}
                  >
                    View All <i className="fas fa-arrow-right" />
                  </button>
                </div>

                <div className="ap-table-wrap">
                  <table className="ap-table">
                    <thead>
                      <tr>
                        {['Device', 'Customer', 'Problem', 'Category', 'Date', 'Status', 'Actions'].map(h => (
                          <th key={h}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="ap-empty-row">No orders yet</td>
                        </tr>
                      ) : recentOrders.map(order => (
                        <tr key={order.id} className="ap-table-row">
                          <td>
                            <div className="ap-cell-main">{order.model_name || '—'}</div>
                            <div className="ap-cell-sub">{order.category_name || ''} · {order.brand_name || ''}</div>
                          </td>
                          <td>
                            <div className="ap-cell-main">{order.user_name || '—'}</div>
                            <div className="ap-cell-sub">{order.mobile_no || ''}</div>
                          </td>
                          <td className="ap-cell-truncate">
                            {order.problem_title || '—'}
                          </td>
                          <td>{order.category_name || '—'}</td>
                          <td className="ap-cell-nowrap">
                            {order.created_at
                              ? new Date(order.created_at).toLocaleDateString('en-IN')
                              : '—'}
                          </td>
                          <td>
                            <span className="ap-status-badge">
                              {order.status || 'Requested'}
                            </span>
                          </td>
                          <td>
                            <button
                              className="ap-view-btn"
                              onClick={() => handleViewOrder(order)}
                            >
                              👁 View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activePage === 'orders'          && <OrdersTable onViewOrder={handleViewOrder} onViewBill={handleViewBill} />}
          {activePage === 'walking-orders'  && <WalkingOrdersPage onViewOrder={handleViewOrder} onRefresh={fetchWalkingOrders} />}
          {activePage === 'bills'           && <BillsTable onViewBill={handleViewBill} />}
          {activePage === 'categories' && <CategoriesGrid onAddCategory={() => setAddCategoryOpen(true)} />}
          {activePage === 'brands'     && <BrandsGrid onAddBrand={() => setAddBrandOpen(true)} />}

        </div>
      </main>

      {/* ── Modals ───────────────────────────────────── */}
      <OrderDetailModal
        isOpen={orderDetailOpen}
        onClose={() => { setOrderDetailOpen(false); setSelectedOrder(null); }}
        order={selectedOrder}
        onViewBill={handleViewBill}
        onViewTempQuotation={handleViewTempQuotation}
        onViewFinalQuotation={handleViewFinalQuotation}
        onSendFinalQuotation={handleSendFinalQuotation}
        onMarkPaid={handleMarkPaid}
      />
      <BillDetailModal
        isOpen={billDetailOpen}
        onClose={() => { setBillDetailOpen(false); setSelectedBillOrderId(null); }}
        orderId={selectedBillOrderId}
      />
      <AddCategoryModal
        isOpen={addCategoryOpen}
        onClose={() => setAddCategoryOpen(false)}
        onSuccess={handleAddCategorySuccess}
      />
      <AddBrandModal
        isOpen={addBrandOpen}
        onClose={() => setAddBrandOpen(false)}
        categories={categories}
        onSuccess={handleAddBrandSuccess}
      />
      <FinalQuotationAdminModal
        isOpen={finalQuotationOpen}
        onClose={() => { setFinalQuotationOpen(false); setSelectedFinalOrderId(null); }}
        orderId={selectedFinalOrderId}
      />
      <ViewFinalQuotationModal
        isOpen={viewFinalQuotationOpen}
        onClose={() => { setViewFinalQuotationOpen(false); setSelectedViewFinalOrderId(null); }}
        orderId={selectedViewFinalOrderId}
      />
      <ViewTempQuotationModal
        isOpen={viewTempQuotationOpen}
        onClose={() => { setViewTempQuotationOpen(false); setSelectedTempOrderId(null); }}
        orderId={selectedTempOrderId}
      />
      <MarkPaidModal
        isOpen={markPaidOpen}
        onClose={() => { setMarkPaidOpen(false); setSelectedPaidOrderId(null); }}
        orderId={selectedPaidOrderId}
      />

      {/* ── Styles ───────────────────────────────────── */}
      <style>{`
        /* Root layout */
        .ap-root {
          display: flex;
          min-height: 100vh;
          background: #f8faff;
          position: relative;
        }

        /* ── Backdrop ── */
        .ap-backdrop {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(5, 12, 26, 0.45);
          backdrop-filter: blur(4px);
          z-index: 1099;
        }

        /* ── Main ── */
        .ap-main {
          margin-left: 272px;
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          background: #f8faff;
          overflow-x: hidden;
          transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* ── Top-bar (hidden on desktop) ── */
        .ap-topbar {
          display: none;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
          height: 60px;
          background: #fff;
          border-bottom: 1px solid rgba(37, 99, 235, 0.1);
          box-shadow: 0 2px 8px rgba(29, 78, 216, 0.06);
          position: sticky;
          top: 0;
          z-index: 500;
          flex-shrink: 0;
        }

        .ap-topbar-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .ap-topbar-logo {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #1d4ed8, #2563eb);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          box-shadow: 0 4px 12px rgba(29, 78, 216, 0.3);
        }

        .ap-topbar-title {
          font-family: 'Sora', 'Outfit', sans-serif;
          font-size: 16px;
          font-weight: 800;
          color: #0a1628;
          letter-spacing: -0.4px;
        }

        /* ── Hamburger button (RIGHT side) ── */
        .ap-hamburger {
          position: relative;
          width: 42px;
          height: 42px;
          border-radius: 10px;
          background: #eff6ff;
          border: 1.5px solid rgba(37, 99, 235, 0.18);
          color: #1d4ed8;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.22s ease;
          flex-shrink: 0;
        }

        .ap-hamburger:hover {
          background: #1d4ed8;
          color: #fff;
          border-color: #1d4ed8;
        }

        .ap-hamburger-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          width: 18px;
          height: 18px;
          background: #dc2626;
          color: #fff;
          border-radius: 50%;
          font-size: 10px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #fff;
          font-family: 'Manrope', sans-serif;
        }

        /* ── Content area ── */
        .ap-content {
          padding: 28px 32px;
          flex: 1;
        }

        /* ── Animation ── */
        .ap-fadein {
          animation: apFadeIn 0.35s ease;
        }

        @keyframes apFadeIn {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Stats grid ── */
        .ap-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 18px;
          margin-bottom: 26px;
        }

        /* ── Card ── */
        .ap-card {
          background: #fff;
          border-radius: 22px;
          border: 1.5px solid rgba(37, 99, 235, 0.09);
          box-shadow: 0 2px 8px rgba(29, 78, 216, 0.07);
          overflow: hidden;
        }

        .ap-card-header {
          padding: 18px 24px;
          border-bottom: 1px solid rgba(37, 99, 235, 0.09);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          background: #f0f4ff;
          border-radius: 22px 22px 0 0;
          flex-wrap: wrap;
        }

        .ap-card-title {
          font-family: 'Outfit', 'Sora', sans-serif;
          font-size: 17px;
          font-weight: 800;
          color: #0a1628;
        }

        .ap-card-sub {
          font-size: 12px;
          color: #4b6a9b;
          margin-top: 2px;
          font-family: 'Manrope', sans-serif;
        }

        .ap-view-all-btn {
          padding: 8px 14px;
          border-radius: 10px;
          background: #eff6ff;
          color: #1d4ed8;
          border: 1px solid #bfdbfe;
          font-family: 'Manrope', sans-serif;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 5px;
          transition: all 0.22s ease;
          white-space: nowrap;
        }

        .ap-view-all-btn:hover {
          background: #1d4ed8;
          color: #fff;
          border-color: #1d4ed8;
        }

        /* ── Table ── */
        .ap-table-wrap {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }

        .ap-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 640px;
        }

        .ap-table thead tr {
          background: #f0f4ff;
        }

        .ap-table th {
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

        .ap-table td {
          padding: 14px 16px;
          border-bottom: 1px solid rgba(37, 99, 235, 0.09);
          font-family: 'Manrope', sans-serif;
          font-size: 13px;
          color: #1e3a5f;
          vertical-align: middle;
        }

        .ap-table-row:hover td {
          background: #eff6ff;
        }

        .ap-cell-main { font-weight: 700; font-size: 13px; }
        .ap-cell-sub  { font-size: 11px; color: #7a9cc4; margin-top: 2px; }

        .ap-cell-truncate {
          max-width: 160px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .ap-cell-nowrap { white-space: nowrap; font-size: 12px; }

        .ap-status-badge {
          display: inline-flex;
          align-items: center;
          padding: 5px 12px;
          border-radius: 9999px;
          font-size: 11px;
          font-weight: 800;
          background: #eff6ff;
          color: #1d4ed8;
          white-space: nowrap;
          font-family: 'Manrope', sans-serif;
        }

        .ap-view-btn {
          padding: 6px 10px;
          border-radius: 10px;
          background: #eff6ff;
          color: #1d4ed8;
          border: 1px solid #bfdbfe;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          font-family: 'Manrope', sans-serif;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .ap-view-btn:hover {
          background: #1d4ed8;
          color: #fff;
          border-color: #1d4ed8;
        }

        .ap-empty-row {
          text-align: center;
          padding: 40px 16px !important;
          color: #7a9cc4;
          font-size: 14px;
        }

        /* ════════════════════════════════════
           RESPONSIVE — 1023px (tablet)
        ════════════════════════════════════ */
        @media (max-width: 1023px) {
          .ap-main     { margin-left: 0; }
          .ap-topbar   { display: flex; }
          .ap-content  { padding: 20px 16px; }
          .ap-backdrop { display: block; }

          .ap-stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
            margin-bottom: 20px;
          }

          .ap-card-header { padding: 14px 16px; }
          .ap-card-title  { font-size: 15px; }
        }

        /* ════════════════════════════════════
           RESPONSIVE — 767px (mobile)
        ════════════════════════════════════ */
        @media (max-width: 767px) {
          .ap-content  { padding: 14px 12px; }
          .ap-topbar   { height: 56px; padding: 0 12px; }
          .ap-topbar-title { font-size: 15px; }

          .ap-stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            margin-bottom: 16px;
          }

          .ap-card-header {
            padding: 12px 14px;
            flex-direction: row;
            align-items: center;
          }

          .ap-view-all-btn { padding: 7px 11px; font-size: 11.5px; }
        }

        /* ════════════════════════════════════
           RESPONSIVE — 479px (small phone)
        ════════════════════════════════════ */
        @media (max-width: 479px) {
          .ap-stats-grid {
            grid-template-columns: 1fr 1fr;
            gap: 8px;
          }

          .ap-topbar   { height: 52px; padding: 0 10px; }
          .ap-content  { padding: 12px 10px; }

          .ap-topbar-title { font-size: 14px; }

          .ap-topbar-logo {
            width: 32px;
            height: 32px;
            font-size: 14px;
            border-radius: 8px;
          }

          .ap-hamburger { width: 38px; height: 38px; border-radius: 8px; }

          .ap-card-title { font-size: 14px; }
          .ap-card-sub   { font-size: 11px; }
        }
      `}</style>
    </div>
  );
};

export default AdminPage;