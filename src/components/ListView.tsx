import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  ArrowUpDown,
  MoreVertical,
  CheckCircle2,
  Trash2,
  Edit,
  ArrowRight,
  Circle,
} from 'lucide-react';
import { Task, TaskPriority, TaskStatus } from '../types/index.ts';
import { useProjects } from '../context/ProjectContext.tsx';

interface ListViewProps {
  onSelectTask: (task: Task) => void;
  onEditTask: (task: Task) => void;
}

type SortField = 'title' | 'dueDate' | 'priority' | 'progress' | 'status';
type SortOrder = 'asc' | 'desc';

export const ListView: React.FC<ListViewProps> = ({ onSelectTask, onEditTask }) => {
  const { filteredTasks, moveTaskStatus, updateTaskProgress, deleteTask, teamMembers } =
    useProjects();

  const [sortField, setSortField] = useState<SortField>('dueDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const priorityWeights: Record<TaskPriority, number> = {
    urgent: 4,
    high: 3,
    medium: 2,
    low: 1,
  };

  const statusWeights: Record<TaskStatus, number> = {
    todo: 1,
    in_progress: 2,
    review: 3,
    done: 4,
  };

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    let comparison = 0;
    if (sortField === 'title') {
      comparison = a.title.localeCompare(b.title);
    } else if (sortField === 'dueDate') {
      comparison = (a.dueDate || '').localeCompare(b.dueDate || '');
    } else if (sortField === 'priority') {
      comparison = priorityWeights[b.priority] - priorityWeights[a.priority];
    } else if (sortField === 'progress') {
      comparison = a.progress - b.progress;
    } else if (sortField === 'status') {
      comparison = statusWeights[a.status] - statusWeights[b.status];
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case 'urgent':
        return <span className="text-rose-400 font-medium">Urgent</span>;
      case 'high':
        return <span className="text-amber-400 font-medium">High</span>;
      case 'medium':
        return <span className="text-sky-400">Medium</span>;
      case 'low':
      default:
        return <span className="text-slate-400">Low</span>;
    }
  };

  const isOverdue = (task: Task) => {
    if (!task.dueDate || task.status === 'done') return false;
    const today = new Date().toISOString().split('T')[0];
    return task.dueDate < today;
  };

  return (
    <div className="flex-1 p-4 sm:p-6 overflow-x-auto">
      <div className="max-w-7xl mx-auto bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs border-collapse">
          {/* Table Header */}
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 font-medium">
              <th
                onClick={() => toggleSort('status')}
                className="py-3 px-4 cursor-pointer hover:text-slate-200 select-none w-32"
              >
                <div className="flex items-center gap-1.5">
                  <span>Status</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th
                onClick={() => toggleSort('title')}
                className="py-3 px-4 cursor-pointer hover:text-slate-200 select-none min-w-[220px]"
              >
                <div className="flex items-center gap-1.5">
                  <span>Task Title</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th
                onClick={() => toggleSort('priority')}
                className="py-3 px-4 cursor-pointer hover:text-slate-200 select-none w-28"
              >
                <div className="flex items-center gap-1.5">
                  <span>Priority</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th className="py-3 px-4 w-40">Assignee</th>
              <th
                onClick={() => toggleSort('dueDate')}
                className="py-3 px-4 cursor-pointer hover:text-slate-200 select-none w-36"
              >
                <div className="flex items-center gap-1.5">
                  <span>Deadline</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th
                onClick={() => toggleSort('progress')}
                className="py-3 px-4 cursor-pointer hover:text-slate-200 select-none w-44"
              >
                <div className="flex items-center gap-1.5">
                  <span>Progress</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th className="py-3 px-4 text-right w-20">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-800/60">
            {sortedTasks.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-slate-500 text-xs">
                  No matching tasks found. Adjust filters or create a new task.
                </td>
              </tr>
            ) : (
              sortedTasks.map((task) => {
                const assignee = teamMembers.find((m) => m.id === task.assigneeId);
                const overdue = isOverdue(task);

                return (
                  <tr
                    key={task.id}
                    onClick={() => onSelectTask(task)}
                    className="hover:bg-slate-800/40 transition-colors cursor-pointer group h-12"
                  >
                    {/* Status Column with quick select */}
                    <td className="py-2.5 px-4" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={task.status}
                        onChange={(e) => moveTaskStatus(task.id, e.target.value as TaskStatus)}
                        className={`bg-slate-900 border border-slate-700/80 rounded-md px-2 py-1 text-xs focus:outline-none focus:border-indigo-500 font-medium ${
                          task.status === 'done'
                            ? 'text-emerald-400'
                            : task.status === 'in_progress'
                            ? 'text-sky-400'
                            : task.status === 'review'
                            ? 'text-amber-400'
                            : 'text-slate-300'
                        }`}
                      >
                        <option value="todo">To Do</option>
                        <option value="in_progress">In Progress</option>
                        <option value="review">In Review</option>
                        <option value="done">Completed</option>
                      </select>
                    </td>

                    {/* Title & Tags */}
                    <td className="py-2.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-200 group-hover:text-white line-clamp-1">
                          {task.title}
                        </span>
                        {task.tags && task.tags.length > 0 && (
                          <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-slate-400">
                            {task.tags.map((t) => (
                              <span key={t} className="text-slate-400">
                                #{t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Priority */}
                    <td className="py-2.5 px-4">{getPriorityBadge(task.priority)}</td>

                    {/* Assignee */}
                    <td className="py-2.5 px-4">
                      {assignee ? (
                        <div className="flex items-center gap-2">
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold text-white shrink-0"
                            style={{ backgroundColor: assignee.avatarColor }}
                          >
                            {assignee.name.charAt(0)}
                          </div>
                          <span className="text-slate-300 truncate max-w-[110px]">
                            {assignee.name}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-500 italic">Unassigned</span>
                      )}
                    </td>

                    {/* Due Date */}
                    <td className="py-2.5 px-4 font-mono tabular-nums">
                      <span className={overdue ? 'text-rose-400 font-medium' : 'text-slate-300'}>
                        {task.dueDate || '—'}
                      </span>
                      {overdue && (
                        <span className="ml-1 text-[10px] text-rose-500 uppercase tracking-tight">
                          late
                        </span>
                      )}
                    </td>

                    {/* Progress Slider / Meter */}
                    <td className="py-2.5 px-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2.5">
                        <div className="flex-1 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-1.5 rounded-full ${
                              task.status === 'done'
                                ? 'bg-emerald-500'
                                : task.progress > 60
                                ? 'bg-indigo-500'
                                : 'bg-sky-500'
                            }`}
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="5"
                          value={task.progress}
                          onChange={(e) =>
                            updateTaskProgress(task.id, parseInt(e.target.value, 10))
                          }
                          className="w-16 accent-indigo-500 h-1 bg-transparent cursor-pointer"
                          title="Adjust progress"
                        />
                        <span className="font-mono tabular-nums text-slate-400 w-8 text-right text-[11px]">
                          {task.progress}%
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td
                      className="py-2.5 px-4 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onEditTask(task)}
                          className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200"
                          title="Edit task"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete task "${task.title}"?`)) {
                              deleteTask(task.id);
                            }
                          }}
                          className="p-1 rounded hover:bg-slate-800 text-rose-400 hover:text-rose-300"
                          title="Delete task"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
