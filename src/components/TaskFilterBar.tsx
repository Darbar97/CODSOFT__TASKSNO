import React from 'react';
import {
  Search,
  Filter,
  X,
  AlertCircle,
  Calendar,
  UserCheck,
  Tag,
  CheckCircle2,
  Clock,
  ArrowUpDown,
} from 'lucide-react';
import { useProjects } from '../context/ProjectContext.tsx';
import { TaskPriority, TaskStatus } from '../types/index.ts';

export const TaskFilterBar: React.FC = () => {
  const {
    filter,
    setFilter,
    resetFilters,
    currentProject,
    filteredTasks,
    tasks,
    teamMembers,
  } = useProjects();

  const isFiltered =
    filter.search.trim() !== '' ||
    filter.priority !== 'all' ||
    filter.status !== 'all' ||
    filter.assigneeId !== 'all' ||
    filter.dueRange !== 'all';

  const priorities: { id: TaskPriority | 'all'; label: string }[] = [
    { id: 'all', label: 'All Priorities' },
    { id: 'urgent', label: 'Urgent' },
    { id: 'high', label: 'High' },
    { id: 'medium', label: 'Medium' },
    { id: 'low', label: 'Low' },
  ];

  return (
    <div className="bg-slate-950/60 border-b border-slate-800/80 px-4 sm:px-6 py-3 space-y-3">
      {/* Top line: Project contextual title and deadline */}
      {currentProject && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: currentProject.color }}
              />
              <h1 className="text-base sm:text-lg font-semibold text-slate-100 tracking-tight">
                {currentProject.name}
              </h1>
              <span className="text-xs text-slate-400 capitalize">
                · {currentProject.status.replace('_', ' ')}
              </span>
            </div>
            {currentProject.description && (
              <p className="text-xs text-slate-400 line-clamp-1 max-w-2xl">
                {currentProject.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400 shrink-0">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Target:</span>
              <span className="font-mono tabular-nums text-slate-200">
                {currentProject.targetDate || 'No date'}
              </span>
            </span>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <span className="font-mono tabular-nums text-slate-200">
              {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
            </span>
          </div>
        </div>
      )}

      {/* Filter Controls Row */}
      <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
        {/* Search Input */}
        <div className="relative min-w-[200px] flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filter.search}
            onChange={(e) => setFilter((prev) => ({ ...prev, search: e.target.value }))}
            placeholder="Search tasks, descriptions..."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-7 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
          {filter.search && (
            <button
              onClick={() => setFilter((prev) => ({ ...prev, search: '' }))}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              aria-label="Clear search"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Priority Filter */}
        <select
          value={filter.priority}
          onChange={(e) =>
            setFilter((prev) => ({
              ...prev,
              priority: e.target.value as TaskPriority | 'all',
            }))
          }
          className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
        >
          {priorities.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>

        {/* Assignee Filter */}
        <select
          value={filter.assigneeId}
          onChange={(e) =>
            setFilter((prev) => ({
              ...prev,
              assigneeId: e.target.value,
            }))
          }
          className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
        >
          <option value="all">All Assignees</option>
          <option value="unassigned">Unassigned</option>
          {teamMembers.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>

        {/* Due Date Filter */}
        <select
          value={filter.dueRange}
          onChange={(e) =>
            setFilter((prev) => ({
              ...prev,
              dueRange: e.target.value as any,
            }))
          }
          className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
        >
          <option value="all">All Deadlines</option>
          <option value="overdue">Overdue Only</option>
          <option value="today">Due Today</option>
          <option value="this_week">Due This Week</option>
        </select>

        {/* Reset Filter Button */}
        {isFiltered && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-slate-100 bg-slate-900/60 hover:bg-slate-800 border border-slate-800 transition-colors"
          >
            <X className="w-3 h-3" />
            <span>Reset filters</span>
          </button>
        )}
      </div>
    </div>
  );
};
