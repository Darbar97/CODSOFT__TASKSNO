import React from 'react';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  Users,
  Target,
  BarChart3,
  Calendar,
} from 'lucide-react';
import { useProjects } from '../context/ProjectContext.tsx';
import { TaskPriority, TaskStatus } from '../types/index.ts';

export const AnalyticsView: React.FC = () => {
  const { currentProject, tasks, teamMembers } = useProjects();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'done').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress').length;
  const reviewTasks = tasks.filter((t) => t.status === 'review').length;
  const todoTasks = tasks.filter((t) => t.status === 'todo').length;

  const todayStr = new Date().toISOString().split('T')[0];
  const overdueTasks = tasks.filter(
    (t) => t.dueDate && t.dueDate < todayStr && t.status !== 'done'
  ).length;

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const averageProgress =
    totalTasks > 0
      ? Math.round(tasks.reduce((acc, t) => acc + (t.progress || 0), 0) / totalTasks)
      : 0;

  // Days until target date
  const daysRemaining = (() => {
    if (!currentProject?.targetDate) return null;
    const target = new Date(currentProject.targetDate);
    const now = new Date();
    const diff = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  })();

  // Priority count
  const priorities: TaskPriority[] = ['urgent', 'high', 'medium', 'low'];
  const priorityCounts = priorities.map((p) => ({
    priority: p,
    count: tasks.filter((t) => t.priority === p).length,
  }));

  // Assignee workload
  const memberWorkload = teamMembers.map((member) => {
    const memberTasks = tasks.filter((t) => t.assigneeId === member.id);
    const done = memberTasks.filter((t) => t.status === 'done').length;
    const active = memberTasks.length - done;
    const rate = memberTasks.length > 0 ? Math.round((done / memberTasks.length) * 100) : 0;
    return {
      member,
      total: memberTasks.length,
      done,
      active,
      rate,
    };
  });

  const unassignedCount = tasks.filter((t) => !t.assigneeId).length;

  return (
    <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Title banner */}
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-slate-100">
            Project Health & Velocity
          </h2>
          <p className="text-xs text-slate-400">
            Real-time delivery burndown, milestone completion, and team resource allocation
          </p>
        </div>

        {/* 4 Core Metric Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Completion Rate */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-medium">Completion Rate</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono tabular-nums text-slate-100">
                {completionRate}%
              </span>
              <span className="text-xs text-slate-400 font-mono tabular-nums">
                ({completedTasks}/{totalTasks} tasks)
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-1.5 rounded-full"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>

          {/* Card 2: Average Progress */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-medium">Average Progress</span>
              <TrendingUp className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono tabular-nums text-slate-100">
                {averageProgress}%
              </span>
              <span className="text-xs text-slate-400">across all tasks</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-indigo-500 h-1.5 rounded-full"
                style={{ width: `${averageProgress}%` }}
              />
            </div>
          </div>

          {/* Card 3: Overdue Alerts */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-medium">Overdue Alerts</span>
              <AlertTriangle
                className={`w-4 h-4 ${
                  overdueTasks > 0 ? 'text-rose-400' : 'text-slate-500'
                }`}
              />
            </div>
            <div className="flex items-baseline gap-2">
              <span
                className={`text-2xl font-bold font-mono tabular-nums ${
                  overdueTasks > 0 ? 'text-rose-400' : 'text-slate-100'
                }`}
              >
                {overdueTasks}
              </span>
              <span className="text-xs text-slate-400">past deadline</span>
            </div>
            <p className="text-[11px] text-slate-500">
              {overdueTasks === 0
                ? 'All schedules on track'
                : 'Attention needed on overdue items'}
            </p>
          </div>

          {/* Card 4: Target Milestone */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-medium">Target Milestone</span>
              <Target className="w-4 h-4 text-amber-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono tabular-nums text-slate-100">
                {daysRemaining !== null
                  ? daysRemaining >= 0
                    ? `${daysRemaining}d`
                    : `${Math.abs(daysRemaining)}d ago`
                  : '—'}
              </span>
              <span className="text-xs text-slate-400">
                {daysRemaining !== null && daysRemaining >= 0 ? 'remaining' : ''}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono tabular-nums">
              Due: {currentProject?.targetDate || 'Unset'}
            </p>
          </div>
        </div>

        {/* Section 2: Status Breakdown and Priority Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status Distribution */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Pipeline Status Distribution
            </h3>

            {/* Segmented bar */}
            <div className="w-full bg-slate-800 rounded-lg h-3 overflow-hidden flex">
              {totalTasks > 0 && (
                <>
                  <div
                    className="bg-slate-600 h-full transition-all"
                    style={{ width: `${(todoTasks / totalTasks) * 100}%` }}
                    title={`To Do: ${todoTasks}`}
                  />
                  <div
                    className="bg-sky-500 h-full transition-all"
                    style={{ width: `${(inProgressTasks / totalTasks) * 100}%` }}
                    title={`In Progress: ${inProgressTasks}`}
                  />
                  <div
                    className="bg-amber-500 h-full transition-all"
                    style={{ width: `${(reviewTasks / totalTasks) * 100}%` }}
                    title={`Review: ${reviewTasks}`}
                  />
                  <div
                    className="bg-emerald-500 h-full transition-all"
                    style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
                    title={`Done: ${completedTasks}`}
                  />
                </>
              )}
            </div>

            {/* Status Legend & Count */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <p className="text-slate-400 text-[11px]">To Do</p>
                <p className="text-base font-semibold font-mono tabular-nums text-slate-200 mt-0.5">
                  {todoTasks}
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <p className="text-sky-400 text-[11px]">In Progress</p>
                <p className="text-base font-semibold font-mono tabular-nums text-slate-200 mt-0.5">
                  {inProgressTasks}
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <p className="text-amber-400 text-[11px]">Review</p>
                <p className="text-base font-semibold font-mono tabular-nums text-slate-200 mt-0.5">
                  {reviewTasks}
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <p className="text-emerald-400 text-[11px]">Completed</p>
                <p className="text-base font-semibold font-mono tabular-nums text-slate-200 mt-0.5">
                  {completedTasks}
                </p>
              </div>
            </div>
          </div>

          {/* Priority Breakdown */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Task Priority Breakdown
            </h3>

            <div className="space-y-3">
              {priorityCounts.map((item) => {
                const percent = totalTasks > 0 ? Math.round((item.count / totalTasks) * 100) : 0;
                const colors: Record<TaskPriority, string> = {
                  urgent: 'bg-rose-500',
                  high: 'bg-amber-500',
                  medium: 'bg-sky-500',
                  low: 'bg-slate-600',
                };

                return (
                  <div key={item.priority} className="space-y-1 text-xs">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="capitalize font-medium text-slate-300">
                        {item.priority}
                      </span>
                      <span className="font-mono tabular-nums text-slate-400">
                        {item.count} tasks ({percent}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`${colors[item.priority]} h-1.5 rounded-full`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 3: Team Workload Grid */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Team Workload & Capacity
            </h3>
            {unassignedCount > 0 && (
              <span className="text-xs text-amber-400 font-mono tabular-nums">
                {unassignedCount} unassigned tasks
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {memberWorkload.map(({ member, total, done, active, rate }) => (
              <div
                key={member.id}
                className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2.5"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-inner shrink-0"
                    style={{ backgroundColor: member.avatarColor }}
                  >
                    {member.name.charAt(0)}
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-semibold text-slate-200 truncate">
                      {member.name}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate">{member.role}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800/60">
                  <span>{active} active tasks</span>
                  <span className="font-mono tabular-nums text-slate-200">
                    {done}/{total} done ({rate}%)
                  </span>
                </div>

                <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
                  <div
                    className="bg-indigo-500 h-1 rounded-full"
                    style={{ width: `${rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
