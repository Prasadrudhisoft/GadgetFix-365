import { STATUS_STEPS, STATUS_ICONS } from '../../utils/constants';
import { getStatusIndex } from '../../utils/adminHelpers';

const TIMELINE_LABELS = [
  'Received', 'Quoted', 'Confirmed', 'Picked Up', 'Reviewed',
  'Final Quote', 'F.Confirmed', 'Repairing', 'Repaired', 'Delivered', 'Done'
];

const StatusTimeline = ({ currentStatus }) => {
  const activeIndex = getStatusIndex(currentStatus);

  if (activeIndex === -1) {
    return (
      <div style={{
        fontSize: '12px',
        color: '#c8d9ef',
        textAlign: 'center',
        gridColumn: '1/-1',
        padding: '20px'
      }}>
        Status tracking unavailable
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      overflowX: 'auto',
      padding: '10px 0 14px',
      marginBottom: '10px',
      gridColumn: '1/-1'
    }}>
      {STATUS_STEPS.map((step, index) => {
        const isDone = index < activeIndex;
        const isActive = index === activeIndex;
        const icon = isDone ? '✓' : (STATUS_ICONS[step] || '📋');

        return (
          <div
            key={step}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flex: 1,
              minWidth: '80px',
              position: 'relative'
            }}
          >
            {/* Connector Line */}
            {index < STATUS_STEPS.length - 1 && (
              <span style={{
                position: 'absolute',
                left: '50%',
                right: 0,
                top: '18px',
                height: '3px',
                background: isDone || isActive ? '#10b981' : 'rgba(37, 99, 235, 0.09)',
                zIndex: 0,
                width: '100%',
                borderRadius: '10px'
              }} />
            )}

            {/* Dot */}
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: "'Manrope', sans-serif",
              fontSize: '12px',
              fontWeight: 800,
              border: `3px solid ${isDone ? '#10b981' : isActive ? '#2563eb' : 'rgba(37, 99, 235, 0.09)'}`,
              background: isDone ? '#10b981' : isActive ? 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #1e40af 100%)' : 'white',
              color: isDone || isActive ? '#fff' : '#0a1628',
              position: 'relative',
              zIndex: 1,
              flexShrink: 0,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: isDone
                ? '0 4px 14px rgba(16, 185, 129, 0.3)'
                : isActive
                  ? '0 0 0 5px rgba(29, 78, 216, 0.15), 0 4px 14px rgba(29, 78, 216, 0.3)'
                  : 'none',
              animation: isActive ? 'pulseStep 2s infinite' : 'none'
            }}>
              {icon}
            </div>

            {/* Label */}
            <div style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: '10px',
              fontWeight: isDone || isActive ? 800 : 600,
              color: isDone || isActive ? '#0a1628' : '#7a9cc4',
              marginTop: '7px',
              textAlign: 'center',
              lineHeight: 1.3
            }}>
              {TIMELINE_LABELS[index]}
            </div>
          </div>
        );
      })}

      <style>{`
        @keyframes pulseStep {
          0%, 100% {
            box-shadow: 0 0 0 5px rgba(29, 78, 216, 0.15), 0 4px 14px rgba(29, 78, 216, 0.3);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(29, 78, 216, 0.07), 0 4px 14px rgba(29, 78, 216, 0.3);
          }
        }
      `}</style>
    </div>
  );
};

export default StatusTimeline;