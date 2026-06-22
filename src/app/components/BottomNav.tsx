import { useApp } from '../context/AppContext';
import { phases } from '../data/roadmapData';

export function BottomNav() {
  const { checkedTopics, activePhase, setActivePhase } = useApp();

  return (
    <div
      className="fixed bottom-0 left-0 right-0 flex justify-around items-center px-1 pb-[14px] pt-2.5 z-50"
      style={{
        background: 'rgba(6, 10, 18, 0.92)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {phases.map(phase => {
        const totalTopics = phase.topicGroups.reduce((a, g) => a + g.topics.length, 0);
        const doneTopics = phase.topicGroups.reduce(
          (a, g) => a + g.topics.filter(t => checkedTopics[t.id]).length,
          0
        );
        const pct = totalTopics > 0 ? Math.round((doneTopics / totalTopics) * 100) : 0;
        const isActive = activePhase === phase.id;

        return (
          <button
            key={phase.id}
            onClick={() => {
              setActivePhase(isActive ? null : phase.id);
              document.getElementById(phase.id)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }}
            className="flex flex-col items-center gap-0.5 bg-none border-none cursor-pointer px-[6px] py-1 rounded-lg transition-all"
            style={{ opacity: isActive ? 1 : 0.6 }}
          >
            {/* Phase circle */}
            <div style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              border: `1.5px solid ${isActive ? phase.color : 'rgba(255,255,255,0.1)'}`,
              background: isActive ? `rgba(${hexToRgb(phase.color)}, 0.2)` : 'rgba(255,255,255,0.04)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
              boxShadow: isActive ? `0 0 12px rgba(${hexToRgb(phase.color)}, 0.4)` : 'none',
              transition: 'all 0.3s',
              position: 'relative',
            }}>
              {doneTopics === totalTopics && totalTopics > 0 ? '✅' : phase.emoji}
              {/* Mini progress arc */}
              {pct > 0 && pct < 100 && (
                <div style={{
                  position: 'absolute',
                  inset: -2,
                  borderRadius: '50%',
                  border: `2px solid transparent`,
                  borderTop: `2px solid ${phase.color}`,
                  transform: `rotate(${(pct / 100) * 360}deg)`,
                }} />
              )}
            </div>

            {/* Percentage */}
            <span style={{
              fontSize: 9,
              color: isActive ? phase.color : '#475569',
              fontWeight: 700,
              transition: 'color 0.2s',
            }}>
              {pct}%
            </span>
          </button>
        );
      })}
    </div>
  );
}

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}
