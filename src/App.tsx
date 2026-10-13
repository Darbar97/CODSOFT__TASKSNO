import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { ProjectProvider, useProjects } from './context/ProjectContext.tsx';
import { Header } from './components/Header.tsx';
import { Sidebar } from './components/Sidebar.tsx';
import { TaskFilterBar } from './components/TaskFilterBar.tsx';
import { KanbanView } from './components/KanbanView.tsx';
import { ListView } from './components/ListView.tsx';
import { TimelineView } from './components/TimelineView.tsx';
import { AnalyticsView } from './components/AnalyticsView.tsx';
import { TaskModal } from './components/TaskModal.tsx';
import { ProjectModal } from './components/ProjectModal.tsx';
import { TaskDetailDrawer } from './components/TaskDetailDrawer.tsx';
import { LoginPage } from './components/LoginPage.tsx';
import { HomePage } from './components/HomePage.tsx';
import { GeminiChatbot } from './components/GeminiChatbot.tsx';
import { DeveloperModal } from './components/DeveloperModal.tsx';
import { Project, Task, TaskStatus } from './types/index.ts';
import { Menu, X, Plus, FolderKanban, Bot } from 'lucide-react';

interface DashboardContentProps {
  onNavigateHome: () => void;
  onOpenChatbot: () => void;
  onOpenDeveloperInfo: () => void;
}

function DashboardContent({
  onNavigateHome,
  onOpenChatbot,
  onOpenDeveloperInfo,
}: DashboardContentProps) {
  const { viewMode, currentProject } = useProjects();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [quickAddStatus, setQuickAddStatus] = useState<TaskStatus>('todo');

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);

  const [selectedTaskDetail, setSelectedTaskDetail] = useState<Task | null>(null);

  const handleOpenNewTask = (status: TaskStatus = 'todo') => {
    setTaskToEdit(null);
    setQuickAddStatus(status);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setIsTaskModalOpen(true);
  };

  const handleOpenNewProject = () => {
    setProjectToEdit(null);
    setIsProjectModalOpen(true);
  };

  const handleEditProject = (proj: Project) => {
    setProjectToEdit(proj);
    setIsProjectModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30">
      {/* Top Bar */}
      <Header
        onOpenNewTask={() => handleOpenNewTask('todo')}
        onOpenNewProject={handleOpenNewProject}
        onNavigateHome={onNavigateHome}
        onOpenChatbot={onOpenChatbot}
        onOpenDeveloperInfo={onOpenDeveloperInfo}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Mobile Sidebar Overlay Backdrop */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/60 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar Navigation */}
        <div
          className={`fixed md:static inset-y-0 left-0 z-40 transform ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 transition-transform duration-200 ease-in-out`}
        >
          <Sidebar
            onOpenNewProject={handleOpenNewProject}
            onEditProject={handleEditProject}
            onOpenDeveloperInfo={onOpenDeveloperInfo}
          />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 bg-slate-950 overflow-y-auto">
          {/* Mobile project & sidebar toggle bar */}
          <div className="md:hidden flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs">
            <button
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              className="flex items-center gap-1.5 p-1.5 rounded-lg text-slate-300 hover:bg-slate-800"
            >
              <Menu className="w-4 h-4" />
              <span>Projects</span>
            </button>
            {currentProject && (
              <span className="font-medium text-slate-200 truncate max-w-[200px]">
                {currentProject.name}
              </span>
            )}
          </div>

          {/* Contextual Filter Bar */}
          <TaskFilterBar />

          {/* Dynamic View Modes */}
          <div className="flex-1 flex flex-col min-h-0">
            {viewMode === 'kanban' && (
              <KanbanView
                onSelectTask={setSelectedTaskDetail}
                onEditTask={handleEditTask}
                onQuickAddTask={(status) => handleOpenNewTask(status)}
              />
            )}

            {viewMode === 'list' && (
              <ListView
                onSelectTask={setSelectedTaskDetail}
                onEditTask={handleEditTask}
              />
            )}

            {viewMode === 'timeline' && (
              <TimelineView onSelectTask={setSelectedTaskDetail} />
            )}

            {viewMode === 'analytics' && <AnalyticsView />}
          </div>
        </main>
      </div>

      {/* Modals & Slide-over Drawer */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        taskToEdit={taskToEdit}
        initialStatus={quickAddStatus}
      />

      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        projectToEdit={projectToEdit}
      />

      <TaskDetailDrawer
        task={selectedTaskDetail}
        onClose={() => setSelectedTaskDetail(null)}
        onEdit={(task) => {
          setSelectedTaskDetail(null);
          handleEditTask(task);
        }}
      />
    </div>
  );
}

function MainView() {
  const { user, loading, continueAsGuest } = useAuth();
  const [currentPage, setCurrentPage] = useState<'home' | 'workspace' | 'login'>('home');
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isDeveloperModalOpen, setIsDeveloperModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 gap-3">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-mono text-slate-400">Loading Planning Master workspace...</span>
      </div>
    );
  }

  const handleLaunchApp = () => {
    if (user) {
      setCurrentPage('workspace');
    } else {
      // Direct fast access or login
      continueAsGuest();
      setCurrentPage('workspace');
    }
  };

  return (
    <>
      {currentPage === 'home' && (
        <HomePage
          onLaunchApp={handleLaunchApp}
          onOpenChatbot={() => setIsChatbotOpen(true)}
          onOpenDeveloperInfo={() => setIsDeveloperModalOpen(true)}
        />
      )}

      {currentPage === 'login' && (
        <LoginPage
          onNavigateHome={() => setCurrentPage('home')}
          onOpenDeveloperInfo={() => setIsDeveloperModalOpen(true)}
        />
      )}

      {currentPage === 'workspace' && (
        <DashboardContent
          onNavigateHome={() => setCurrentPage('home')}
          onOpenChatbot={() => setIsChatbotOpen(true)}
          onOpenDeveloperInfo={() => setIsDeveloperModalOpen(true)}
        />
      )}

      {/* Floating Gemini Chatbot Trigger Button (Available on all pages) */}
      {!isChatbotOpen && (
        <button
          onClick={() => setIsChatbotOpen(true)}
          className="fixed bottom-5 right-5 z-40 px-3.5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white shadow-xl hover:shadow-indigo-500/25 transition-all flex items-center gap-2 group cursor-pointer border border-indigo-400/30"
          title="Open Master Copilot"
          aria-label="Open Master"
        >
          <Bot className="w-4 h-4 text-white" />
          <span className="text-xs font-semibold pr-1">Master</span>
        </button>
      )}

      {/* Multi-turn Gemini AI Chatbot */}
      <GeminiChatbot
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
      />

      {/* Developer & Copyright Info Modal */}
      <DeveloperModal
        isOpen={isDeveloperModalOpen}
        onClose={() => setIsDeveloperModalOpen(false)}
      />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ProjectProvider>
        <MainView />
      </ProjectProvider>
    </AuthProvider>
  );
}
