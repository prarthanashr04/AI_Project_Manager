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
        status: 'TODO',
        projectId: 1
      },
      {
        id: 2,
        title: 'Create API',
        status: 'IN_PROGRESS',
        projectId: 2
      },
      {
        id: 3,
        title: 'Deploy App',
        status: 'DONE',
        projectId: 3
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
}
