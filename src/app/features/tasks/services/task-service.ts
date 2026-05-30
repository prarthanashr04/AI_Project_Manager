import { computed, Injectable, signal } from '@angular/core';
import { Task, TaskStatus } from '../models/task.model';
@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasksSignal = signal<Task[]>([]);
  tasks = this.tasksSignal.asReadonly();

  constructor() {
    this.tasksSignal.set([
      {
        id: 1,
        title: 'Design UI',
        description: 'Create modern UI designs',
        status: 'TODO',
        projectId: 1,
        priority: 'HIGH',
        assignee: 'John Doe',
        dueDate: new Date('2026-06-15'),
        labels: ['Design', 'Frontend'],
        estimatedHours: 8
      },
      {
        id: 2,
        title: 'Create API',
        description: 'Build REST API endpoints',
        status: 'IN_PROGRESS',
        projectId: 1,
        priority: 'CRITICAL',
        assignee: 'Jane Smith',
        dueDate: new Date('2026-05-25'),
        labels: ['Backend'],
        estimatedHours: 16
      },
      {
        id: 3,
        title: 'Deploy App',
        description: 'Deploy to production',
        status: 'DONE',
        projectId: 1,
        priority: 'MEDIUM',
        assignee: 'Bob Johnson',
        dueDate: new Date('2026-05-20'),
        labels: ['DevOps'],
        estimatedHours: 4
      }
    ]);
  }
  todoTasks(projectId: number) {
    return computed(() =>
      this.tasks().filter(
        t => t.status === 'TODO' && t.projectId === projectId
      )
    );
  }

  inProgressTasks(projectId: number) {
    return computed(() =>
      this.tasks().filter(
        t =>
          t.status === 'IN_PROGRESS' &&
          t.projectId === projectId
      )
    );
  }

  doneTasks(projectId: number) {
    return computed(() =>
      this.tasks().filter(
        t => t.status === 'DONE' && t.projectId === projectId
      )
    );
  }

  addTask(task: Task) {
    this.tasksSignal.update(list => [...list, task]);
  }

  updateTaskStatus(taskId: number, newStatus: TaskStatus) {
    this.tasksSignal.update(list => list.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  }

  deleteTask(taskId: number) {
    this.tasksSignal.update(list => list.filter(t => t.id !== taskId));
  }

  updateTask(taskId: number, updates: Partial<Task>) {
    this.tasksSignal.update(list =>
      list.map(t => t.id === taskId ? { ...t, ...updates } : t)
    );
  }

  getTaskById(taskId: number) {
    return this.tasks().find(t => t.id === taskId);
  }
}
