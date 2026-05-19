import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task-service';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import { TaskStatus } from '../../models/task.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-task-board',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './task-board.html',
  styleUrl: './task-board.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskBoard implements OnInit {
  projectId!: number;

  constructor(
    private route: ActivatedRoute,
    public taskService: TaskService
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
}