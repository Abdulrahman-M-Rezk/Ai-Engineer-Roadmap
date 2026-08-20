import { Phase } from '../../data/roadmapData';

interface PhaseHeaderProps {
  phase: Phase;
  doneTopics: number;
  totalTopics: number;
  phaseProgress: number;
  isCompleted: boolean;
  isExpanded: boolean;
  isFuture: boolean;
  color: string;
  rgb: string;
  onToggle: () => void;
}

export function PhaseHeader({ phase, doneTopics, totalTopics, phaseProgress, isCompleted, isExpanded, isFuture, color, rgb, onToggle }: PhaseHeaderProps) {
  return (
    <div
      className="glass-card cursor-pointer transition-all"
      style={{
        borderRadius: isExpanded ? '16px 16px 0 0' : 16,
        border: `1px solid ${isExpanded ? `rgba(${rgb}, 0.4)` : `rgba(${rgb}, 0.15)`}`,
        padding: '16px 20px',
        boxShadow: isExpanded
          ? `0 0 24px rgba(${rgb}, 0.15), 0 8px 32px rgba(0,0,0,0.3)`
          : `0 4px 16px rgba(0,0,0,0.2)`,
        opacity: isFuture ? 0.6 : 1,
      }}
      onClick={onToggle}
      onMouseEnter={e => {
        if (!isExpanded) {
          (e.currentTarget as HTMLElement).style.borderColor = `rgba(${rgb}, 0.35)`;
          (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px rgba(${rgb}, 0.15), 0 8px 24px rgba(0,0,0,0.3)`;
        }
      }}
      onMouseLeave={e => {
        if (!isExpanded) {
          (e.currentTarget as HTMLElement).style.borderColor = `rgba(${rgb}, 0.15)`;
          (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.2)';
        }
      }}
    >
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2.5">
          <span style={{
            background: `rgba(${rgb}, 0.15)`,
            border: `1px solid rgba(${rgb}, 0.3)`,
            color: color,
            borderRadius: 8,
            padding: '2px 10px',
            fontSize: 11,
            fontWeight: 700,
          }}>
            المرحلة {phase.number}
          </span>
          <span className="text-slate-600 text-xs">{phase.duration}</span>
        </div>
        <div className="flex items-center gap-2">
          <span style={{ color: color, fontSize: 12, fontWeight: 700 }}>
            {doneTopics}/{totalTopics}
          </span>
          <span className="text-slate-500 text-sm inline-block transition-transform duration-300" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
        </div>
      </div>

      <div className="mb-2.5">
        <h3 className="text-slate-200 font-black text-base mb-[2px]">
          {phase.nameAr}
        </h3>
        <p className="text-slate-500 text-xs">{phase.nameEn}</p>
      </div>

      <div className="h-[6px] rounded-[3px] overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div style={{
          height: '100%',
          width: `${phaseProgress}%`,
          background: isCompleted
            ? `linear-gradient(90deg, ${color}, ${color}aa)`
            : `linear-gradient(90deg, ${color}bb, ${color}55)`,
          borderRadius: 3,
          boxShadow: phaseProgress > 0 ? `0 0 8px rgba(${rgb}, 0.5)` : 'none',
          transition: 'width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }} />
      </div>
      <div className="flex justify-end mt-1">
        <span className="text-slate-600 text-[11px]">{phaseProgress}% مكتمل</span>
      </div>
    </div>
  );
}