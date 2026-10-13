import React, { useState } from 'react';
import {
  FolderKanban,
  Plus,
  LogIn,
  LogOut,
  User,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useProjects } from '../context/ProjectContext.tsx';
import { ViewMode } from '../types/index.ts';

interface HeaderProps {
  onOpenNewTask: () => void;
  onOpenNewProject: () => void;
  onNavigateHome?: () => void;
  onOpenChatbot?: () => void;
  onOpenDeveloperInfo?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNewTask,
  onOpenNewProject,
  onNavigateHome,
  onOpenChatbot,
  onOpenDeveloperInfo,
}) => {
  const { user, signInWithGoogle, signOutUser, continueAsGuest } = useAuth();
  const { currentProject, viewMode, setViewMode } = useProjects();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navItems: { id: ViewMode; label: string }[] = [
    { id: 'kanban', label: 'Board' },
    { id: 'list', label: 'List' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'analytics', label: 'Analytics' },
  ];

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-4 sm:px-6 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      {/* Zone 1: Brand Wordmark */}
      <div className="flex items-center gap-3">
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2.5 text-slate-100 hover:text-white transition-colors group text-left cursor-pointer"
          title="Return to Home page"
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600/30 transition-colors">
            <FolderKanban className="w-4 h-4" />
          </div>
          <span className="font-semibold tracking-tight text-base sm:text-lg">
            Planning Master
          </span>
        </button>

        {currentProject && (
          <div className="hidden lg:flex items-center text-xs text-slate-400 pl-3 border-l border-slate-800">
            <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: currentProject.color }} />
            <span className="font-medium text-slate-200 truncate max-w-[200px]">
              {currentProject.name}
            </span>
          </div>
        )}
      </div>

      {/* Zone 2: Navigation Links (View Selectors) */}
      <nav className="flex items-center gap-1 sm:gap-2">
        {navItems.map((item) => {
          const isActive = viewMode === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setViewMode(item.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-slate-800 text-slate-100 shadow-sm border border-slate-700/60'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Zone 3: Primary Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Gemini AI Copilot button */}
        {onOpenChatbot && (
          <button
            onClick={onOpenChatbot}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-indigo-300 hover:text-white bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-800/60 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            title="Open Master AI Copilot"
          >
            <FolderKanban className="hidden" />
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse sm:hidden" />
            <span className="hidden sm:inline">Master</span>
            <span className="sm:hidden">Master</span>
          </button>
        )}

        <button
          onClick={onOpenNewTask}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-lg shadow-sm transition-colors whitespace-nowrap cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Task</span>
          <span className="sm:hidden">Task</span>
        </button>

        {/* User Account / Auth trigger */}
        <div className="relative">
          {user ? (
            <button
              onClick={() => setShowProfileMenu((prev) => !prev)}
              className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-900 text-slate-300 transition-colors focus:outline-none focus:ring-1 focus:ring-indigo-500"
              aria-label="User profile"
            >
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="w-7 h-7 rounded-full object-cover border border-slate-700"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-indigo-950 border border-indigo-700 text-indigo-300 flex items-center justify-center text-xs font-medium">
                  {user.displayName?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
            </button>
          ) : (
            <button
              onClick={signInWithGoogle}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-colors whitespace-nowrap"
            >
              <LogIn className="w-3.5 h-3.5 text-slate-400" />
              <span>Sign In</span>
            </button>
          )}

          {/* Profile Dropdown */}
          {showProfileMenu && user && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-800 shadow-xl py-2 px-1 z-50 text-xs text-slate-300">
              <div className="px-3 py-2 border-b border-slate-800">
                <p className="font-semibold text-slate-100 truncate">{user.displayName}</p>
                <p className="text-slate-400 truncate text-[11px]">{user.email}</p>
                {user.isGuest ? (
                  <span className="inline-block mt-1 text-[10px] text-amber-400 font-medium">
                    Guest Workspace Mode
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 mt-1 text-[10px] text-emerald-400 font-medium">
                    <ShieldCheck className="w-3 h-3" />
                    Connected via Firebase
                  </span>
                )}
              </div>

              <div className="pt-1">
                <button
                  onClick={() => {
                    onOpenNewProject();
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-2"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Project</span>
                </button>

                {user.isGuest && (
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      signInWithGoogle();
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-2"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Connect Google Account</span>
                  </button>
                )}

                {onOpenDeveloperInfo && (
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onOpenDeveloperInfo();
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Developer & Copyright Info</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    signOutUser();
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
