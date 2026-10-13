import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
} from 'firebase/firestore';
import {
  Project,
  Task,
  TaskStatus,
  TeamMember,
  ViewMode,
  TaskFilterOptions,
} from '../types/index.ts';
import { DEFAULT_TEAM_MEMBERS, INITIAL_PROJECTS, INITIAL_TASKS } from '../data/defaultData.ts';
import { db, handleFirestoreError, OperationType } from '../lib/firebase.ts';
import { useAuth } from './AuthContext.tsx';

interface ProjectContextValue {
  projects: Project[];
  currentProject: Project | null;
  setCurrentProjectId: (id: string) => void;
  tasks: Task[];
  allTasks: Task[];
  filteredTasks: Task[];
  teamMembers: TeamMember[];
  loading: boolean;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  filter: TaskFilterOptions;
  setFilter: React.Dispatch<React.SetStateAction<TaskFilterOptions>>;
  resetFilters: () => void;
  // CRUD
  createProject: (data: {
    name: string;
    description: string;
    color: string;
    status: Project['status'];
    targetDate: string;
    memberIds: string[];
  }) => Promise<string>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  createTask: (data: {
    title: string;
    description: string;
    status: TaskStatus;
    priority: Task['priority'];
    assigneeId?: string;
    dueDate: string;
    progress: number;
    tags: string[];
    projectId?: string;
  }) => Promise<string>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  moveTaskStatus: (id: string, newStatus: TaskStatus) => Promise<void>;
  updateTaskProgress: (id: string, progress: number) => Promise<void>;
}

const ProjectContext = createContext<ProjectContextValue | undefined>(undefined);

