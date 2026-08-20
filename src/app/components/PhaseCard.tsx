import { useState, useCallback, useMemo } from 'react';
import confetti from 'canvas-confetti';
import * as Accordion from '@radix-ui/react-accordion';
import { GripVertical, Copy, Check, Edit3 } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Phase } from '../data/roadmapData';
import { useApp, CustomResource } from '../context/AppContext';

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

function SortableResourceItem({ resource, rgb, color, onRemoveCustom }: { resource: any, rgb: string, color: string, onRemoveCustom: (id: string) => void }) {
  const [copiedName, setCopiedName] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: resource.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 2 : 1,
    opacity: isDragging ? 0.7 : 1,
    padding: '14px 16px',
    borderRadius: 12,
    border: `1px solid ${isDragging ? `rgba(${rgb}, 0.5)` : 'rgba(255,255,255,0.07)'}`,
    background: isDragging ? `rgba(${rgb}, 0.1)` : 'rgba(255,255,255,0.03)',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
    position: 'relative' as const,
  };

  const isFree = resource.price === 'free';
  const isAr = resource.lang === 'ar';
  
  return (
    <div ref={setNodeRef} style={style}>
      <div {...attributes} {...listeners} className="cursor-grab flex items-center text-slate-500 px-1 touch-none">
        <GripVertical size={18} />
      </div>
      
      <div className="flex-1">
        <a href={resource.url || '#'} target="_blank" rel="noopener noreferrer" className="no-underline">
           <p style={{ color: resource.isCustom ? color : '#CBD5E1', fontSize: 16, fontWeight: 600, marginBottom: resource.isCustom && !resource.desc ? 0 : 6, lineHeight: 1.6 }}>
              {resource.isCustom ? `📌 ${resource.name}` : resource.name}
           </p>
        </a>
        
        {!resource.isCustom && (
           <div className="flex gap-[6px] flex-wrap">
             <span className="text-[10px] px-[7px] py-[2px] rounded text-purple-400" style={{ background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.2)' }}>
               {resource.type === 'video' ? '📹 فيديو' : resource.type === 'book' ? '📕 كتاب' : '📄 مقال'}
             </span>
             <span className={`text-[10px] px-[7px] py-[2px] rounded ${isAr ? 'text-emerald-400' : 'text-cyan-400'}`} style={{ background: isAr ? 'rgba(52,211,153,0.1)' : 'rgba(0,212,255,0.1)', border: `1px solid ${isAr ? 'rgba(52,211,153,0.2)' : 'rgba(0,212,255,0.2)'}` }}>
               {isAr ? '🇪🇬 عربي' : '🌍 English'}
             </span>
             <span className={`text-[10px] px-[7px] py-[2px] rounded ${isFree ? 'text-emerald-400' : 'text-amber-400'}`} style={{ background: isFree ? 'rgba(52,211,153,0.1)' : 'rgba(251,191,36,0.1)', border: `1px solid ${isFree ? 'rgba(52,211,153,0.2)' : 'rgba(251,191,36,0.2)'}` }}>
               {isFree ? 'مجاني ✓' : 'مدفوع 💳'}
             </span>
           </div>
        )}
        
        {resource.desc && (
           <div className="mt-2 p-[8px_12px] rounded-[4px_8px_8px_4px]" style={{ background: 'rgba(56, 189, 248, 0.1)', borderLeft: '3px solid #38BDF8' }}>
             <p className="text-sky-100 text-sm leading-relaxed m-0">{resource.desc}</p>
           </div>
        )}
        
        {resource.referral && (
          <div className="mt-2 p-[12px_14px] rounded-[8px_4px_4px_8px]" style={{ background: 'rgba(56, 189, 248, 0.08)', borderRight: '3px solid #38BDF8' }}>
            <p className="text-sky-100 text-sm leading-relaxed m-0 mb-3 whitespace-pre-wrap">
              {resource.referral.message}
            </p>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  navigator.clipboard.writeText(resource.referral.name);
                  setCopiedName(true);
                  setTimeout(() => setCopiedName(false), 2000);
                }}
                className="flex items-center gap-[6px] px-[10px] py-[6px] rounded text-[11px] cursor-pointer transition-all" style={{ border: '1px solid rgba(56, 189, 248, 0.2)', background: 'rgba(255,255,255,0.05)', color: '#38BDF8' }}
              >
                {copiedName ? <Check size={12} /> : <Copy size={12} />}
                {copiedName ? 'تم النسخ' : resource.referral.name}
              </button>
              
              <button
                onClick={(e) => {
                  e.preventDefault();
                  navigator.clipboard.writeText(resource.referral.email);
                  setCopiedEmail(true);
                  setTimeout(() => setCopiedEmail(false), 2000);
                }}
                className="flex items-center gap-[6px] px-[10px] py-[6px] rounded text-[11px] cursor-pointer transition-all" style={{ border: '1px solid rgba(56, 189, 248, 0.2)', background: 'rgba(255,255,255,0.05)', color: '#38BDF8' }}
              >
                {copiedEmail ? <Check size={12} /> : <Copy size={12} />}
                {copiedEmail ? 'تم النسخ' : resource.referral.email}
              </button>
            </div>
          </div>
        )}
      </div>
      
      {!resource.isCustom ? (
         <a href={resource.url || '#'} target="_blank" rel="noopener noreferrer" className="no-underline px-1">
           <span style={{ color: color, fontSize: 16, opacity: 0.7 }}>↗</span>
         </a>
      ) : (
         <button onClick={() => onRemoveCustom(resource.id)} className="bg-none border-none text-slate-600 cursor-pointer text-base px-1 shrink-0" title="حذف">
           🗑️
         </button>
      )}
    </div>
  );
}


