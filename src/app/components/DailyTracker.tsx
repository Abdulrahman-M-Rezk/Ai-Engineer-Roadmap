import { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { DailyTask } from '../context/AppContext';
import { getTodayLocal } from '../utils/dates';

const PRIORITY_STYLES: Record<DailyTask['priority'], { bg: string; border: string; badgeBg: string; badgeText: string; label: string }> = {
  high:   { bg: 'rgba(239,68,68,0.10)',  border: 'rgba(239,68,68,0.30)',  badgeBg: 'rgba(239,68,68,0.20)',  badgeText: '#F87171', label: 'عالية 🔴' },
  medium: { bg: 'rgba(234,179,8,0.10)',   border: 'rgba(234,179,8,0.30)',  badgeBg: 'rgba(234,179,8,0.20)',  badgeText: '#FBBF24', label: 'متوسطة 🟡' },
  low:    { bg: 'rgba(100,116,139,0.10)', border: 'rgba(100,116,139,0.30)', badgeBg: 'rgba(100,116,139,0.20)', badgeText: '#94A3B8', label: 'عادية ⚪' },
};

export function DailyTracker() {
  const { dailyTasks, addDailyTask, toggleDailyTask, deleteDailyTask } = useApp();
  const [selectedDate, setSelectedDate] = useState(getTodayLocal);
  const [taskText, setTaskText] = useState('');
  const [priority, setPriority] = useState<DailyTask['priority']>('medium');

  const tasks = dailyTasks[selectedDate] || [];

  const handleAdd = () => {
    const trimmed = taskText.trim();
    if (!trimmed) return;
    addDailyTask(selectedDate, trimmed, priority);
    setTaskText('');
  };

  const openGoogleCalendar = (text: string) => {
    const dateStr = selectedDate.replace(/-/g, '');
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(text)}&dates=${dateStr}T09:00:00/${dateStr}T10:00:00`;
    window.open(url, '_blank');
  };

  return (
    <div dir="ltr" className="w-full mx-auto flex flex-col gap-6">
      {/* Date Selection */}
      <div>
        <label className="text-slate-400 text-sm mr-2">Select a date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
          className="bg-slate-800 text-white border border-slate-700 outline-none focus:ring-2 focus:ring-emerald-500 rounded-lg px-3 py-2 text-sm"
        />
      </div>

      {/* Task Input Row */}
      <div className="flex gap-2 flex-wrap">
        <input
          type="text"
          value={taskText}
          onChange={e => setTaskText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="Add a new task..."
          className="flex-1 min-w-[200px] bg-slate-800 text-white border border-slate-700 outline-none focus:ring-2 focus:ring-emerald-500 rounded-lg px-3 py-2 text-[18px]"
        />
        <select
          value={priority}
          onChange={e => setPriority(e.target.value as DailyTask['priority'])}
          className="bg-slate-800 text-white border border-slate-700 outline-none focus:ring-2 focus:ring-emerald-500 rounded-lg px-3 py-2 text-sm cursor-pointer min-w-[130px]"
        >
          <option value="high" className="bg-slate-800 text-white">🔴 High</option>
          <option value="medium" className="bg-slate-800 text-white">🟡 Medium</option>
          <option value="low" className="bg-slate-800 text-white">⚪ Low</option>
        </select>
        <button
          onClick={handleAdd}
          className="px-5 py-2 rounded-lg border-none font-bold text-sm cursor-pointer whitespace-nowrap text-black"
          style={{ background: 'linear-gradient(340deg, #34D399, #10B981)' }}
        >
          Add Task
        </button>
      </div>

      {/* Task List */}
      {tasks.length === 0 ? (
        <p className="text-slate-600 text-[18px] text-center py-10">
          No tasks for today. Add a task to start! 📝
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {tasks.map(task => {
            const p = PRIORITY_STYLES[task.priority || 'medium'];
            return (
              <div
                key={task.id}
                className="flex items-center gap-3 rounded-2xl"
                style={{
                  padding: '14px 16px',
                  background: p.bg,
                  border: `1px solid ${p.border}`,
                  borderRight: `4px solid ${p.border}`,
                }}
              >
                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleDailyTask(selectedDate, task.id)}
                  className="w-5 h-5 cursor-pointer shrink-0"
                  style={{ accentColor: '#34D399' }}
                />

                {/* Task text + priority badge */}
                <div className="flex-1 flex items-center gap-2 flex-wrap">
                  <span
                    className="text-xl leading-relaxed font-semibold"
                    style={{
                      color: task.completed ? '#475569' : '#e2e8f0',
                      textDecoration: task.completed ? 'line-through' : 'none',
                    }}
                  >
                    {task.text}
                  </span>
                  <span
                    className="text-xs px-2 py-1 rounded-full font-bold shrink-0"
                    style={{ background: p.badgeBg, color: p.badgeText }}
                  >
                    {p.label}
                  </span>
                </div>

                {/* Calendar button */}
                <button
                  onClick={() => openGoogleCalendar(task.text)}
                  title="أضف للتقويم"
                  className="bg-transparent border-none cursor-pointer text-[13px] text-slate-400 px-1.5 py-1 rounded-md whitespace-nowrap shrink-0 hover:text-emerald-400 transition-colors"
                >
                  📅 Add to My Calendar
                </button>

                {/* Delete button */}
                <button
                  onClick={() => deleteDailyTask(selectedDate, task.id)}
                  title="حذف"
                  className="bg-transparent border-none cursor-pointer text-lg text-red-400 px-2 py-1 rounded-md shrink-0 hover:text-red-300 transition-colors"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