const LOCAL_STORAGE_PROJECTS_KEY = 'planpulse_projects_v1';
const LOCAL_STORAGE_TASKS_KEY = 'planpulse_tasks_v1';

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  // Initialize from localStorage or defaults
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_PROJECTS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some((p: Project) => p.id === 'proj_pm_tool' || p.name === 'Project Management Tool')) {
          return parsed;
        }
        return [INITIAL_PROJECTS[0], ...(Array.isArray(parsed) ? parsed : [])];
      }
    } catch {
      // ignore
    }
    return INITIAL_PROJECTS;
  });

  const [allTasks, setAllTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_TASKS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some((t: Task) => t.projectId === 'proj_pm_tool')) {
          return parsed;
        }
        const pmTasks = INITIAL_TASKS.filter((t) => t.projectId === 'proj_pm_tool');
        return [...pmTasks, ...(Array.isArray(parsed) ? parsed : [])];
      }
    } catch {
      // ignore
    }
    return INITIAL_TASKS;
  });

  const [currentProjectId, setCurrentProjectId] = useState<string>(
    () => 'proj_pm_tool'
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');

  const [filter, setFilter] = useState<TaskFilterOptions>({
    search: '',
    priority: 'all',
    status: 'all',
    assigneeId: 'all',
    tag: 'all',
    dueRange: 'all',
  });

  // Keep localStorage updated
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_PROJECTS_KEY, JSON.stringify(projects));
    } catch (e) {
      console.warn('Could not persist projects to localStorage', e);
    }
  }, [projects]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_TASKS_KEY, JSON.stringify(allTasks));
    } catch (e) {
      console.warn('Could not persist tasks to localStorage', e);
    }
  }, [allTasks]);

  // Sync with Firestore if logged in
  useEffect(() => {
    if (!user || user.isGuest) return;

    setLoading(true);
    const projectsPath = 'projects';

    const unsubscribeProjects = onSnapshot(
      collection(db, projectsPath),
      (snapshot) => {
        if (!snapshot.empty) {
          const loadedProjects: Project[] = [];
          snapshot.forEach((docSnap) => {
            loadedProjects.push({ id: docSnap.id, ...(docSnap.data() as Omit<Project, 'id'>) });
          });
          setProjects(loadedProjects);
          if (!loadedProjects.some((p) => p.id === currentProjectId) && loadedProjects.length > 0) {
            setCurrentProjectId(loadedProjects[0].id);
          }
        }
        setLoading(false);
      },
      (error) => {
        console.warn('Firestore snapshot error on projects, using local cache:', error.message);
        setLoading(false);
      }
    );

    return () => unsubscribeProjects();
  }, [user]);

  // Sync tasks for current project
  useEffect(() => {
    if (!user || user.isGuest || !currentProjectId) return;

    const tasksPath = `projects/${currentProjectId}/tasks`;
    const unsubscribeTasks = onSnapshot(
      collection(db, tasksPath),
      (snapshot) => {
        if (!snapshot.empty) {
          const loadedTasks: Task[] = [];
          snapshot.forEach((docSnap) => {
            loadedTasks.push({ id: docSnap.id, ...(docSnap.data() as Omit<Task, 'id'>) });
          });
          setAllTasks((prev) => {
            const others = prev.filter((t) => t.projectId !== currentProjectId);
            return [...others, ...loadedTasks];
          });
        }
      },
      (error) => {
        console.warn('Firestore tasks snapshot notice:', error.message);
      }
    );

    return () => unsubscribeTasks();
  }, [user, currentProjectId]);

  // Derived current project
  const currentProject = useMemo(() => {
    return projects.find((p) => p.id === currentProjectId) || projects[0] || null;
  }, [projects, currentProjectId]);

  // Tasks for current project
  const projectTasks = useMemo(() => {
    if (!currentProject) return [];
    return allTasks.filter((t) => t.projectId === currentProject.id);
  }, [allTasks, currentProject]);

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    return projectTasks.filter((task) => {
      // Search
      if (filter.search.trim()) {
        const query = filter.search.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesDesc = task.description.toLowerCase().includes(query);
        const matchesTag = task.tags.some((t) => t.toLowerCase().includes(query));
        if (!matchesTitle && !matchesDesc && !matchesTag) return false;
      }
      // Priority
      if (filter.priority !== 'all' && task.priority !== filter.priority) return false;
      // Status
      if (filter.status !== 'all' && task.status !== filter.status) return false;
      // Assignee
      if (filter.assigneeId !== 'all') {
        if (filter.assigneeId === 'unassigned') {
          if (task.assigneeId) return false;
        } else if (task.assigneeId !== filter.assigneeId) {
          return false;
        }
      }
      // Tag
      if (filter.tag !== 'all' && !task.tags.includes(filter.tag)) return false;
      // Due Date Range
      if (filter.dueRange !== 'all') {
        const today = new Date().toISOString().split('T')[0];
        if (filter.dueRange === 'overdue') {
          if (task.dueDate >= today || task.status === 'done') return false;
        } else if (filter.dueRange === 'today') {
          if (task.dueDate !== today) return false;
        } else if (filter.dueRange === 'this_week') {
          const now = new Date();
          const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
          if (task.dueDate < today || task.dueDate > nextWeek) return false;
        }
      }
      return true;
    });
  }, [projectTasks, filter]);

  const resetFilters = () => {
    setFilter({
      search: '',
      priority: 'all',
      status: 'all',
      assigneeId: 'all',
      tag: 'all',
      dueRange: 'all',
    });
  };

  // Team members roster
  const teamMembers = useMemo(() => {
    const list = [...DEFAULT_TEAM_MEMBERS];
    if (user && !user.isGuest) {
      if (!list.some((m) => m.id === user.uid)) {
        list.unshift({
          id: user.uid,
          name: user.displayName || 'Current User',
          email: user.email || 'user@work.io',
          role: 'Project Owner',
          avatarColor: '#8B5CF6',
        });
      }
    }
    return list;
  }, [user]);

  // CRUD Implementations
  const createProject = async (data: {
    name: string;
    description: string;
    color: string;
    status: Project['status'];
    targetDate: string;
    memberIds: string[];
  }) => {
    const id = `proj_${Date.now()}`;
    const now = new Date().toISOString();
    const newProject: Project = {
      id,
      name: data.name,
      description: data.description,
      ownerId: user?.uid || 'default_admin',
      ownerEmail: user?.email || 'admin@planningmaster.io',
      color: data.color || '#6366F1',
      status: data.status,
      targetDate: data.targetDate,
      memberIds: data.memberIds,
      createdAt: now,
      updatedAt: now,
    };

    setProjects((prev) => [newProject, ...prev]);
    setCurrentProjectId(id);

    if (user && !user.isGuest) {
      const path = `projects/${id}`;
      try {
        await setDoc(doc(db, 'projects', id), {
          name: newProject.name,
          description: newProject.description,
          ownerId: newProject.ownerId,
          ownerEmail: newProject.ownerEmail,
          color: newProject.color,
          status: newProject.status,
          targetDate: newProject.targetDate,
          memberIds: newProject.memberIds,
          createdAt: newProject.createdAt,
          updatedAt: newProject.updatedAt,
        });
      } catch (err) {
        console.warn('Could not sync project creation to Firestore:', err);
      }
    }

    return id;
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    const now = new Date().toISOString();
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: now } : p))
    );

    if (user && !user.isGuest) {
      try {
        await updateDoc(doc(db, 'projects', id), {
          ...updates,
          updatedAt: now,
        });
      } catch (err) {
        console.warn('Could not sync project update to Firestore:', err);
      }
    }
  };

  const deleteProject = async (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setAllTasks((prev) => prev.filter((t) => t.projectId !== id));

    if (currentProjectId === id) {
      const remaining = projects.filter((p) => p.id !== id);
      if (remaining.length > 0) {
        setCurrentProjectId(remaining[0].id);
      }
    }

    if (user && !user.isGuest) {
      try {
        await deleteDoc(doc(db, 'projects', id));
      } catch (err) {
        console.warn('Could not sync project deletion to Firestore:', err);
      }
    }
  };

  const createTask = async (data: {
    title: string;
    description: string;
    status: TaskStatus;
    priority: Task['priority'];
    assigneeId?: string;
    dueDate: string;
    progress: number;
    tags: string[];
    projectId?: string;
  }) => {
    const pId = data.projectId || currentProject?.id || projects[0]?.id;
    if (!pId) throw new Error('No project selected to create task');

    const id = `task_${Date.now()}`;
    const now = new Date().toISOString();

    const assignee = teamMembers.find((m) => m.id === data.assigneeId);

    const newTask: Task = {
      id,
      projectId: pId,
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      assigneeId: data.assigneeId,
      assigneeName: assignee?.name,
      assigneeEmail: assignee?.email,
      dueDate: data.dueDate,
      progress: data.progress,
      tags: data.tags,
      createdBy: user?.uid || 'default_admin',
      createdAt: now,
      updatedAt: now,
    };

    setAllTasks((prev) => [newTask, ...prev]);

    if (user && !user.isGuest) {
      const path = `projects/${pId}/tasks/${id}`;
      try {
        await setDoc(doc(db, 'projects', pId, 'tasks', id), {
          projectId: pId,
          title: newTask.title,
          description: newTask.description,
          status: newTask.status,
          priority: newTask.priority,
          assigneeId: newTask.assigneeId || '',
          assigneeName: newTask.assigneeName || '',
          assigneeEmail: newTask.assigneeEmail || '',
          dueDate: newTask.dueDate,
          progress: newTask.progress,
          tags: newTask.tags,
          createdBy: newTask.createdBy,
          createdAt: newTask.createdAt,
          updatedAt: newTask.updatedAt,
        });
      } catch (err) {
        console.warn('Could not sync task creation to Firestore:', err);
      }
    }

    return id;
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    const now = new Date().toISOString();
    let targetProject = currentProjectId;

    setAllTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          targetProject = t.projectId;
          let assigneeName = t.assigneeName;
          let assigneeEmail = t.assigneeEmail;
          if (updates.assigneeId !== undefined) {
            const member = teamMembers.find((m) => m.id === updates.assigneeId);
            assigneeName = member?.name;
            assigneeEmail = member?.email;
          }
          return {
            ...t,
            ...updates,
            assigneeName,
            assigneeEmail,
            updatedAt: now,
          };
        }
        return t;
      })
    );

    if (user && !user.isGuest && targetProject) {
      try {
        await updateDoc(doc(db, 'projects', targetProject, 'tasks', id), {
          ...updates,
          updatedAt: now,
        });
      } catch (err) {
        console.warn('Could not sync task update to Firestore:', err);
      }
    }
  };

  const deleteTask = async (id: string) => {
    let targetProject = currentProjectId;
    const task = allTasks.find((t) => t.id === id);
    if (task) targetProject = task.projectId;

    setAllTasks((prev) => prev.filter((t) => t.id !== id));

    if (user && !user.isGuest && targetProject) {
      try {
        await deleteDoc(doc(db, 'projects', targetProject, 'tasks', id));
      } catch (err) {
        console.warn('Could not sync task deletion to Firestore:', err);
      }
    }
  };

  const moveTaskStatus = async (id: string, newStatus: TaskStatus) => {
    // If moving to done, set progress to 100%
    const progress = newStatus === 'done' ? 100 : undefined;
    await updateTask(id, {
      status: newStatus,
      ...(progress !== undefined ? { progress } : {}),
    });
  };

  const updateTaskProgress = async (id: string, progress: number) => {
    const status: TaskStatus | undefined =
      progress === 100 ? 'done' : progress > 0 ? 'in_progress' : undefined;
    await updateTask(id, {
      progress,
      ...(status ? { status } : {}),
    });
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        currentProject,
        setCurrentProjectId,
        tasks: projectTasks,
        allTasks,
        filteredTasks,
        teamMembers,
        loading,
        viewMode,
        setViewMode,
        filter,
        setFilter,
        resetFilters,
        createProject,
        updateProject,
        deleteProject,
        createTask,
        updateTask,
        deleteTask,
        moveTaskStatus,
        updateTaskProgress,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};
