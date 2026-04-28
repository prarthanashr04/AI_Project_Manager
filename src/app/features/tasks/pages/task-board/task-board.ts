import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task-service';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import { TaskStatus } from '../../models/task.model';

@Component({
  selector: 'app-task-board',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './task-board.html',
  styleUrl: './task-board.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskBoard {

  constructor(public taskService: TaskService) { }

  drop(event: CdkDragDrop<any>, status: TaskStatus) {

    const task = event.item.data;

    this.taskService.updateTaskStatus(task.id, status);
  }
}