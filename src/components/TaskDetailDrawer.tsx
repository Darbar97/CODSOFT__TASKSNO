import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  User,
  Tag,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Edit,
  ArrowRight,
} from 'lucide-react';
import { Task, TaskPriority, TaskStatus } from '../types/index.ts';
import { useProjects } from '../context/ProjectContext.tsx';

interface TaskDetailDrawerProps {
  task: Task | null;
  onClose: () => void;
  onEdit: (task: Task) => void;
}

export const TaskDetailDrawer: React.FC<TaskDetailDrawerProps> = ({
  task,
  onClose,
  onEdit,
}) => {
  const {
    moveTaskStatus,
    updateTaskProgress,
    deleteTask,
    teamMembers,
    currentProject,
  } = useProjects();

  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!task) return null;

  const assignee = teamMembers.find((m) => m.id === task.assigneeId);

  const isOverdue = () => {
    if (!task.dueDate || task.status === 'done') return false;
    const today = new Date().toISOString().split('T')[0];
    return task.dueDate < today;
  };

  const getPriorityLabel = (p: TaskPriority) => {
    switch (p) {
      case 'urgent':
        return <span className="text-rose-400 font-semibold">Urgent</span>;
      case 'high':
        return <span className="text-amber-400 font-semibold">High Priority</span>;
      case 'medium':
        return <span className="text-sky-400 font-medium">Medium Priority</span>;
      case 'low':
      default:
        return <span className="text-slate-400 font-medium">Low Priority</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/40 backdrop-blur-xs">
      <div
        className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl p-6 overflow-y-auto space-y-6 text-xs text-slate-300 animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-slate-400">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: currentProject?.color || '#6366F1' }}
            />
            <span className="font-medium text-slate-300 truncate max-w-[200px]">
              {currentProject?.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(task)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800"
              title="Edit task"
              aria-label="Edit task"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (confirmDelete) {
                  deleteTask(task.id);
                  onClose();
                } else {
                  setConfirmDelete(true);
                  setTimeout(() => setConfirmDelete(false), 3000);
                }
              }}
              className={`p-1.5 rounded-lg transition-colors ${
                confirmDelete
                  ? 'bg-rose-950 text-rose-300 ring-1 ring-rose-500'
                  : 'text-rose-400 hover:text-rose-300 hover:bg-slate-800'
              }`}
              title={confirmDelete ? 'Click again to confirm delete' : 'Delete task'}
              aria-label="Delete task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800"
              aria-label="Close drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Title */}
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-100 leading-snug">
            {task.title}
          </h2>
          <div className="flex items-center gap-2 mt-2">
            {getPriorityLabel(task.priority)}
            <span aria-hidden="true">·</span>
            <span className="text-slate-400 capitalize">
              {task.status.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Quick Status Selector */}
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Workflow Stage
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(['todo', 'in_progress', 'review', 'done'] as TaskStatus[]).map((st) => (
              <button
                key={st}
                onClick={() => moveTaskStatus(task.id, st)}
                className={`py-1.5 px-3 rounded-lg font-medium text-xs transition-colors capitalize ${
                  task.status === st
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-850 hover:text-slate-200'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Progress Adjuster */}
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Task Progress
            </label>
            <span className="font-mono tabular-nums text-sm font-bold text-slate-100">
              {task.progress}%
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
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
            onChange={(e) => updateTaskProgress(task.id, parseInt(e.target.value, 10))}
            className="w-full accent-indigo-500 cursor-pointer pt-1"
          />
        </div>

        {/* Meta Grid: Assignee & Deadline */}
        <div className="grid grid-cols-2 gap-3">
          {/* Assignee */}
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Assignee
            </p>
            {assignee ? (
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-inner"
                  style={{ backgroundColor: assignee.avatarColor }}
                >
                  {assignee.name.charAt(0)}
                </div>
                <div className="truncate">
                  <p className="text-slate-200 font-medium truncate">{assignee.name}</p>
                  <p className="text-[10px] text-slate-500 truncate">{assignee.role}</p>
                </div>
              </div>
            ) : (
              <p className="text-slate-500 italic">Unassigned</p>
            )}
          </div>

          {/* Deadline */}
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Deadline
            </p>
            <div className="flex items-center gap-1.5 font-mono tabular-nums">
              <Calendar
                className={`w-4 h-4 ${isOverdue() ? 'text-rose-400' : 'text-slate-400'}`}
              />
              <span className={isOverdue() ? 'text-rose-400 font-semibold' : 'text-slate-200'}>
                {task.dueDate || 'No date'}
              </span>
            </div>
            {isOverdue() && (
              <p className="text-[10px] text-rose-500 font-medium mt-0.5">Overdue</p>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <h4 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Description & Notes
          </h4>
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-slate-300 leading-relaxed font-normal whitespace-pre-wrap min-h-[80px]">
            {task.description || (
              <span className="text-slate-500 italic">No description provided.</span>
            )}
          </div>
        </div>

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="space-y-1.5">
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Tags & Labels
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {task.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[11px] font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Timestamps */}
        <div className="pt-4 border-t border-slate-800/60 text-[11px] text-slate-500 space-y-1 font-mono tabular-nums">
          <p>Created: {new Date(task.createdAt).toLocaleString()}</p>
          <p>Last Modified: {new Date(task.updatedAt).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};
