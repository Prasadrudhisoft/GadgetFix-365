import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getInitials } from '../../utils/adminHelpers';
import logoImage from '@assets/images/logo.png';

const NAV_ITEMS = [
  { id: 'dashboard',      icon: 'fas fa-chart-pie',            label: 'Dashboard',     section: 'main',   badge: null      },
  { id: 'orders',         icon: 'fas fa-clipboard-list',        label: 'All Orders',    section: 'main',   badge: 'pending' },
  { id: 'walking-orders', icon: 'fas fa-person-walking',        label: 'Walk-in Orders',section: 'main',   badge: null      },
  { id: 'bills',          icon: 'fas fa-file-invoice-dollar',   label: 'Bills',         section: 'main',   badge: null      },
  { id: 'categories',     icon: 'fas fa-layer-group',           label: 'Categories',    section: 'manage', badge: null      },
  { id: 'brands',         icon: 'fas fa-tags',                  label: 'Brands',        section: 'manage', badge: null      },
];

const Sidebar = ({ activePage, onPageChange, pendingCount = 0, isOpen, onClose, onToggle }) => {
  const { user, logout } = useAuth();
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () =>
      setTime(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    updateTime();
    const id = setInterval(updateTime, 1000);
    return () => clearInterval(id);
  }, []);

  const handleLogout   = () => { if (window.confirm('Are you sure you want to logout?')) logout(); };
  const handleNavClick = (pageId) => { onPageChange(pageId); onClose(); };

  return (
    <>
      <style>{`
        /* ── Sidebar wrapper ── */
        .sidebar-wrap {
          width: 272px;
          background: linear-gradient(160deg, #040d1f 0%, #061322 50%, #081428 100%);
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          z-index: 1100;
          display: flex;
          flex-direction: column;
          box-shadow: 4px 0 32px rgba(0,0,0,0.22);
          border-right: 1px solid rgba(37,99,235,0.12);
          transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
          transform: translateX(0);
          overflow: hidden;
        }

        /* ── Nav scroll area ── */
        .sidebar-nav-scroll {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 12px;
        }
        .sidebar-nav-scroll::-webkit-scrollbar { width: 3px; }
        .sidebar-nav-scroll::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
        }

        /* ── Nav buttons ── */
        .nav-btn {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 11px 14px;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
          font-family: 'Manrope', sans-serif;
          font-size: 13.5px;
          font-weight: 600;
          margin-bottom: 3px;
          width: 100%;
          text-align: left;
          position: relative;
          overflow: hidden;
          color: rgba(255,255,255,0.58);
          background: none;
          border: none;
        }
        .nav-btn:hover {
          background: rgba(255,255,255,0.08) !important;
          color: #fff !important;
          transform: translateX(4px);
        }
        .nav-btn.active {
          background: rgba(29,78,216,0.22) !important;
          color: #fff !important;
          border: 1px solid rgba(59,130,246,0.3) !important;
          box-shadow: 0 4px 16px rgba(29,78,216,0.22) !important;
        }
        .nav-btn.active::before {
          content: '';
          position: absolute;
          left: 0; top: 0;
          height: 100%; width: 3px;
          background: linear-gradient(135deg, #1d4ed8, #2563eb, #1e40af);
          border-radius: 0 3px 3px 0;
        }

        /* ── Section label ── */
        .section-label {
          font-family: 'Manrope', sans-serif;
          font-size: 10px;
          font-weight: 800;
          color: rgba(255,255,255,0.28);
          text-transform: uppercase;
          letter-spacing: 2px;
          padding: 12px 12px 6px;
        }

        /* ── OLD toggle button — HIDDEN always ── */
        .sidebar-toggle-btn { display: none !important; }

        /* ── Overlay ── */
        .sidebar-overlay {
          position: fixed;
          inset: 0;
          background: rgba(6,16,31,0.75);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          z-index: 1099;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
        }
        .sidebar-overlay.open { opacity: 1; visibility: visible; }

        /* ── Responsive ── */
        @media (max-width: 1023px) {
          .sidebar-wrap {
            transform: translateX(-100%);
            box-shadow: none;
          }
          .sidebar-wrap.open {
            transform: translateX(0);
            box-shadow: 8px 0 40px rgba(0,0,0,0.4);
          }
        }

        @media (max-width: 767px) {
          .sidebar-wrap { width: 85%; max-width: 280px; }
        }

        @media (max-width: 479px) {
          .sidebar-wrap { width: 90%; max-width: 260px; }
        }
      `}</style>

      {/* Overlay — clicking outside closes sidebar */}
      <div
        className={`sidebar-overlay${isOpen ? ' open' : ''}`}
        onClick={onClose}
      />

      <aside className={`sidebar-wrap${isOpen ? ' open' : ''}`}>

        {/* Logo */}
        <div style={{
          padding: '14px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          background: 'rgba(0,0,0,0.18)',
          flexShrink: 0,
        }}>
          {/* Logo pill */}
          <div style={{
            background: '#fff',
            borderRadius: '10px',
            padding: '5px 8px',
            display: 'flex',
            alignItems: 'center',
            flexShrink: 0,
            width: '120px',
          }}>
            <img
              src={logoImage}
              alt="GadgetFix 365"
              style={{
                width: '100%',
                height: 'auto',
                objectFit: 'contain',
                display: 'block',
              }}
            />
          </div>
          {/* ADMIN badge + panel label stacked */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0 }}>
            <span style={{
              fontSize: '9px', fontWeight: 800,
              background: 'linear-gradient(135deg,#ea580c,#db2777)',
              color: '#fff', padding: '3px 8px',
              borderRadius: '9999px', letterSpacing: '0.5px',
              fontFamily: "'Sora',sans-serif",
              alignSelf: 'flex-start',
            }}>ADMIN</span>
            <span style={{
              fontFamily: "'Manrope',sans-serif",
              fontSize: '10px', fontWeight: 600,
              color: 'rgba(255,255,255,0.3)',
              letterSpacing: '0.3px',
            }}>Control Panel</span>
          </div>
        </div>

        {/* Nav */}
        <div className="sidebar-nav-scroll">
          <div className="section-label">MAIN</div>
          {NAV_ITEMS.filter(i => i.section === 'main').map(item => (
            <button
              key={item.id}
              className={`nav-btn${activePage === item.id ? ' active' : ''}`}
              onClick={() => handleNavClick(item.id)}
            >
              <span style={{ fontSize: '16px', flexShrink: 0, width: '20px', textAlign: 'center' }}>
                <i className={item.icon} />
              </span>
              {item.label}
              {item.badge === 'pending' && pendingCount > 0 && (
                <span style={{
                  marginLeft: 'auto',
                  background: 'linear-gradient(135deg,#ea580c,#db2777)',
                  color: '#fff', fontSize: '10px', fontWeight: 800,
                  padding: '2px 8px', borderRadius: '9999px',
                  minWidth: '20px', textAlign: 'center',
                }}>
                  {pendingCount}
                </span>
              )}
            </button>
          ))}

          <div className="section-label" style={{ marginTop: '8px' }}>MANAGE</div>
          {NAV_ITEMS.filter(i => i.section === 'manage').map(item => (
            <button
              key={item.id}
              className={`nav-btn${activePage === item.id ? ' active' : ''}`}
              onClick={() => handleNavClick(item.id)}
            >
              <span style={{ fontSize: '16px', flexShrink: 0, width: '20px', textAlign: 'center' }}>
                <i className={item.icon} />
              </span>
              {item.label}
            </button>
          ))}
        </div>

        {/* Clock */}
        <div style={{
          padding: '10px 16px',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          background: 'rgba(0,0,0,0.1)',
          flexShrink: 0,
        }}>
          <div style={{
            fontFamily: "'Sora',sans-serif", fontSize: '11px', fontWeight: 700,
            color: 'rgba(255,255,255,0.35)', padding: '5px 10px',
            background: 'rgba(255,255,255,0.04)', borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.07)',
            display: 'inline-flex', alignItems: 'center', gap: '6px',
          }}>
            <i className="fas fa-clock" style={{ fontSize: '10px' }} />
            {time}
          </div>
        </div>

        {/* User + Logout */}
        <div style={{
          padding: '12px',
          borderTop: '1px solid rgba(255,255,255,0.07)',
          background: 'rgba(0,0,0,0.18)',
          flexShrink: 0,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '11px 13px', borderRadius: '14px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            <div style={{
              width: '38px', height: '38px', borderRadius: '50%',
              background: 'linear-gradient(135deg,#1d4ed8,#2563eb,#1e40af)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Sora',sans-serif", fontSize: '13px', fontWeight: 800,
              color: '#fff', flexShrink: 0, border: '2px solid rgba(255,255,255,0.18)',
            }}>
              {getInitials(user?.name || 'Admin')}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: "'Sora',sans-serif", fontSize: '13px', fontWeight: 700,
                color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {user?.name || 'Admin'}
              </div>
              <div style={{ fontFamily: "'Manrope',sans-serif", fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>
                Administrator
              </div>
            </div>
            <button
              onClick={handleLogout}
              style={{
                background: 'rgba(220,38,38,0.18)', border: '1px solid rgba(220,38,38,0.28)',
                color: '#fca5a5', padding: '7px 10px', borderRadius: '10px',
                cursor: 'pointer', fontFamily: "'Manrope',sans-serif",
                fontSize: '11px', fontWeight: 700,
                display: 'flex', alignItems: 'center', gap: '5px',
                transition: 'all 0.3s ease', flexShrink: 0,
              }}
              onMouseEnter={e => { e.currentTarget.style.background='#dc2626'; e.currentTarget.style.color='#fff'; e.currentTarget.style.borderColor='#dc2626'; }}
              onMouseLeave={e => { e.currentTarget.style.background='rgba(220,38,38,0.18)'; e.currentTarget.style.color='#fca5a5'; e.currentTarget.style.borderColor='rgba(220,38,38,0.28)'; }}
            >
              <i className="fas fa-power-off" /> Logout
            </button>
          </div>
        </div>
      </aside>

    </>
  );
};

export default Sidebar;