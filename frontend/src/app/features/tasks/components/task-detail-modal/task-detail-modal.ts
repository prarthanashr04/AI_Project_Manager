import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task, TaskPriority, TaskStatus } from '../../models/task.model';

@Component({
  selector: 'app-task-detail-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-detail-modal.html',
  styleUrl: './task-detail-modal.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskDetailModal {
  @Input() task!: Task;
  @Input() mode: 'create' | 'edit' = 'edit';
  @Output() save = new EventEmitter<Task>();
  @Output() close = new EventEmitter<void>();

  get isCreateMode(): boolean {
    return this.mode === 'create';
  }

  get modalTitle(): string {
    return this.isCreateMode ? 'Create New Task' : this.task?.title || 'Edit Task';
  }

  onSave() {
    if (!this.task.title?.trim()) return;
    this.save.emit(this.task);
  }

  onClose() {
    this.close.emit();
  }
}
