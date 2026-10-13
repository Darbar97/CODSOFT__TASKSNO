import React, { useState } from 'react';
import {
  FolderKanban,
  CheckCircle2,
  Calendar,
  BarChart3,
  Users,
  ShieldCheck,
  ArrowRight,
  Bot,
  Sparkles,
  Zap,
  Clock,
  Layout,
  Check,
  ChevronRight,
  Layers,
  Flame,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useProjects } from '../context/ProjectContext.tsx';

interface HomePageProps {
  onLaunchApp: () => void;
  onOpenChatbot: () => void;
  onOpenDeveloperInfo?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onLaunchApp,
  onOpenChatbot,
  onOpenDeveloperInfo,
}) => {
  const { user } = useAuth();
  const { currentProject, tasks } = useProjects();
  const [activeTab, setActiveTab] = useState<'kanban' | 'timeline' | 'analytics' | 'ai'>('kanban');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500/30">
      {/* Top Bar (Strict 3-zone contract) */}
      <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 sm:px-12 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <FolderKanban className="w-4 h-4" />
          </div>
          <span className="font-bold text-lg tracking-tight text-white">
            Planning Master
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-slate-400">
          <a href="#features" className="hover:text-slate-100 transition-colors">
            Capabilities
          </a>
          <a href="#views" className="hover:text-slate-100 transition-colors">
            Views
          </a>
          <a href="#master" className="hover:text-slate-100 transition-colors flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Master</span>
          </a>
          <a href="#workflow" className="hover:text-slate-100 transition-colors">
            Architecture
          </a>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenChatbot}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-300 hover:text-white bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-800/60 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
          >
            <Bot className="w-3.5 h-3.5 text-indigo-400" />
            <span>Master</span>
          </button>

          <button
            onClick={onLaunchApp}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-lg shadow-sm transition-colors whitespace-nowrap cursor-pointer"
          >
            <span>{user ? 'Open Workspace' : 'Launch Tool'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 sm:px-12 pt-16 pb-20 max-w-6xl mx-auto w-full text-center space-y-6">
        {/* Unboxed editorial kicker */}
        <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
          <span className="text-indigo-400 font-semibold uppercase tracking-wider text-[11px]">
            Agile Project Management
          </span>
          <span aria-hidden="true">·</span>
          <span>Powered by React, Node & Gemini AI</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none text-balance">
          Orchestrate complex projects with absolute momentum.
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          The collaborative project management platform built for modern engineering and product teams. Interactive Kanban pipelines, chronological milestone roadmaps, and Gemini AI task decomposition.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
          <button
            onClick={onLaunchApp}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-medium text-xs sm:text-sm shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <FolderKanban className="w-4 h-4" />
            <span>Open Project Management Tool</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenChatbot}
            className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-200 hover:text-white font-medium text-xs sm:text-sm border border-slate-800 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Bot className="w-4 h-4 text-indigo-400" />
            <span>Ask Master</span>
          </button>
        </div>

        {/* Hero Interactive Preview Showcase */}
        <div className="pt-10 max-w-5xl mx-auto text-left">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
            {/* Mock Header Tabs */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-slate-950/80">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                <span className="text-xs font-semibold text-slate-200">
                  {currentProject?.name || 'Project Management Tool'}
                </span>
                <span className="text-[11px] text-slate-500 hidden sm:inline">
                  · {tasks.length} active tasks
                </span>
              </div>

              {/* View Switcher Tabs */}
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-[11px]">
                <button
                  onClick={() => setActiveTab('kanban')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    activeTab === 'kanban'
                      ? 'bg-slate-800 text-slate-100 font-medium'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Board
                </button>
                <button
                  onClick={() => setActiveTab('timeline')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    activeTab === 'timeline'
                      ? 'bg-slate-800 text-slate-100 font-medium'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Timeline
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    activeTab === 'analytics'
                      ? 'bg-slate-800 text-slate-100 font-medium'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Velocity
                </button>
                <button
                  onClick={() => setActiveTab('ai')}
                  className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1 ${
                    activeTab === 'ai'
                      ? 'bg-indigo-950 text-indigo-300 font-medium border border-indigo-800/80'
                      : 'text-indigo-400 hover:text-indigo-300'
                  }`}
                >
                  <Sparkles className="w-3 h-3" />
                  <span>AI Copilot</span>
                </button>
              </div>
            </div>

            {/* Mock Display Content */}
            <div className="p-5 min-h-[280px] bg-slate-950/60">
              {activeTab === 'kanban' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                      <span>TO DO</span>
                      <span className="font-mono tabular-nums">2</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-850 text-xs space-y-1">
                      <p className="font-medium text-slate-200">
                        Add export summary report & burndown telemetry
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                        <span>Low Priority</span>
                        <span>Nov 05</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs text-sky-400 font-semibold">
                      <span>IN PROGRESS</span>
                      <span className="font-mono tabular-nums">3</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-850 text-xs space-y-1.5">
                      <p className="font-medium text-slate-200">
                        Build interactive Gantt milestone timeline scheduler
                      </p>
                      <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
                        <div className="bg-sky-500 h-1 rounded-full w-[80%]" />
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                        <span>Sophia Chen</span>
                        <span className="text-sky-400 font-semibold">80%</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold">
                      <span>COMPLETED</span>
                      <span className="font-mono tabular-nums">4</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-850 text-xs space-y-1">
                      <p className="font-medium text-slate-200">
                        Configure Cloud Firestore real-time sync & rules
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-emerald-400 font-mono">
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Done
                        </span>
                        <span>100%</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'timeline' && (
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800">
                    <span className="font-mono">Task Scope</span>
                    <span className="font-mono">Schedule Interval (Oct - Nov 2026)</span>
                  </div>
                  <div className="flex items-center gap-4 py-1.5">
                    <span className="w-56 truncate font-medium text-slate-200">
                      Gantt Milestone Scheduler
                    </span>
                    <div className="flex-1 bg-slate-900 rounded-lg h-6 relative overflow-hidden border border-slate-800 p-0.5">
                      <div className="bg-sky-600/80 rounded h-full w-[70%] flex items-center px-2 text-[10px] font-mono text-white">
                        In Progress (80%)
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 py-1.5">
                    <span className="w-56 truncate font-medium text-slate-200">
                      Team Capacity Analytics
                    </span>
                    <div className="flex-1 bg-slate-900 rounded-lg h-6 relative overflow-hidden border border-slate-800 p-0.5">
                      <div className="bg-indigo-600/80 rounded h-full w-[60%] flex items-center px-2 text-[10px] font-mono text-white">
                        In Progress (70%)
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'analytics' && (
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <p className="text-slate-400 text-[11px]">Sprint Velocity</p>
                    <p className="text-xl font-bold font-mono text-emerald-400 mt-1">72%</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Delivery pace nominal</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <p className="text-slate-400 text-[11px]">Completed Tasks</p>
                    <p className="text-xl font-bold font-mono text-slate-100 mt-1">4 / 8</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">On target</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <p className="text-slate-400 text-[11px]">Overdue Items</p>
                    <p className="text-xl font-bold font-mono text-slate-100 mt-1">0</p>
                    <p className="text-[10px] text-emerald-400 mt-0.5">100% on schedule</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <p className="text-slate-400 text-[11px]">Target Milestone</p>
                    <p className="text-xl font-bold font-mono text-indigo-400 mt-1">Nov 30</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">54 days remaining</p>
                  </div>
                </div>
              )}

              {activeTab === 'ai' && (
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
                  <div className="flex items-center gap-2 text-indigo-400 font-semibold">
                    <Bot className="w-4 h-4" />
                    <span>Master Scrum Recommendation</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed font-normal">
                    "Based on current velocity for <strong>Project Management Tool</strong>, completing the <em>Gantt milestone scheduler</em> by Oct 16 unblocks QA load tests for David Kim. I recommend splitting task #8 into two smaller subtasks."
                  </p>
                  <button
                    onClick={onOpenChatbot}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-medium underline inline-flex items-center gap-1"
                  >
                    <span>Launch interactive chat session</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            {/* Card Action Banner */}
            <div className="px-5 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono text-[11px]">
                Ready to manage your own projects?
              </span>
              <button
                onClick={onLaunchApp}
                className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
              >
                <span>Launch Interactive Workspace</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Bento Grid Section */}
      <section id="features" className="px-6 sm:px-12 py-16 border-t border-slate-800/80 max-w-6xl mx-auto w-full space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
            Core Architecture
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
            Designed for execution, not administrative clutter.
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Everything your team needs to break down epics, assign tasks, enforce deadlines, and hit every release milestone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Bento Card 1 */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <FolderKanban className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">
              Dynamic Kanban Lanes
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Drag-and-drop workflow stages with quick progress steppers. Move tasks seamlessly from To Do to Completed with real-time percentage indicators.
            </p>
          </div>

          {/* Bento Card 2 */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-3">
            <div className="w-9 h-9 rounded-xl bg-sky-600/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">
              Milestone Gantt Roadmaps
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Visualize duration, deadline constraints, and delivery pacing plotted along a clear chronological axis without spreadsheet friction.
            </p>
          </div>

          {/* Bento Card 3 */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">
              Delivery Velocity & Burndown
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Instant burndown completion rates, overdue deadline counters, and team capacity monitors ensuring no engineer gets overloaded.
            </p>
          </div>
        </div>
      </section>

      {/* Master Section */}
      <section id="master" className="px-6 sm:px-12 py-16 border-t border-slate-800/80 bg-slate-900/30">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-950/80 border border-indigo-800/80 text-indigo-400 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Built-in Gemini AI Scrum Master</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Master: Your Technical Project Copilot.
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Master connects directly to your workspace. It can break down vague requirements into well-structured Kanban tasks with clear priorities, estimate delivery deadlines, generate acceptance criteria, and optimize team allocation.
            </p>
            <div className="pt-2">
              <button
                onClick={onOpenChatbot}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Bot className="w-4 h-4" />
                <span>Chat with Master Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="w-full md:w-96 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
            <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
              <span className="font-semibold text-slate-200">Master Chat Demo</span>
              <span className="font-mono text-[10px] text-indigo-400">gemini-3.5-flash</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
                <p className="text-[11px] text-slate-500 font-medium">User Prompt:</p>
                <p className="mt-0.5 font-medium">
                  "Break down our Project Management Tool user authentication epic."
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-800/60 text-slate-200 space-y-1">
                <p className="text-[11px] text-indigo-400 font-medium">Master Output:</p>
                <p className="text-[11px]">1. Task: Google OAuth Sign-In (Urgent, 2d)</p>
                <p className="text-[11px]">2. Task: Firestore RBAC Security Rules (High, 3d)</p>
                <p className="text-[11px]">3. Task: Session Profile State & Fallback (Medium, 1d)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="px-6 sm:px-12 py-16 border-t border-slate-800/80 text-center space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Ready to manage your projects with speed?
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
          Jump into the interactive Project Management Tool workspace and start tracking your milestones today.
        </p>
        <div className="pt-2">
          <button
            onClick={onLaunchApp}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs sm:text-sm shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Launch Project Management Tool</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Footer with Developer Info & Copyright */}
      <footer className="px-6 py-8 border-t border-slate-800/80 bg-slate-950 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4 max-w-6xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <FolderKanban className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-slate-200">Planning Master</span>
          </div>
          <span className="hidden sm:inline text-slate-700">·</span>
          <span className="text-slate-400">
            &copy; 2026 Planning Master. All rights reserved.
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-[11px]">
          {onOpenDeveloperInfo && (
            <button
              onClick={onOpenDeveloperInfo}
              className="text-indigo-400 hover:text-indigo-300 font-medium underline underline-offset-2 transition-colors cursor-pointer"
            >
              Developer: Prem Parmar
            </button>
          )}
          <span className="text-slate-700">·</span>
          <span className="text-slate-500">React 19 & Tailwind</span>
          <span className="text-slate-700">·</span>
          <span className="text-slate-500">Cloud Firestore</span>
          <span className="text-slate-700">·</span>
          <span className="text-slate-500">Gemini AI</span>
        </div>
      </footer>
    </div>
  );
};
