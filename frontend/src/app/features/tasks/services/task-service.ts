// import { computed, Injectable, signal } from '@angular/core';
// import { Task, TaskStatus } from '../models/task.model';
// @Injectable({
//   providedIn: 'root',
// })
// export class TaskService {
//   private tasksSignal = signal<Task[]>([]);
//   tasks = this.tasksSignal.asReadonly();

//   constructor() {
//     this.tasksSignal.set([
//       {
//         id: 1,
//         title: 'Design UI',
//         description: 'Create modern UI designs',
//         status: 'TODO',
//         projectId: 1,
//         priority: 'HIGH',
//         assignee: 'John Doe',
//         dueDate: new Date('2026-06-15'),
//         labels: ['Design', 'Frontend'],
//         estimatedHours: 8
//       },
//       {
//         id: 2,
//         title: 'Create API',
//         description: 'Build REST API endpoints',
//         status: 'IN_PROGRESS',
//         projectId: 1,
//         priority: 'CRITICAL',
//         assignee: 'Jane Smith',
//         dueDate: new Date('2026-05-25'),
//         labels: ['Backend'],
//         estimatedHours: 16
//       },
//       {
//         id: 3,
//         title: 'Deploy App',
//         description: 'Deploy to production',
//         status: 'DONE',
//         projectId: 1,
//         priority: 'MEDIUM',
//         assignee: 'Bob Johnson',
//         dueDate: new Date('2026-05-20'),
//         labels: ['DevOps'],
//         estimatedHours: 4
//       }
//     ]);
//   }
//   todoTasks(projectId: number) {
//     return computed(() =>
//       this.tasks().filter(
//         t => t.status === 'TODO' && t.projectId === projectId
//       )
//     );
//   }

//   inProgressTasks(projectId: number) {
//     return computed(() =>
//       this.tasks().filter(
//         t =>
//           t.status === 'IN_PROGRESS' &&
//           t.projectId === projectId
//       )
//     );
//   }

//   doneTasks(projectId: number) {
//     return computed(() =>
//       this.tasks().filter(
//         t => t.status === 'DONE' && t.projectId === projectId
//       )
//     );
//   }

//   addTask(task: Task) {
//     this.tasksSignal.update(list => [...list, task]);
//   }

//   updateTaskStatus(taskId: number, newStatus: TaskStatus) {
//     this.tasksSignal.update(list => list.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
//   }

//   deleteTask(taskId: number) {
//     this.tasksSignal.update(list => list.filter(t => t.id !== taskId));
//   }

//   updateTask(taskId: number, updates: Partial<Task>) {
//     this.tasksSignal.update(list =>
//       list.map(t => t.id === taskId ? { ...t, ...updates } : t)
//     );
//   }

//   getTaskById(taskId: number) {
//     return this.tasks().find(t => t.id === taskId);
//   }
// }

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Task } from '../models/task.model';

type TaskResponse = Omit<Task, 'dueDate'> & {
  dueDate?: string;
};

export interface TaskOrderUpdate {
  id: number;
  status: Task['status'];
  position: number;
}

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getProjectTasks(projectId: number) {
    return this.http
      .get<TaskResponse[]>(
        `${this.apiUrl}/projects/${projectId}/tasks`
      )
      .pipe(
        map((tasks) =>
          tasks.map((task) => ({
            ...task,
            dueDate: task.dueDate
              ? new Date(task.dueDate)
              : undefined,
          }))
        )
      );
  }

  reorderTasks(
    projectId: number,
    tasks: TaskOrderUpdate[]
  ) {
    return this.http.patch(
      `${this.apiUrl}/projects/${projectId}/tasks/reorder`,
      { tasks }
    );
  }

  createTask(projectId: number, task: Task) {
    return this.http
      .post<TaskResponse>(
        `${this.apiUrl}/projects/${projectId}/tasks`,
        this.toRequest(task)
      )
      .pipe(map((createdTask) => this.mapTask(createdTask)));
  }

  updateTask(projectId: number, task: Task) {
    return this.http
      .put<TaskResponse>(
        `${this.apiUrl}/projects/${projectId}/tasks/${task.id}`,
        this.toRequest(task)
      )
      .pipe(map((updatedTask) => this.mapTask(updatedTask)));
  }

  private mapTask(task: TaskResponse): Task {
    return {
      ...task,
      dueDate: task.dueDate
        ? new Date(task.dueDate)
        : undefined,
    };
  }

  private toRequest(task: Task) {
    return {
      ...task,
      dueDate: task.dueDate
        ? new Date(task.dueDate).toISOString().slice(0, 10)
        : null,
      labels: Array.isArray(task.labels)
        ? task.labels
        : String(task.labels || '')
            .split(',')
            .map((label) => label.trim())
            .filter(Boolean),
    };
  }
}
