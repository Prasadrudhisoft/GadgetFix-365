import { normalizeStatus } from '../../utils/adminHelpers';
import { STATUS_ICONS } from '../../utils/constants';

const Badge = ({ status, type = 'status', className = '', ...props }) => {
  const getStatusClass = () => {
    if (type === 'payment') {
      return `badge-${status?.toLowerCase() || 'pending'}`;
    }

    const normalized = normalizeStatus(status);
    return `badge-${normalized.replace(/ /g, '_')}`;
  };

  const getIcon = () => {
    if (type === 'payment') {
      return status === 'paid' ? '✅' : status === 'unpaid' ? '❌' : '⏳';
    }
    const normalized = normalizeStatus(status);
    return STATUS_ICONS[normalized] || '📋';
  };

  const getLabel = () => {
    if (type === 'payment') {
      return status?.toUpperCase() || 'PENDING';
    }
    return normalizeStatus(status);
  };

  return (
    <span
      className={`badge ${getStatusClass()} ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '5px 12px',
        borderRadius: '9999px',
        fontFamily: "'Manrope', sans-serif",
        fontSize: '11px',
        fontWeight: 800,
        whiteSpace: 'nowrap',
        ...props.style
      }}
      {...props}
    >
      {getIcon()} {getLabel()}
    </span>
  );
};

export default Badge;