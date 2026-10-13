export type ProjectStatus = 'planning' | 'active' | 'on_hold' | 'completed';

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Project {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  ownerEmail: string;
  color: string;
  status: ProjectStatus;
  targetDate: string; // YYYY-MM-DD
  memberIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: string;
  assigneeName?: string;
  assigneeEmail?: string;
  dueDate: string; // YYYY-MM-DD
  progress: number; // 0 - 100
  tags: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarColor: string;
}

export type ViewMode = 'kanban' | 'list' | 'timeline' | 'analytics';

export interface TaskFilterOptions {
  search: string;
  priority: TaskPriority | 'all';
  status: TaskStatus | 'all';
  assigneeId: string | 'all';
  tag: string | 'all';
  dueRange: 'all' | 'overdue' | 'today' | 'this_week';
}
