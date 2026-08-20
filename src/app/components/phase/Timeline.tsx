import { Phase } from '../../data/roadmapData';

interface TimelineProps {
  phase: Phase;
  isLast: boolean;
  isCompleted: boolean;
  isCurrentPhase: boolean;
  isFuture: boolean;
  color: string;
  rgb: string;
  pulseClass: string;
  onToggle: () => void;
}

export function Timeline({ phase, isLast, isCompleted, isCurrentPhase, isFuture, color, rgb, pulseClass, onToggle }: TimelineProps) {
  return (
    <div className="flex flex-col items-center shrink-0 w-[52px]">
      <div
        className={isCurrentPhase && !isCompleted ? pulseClass : ''}
        style={{
          width: 52,
          height: 52,
          borderRadius: '50%',
          border: `2px solid ${isCompleted ? color : isFuture ? 'rgba(255,255,255,0.1)' : color}`,
          background: isCompleted
            ? `linear-gradient(135deg, ${color}33, ${color}11)`
            : isFuture
            ? 'rgba(255,255,255,0.03)'
            : `rgba(${rgb}, 0.12)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 22,
          flexShrink: 0,
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: isCompleted
            ? `0 0 20px rgba(${rgb}, 0.6), 0 0 40px rgba(${rgb}, 0.2)`
            : isCurrentPhase
            ? `0 0 16px rgba(${rgb}, 0.4)`
            : 'none',
          opacity: isFuture ? 0.5 : 1,
          zIndex: 2,
        }}
        onClick={onToggle}
      >
        {isCompleted ? '✅' : phase.emoji}
      </div>

      {!isLast && (
        <div style={{
          width: 2,
          flex: 1,
          minHeight: 40,
          background: isCompleted
            ? `linear-gradient(to bottom, ${color}, rgba(${rgb}, 0.3))`
            : `linear-gradient(to bottom, rgba(${rgb}, 0.3), rgba(255,255,255,0.05))`,
          margin: '4px 0',
          position: 'relative',
        }}>
          {isCompleted && (
            <div style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(to bottom, ${color}, rgba(${rgb}, 0.3))`,
              boxShadow: `0 0 6px rgba(${rgb}, 0.5)`,
              borderRadius: 2,
            }} />
          )}
        </div>
      )}
    </div>
  );
}