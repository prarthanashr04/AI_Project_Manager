import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task-service';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import { TaskStatus } from '../../models/task.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-task-board',
  standalone: true,
  imports: [CommonModule, DragDropModule, FormsModule],
  templateUrl: './task-board.html',
  styleUrl: './task-board.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskBoard implements OnInit {
  projectId!: number;
  newTaskTitle = '';
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

  createTask() {

    if (!this.newTaskTitle.trim()) return;

    this.taskService.addTask({
      id: Date.now(),

      title: this.newTaskTitle,

      status: 'TODO',

      projectId: this.projectId
    });

    this.newTaskTitle = '';
  }
}