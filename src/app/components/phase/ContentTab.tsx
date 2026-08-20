import { useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Edit3 } from 'lucide-react';
import { Phase } from '../../data/roadmapData';
import { useApp } from '../../context/AppContext';

interface ContentTabProps {
  phase: Phase;
  color: string;
  rgb: string;
}

export function ContentTab({ phase, color, rgb }: ContentTabProps) {
  const { checkedTopics, toggleTopic, topicDetails, updateTopicDetails } = useApp();
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);

  const totalTopics = phase.topicGroups.reduce((a, g) => a + g.topics.length, 0);

  const handleToggleTopic = useCallback((topicId: string) => {
    const wasDone = phase.topicGroups.reduce((a, g) => a + g.topics.filter(t => checkedTopics[t.id]).length, 0);
    toggleTopic(topicId);
    const nowDone = wasDone + (checkedTopics[topicId] ? -1 : 1);
    if (nowDone === totalTopics && !checkedTopics[topicId]) {
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

  return (
    <div>
      {phase.topicGroups.map((group, gi) => (
        <div key={group.id} style={{ marginBottom: gi < phase.topicGroups.length - 1 ? 28 : 0 }}>
          <div className="flex items-center gap-2.5 mb-[14px]" dir="rtl">
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
              <span className="text-slate-300 font-bold text-sm">{group.nameAr}</span>
              <span className="text-slate-600 text-[11px] mr-2">{group.nameEn}</span>
            </div>
          </div>

          <div style={{ marginRight: 11, borderRight: `2px solid rgba(${rgb}, 0.2)`, paddingRight: 18 }}>
            {group.topics.map((topic, ti) => {
              const checked = !!checkedTopics[topic.id];
              return (
                <div key={topic.id} style={{ borderBottom: ti < group.topics.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                  <div
                    className="flex items-center gap-2.5 py-2 cursor-pointer"
                    onClick={() => handleToggleTopic(topic.id)}
                  >
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

                    <div className="flex-1 flex items-center">
                      <span style={{
                        color: checked ? '#475569' : '#CBD5E1',
                        textDecoration: checked ? 'line-through' : 'none',
                        fontSize: 16,
                        fontWeight: checked ? 400 : 600,
                        lineHeight: 1.6,
                        transition: 'all 0.2s',
                      }}>
                        {topic.nameAr}
                      </span>
                      {topic.essential && (
                        <span className="mr-[6px] text-[10px] text-amber-400 rounded px-[5px] py-[1px]" style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)' }}>⭐ أساسي</span>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); setExpandedTopic(expandedTopic === topic.id ? null : topic.id); }}
                        className="bg-none border-none cursor-pointer px-2 py-1 mr-2 transition-colors rounded" style={{ color: expandedTopic === topic.id ? color : '#64748B' }}
                        title="إضافة ملاحظات وتواريخ"
                      >
                        <Edit3 size={14} />
                      </button>
                    </div>

                    <span className="text-slate-500 text-xs mr-2">{topic.nameEn}</span>
                  </div>

                  {expandedTopic === topic.id && (
                    <div className="animate-slide-down p-3 rounded-lg mb-3 flex flex-col gap-2.5" style={{ background: 'rgba(255,255,255,0.03)' }}>
                      <div className="flex gap-3 flex-wrap">
                        <div className="flex-1 min-w-[120px]">
                          <label className="block text-[11px] text-slate-400 mb-1">تاريخ البدء</label>
                          <input type="date"
                            value={topicDetails[topic.id]?.startDate || ''}
                            onChange={(e) => updateTopicDetails(topic.id, { startDate: e.target.value })}
                            className="w-full px-[10px] py-[6px] rounded text-sm outline-none" style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.3)', color: '#F8FAFC', colorScheme: 'dark' }}
                          />
                        </div>
                        <div className="flex-1 min-w-[120px]">
                          <label className="block text-[11px] text-slate-400 mb-1">تاريخ الانتهاء</label>
                          <input type="date"
                            value={topicDetails[topic.id]?.endDate || ''}
                            onChange={(e) => updateTopicDetails(topic.id, { endDate: e.target.value })}
                            className="w-full px-[10px] py-[6px] rounded text-sm outline-none" style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.3)', color: '#F8FAFC', colorScheme: 'dark' }}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">ملاحظات</label>
                        <textarea
                          value={topicDetails[topic.id]?.note || ''}
                          onChange={(e) => updateTopicDetails(topic.id, { note: e.target.value })}
                          placeholder="اكتب ملاحظاتك هنا..."
                          rows={2}
                          className="w-full px-[10px] py-2 rounded text-sm outline-none resize-y" style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.3)', color: '#F8FAFC' }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}