import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-list.html',
  styleUrl: './project-list.css',
})
export class ProjectList {
  projects = signal([
    { id: 1, name: 'AI Project Manager', description: 'Main system' },
    { id: 2, name: 'Authentication Module', description: 'Login system' }
  ]);
}
