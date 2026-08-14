export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface Task {
    id: number;
    title: string;
    description?: string;
    status: TaskStatus;
    projectId: number;
    priority: TaskPriority;
    assignee?: string;
    dueDate?: Date;
    labels?: string[];
    estimatedHours?: number;
    position: number;
}