import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import WalkingOrderModal from '../modals/WalkingOrderModal';

const PAGE_TITLES = {
  dashboard: ['Dashboard', 'Overview of all repair activities'],
  orders: ['All Orders', 'Manage and update repair requests'],
  bills: ['Bills', 'View all generated bills and payment status'],
  categories: ['Categories', 'Manage device repair categories'],
  brands: ['Brands', 'Manage supported device brands']
};

const Topbar = ({ activePage, onToggleSidebar, onOrderCreated }) => {
  const { logout } = useAuth();
  const [time, setTime] = useState('');
  const [walkInOpen, setWalkInOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      setTime(new Date().toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const [title, subtitle] = PAGE_TITLES[activePage] || ['Admin', ''];

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={onToggleSidebar}
        style={{
          display: 'none',
          position: 'fixed',
          top: '14px',
          left: '14px',
          zIndex: 1100,
          width: '44px',
          height: '44px',
          borderRadius: '13px',
          background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #1e40af 100%)',
          border: 'none',
          color: '#fff',
          fontSize: '18px',
          cursor: 'pointer',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 32px rgba(29, 78, 216, 0.38)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
        className="sidebar-toggle"
      >
        <i className="fas fa-bars"></i>
      </button>

      {/* Topbar */}
      <div style={{
        background: 'rgba(248, 250, 255, 0.94)',
        backdropFilter: 'blur(28px)',
        borderBottom: '1px solid rgba(37, 99, 235, 0.09)',
        padding: '0 32px',
        height: '70px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 1px 3px rgba(29, 78, 216, 0.05)'
      }}>
        <div>
          <div style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: '20px',
            fontWeight: 800,
            color: '#0a1628',
            letterSpacing: '-0.5px'
          }}>
            {title}
          </div>
          <div style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: '12.5px',
            color: '#7a9cc4',
            fontWeight: 600,
            marginTop: '2px'
          }}>
            {subtitle}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>

          {/* Walk-in Order Button */}
          <button
            onClick={() => setWalkInOpen(true)}
            style={{
              padding: '9px 18px',
              borderRadius: '16px',
              background: '#eff6ff',
              color: '#1d4ed8',
              fontFamily: "'Manrope', sans-serif",
              fontSize: '13px',
              fontWeight: 700,
              border: '1.5px solid rgba(29, 78, 216, 0.18)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#1d4ed8';
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(29, 78, 216, 0.35)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#eff6ff';
              e.currentTarget.style.color = '#1d4ed8';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <i className="fas fa-plus"></i>
            <span>Walk-in Order</span>
          </button>

          {/* Clock */}
          <span style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: '12px',
            color: '#4b6a9b',
            fontWeight: 700,
            padding: '8px 14px',
            background: '#f0f4ff',
            borderRadius: '16px',
            border: '1px solid rgba(37, 99, 235, 0.09)'
          }}>
            {time}
          </span>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            style={{
              padding: '9px 18px',
              borderRadius: '16px',
              background: '#fef2f2',
              color: '#dc2626',
              fontFamily: "'Manrope', sans-serif",
              fontSize: '13px',
              fontWeight: 700,
              border: '1.5px solid rgba(220, 38, 38, 0.18)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#dc2626';
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(220, 38, 38, 0.35)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#fef2f2';
              e.currentTarget.style.color = '#dc2626';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <i className="fas fa-power-off"></i>
            <span className="logout-label">Logout</span>
          </button>
        </div>
      </div>

      {/* Walk-in Order Modal */}
      <WalkingOrderModal
        isOpen={walkInOpen}
        onClose={() => setWalkInOpen(false)}
        onSuccess={() => {
          setWalkInOpen(false);
          onOrderCreated?.();
        }}
      />
    </>
  );
};

export default Topbar;