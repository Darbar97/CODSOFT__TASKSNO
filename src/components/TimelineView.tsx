import React, { useMemo } from 'react';
import { Calendar, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { Task } from '../types/index.ts';
import { useProjects } from '../context/ProjectContext.tsx';

interface TimelineViewProps {
  onSelectTask: (task: Task) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({ onSelectTask }) => {
  const { filteredTasks, currentProject, teamMembers } = useProjects();

  // Compute date range
  const { startDate, endDate, daysCount, dateTicks } = useMemo(() => {
    const dates = filteredTasks
      .map((t) => t.dueDate)
      .filter(Boolean)
      .sort();

    const now = new Date();
    let minD = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    let maxD = new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000);

    if (dates.length > 0) {
      const first = new Date(dates[0]);
      const last = new Date(dates[dates.length - 1]);
      if (first < minD) minD = new Date(first.getTime() - 3 * 24 * 60 * 60 * 1000);
      if (last > maxD) maxD = new Date(last.getTime() + 7 * 24 * 60 * 60 * 1000);
    }

    const diffTime = Math.abs(maxD.getTime() - minD.getTime());
    const count = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const ticks: { dateStr: string; label: string; isToday: boolean }[] = [];
    const todayStr = now.toISOString().split('T')[0];

    for (let i = 0; i <= count; i += 3) {
      const cur = new Date(minD.getTime() + i * 24 * 60 * 60 * 1000);
      const str = cur.toISOString().split('T')[0];
      const month = cur.toLocaleString('default', { month: 'short' });
      const day = cur.getDate();
      ticks.push({
        dateStr: str,
        label: `${month} ${day}`,
        isToday: str === todayStr,
      });
    }

    return {
      startDate: minD,
      endDate: maxD,
      daysCount: count,
      dateTicks: ticks,
    };
  }, [filteredTasks]);

  const calculateBarPosition = (task: Task) => {
    const createdTime = new Date(task.createdAt || startDate).getTime();
    const dueTime = task.dueDate ? new Date(task.dueDate).getTime() : createdTime + 5 * 86400000;

    const totalDuration = endDate.getTime() - startDate.getTime();
    if (totalDuration <= 0) return { left: '0%', width: '10%' };

    const startOffset = Math.max(0, createdTime - startDate.getTime());
    const taskDuration = Math.max(86400000, dueTime - createdTime);

    const leftPercent = Math.min(95, Math.max(0, (startOffset / totalDuration) * 100));
    const widthPercent = Math.min(
      100 - leftPercent,
      Math.max(8, (taskDuration / totalDuration) * 100)
    );

    return {
      left: `${leftPercent}%`,
      width: `${widthPercent}%`,
    };
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'done':
        return 'bg-emerald-600/80 border-emerald-500 text-emerald-100';
      case 'in_progress':
        return 'bg-sky-600/80 border-sky-500 text-sky-100';
      case 'review':
        return 'bg-amber-600/80 border-amber-500 text-amber-100';
      case 'todo':
      default:
        return 'bg-slate-700/80 border-slate-600 text-slate-200';
    }
  };

  return (
    <div className="flex-1 p-4 sm:p-6 overflow-x-auto">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Timeline Header Info */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div>
            <h2 className="text-sm font-semibold text-slate-100">Milestone Roadmap</h2>
            <p className="text-[11px] text-slate-400">
              Interactive timeline visualizing task duration, deadlines, and delivery pace
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-slate-700" />
              <span>To Do</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-sky-600" />
              <span>In Progress</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-amber-600" />
              <span>Review</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-emerald-600" />
              <span>Completed</span>
            </span>
          </div>
        </div>

        {/* Timeline Gantt Board */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden shadow-sm min-w-[700px]">
          {/* Time axis header */}
          <div className="flex border-b border-slate-800 bg-slate-950/80 py-2.5 px-4 text-[11px] font-mono text-slate-400">
            <div className="w-64 shrink-0 font-medium text-slate-300">Task Name</div>
            <div className="flex-1 relative flex justify-between pr-4">
              {dateTicks.map((tick, i) => (
                <span
                  key={i}
                  className={`tabular-nums ${
                    tick.isToday ? 'text-indigo-400 font-semibold' : 'text-slate-500'
                  }`}
                >
                  {tick.label}
                </span>
              ))}
            </div>
          </div>

          {/* Task rows */}
          <div className="divide-y divide-slate-800/60">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12 text-xs text-slate-500">
                No tasks available for this milestone view.
              </div>
            ) : (
              filteredTasks.map((task) => {
                const { left, width } = calculateBarPosition(task);
                const assignee = teamMembers.find((m) => m.id === task.assigneeId);
                const colorClass = getStatusColor(task.status);

                return (
                  <div
                    key={task.id}
                    onClick={() => onSelectTask(task)}
                    className="flex items-center py-2.5 px-4 hover:bg-slate-800/40 transition-colors cursor-pointer group"
                  >
                    {/* Task Title & Meta (Left column) */}
                    <div className="w-64 shrink-0 pr-4">
                      <p className="text-xs font-medium text-slate-200 group-hover:text-white truncate">
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                        <span className="capitalize">{task.status.replace('_', ' ')}</span>
                        <span>·</span>
                        <span className="font-mono tabular-nums">{task.dueDate}</span>
                      </div>
                    </div>

                    {/* Gantt Bar Canvas (Right column) */}
                    <div className="flex-1 relative h-8 flex items-center">
                      <div
                        className={`absolute h-7 rounded-lg border ${colorClass} shadow-sm px-2.5 flex items-center justify-between text-xs overflow-hidden transition-all group-hover:brightness-110`}
                        style={{ left, width }}
                        title={`${task.title} (${task.progress}%)`}
                      >
                        {/* Internal progress indicator fill */}
                        <div
                          className="absolute left-0 top-0 bottom-0 bg-white/15"
                          style={{ width: `${task.progress}%` }}
                        />

                        {/* Title text & progress inside bar */}
                        <span className="relative z-10 text-[11px] font-medium truncate pr-2">
                          {task.title}
                        </span>

                        <div className="relative z-10 flex items-center gap-1.5 shrink-0">
                          {assignee && (
                            <div
                              className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white shadow"
                              style={{ backgroundColor: assignee.avatarColor }}
                              title={assignee.name}
                            >
                              {assignee.name.charAt(0)}
                            </div>
                          )}
                          <span className="font-mono tabular-nums text-[10px] opacity-90">
                            {task.progress}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
