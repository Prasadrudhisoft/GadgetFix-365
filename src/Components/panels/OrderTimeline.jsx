// src/components/panels/OrderTimeline.jsx
import { STATUS_STEPS, TIMELINE_LABELS, TIMELINE_ICONS } from '@utils/constants';
import clsx from 'clsx';

export const OrderTimeline = ({ status }) => {
  const activeIndex = STATUS_STEPS.indexOf(status);

  return (
    <div className="flex items-start gap-0 overflow-x-auto pb-1 custom-scrollbar">
      {STATUS_STEPS.map((step, index) => {
        const isDone = index < activeIndex;
        const isActive = index === activeIndex;
        const icon = isDone ? '✓' : TIMELINE_ICONS[index];

        return (
          <div
            key={index}
            className="flex flex-col items-center flex-1 min-w-[50px] relative"
          >
            {/* Connecting Line */}
            {index < STATUS_STEPS.length - 1 && (
              <div
                className={clsx(
                  'absolute top-[13px] left-1/2 right-[-50%] h-[2px] z-0',
                  isDone && 'bg-green-2',
                  isActive && 'bg-brand',
                  !isDone && !isActive && 'bg-border'
                )}
              />
            )}

            {/* Dot */}
            <div
              className={clsx(
                'w-[26px] h-[26px] rounded-full flex items-center justify-center font-manrope text-[10px] font-extrabold relative z-[1] transition-all mb-1.5',
                isDone && 'bg-green-2 text-white',
                isActive && 'bg-brand text-white shadow-[0_0_0_4px_rgba(29,78,216,0.2)] animate-pulse-step',
                !isDone && !isActive && 'bg-bg3 text-text-4 border-[3px] border-border'
              )}
            >
              {icon}
            </div>

            {/* Label */}
            <div
              className={clsx(
                'font-manrope text-[9px] font-semibold text-center whitespace-nowrap',
                isDone && 'text-green font-bold',
                isActive && 'text-brand font-extrabold',
                !isDone && !isActive && 'text-text-4'
              )}
            >
              {TIMELINE_LABELS[index]}
            </div>
          </div>
        );
      })}
    </div>
  );
};