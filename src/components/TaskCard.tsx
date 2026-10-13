import React from 'react';
import {
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
  MoreHorizontal,
  Trash2,
  Edit,
} from 'lucide-react';
import { Task, TaskPriority, TaskStatus } from '../types/index.ts';
import { useProjects } from '../context/ProjectContext.tsx';

interface TaskCardProps {
  task: Task;
  onSelect: (task: Task) => void;
  onEdit: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onSelect, onEdit }) => {
  const { moveTaskStatus, deleteTask, teamMembers } = useProjects();

  const assignee = teamMembers.find((m) => m.id === task.assigneeId);

  const getPriorityStyle = (priority: TaskPriority) => {
    switch (priority) {
      case 'urgent':
        return { text: 'text-rose-400', dot: 'bg-rose-500', label: 'Urgent' };
      case 'high':
        return { text: 'text-amber-400', dot: 'bg-amber-500', label: 'High' };
      case 'medium':
        return { text: 'text-sky-400', dot: 'bg-sky-500', label: 'Medium' };
      case 'low':
      default:
        return { text: 'text-slate-400', dot: 'bg-slate-500', label: 'Low' };
    }
  };

  const isOverdue = () => {
    if (!task.dueDate || task.status === 'done') return false;
    const today = new Date().toISOString().split('T')[0];
    return task.dueDate < today;
  };

  const priorityStyle = getPriorityStyle(task.priority);

  const statusNext: Record<TaskStatus, TaskStatus | null> = {
    todo: 'in_progress',
    in_progress: 'review',
    review: 'done',
    done: null,
  };

  const statusPrev: Record<TaskStatus, TaskStatus | null> = {
    todo: null,
    in_progress: 'todo',
    review: 'in_progress',
    done: 'review',
  };

  return (
    <div
      onClick={() => onSelect(task)}
      className="group relative bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-xl p-3.5 space-y-3 shadow-sm hover:shadow-md transition-all cursor-pointer"
    >
      {/* Priority and Actions line */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${priorityStyle.dot}`} />
          <span className={`font-medium text-[11px] uppercase tracking-wider ${priorityStyle.text}`}>
            {priorityStyle.label}
          </span>
        </div>

        {/* Quick status stepper controls */}
        <div
          className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity"
          onClick={(e) => e.stopPropagation()}
        >
          {statusPrev[task.status] && (
            <button
              onClick={() => moveTaskStatus(task.id, statusPrev[task.status]!)}
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200"
              title={`Move to ${statusPrev[task.status]}`}
              aria-label="Move previous"
            >
              <ArrowLeft className="w-3 h-3" />
            </button>
          )}
          {statusNext[task.status] && (
            <button
              onClick={() => moveTaskStatus(task.id, statusNext[task.status]!)}
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200"
              title={`Move to ${statusNext[task.status]}`}
              aria-label="Move next"
            >
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
          <button
            onClick={() => onEdit(task)}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200"
            title="Edit task"
            aria-label="Edit task"
          >
            <Edit className="w-3 h-3" />
          </button>
          <button
            onClick={() => {
              if (window.confirm(`Delete task "${task.title}"?`)) {
                deleteTask(task.id);
              }
            }}
            className="p-1 rounded hover:bg-slate-800 text-rose-400 hover:text-rose-300"
            title="Delete task"
            aria-label="Delete task"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Title & Description */}
      <div>
        <h4 className="text-xs sm:text-sm font-semibold text-slate-100 group-hover:text-white line-clamp-2 leading-snug">
          {task.title}
        </h4>
        {task.description && (
          <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed font-normal">
            {task.description}
          </p>
        )}
      </div>

      {/* Tags (Zero-Pill: subtle clean inline text) */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400">
          {task.tags.map((tag, idx) => (
            <span
              key={tag}
              className="px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-300 text-[10px] font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Progress Bar */}
      <div className="space-y-1 pt-0.5">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>Progress</span>
          <span className="font-mono tabular-nums text-slate-300 font-medium">
            {task.progress}%
          </span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-1.5 rounded-full transition-all duration-300 ${
              task.status === 'done'
                ? 'bg-emerald-500'
                : task.progress > 60
                ? 'bg-indigo-500'
                : 'bg-sky-500'
            }`}
            style={{ width: `${task.progress}%` }}
          />
        </div>
      </div>

      {/* Bottom Footer: Deadline and Assignee */}
      <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/60">
        {/* Due Date */}
        <div className="flex items-center gap-1.5">
          <Calendar
            className={`w-3.5 h-3.5 ${
              isOverdue() ? 'text-rose-400' : 'text-slate-500'
            }`}
          />
          <span
            className={`font-mono tabular-nums text-[11px] ${
              isOverdue()
                ? 'text-rose-400 font-medium'
                : 'text-slate-400'
            }`}
          >
            {task.dueDate || 'No deadline'}
          </span>
        </div>

        {/* Assignee Avatar / Name */}
        <div className="flex items-center gap-1.5">
          {assignee ? (
            <div className="flex items-center gap-1.5" title={assignee.name}>
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold text-white shadow-inner"
                style={{ backgroundColor: assignee.avatarColor }}
              >
                {assignee.name.charAt(0)}
              </div>
              <span className="text-[11px] text-slate-400 max-w-[80px] truncate">
                {assignee.name.split(' ')[0]}
              </span>
            </div>
          ) : (
            <span className="text-[11px] text-slate-500 italic">Unassigned</span>
          )}
        </div>
      </div>
    </div>
  );
};
