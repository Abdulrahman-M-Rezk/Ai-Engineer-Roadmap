import { TabType } from './shared';

interface PhaseTabsProps {
  activeTab: TabType;
  onChange: (tab: TabType) => void;
  color: string;
}

export function PhaseTabs({ activeTab, onChange, color }: PhaseTabsProps) {
  return (
    <div className="flex" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 16px' }}>
      {([
        { key: 'content', label: 'المحتوى' },
        { key: 'resources', label: 'المصادر' },
        { key: 'tasks', label: 'تكاليف 📝' },
      ] as { key: TabType; label: string }[]).map(tab => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
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
  );
}