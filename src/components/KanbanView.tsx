import React, { useState } from 'react';
import { Plus, CheckCircle2, Circle, Clock, CheckCheck, FolderOpen } from 'lucide-react';
import { Task, TaskStatus } from '../types/index.ts';
import { useProjects } from '../context/ProjectContext.tsx';
import { TaskCard } from './TaskCard.tsx';

interface KanbanViewProps {
  onSelectTask: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onQuickAddTask: (status: TaskStatus) => void;
}

export const KanbanView: React.FC<KanbanViewProps> = ({
  onSelectTask,
  onEditTask,
  onQuickAddTask,
}) => {
  const { filteredTasks, moveTaskStatus } = useProjects();
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);

  const columns: { id: TaskStatus; title: string; color: string; icon: React.ReactNode }[] = [
    {
      id: 'todo',
      title: 'To Do',
      color: 'border-slate-700/80 text-slate-300',
      icon: <Circle className="w-3.5 h-3.5 text-slate-400" />,
    },
    {
      id: 'in_progress',
      title: 'In Progress',
      color: 'border-sky-500/50 text-sky-400',
      icon: <Clock className="w-3.5 h-3.5 text-sky-400" />,
    },
    {
      id: 'review',
      title: 'In Review',
      color: 'border-amber-500/50 text-amber-400',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />,
    },
    {
      id: 'done',
      title: 'Completed',
      color: 'border-emerald-500/50 text-emerald-400',
      icon: <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />,
    },
  ];

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
    setDraggedTaskId(taskId);
  };

  const handleDragOver = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    setDragOverColumn(status);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = async (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    setDragOverColumn(null);
    setDraggedTaskId(null);
    if (taskId) {
      await moveTaskStatus(taskId, status);
    }
  };

  return (
    <div className="flex-1 overflow-x-auto p-4 sm:p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 min-w-[320px] max-w-7xl mx-auto items-start">
        {columns.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.id);
          const isOver = dragOverColumn === col.id;

          return (
            <div
              key={col.id}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, col.id)}
              className={`flex flex-col bg-slate-950/40 rounded-2xl border transition-colors ${
                isOver ? 'border-indigo-500/80 bg-slate-900/50' : 'border-slate-800/80'
              } p-3.5 min-h-[500px]`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  {col.icon}
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
                    {col.title}
                  </h3>
                  <span className="font-mono tabular-nums text-xs text-slate-500 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">
                    {colTasks.length}
                  </span>
                </div>

                <button
                  onClick={() => onQuickAddTask(col.id)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
                  title={`Add task to ${col.title}`}
                  aria-label={`Add task to ${col.title}`}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Task Cards Column Stack */}
              <div className="flex-1 py-3 space-y-3 overflow-y-auto">
                {colTasks.length === 0 ? (
                  <div className="h-36 flex flex-col items-center justify-center text-center border border-dashed border-slate-800/80 rounded-xl p-4 text-slate-500 text-xs">
                    <p>No tasks in this lane</p>
                    <button
                      onClick={() => onQuickAddTask(col.id)}
                      className="mt-2 text-indigo-400 hover:text-indigo-300 font-medium"
                    >
                      + Create task
                    </button>
                  </div>
                ) : (
                  colTasks.map((task) => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                    >
                      <TaskCard
                        task={task}
                        onSelect={onSelectTask}
                        onEdit={onEditTask}
                      />
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
