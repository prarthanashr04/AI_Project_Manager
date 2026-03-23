import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../../services/project-service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './project-list.html',
  styleUrl: './project-list.css',
})
export class ProjectList {
  constructor(public projectService: ProjectService) { }

}
