import { Phase } from '../../data/roadmapData';
import { useApp } from '../../context/AppContext';

interface TasksTabProps {
  phase: Phase;
  color: string;
  rgb: string;
}

export function TasksTab({ phase, color, rgb }: TasksTabProps) {
  const { checkedTasks, toggleTask } = useApp();

  const totalTasks = phase.tasks.length;
  const doneTasks = phase.tasks.filter(t => checkedTasks[t.id]).length;

  const taskTypeIcon = (type: string) => {
    if (type === 'build') return '🔨';
    if (type === 'deploy') return '🚀';
    return '📖';
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4 p-[10px_14px] rounded-xl" style={{ background: `rgba(${rgb}, 0.08)`, border: `1px solid rgba(${rgb}, 0.2)` }}>
        <span style={{ color: color, fontSize: 13, fontWeight: 700 }}>
          {doneTasks}/{totalTasks} خلصت
        </span>
        <div className="flex gap-[6px]">
          {phase.tasks.map(t => (
            <div key={t.id} style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: checkedTasks[t.id] ? color : 'rgba(255,255,255,0.1)',
              boxShadow: checkedTasks[t.id] ? `0 0 6px rgba(${rgb}, 0.6)` : 'none',
              transition: 'all 0.3s',
            }} />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        {phase.tasks.map(task => {
          const done = !!checkedTasks[task.id];
          return (
            <div
              key={task.id}
              className="p-[14px_16px] rounded-xl flex items-start gap-3 transition-all"
              style={{
                border: `1px solid ${done ? `rgba(${rgb}, 0.25)` : 'rgba(255,255,255,0.07)'}`,
                background: done ? `rgba(${rgb}, 0.06)` : 'rgba(255,255,255,0.02)',
              }}
            >
              <div
                className="w-6 h-6 rounded shrink-0 flex items-center justify-center cursor-pointer transition-all mt-[1px]"
                style={{
                  border: done ? `2px solid ${color}` : '2px solid rgba(255,255,255,0.12)',
                  background: done ? `rgba(${rgb}, 0.2)` : 'transparent',
                  boxShadow: done ? `0 0 8px rgba(${rgb}, 0.4)` : 'none',
                }}
                onClick={() => toggleTask(task.id)}
              >
                {done && <span className="animate-checkbox" style={{ color, fontSize: 13 }}>✓</span>}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base">{taskTypeIcon(task.type)}</span>
                  <span className="text-slate-600 text-[11px] uppercase tracking-[1px]">
                    {task.type === 'build' ? 'Build' : task.type === 'deploy' ? 'Deploy' : 'Read'}
                  </span>
                </div>
                <p style={{
                  color: done ? '#475569' : '#CBD5E1',
                  fontSize: 16,
                  fontWeight: 600,
                  textDecoration: done ? 'line-through' : 'none',
                  lineHeight: 1.8,
                  transition: 'all 0.2s',
                }}>
                  {task.textAr}
                </p>
              </div>

              {task.link && (
                <a
                  href={task.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-[11px] font-bold no-underline px-3 py-[5px] rounded-lg"
                  style={{
                    border: `1px solid rgba(${rgb}, 0.3)`,
                    background: `rgba(${rgb}, 0.1)`,
                    color: color,
                  }}
                >
                  افتح ↗
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}