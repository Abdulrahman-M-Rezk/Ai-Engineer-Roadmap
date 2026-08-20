import { useState } from 'react';
import { Phase } from '../data/roadmapData';
import { useApp } from '../context/AppContext';
import { TabType, hexToRgb, PULSE_CLASS } from './phase/shared';
import { Timeline } from './phase/Timeline';
import { PhaseHeader } from './phase/PhaseHeader';
import { PhaseTabs } from './phase/PhaseTabs';
import { ContentTab } from './phase/ContentTab';
import { ResourcesTab } from './phase/ResourcesTab';
import { TasksTab } from './phase/TasksTab';

interface PhaseCardProps {
  phase: Phase;
  isLast: boolean;
  phaseIndex: number;
}

export function PhaseCard({ phase, isLast, phaseIndex }: PhaseCardProps) {
  const { checkedTopics, activePhase, setActivePhase } = useApp();
  const [activeTab, setActiveTab] = useState<TabType>('content');

  const totalTopics = phase.topicGroups.reduce((a, g) => a + g.topics.length, 0);
  const doneTopics = phase.topicGroups.reduce(
    (a, g) => a + g.topics.filter(t => checkedTopics[t.id]).length,
    0
  );

  const phaseProgress = totalTopics > 0 ? Math.round((doneTopics / totalTopics) * 100) : 0;
  const isCompleted = doneTopics === totalTopics;
  const isExpanded = activePhase === phase.id;

  const isCurrentPhase = !isCompleted && (phaseIndex === 0 || phaseProgress > 0);
  const isFuture = !isCompleted && phaseProgress === 0 && phaseIndex > 0;

  const color = phase.color;
  const rgb = hexToRgb(color);
  const pulseClass = PULSE_CLASS[color] || '';
  const toggle = () => setActivePhase(isExpanded ? null : phase.id);

  return (
    <div className="flex gap-4 relative" dir="rtl" style={{ marginBottom: 0 }}>
      <Timeline
        phase={phase}
        isLast={isLast}
        isCompleted={isCompleted}
        isCurrentPhase={isCurrentPhase}
        isFuture={isFuture}
        color={color}
        rgb={rgb}
        pulseClass={pulseClass}
        onToggle={toggle}
      />

      <div className="flex-1 mb-5">
        <PhaseHeader
          phase={phase}
          doneTopics={doneTopics}
          totalTopics={totalTopics}
          phaseProgress={phaseProgress}
          isCompleted={isCompleted}
          isExpanded={isExpanded}
          isFuture={isFuture}
          color={color}
          rgb={rgb}
          onToggle={toggle}
        />

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
            <PhaseTabs activeTab={activeTab} onChange={setActiveTab} color={color} />

            <div className="p-5">
              {activeTab === 'content' && <ContentTab phase={phase} color={color} rgb={rgb} />}
              {activeTab === 'resources' && <ResourcesTab phase={phase} color={color} rgb={rgb} />}
              {activeTab === 'tasks' && <TasksTab phase={phase} color={color} rgb={rgb} />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}