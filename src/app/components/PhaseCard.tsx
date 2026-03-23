import { useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Phase } from '../data/roadmapData';
import { useApp } from '../context/AppContext';

interface PhaseCardProps {
  phase: Phase;
  isLast: boolean;
  phaseIndex: number;
}

type TabType = 'content' | 'resources' | 'tasks';

const RESOURCE_FILTERS = [
  { key: 'all', label: 'الكل' },
  { key: 'video', label: '📹 فيديو' },
  { key: 'book', label: '📕 كتاب' },
  { key: 'article', label: '📄 مقال' },
  { key: 'ar', label: '🇪🇬 عربي' },
];

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}

const PULSE_CLASS: Record<string, string> = {
  '#00D4FF': 'animate-pulse-cyan',
  '#A78BFA': 'animate-pulse-purple',
  '#FB923C': 'animate-pulse-orange',
  '#34D399': 'animate-pulse-green',
  '#F472B6': 'animate-pulse-pink',
  '#FBBF24': 'animate-pulse-yellow',
  '#F87171': 'animate-pulse-red',
};

export function PhaseCard({ phase, isLast, phaseIndex }: PhaseCardProps) {
  const { checkedTopics, checkedTasks, toggleTopic, toggleTask, activePhase, setActivePhase } = useApp();
  const [activeTab, setActiveTab] = useState<TabType>('content');
  const [resourceFilter, setResourceFilter] = useState('all');

  const totalTopics = phase.topicGroups.reduce((a, g) => a + g.topics.length, 0);
  const doneTopics = phase.topicGroups.reduce(
    (a, g) => a + g.topics.filter(t => checkedTopics[t.id]).length,
    0
  );
  const totalTasks = phase.tasks.length;
  const doneTasks = phase.tasks.filter(t => checkedTasks[t.id]).length;

  const phaseProgress = totalTopics > 0 ? Math.round((doneTopics / totalTopics) * 100) : 0;
  const isCompleted = doneTopics === totalTopics;
  const isExpanded = activePhase === phase.id;

  // Determine phase state
  const isCurrentPhase = !isCompleted && (phaseIndex === 0 || phaseProgress > 0);
  const isFuture = !isCompleted && phaseProgress === 0 && phaseIndex > 0;

  const color = phase.color;
  const rgb = hexToRgb(color);
  const pulseClass = PULSE_CLASS[color] || '';

  const handleToggleTopic = useCallback((topicId: string) => {
    const wasDone = phase.topicGroups.reduce((a, g) => a + g.topics.filter(t => checkedTopics[t.id]).length, 0);
    toggleTopic(topicId);
    const nowDone = wasDone + (checkedTopics[topicId] ? -1 : 1);
    if (nowDone === totalTopics && !checkedTopics[topicId]) {
      // Completed!
      setTimeout(() => {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 },
          colors: [color, '#ffffff', '#A78BFA'],
        });
      }, 100);
    }
  }, [checkedTopics, toggleTopic, phase, totalTopics, color]);

  const filteredResources = phase.resources.filter(r => {
    if (resourceFilter === 'all') return true;
    if (resourceFilter === 'ar') return r.lang === 'ar';
    return r.type === resourceFilter;
  });

  const taskTypeIcon = (type: string) => {
    if (type === 'build') return '🔨';
    if (type === 'deploy') return '🚀';
    return '📖';
  };

  const getResourceTypeLabel = (type: string) => {
    if (type === 'video') return '📹 فيديو';
    if (type === 'book') return '📕 كتاب';
    return '📄 مقال';
  };

  return (
    <div dir="rtl" style={{ display: 'flex', gap: 16, marginBottom: isLast ? 0 : 0, position: 'relative' }}>
      {/* Timeline column */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: 52 }}>
        {/* Circle */}
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
          onClick={() => setActivePhase(isExpanded ? null : phase.id)}
        >
          {isCompleted ? '✅' : phase.emoji}
        </div>

        {/* Connecting line */}
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

      {/* Card column */}
      <div style={{ flex: 1, marginBottom: 20 }}>
        {/* Card header */}
        <div
          className="glass-card"
          style={{
            borderRadius: isExpanded ? '16px 16px 0 0' : 16,
            border: `1px solid ${isExpanded ? `rgba(${rgb}, 0.4)` : `rgba(${rgb}, 0.15)`}`,
            padding: '16px 20px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: isExpanded
              ? `0 0 24px rgba(${rgb}, 0.15), 0 8px 32px rgba(0,0,0,0.3)`
              : `0 4px 16px rgba(0,0,0,0.2)`,
            opacity: isFuture ? 0.6 : 1,
          }}
          onClick={() => setActivePhase(isExpanded ? null : phase.id)}
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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
              <span style={{ color: '#475569', fontSize: 12 }}>{phase.duration}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: color, fontSize: 12, fontWeight: 700 }}>
                {doneTopics}/{totalTopics}
              </span>
              <span style={{
                color: '#64748B',
                fontSize: 14,
                transition: 'transform 0.3s',
                display: 'inline-block',
                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              }}>▼</span>
            </div>
          </div>

          <div style={{ marginBottom: 10 }}>
            <h3 style={{ color: '#F1F5F9', fontWeight: 800, fontSize: 16, marginBottom: 2 }}>
              {phase.nameAr}
            </h3>
            <p style={{ color: '#64748B', fontSize: 12 }}>{phase.nameEn}</p>
          </div>

          {/* Mini progress bar */}
          <div style={{
            height: 6,
            borderRadius: 3,
            background: 'rgba(255,255,255,0.06)',
            overflow: 'hidden',
          }}>
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
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
            <span style={{ color: '#475569', fontSize: 11 }}>{phaseProgress}% مكتمل</span>
          </div>
        </div>

        {/* Expanded content */}
        {isExpanded && (
          <div
            className="animate-slide-down glass-card"
            style={{
              borderRadius: '0 0 16px 16px',
              border: `1px solid rgba(${rgb}, 0.4)`,
              borderTop: `1px solid rgba(${rgb}, 0.15)`,
              overflow: 'hidden',
            }}
          >
            {/* Tabs */}
            <div style={{
              display: 'flex',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              padding: '0 16px',
            }}>
              {([
                { key: 'content', label: 'المحتوى' },
                { key: 'resources', label: 'المصادر' },
                { key: 'tasks', label: 'تكاليف 📝' },
              ] as { key: TabType; label: string }[]).map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    padding: '12px 16px',
                    background: 'none',
                    border: 'none',
                    borderBottom: activeTab === tab.key ? `2px solid ${color}` : '2px solid transparent',
                    color: activeTab === tab.key ? color : '#64748B',
                    fontFamily: "'Cairo', sans-serif",
                    fontSize: 13,
                    fontWeight: activeTab === tab.key ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    marginBottom: -1,
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div style={{ padding: 20 }}>

              {/* CONTENT TAB */}
              {activeTab === 'content' && (
                <div>
                  {phase.topicGroups.map((group, gi) => (
                    <div key={group.id} style={{ marginBottom: gi < phase.topicGroups.length - 1 ? 28 : 0 }}>
                      {/* Group header with left dot */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, direction: 'rtl' }}>
                        <div style={{
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          background: color,
                          boxShadow: `0 0 8px rgba(${rgb}, 0.6)`,
                          flexShrink: 0,
                        }} />
                        <div style={{
                          width: 2,
                          height: 16,
                          background: `rgba(${rgb}, 0.4)`,
                          flexShrink: 0,
                        }} />
                        <div>
                          <span style={{ color: '#CBD5E1', fontWeight: 700, fontSize: 13 }}>{group.nameAr}</span>
                          <span style={{ color: '#475569', fontSize: 11, marginRight: 8 }}>{group.nameEn}</span>
                        </div>
                      </div>

                      {/* Topics with connecting line */}
                      <div style={{ marginRight: 11, borderRight: `2px solid rgba(${rgb}, 0.2)`, paddingRight: 18 }}>
                        {group.topics.map((topic, ti) => {
                          const checked = !!checkedTopics[topic.id];
                          return (
                            <div
                              key={topic.id}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                                padding: '8px 0',
                                borderBottom: ti < group.topics.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                                cursor: 'pointer',
                              }}
                              onClick={() => handleToggleTopic(topic.id)}
                            >
                              {/* Custom checkbox */}
                              <div style={{
                                width: 22,
                                height: 22,
                                borderRadius: 6,
                                border: checked ? `2px solid ${color}` : '2px solid rgba(255,255,255,0.15)',
                                background: checked ? `rgba(${rgb}, 0.2)` : 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                transition: 'all 0.25s cubic-bezier(0.17, 0.67, 0.83, 0.67)',
                                boxShadow: checked ? `0 0 8px rgba(${rgb}, 0.4)` : 'none',
                              }}>
                                {checked && (
                                  <span className="animate-checkbox" style={{ color, fontSize: 13, fontWeight: 700 }}>✓</span>
                                )}
                              </div>

                              <div style={{ flex: 1 }}>
                                <span style={{
                                  color: checked ? '#475569' : '#CBD5E1',
                                  textDecoration: checked ? 'line-through' : 'none',
                                  fontSize: 13,
                                  fontWeight: checked ? 400 : 600,
                                  transition: 'all 0.2s',
                                }}>
                                  {topic.nameAr}
                                </span>
                                {topic.essential && (
                                  <span style={{
                                    marginRight: 6,
                                    fontSize: 10,
                                    color: '#FBBF24',
                                    background: 'rgba(251,191,36,0.1)',
                                    borderRadius: 4,
                                    padding: '1px 5px',
                                    border: '1px solid rgba(251,191,36,0.2)',
                                  }}>⭐ أساسي</span>
                                )}
                              </div>

                              <span style={{ color: '#334155', fontSize: 11 }}>{topic.nameEn}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* RESOURCES TAB */}
              {activeTab === 'resources' && (
                <div>
                  {/* Filter bar */}
                  <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                    {RESOURCE_FILTERS.map(f => (
                      <button
                        key={f.key}
                        onClick={() => setResourceFilter(f.key)}
                        style={{
                          padding: '5px 12px',
                          borderRadius: 20,
                          border: `1px solid ${resourceFilter === f.key ? `rgba(${rgb}, 0.5)` : 'rgba(255,255,255,0.08)'}`,
                          background: resourceFilter === f.key ? `rgba(${rgb}, 0.15)` : 'rgba(255,255,255,0.03)',
                          color: resourceFilter === f.key ? color : '#64748B',
                          fontSize: 12,
                          fontWeight: 600,
                          fontFamily: "'Cairo', sans-serif",
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  {/* Resource cards */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {filteredResources.map(r => (
                      <div
                        key={r.id}
                        style={{
                          padding: '14px 16px',
                          borderRadius: 12,
                          border: '1px solid rgba(255,255,255,0.07)',
                          background: 'rgba(255,255,255,0.03)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLElement).style.borderColor = `rgba(${rgb}, 0.3)`;
                          (e.currentTarget as HTMLElement).style.background = `rgba(${rgb}, 0.05)`;
                          (e.currentTarget as HTMLElement).style.boxShadow = `0 0 16px rgba(${rgb}, 0.1)`;
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)';
                          (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)';
                          (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <p style={{ color: '#CBD5E1', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>{r.name}</p>
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            <span style={{
                              fontSize: 10, padding: '2px 7px', borderRadius: 6,
                              background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.2)', color: '#A78BFA',
                            }}>{getResourceTypeLabel(r.type)}</span>
                            <span style={{
                              fontSize: 10, padding: '2px 7px', borderRadius: 6,
                              background: r.lang === 'ar' ? 'rgba(52,211,153,0.1)' : 'rgba(0,212,255,0.1)',
                              border: `1px solid ${r.lang === 'ar' ? 'rgba(52,211,153,0.2)' : 'rgba(0,212,255,0.2)'}`,
                              color: r.lang === 'ar' ? '#34D399' : '#00D4FF',
                            }}>{r.lang === 'ar' ? '🇪🇬 عربي' : '🌍 English'}</span>
                            <span style={{
                              fontSize: 10, padding: '2px 7px', borderRadius: 6,
                              background: r.price === 'free' ? 'rgba(52,211,153,0.1)' : 'rgba(251,191,36,0.1)',
                              border: `1px solid ${r.price === 'free' ? 'rgba(52,211,153,0.2)' : 'rgba(251,191,36,0.2)'}`,
                              color: r.price === 'free' ? '#34D399' : '#FBBF24',
                            }}>{r.price === 'free' ? 'مجاني ✓' : 'مدفوع 💳'}</span>
                          </div>
                        </div>
                        <span style={{ color: '#475569', fontSize: 16 }}>←</span>
                      </div>
                    ))}
                    {filteredResources.length === 0 && (
                      <p style={{ color: '#475569', textAlign: 'center', padding: 20, fontSize: 13 }}>
                        ما فيش نتائج للفلتر ده
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* TASKS TAB */}
              {activeTab === 'tasks' && (
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 16,
                    padding: '10px 14px',
                    borderRadius: 10,
                    background: `rgba(${rgb}, 0.08)`,
                    border: `1px solid rgba(${rgb}, 0.2)`,
                  }}>
                    <span style={{ color: color, fontSize: 13, fontWeight: 700 }}>
                      {doneTasks}/{totalTasks} خلصت
                    </span>
                    <div style={{ display: 'flex', gap: 6 }}>
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

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {phase.tasks.map(task => {
                      const done = !!checkedTasks[task.id];
                      return (
                        <div
                          key={task.id}
                          style={{
                            padding: '14px 16px',
                            borderRadius: 12,
                            border: `1px solid ${done ? `rgba(${rgb}, 0.25)` : 'rgba(255,255,255,0.07)'}`,
                            background: done ? `rgba(${rgb}, 0.06)` : 'rgba(255,255,255,0.02)',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 12,
                            transition: 'all 0.2s',
                          }}
                        >
                          {/* Task checkbox */}
                          <div
                            style={{
                              width: 24,
                              height: 24,
                              borderRadius: 7,
                              border: done ? `2px solid ${color}` : '2px solid rgba(255,255,255,0.12)',
                              background: done ? `rgba(${rgb}, 0.2)` : 'transparent',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              flexShrink: 0,
                              transition: 'all 0.25s',
                              boxShadow: done ? `0 0 8px rgba(${rgb}, 0.4)` : 'none',
                              marginTop: 1,
                            }}
                            onClick={() => toggleTask(task.id)}
                          >
                            {done && <span className="animate-checkbox" style={{ color, fontSize: 13 }}>✓</span>}
                          </div>

                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                              <span style={{ fontSize: 16 }}>{taskTypeIcon(task.type)}</span>
                              <span style={{ color: '#475569', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 }}>
                                {task.type === 'build' ? 'Build' : task.type === 'deploy' ? 'Deploy' : 'Read'}
                              </span>
                            </div>
                            <p style={{
                              color: done ? '#475569' : '#CBD5E1',
                              fontSize: 13,
                              fontWeight: 600,
                              textDecoration: done ? 'line-through' : 'none',
                              lineHeight: 1.6,
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
                              style={{
                                padding: '5px 12px',
                                borderRadius: 8,
                                border: `1px solid rgba(${rgb}, 0.3)`,
                                background: `rgba(${rgb}, 0.1)`,
                                color: color,
                                fontSize: 11,
                                fontWeight: 700,
                                textDecoration: 'none',
                                fontFamily: "'Cairo', sans-serif",
                                whiteSpace: 'nowrap',
                                flexShrink: 0,
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
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}