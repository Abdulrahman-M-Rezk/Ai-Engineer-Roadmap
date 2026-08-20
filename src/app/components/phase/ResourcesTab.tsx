import { useState, useMemo, useCallback } from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import { PointerSensor, KeyboardSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Phase } from '../../data/roadmapData';
import { useApp } from '../../context/AppContext';
import { RESOURCE_FILTERS, DisplayResource } from './shared';
import { ResourceGroup } from './ResourceGroup';

interface ResourcesTabProps {
  phase: Phase;
  color: string;
  rgb: string;
}

interface ResourceGroupData {
  title: string;
  id: string;
  resources: DisplayResource[];
}

export function ResourcesTab({ phase, color, rgb }: ResourcesTabProps) {
  const { customResources, addCustomResource, removeCustomResource, resourceOrder, updateResourceOrder, resetResourceOrder } = useApp();
  const [resourceFilter, setResourceFilter] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newResName, setNewResName] = useState('');
  const [newResUrl, setNewResUrl] = useState('');
  const [newResNote, setNewResNote] = useState('');

  const myResources = useMemo(() => customResources[phase.id] || [], [customResources, phase.id]);

  const handleAddResource = () => {
    if (!newResName.trim()) return;
    addCustomResource(phase.id, { name: newResName.trim(), url: newResUrl.trim(), note: newResNote.trim() });
    setNewResName(''); setNewResUrl(''); setNewResNote('');
    setShowAddForm(false);
  };

  const allResources = useMemo<DisplayResource[]>(() => [
    ...phase.resources.map(r => ({ ...r, isCustom: false })),
    ...myResources.map(r => ({ id: r.id, name: r.name, url: r.url, desc: r.note, isCustom: true, type: 'custom' as const, lang: 'ar' as const, price: 'free' as const, groupId: undefined }))
  ], [phase.resources, myResources]);

  const order = resourceOrder[phase.id];
  const hasCustomOrder = !!order && order.length > 0;

  const finalResources = useMemo(() => {
    if (!order) return allResources;
    const active = order.map(id => allResources.find(r => r.id === id)).filter(Boolean) as DisplayResource[];
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

  const groupedResources = useMemo<ResourceGroupData[]>(() => {
    const groups: ResourceGroupData[] = [];

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

  const handleDragEnd = useCallback((event: DragEndEvent, groupResources: DisplayResource[]) => {
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

  return (
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

              <div className="flex flex-col gap-6">
                {groupedResources.length === 0 ? (
                  <p className="text-slate-600 text-center py-5 text-sm">ما فيش نتائج</p>
                ) : (
                  groupedResources.map(group => (
                    <ResourceGroup
                      key={group.id}
                      title={group.title}
                      color={color}
                      rgb={rgb}
                      resources={group.resources}
                      sensors={sensors}
                      onDragEnd={handleDragEnd}
                      onRemoveCustom={(id) => removeCustomResource(phase.id, id)}
                    />
                  ))
                )}
              </div>

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

              <div className="mt-6 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-slate-500 text-xs font-bold tracking-[1px]">📌 إدارة مصادرك الشخصية</p>
                  <button onClick={() => setShowAddForm(!showAddForm)} className="text-xs font-bold cursor-pointer transition-all px-3 py-[5px] rounded-lg" style={{ border: `1px solid rgba(${rgb}, 0.3)`, background: showAddForm ? `rgba(${rgb}, 0.15)` : 'rgba(255,255,255,0.03)', color: color }}>
                    {showAddForm ? '✕ إلغاء' : '➕ أضف مصدر'}
                  </button>
                </div>

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
  );
}