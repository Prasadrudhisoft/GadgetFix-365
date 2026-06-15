const StatCard = ({ icon, label, value, color, bgColor }) => {
  return (
    <div style={{
      background: '#ffffff',
      borderRadius: '22px',
      padding: '22px 20px',
      border: '1.5px solid rgba(37, 99, 235, 0.09)',
      boxShadow: '0 2px 8px rgba(29, 78, 216, 0.07), 0 1px 3px rgba(0, 0, 0, 0.04)',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      transition: 'all 0.36s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      overflow: 'hidden',
      cursor: 'default'
    }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.boxShadow = '0 24px 72px rgba(29, 78, 216, 0.16), 0 12px 28px rgba(0, 0, 0, 0.08)';
        e.currentTarget.style.borderColor = '#bfdbfe';
        const bar = e.currentTarget.querySelector('.stat-card-bar');
        if (bar) bar.style.transform = 'scaleX(1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(29, 78, 216, 0.07), 0 1px 3px rgba(0, 0, 0, 0.04)';
        e.currentTarget.style.borderColor = 'rgba(37, 99, 235, 0.09)';
        const bar = e.currentTarget.querySelector('.stat-card-bar');
        if (bar) bar.style.transform = 'scaleX(0)';
      }}
    >
      <span
        className="stat-card-bar"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #1e40af 100%)',
          transform: 'scaleX(0)',
          transformOrigin: 'left',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          borderRadius: '0 0 3px 3px'
        }}
      />

      <div style={{
        width: '56px',
        height: '56px',
        borderRadius: '16px',
        background: bgColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
        color: color,
        flexShrink: 0,
        boxShadow: '0 1px 3px rgba(29, 78, 216, 0.05)'
      }}>
        <i className={icon}></i>
      </div>

      <div>
        <div style={{
          fontFamily: "'Sora', sans-serif",
          fontSize: '32px',
          fontWeight: 800,
          color: '#0a1628',
          lineHeight: 1,
          letterSpacing: '-1.5px'
        }}>
          {value}
        </div>
        <div style={{
          fontFamily: "'Manrope', sans-serif",
          fontSize: '12px',
          color: '#7a9cc4',
          fontWeight: 700,
          marginTop: '5px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          {label}
        </div>
      </div>
    </div>
  );
};

export default StatCard;