const Pagination = ({ currentPage, totalPages, showing, onPageChange }) => {
  if (totalPages <= 1) return null;

  const renderPageButtons = () => {
    const buttons = [];

    for (let i = 1; i <= totalPages; i++) {
      if (
        totalPages <= 7 ||
        i === 1 ||
        i === totalPages ||
        Math.abs(i - currentPage) <= 1
      ) {
        buttons.push(
          <button
            key={i}
            onClick={() => onPageChange(i)}
            style={{
              padding: '7px 11px',
              borderRadius: '10px',
              border: '1.5px solid',
              borderColor: i === currentPage ? 'transparent' : 'rgba(37, 99, 235, 0.18)',
              background: i === currentPage
                ? 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #1e40af 100%)'
                : 'white',
              fontFamily: "'Manrope', sans-serif",
              fontSize: '12px',
              fontWeight: 700,
              color: i === currentPage ? '#fff' : '#1e3a5f',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: i === currentPage ? '0 4px 12px rgba(29, 78, 216, 0.3)' : 'none'
            }}
            onMouseEnter={(e) => {
              if (i !== currentPage) {
                e.currentTarget.style.borderColor = '#1d4ed8';
                e.currentTarget.style.color = '#1d4ed8';
                e.currentTarget.style.background = '#eff6ff';
              }
            }}
            onMouseLeave={(e) => {
              if (i !== currentPage) {
                e.currentTarget.style.borderColor = 'rgba(37, 99, 235, 0.18)';
                e.currentTarget.style.color = '#1e3a5f';
                e.currentTarget.style.background = 'white';
              }
            }}
          >
            {i}
          </button>
        );
      } else if (Math.abs(i - currentPage) === 2) {
        buttons.push(
          <span key={i} style={{ padding: '5px 4px', color: '#c8d9ef' }}>…</span>
        );
      }
    }

    return buttons;
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 18px',
      borderTop: '1px solid rgba(37, 99, 235, 0.09)',
      fontFamily: "'Manrope', sans-serif",
      fontSize: '12px',
      fontWeight: 600,
      color: '#7a9cc4',
      background: '#f0f4ff'
    }}>
      <span>
        Showing {showing.start}–{showing.end} of {showing.total}
      </span>

      <div style={{ display: 'flex', gap: '5px' }}>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          style={{
            padding: '7px 11px',
            borderRadius: '10px',
            border: '1.5px solid rgba(37, 99, 235, 0.18)',
            background: 'white',
            fontFamily: "'Manrope', sans-serif",
            fontSize: '12px',
            fontWeight: 700,
            color: '#1e3a5f',
            cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
            opacity: currentPage <= 1 ? 0.4 : 1,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          ‹ Prev
        </button>

        {renderPageButtons()}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          style={{
            padding: '7px 11px',
            borderRadius: '10px',
            border: '1.5px solid rgba(37, 99, 235, 0.18)',
            background: 'white',
            fontFamily: "'Manrope', sans-serif",
            fontSize: '12px',
            fontWeight: 700,
            color: '#1e3a5f',
            cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
            opacity: currentPage >= totalPages ? 0.4 : 1,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          Next ›
        </button>
      </div>
    </div>
  );
};

export default Pagination;