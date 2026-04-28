import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../services/project-service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './project-list.html',
  styleUrl: './project-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectList implements OnInit {
  public projects: any;
  constructor(public projectService: ProjectService) {
  }

  ngOnInit() {
    this.projectService.getProjects().subscribe();
  }
}
