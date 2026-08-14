import { Component, ChangeDetectionStrategy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';
import { Task, TaskStatus } from '../../models/task.model';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TaskStore } from '../../store/task.store';
import { TaskDetailModal } from '../../components/task-detail-modal/task-detail-modal';

@Component({
  selector: 'app-task-board',
  standalone: true,
  imports: [CommonModule, DragDropModule, FormsModule, RouterModule, TaskDetailModal],
  templateUrl: './task-board.html',
  styleUrl: './task-board.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskBoard implements OnInit {
  projectId!: number;
  taskService = inject(TaskStore)
  selectedTask: Task | null = null;
  isCreateMode = false;

  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.projectId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    if (Number.isInteger(this.projectId)) {
      this.taskService.loadTasks(this.projectId);
    }
  }

  drop(
    event: CdkDragDrop<Task[]>,
    targetStatus: TaskStatus
  ) {
    const sourceStatus = event.item.data.status as TaskStatus;

    if (event.previousContainer === event.container) {
      const tasks = [...event.container.data];

      moveItemInArray(
        tasks,
        event.previousIndex,
        event.currentIndex
      );

      const reorderedTasks = tasks.map((task, position) => ({
        ...task,
        status: targetStatus,
        position,
      }));

      this.taskService.reorderTasks(
        this.projectId,
        reorderedTasks
      );

      return;
    }

    const sourceTasks = [...event.previousContainer.data];
    const targetTasks = [...event.container.data];

    transferArrayItem(
      sourceTasks,
      targetTasks,
      event.previousIndex,
      event.currentIndex
    );

    const reorderedSource = sourceTasks.map(
      (task, position) => ({
        ...task,
        status: sourceStatus,
        position,
      })
    );

    const reorderedTarget = targetTasks.map(
      (task, position) => ({
        ...task,
        status: targetStatus,
        position,
      })
    );

    this.taskService.reorderTasks(
      this.projectId,
      [
        ...reorderedSource,
        ...reorderedTarget,
      ]
    );
  }

  openCreateTaskModal() {
    this.isCreateMode = true;
    this.selectedTask = {
      id: 0,
      title: '',
      description: '',
      status: 'TODO',
      projectId: this.projectId,
      priority: 'MEDIUM',
      assignee: '',
      dueDate: undefined,
      labels: [],
      estimatedHours: 0,
      position: 0
    };
  }

  openTaskDetail(task: Task) {
    this.isCreateMode = false;
    this.selectedTask = { ...task };
  }

  closeTaskDetail() {
    this.selectedTask = null;
    this.isCreateMode = false;
  }

  async onTaskSave(task: Task) {
    try {
      if (this.isCreateMode) {
        await this.taskService.createTask(this.projectId, task);
      } else {
        await this.taskService.updateTask(this.projectId, task);
      }

      this.closeTaskDetail();
    } catch (error) {
      console.error('Unable to save task', error);
    }
  }

  isOverdue(date: Date | undefined): boolean {
    if (!date) return false;
    return new Date(date) < new Date();
  }
}
