import React, { useState } from 'react';
import {
  Folder,
  Plus,
  Users,
  Calendar,
  CheckCircle,
  MoreVertical,
  Trash2,
  Edit2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useProjects } from '../context/ProjectContext.tsx';
import { Project } from '../types/index.ts';

interface SidebarProps {
  onOpenNewProject: () => void;
  onEditProject: (project: Project) => void;
  onOpenDeveloperInfo?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onOpenNewProject,
  onEditProject,
  onOpenDeveloperInfo,
}) => {
  const {
    projects,
    currentProject,
    setCurrentProjectId,
    allTasks,
    deleteProject,
    teamMembers,
  } = useProjects();

  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const getProjectTaskCounts = (projectId: string) => {
    const tasks = allTasks.filter((t) => t.projectId === projectId);
    const completed = tasks.filter((t) => t.status === 'done').length;
    return { total: tasks.length, completed };
  };

  const calculateTotalProgress = () => {
    if (allTasks.length === 0) return 0;
    const completed = allTasks.filter((t) => t.status === 'done').length;
    return Math.round((completed / allTasks.length) * 100);
  };

  return (
    <aside className="w-64 shrink-0 bg-slate-950 border-r border-slate-800/80 flex flex-col h-[calc(100vh-3.5rem)] overflow-hidden">
      {/* Workspace Quick Velocity Banner */}
      <div className="p-4 border-b border-slate-800/60">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span className="font-medium text-slate-300">Workspace Velocity</span>
          <span className="font-mono tabular-nums text-slate-200">
            {calculateTotalProgress()}%
          </span>
        </div>
        <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${calculateTotalProgress()}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
          <span>{allTasks.length} total tasks</span>
          <span>{allTasks.filter((t) => t.status === 'done').length} completed</span>
        </div>
      </div>

      {/* Projects List Section */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        <div className="flex items-center justify-between px-2 py-1.5 text-xs text-slate-400">
          <span className="font-semibold uppercase tracking-wider text-[11px] text-slate-500">
            Projects ({projects.length})
          </span>
          <button
            onClick={onOpenNewProject}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title="Create new project"
            aria-label="Add project"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-0.5">
          {projects.map((proj) => {
            const isSelected = currentProject?.id === proj.id;
            const counts = getProjectTaskCounts(proj.id);
            const isMenuOpen = menuOpenId === proj.id;

            return (
              <div
                key={proj.id}
                className={`group relative flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800/90 text-slate-100 font-medium'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
                onClick={() => setCurrentProjectId(proj.id)}
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-1">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: proj.color || '#6366F1' }}
                  />
                  <div className="truncate">
                    <p className="truncate text-xs">{proj.name}</p>
                    <p className="text-[10px] text-slate-500 font-normal">
                      {counts.completed}/{counts.total} done
                    </p>
                  </div>
                </div>

                {/* Project action dropdown */}
                <div className="relative shrink-0 flex items-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpenId(isMenuOpen ? null : proj.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-slate-200 rounded transition-opacity"
                    aria-label="Project options"
                  >
                    <MoreVertical className="w-3.5 h-3.5" />
                  </button>

                  {isMenuOpen && (
                    <div
                      className="absolute right-0 top-6 w-32 bg-slate-900 border border-slate-700/80 rounded-lg shadow-xl py-1 z-30"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => {
                          setMenuOpenId(null);
                          onEditProject(proj);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      {projects.length > 1 && (
                        <button
                          onClick={() => {
                            setMenuOpenId(null);
                            if (window.confirm(`Delete project "${proj.name}"? Tasks will also be removed.`)) {
                              deleteProject(proj.id);
                            }
                          }}
                          className="w-full text-left px-3 py-1.5 text-xs text-rose-400 hover:bg-slate-800 flex items-center gap-2"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Team Members Roster */}
        <div className="pt-4 mt-4 border-t border-slate-800/60">
          <div className="px-2 py-1 text-xs font-semibold uppercase tracking-wider text-[11px] text-slate-500 flex items-center gap-1.5">
            <Users className="w-3 h-3" />
            <span>Team ({teamMembers.length})</span>
          </div>

          <div className="mt-1 space-y-1">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs text-slate-400 hover:bg-slate-900/40"
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold text-white shrink-0"
                  style={{ backgroundColor: member.avatarColor }}
                >
                  {member.name.charAt(0)}
                </div>
                <div className="truncate">
                  <p className="text-slate-300 truncate text-[11px] font-medium leading-tight">
                    {member.name}
                  </p>
                  <p className="text-slate-500 truncate text-[10px] leading-tight">
                    {member.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer info & Copyright */}
      <div className="p-3 border-t border-slate-800/60 space-y-1.5 text-[11px] text-slate-500">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-slate-400" />
            <span>Milestones</span>
          </span>
          {currentProject && (
            <span className="font-mono tabular-nums text-slate-400 text-[10px]">
              Target: {currentProject.targetDate}
            </span>
          )}
        </div>

        <div className="pt-1.5 border-t border-slate-900 flex items-center justify-between text-[10px]">
          <span>&copy; 2026 Planning Master</span>
          <button
            onClick={onOpenDeveloperInfo}
            className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium cursor-pointer"
          >
            Prem Parmar
          </button>
        </div>
      </div>
    </aside>
  );
};