export function PhaseCard({ phase, isLast, phaseIndex }: PhaseCardProps) {
  const { checkedTopics, checkedTasks, toggleTopic, toggleTask, activePhase, setActivePhase, customResources, addCustomResource, removeCustomResource, resourceOrder, updateResourceOrder, resetResourceOrder, topicDetails, updateTopicDetails } = useApp();
  const [activeTab, setActiveTab] = useState<TabType>('content');
  const [resourceFilter, setResourceFilter] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  const [newResName, setNewResName] = useState('');
  const [newResUrl, setNewResUrl] = useState('');
  const [newResNote, setNewResNote] = useState('');

  const myResources: CustomResource[] = customResources[phase.id] || [];

  const handleAddResource = () => {
    if (!newResName.trim()) return;
    addCustomResource(phase.id, { name: newResName.trim(), url: newResUrl.trim(), note: newResNote.trim() });
    setNewResName(''); setNewResUrl(''); setNewResNote('');
    setShowAddForm(false);
  };

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

  const allResources = useMemo(() => [
    ...phase.resources.map(r => ({ ...r, isCustom: false })),
    ...myResources.map(r => ({ id: r.id, name: r.name, url: r.url, desc: r.note, isCustom: true, type: 'custom', lang: 'ar', price: 'free', groupId: undefined }))
  ], [phase.resources, myResources]);

  const order = resourceOrder[phase.id];
  const hasCustomOrder = !!order && order.length > 0;

  const finalResources = useMemo(() => {
    if (!order) return allResources;
    const active = order.map(id => allResources.find(r => r.id === id)).filter(Boolean) as typeof allResources;
    const remaining = allResources.filter(r => !order.includes(r.id));
    return [...active, ...remaining];
  }, [allResources, order]);

  const filteredFinalResources = useMemo(() => {
    return finalResources.filter(r => {
      if (resourceFilter === 'all') return true;
      if (resourceFilter === 'ar') return r.lang === 'ar';
      return r.type === resourceFilter;
    });
  }, [finalResources, resourceFilter]);

  const groupedResources = useMemo(() => {
    const groups: { title: string; id: string; resources: typeof filteredFinalResources }[] = [];
    
    phase.topicGroups.forEach(g => {
      groups.push({ title: g.nameAr, id: g.id, resources: [] });
    });
    
    groups.push({ title: 'مصادر عامة وشخصية', id: 'general', resources: [] });

    filteredFinalResources.forEach(r => {
      if (r.isCustom) {
        groups[groups.length - 1].resources.push(r);
      } else if (r.groupId) {
        const targetGroup = groups.find(g => g.id === r.groupId);
        if (targetGroup) targetGroup.resources.push(r);
        else groups[groups.length - 1].resources.push(r);
      } else {
        groups[groups.length - 1].resources.push(r);
      }
    });

    return groups.filter(g => g.resources.length > 0);
  }, [filteredFinalResources, phase.topicGroups]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = useCallback((event: DragEndEvent, groupResources: any[]) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const globalOrder = order || allResources.map(r => r.id);
      
      const oldIndexLocal = groupResources.findIndex(r => r.id === active.id);
      const newIndexLocal = groupResources.findIndex(r => r.id === over.id);
      if (oldIndexLocal === -1 || newIndexLocal === -1) return;

      const newGroupOrderIds = arrayMove(groupResources, oldIndexLocal, newIndexLocal).map(r => r.id);
      
      const globalIndices = newGroupOrderIds.map(id => globalOrder.indexOf(id)).sort((a, b) => a - b);
      
      const nextGlobalOrder = [...globalOrder];
      globalIndices.forEach((gIdx, i) => {
        nextGlobalOrder[gIdx] = newGroupOrderIds[i];
      });
      
      updateResourceOrder(phase.id, nextGlobalOrder);
    }
  }, [order, allResources, updateResourceOrder, phase.id]);

  const taskTypeIcon = (type: string) => {
    if (type === 'build') return '🔨';
    if (type === 'deploy') return '🚀';
    return '📖';
  };

  return (
    <div className="flex gap-4 relative" dir="rtl" style={{ marginBottom: 0 }}>
      {/* Timeline column */}
      <div className="flex flex-col items-center shrink-0 w-[52px]">
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
      <div className="flex-1 mb-5">
        {/* Card header */}
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

          {/* Mini progress bar */}
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
            <div className="flex" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 16px' }}>
              {([
                { key: 'content', label: 'المحتوى' },
                { key: 'resources', label: 'المصادر' },
                { key: 'tasks', label: 'تكاليف 📝' },
              ] as { key: TabType; label: string }[]).map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className="bg-none border-none text-sm cursor-pointer transition-all mb-[-1px]"
                  style={{
                    padding: '12px 16px',
                    borderBottom: activeTab === tab.key ? `2px solid ${color}` : '2px solid transparent',
                    color: activeTab === tab.key ? color : '#64748B',
                    fontWeight: activeTab === tab.key ? 700 : 500,
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="p-5">
              {/* CONTENT TAB */}
              {activeTab === 'content' && (
                <div>
                  {phase.topicGroups.map((group, gi) => (
                    <div key={group.id} style={{ marginBottom: gi < phase.topicGroups.length - 1 ? 28 : 0 }}>
                      {/* Group header with left dot */}
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

                      {/* Topics with connecting line */}
                      <div style={{ marginRight: 11, borderRight: `2px solid rgba(${rgb}, 0.2)`, paddingRight: 18 }}>
                        {group.topics.map((topic, ti) => {
                          const checked = !!checkedTopics[topic.id];
                          return (
                            <div key={topic.id} style={{ borderBottom: ti < group.topics.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                              <div
                                className="flex items-center gap-2.5 py-2 cursor-pointer"
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
                              
                              {/* Inline Details Panel */}
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
              )}

              {/* RESOURCES TAB (Accordion & DND) */}
              {activeTab === 'resources' && (
                <div>
                  <Accordion.Root type="single" collapsible defaultValue="">
                    <Accordion.Item value="resources" style={{ border: 'none' }}>
                      <Accordion.Header style={{ margin: 0 }}>
                        <Accordion.Trigger className="w-full flex items-center justify-between text-sm font-bold text-slate-200 cursor-pointer outline-none transition-all"
                          style={{
                            padding: '16px 20px',
                            background: `rgba(${rgb}, 0.06)`,
                            border: `1px solid rgba(${rgb}, 0.2)`,
                            borderRadius: 12,
                          }}>
                          <span>📚 المصادر والمراجع ({finalResources.length})</span>
                          <span className="text-slate-500 text-xs">▼ عرض</span>
                        </Accordion.Trigger>
                      </Accordion.Header>
                      <Accordion.Content className="animate-slide-down" style={{ overflow: 'hidden' }}>
                        <div className="pt-4">
                          
                          {/* Filter bar */}
                          <div className="flex gap-2 mb-4 flex-wrap">
                            {RESOURCE_FILTERS.map(f => (
                              <button
                                key={f.key}
                                onClick={() => setResourceFilter(f.key)}
                                className="px-3 py-[5px] rounded-full text-xs font-semibold cursor-pointer transition-all"
                                style={{
                                  border: `1px solid ${resourceFilter === f.key ? `rgba(${rgb}, 0.5)` : 'rgba(255,255,255,0.08)'}`,
                                  background: resourceFilter === f.key ? `rgba(${rgb}, 0.15)` : 'rgba(255,255,255,0.03)',
                                  color: resourceFilter === f.key ? color : '#64748B',
                                }}
                              >
                                {f.label}
                              </button>
                            ))}
                          </div>

                          {/* DND Context for Resources List per Group */}
                          <div className="flex flex-col gap-6">
                            {groupedResources.length === 0 ? (
                              <p className="text-slate-600 text-center py-5 text-sm">ما فيش نتائج</p>
                            ) : (
                              groupedResources.map(group => (
                                <div key={group.id}>
                                  <div className="flex items-center gap-2.5 mb-4">
                                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: color, boxShadow: `0 0 8px ${color}` }} />
                                    <h4 className="text-slate-300 text-sm font-bold m-0">{group.title}</h4>
                                    <div className="flex-1 h-[1px]" style={{ background: `rgba(${rgb}, 0.2)` }} />
                                  </div>
                                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, group.resources)}>
                                    <SortableContext items={group.resources.map(r => r.id)} strategy={verticalListSortingStrategy}>
                                      <div className="flex flex-col gap-0">
                                        {group.resources.map(r => (
                                          <SortableResourceItem key={r.id} resource={r} rgb={rgb} color={color} onRemoveCustom={(id) => removeCustomResource(phase.id, id)} />
                                        ))}
                                      </div>
                                    </SortableContext>
                                  </DndContext>
                                </div>
                              ))
                            )}
                          </div>

                          {/* Reset order button */}
                          {hasCustomOrder && resourceFilter === 'all' && (
                            <div className="flex justify-start mt-3 mb-6">
                              <button
                                onClick={() => resetResourceOrder(phase.id)}
                                className="bg-transparent text-red-400 text-xs px-[14px] py-[6px] rounded-lg font-semibold cursor-pointer" style={{ border: '1px solid rgba(248,113,113,0.3)' }}
                              >
                                ↺ استعادة الترتيب الأصلي
                              </button>
                            </div>
                          )}

                          {/* ── Custom / Personal Resources Add ── */}
                          <div className="mt-6 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                            <div className="flex items-center justify-between mb-3">
                              <p className="text-slate-500 text-xs font-bold tracking-[1px]">📌 إدارة مصادرك الشخصية</p>
                              <button onClick={() => setShowAddForm(!showAddForm)} className="text-xs font-bold cursor-pointer transition-all px-3 py-[5px] rounded-lg" style={{ border: `1px solid rgba(${rgb}, 0.3)`, background: showAddForm ? `rgba(${rgb}, 0.15)` : 'rgba(255,255,255,0.03)', color: color }}>
                                {showAddForm ? '✕ إلغاء' : '➕ أضف مصدر'}
                              </button>
                            </div>

                            {/* Add form */}
                            {showAddForm && (
                              <div className="animate-slide-down p-4 rounded-xl mb-3 flex flex-col gap-2.5" style={{ border: `1px solid rgba(${rgb}, 0.25)`, background: `rgba(${rgb}, 0.04)` }}>
                                {[{ val: newResName, set: setNewResName, ph: 'اسم المصدر *', required: true }, { val: newResUrl,  set: setNewResUrl,  ph: 'رابط URL (اختياري)', required: false }, { val: newResNote, set: setNewResNote, ph: 'ملاحظة (اختياري)', required: false }].map(({ val, set, ph }) => (
                                  <input key={ph} type="text" value={val} placeholder={ph} onChange={e => set(e.target.value)} className="w-full p-[10px_12px] rounded-lg text-sm text-slate-200 outline-none box-border" style={{ border: `1px solid rgba(${rgb}, 0.25)`, background: 'rgba(255,255,255,0.04)' }} />
                                ))}
                                <button onClick={handleAddResource} disabled={!newResName.trim()} className="p-[10px] rounded-lg border-none text-sm font-bold" style={{ background: newResName.trim() ? `linear-gradient(135deg, ${color}, ${color}99)` : 'rgba(255,255,255,0.06)', color: newResName.trim() ? '#000' : '#475569', cursor: newResName.trim() ? 'pointer' : 'not-allowed' }}>حفظ المصدر</button>
                              </div>
                            )}
                          </div>
                          
                        </div>
                      </Accordion.Content>
                    </Accordion.Item>
                  </Accordion.Root>
                </div>
              )}

              {/* TASKS TAB */}
              {activeTab === 'tasks' && (
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
                          {/* Task checkbox */}
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
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
