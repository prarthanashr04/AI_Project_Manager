import { Component, ChangeDetectionStrategy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task-service';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import { Task, TaskStatus } from '../../models/task.model';
import { ActivatedRoute } from '@angular/router';
import { TaskStore } from '../../store/task.store';
import { TaskDetailModal } from '../../components/task-detail-modal/task-detail-modal';

@Component({
  selector: 'app-task-board',
  standalone: true,
  imports: [CommonModule, DragDropModule, FormsModule, TaskDetailModal],
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
  }

  drop(event: CdkDragDrop<any>, status: TaskStatus) {
    const task = event.item.data;
    this.taskService.updateTaskStatus(task.id, status);
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
      estimatedHours: 0
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

  onTaskSave(task: Task) {
    if (this.isCreateMode) {
      this.taskService.addTask({
        ...task,
        id: Date.now()
      });
    } else {
      this.taskService.updateTask(task.id, task);
    }
    this.closeTaskDetail();
  }

  isOverdue(date: Date | undefined): boolean {
    if (!date) return false;
    return new Date(date) < new Date();
  }
}