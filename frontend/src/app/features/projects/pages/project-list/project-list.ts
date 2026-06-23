import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../services/project-service';
import { RouterModule } from '@angular/router';
import { ProjectStore } from '../../store/project.store'
import { FormsModule } from '@angular/forms';
import { computed } from '@angular/core';
import { AuthService } from '../../../auth/services/auth-service';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './project-list.html',
  styleUrl: './project-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectList implements OnInit {
  projectStore = inject(ProjectStore)
  authService = inject(AuthService)
  searchQuery = '';
  selectedStatus: string = '';
  selectedTag: string = '';
  deleteConfirm: number | null = null;

  filteredProjects = computed(() => {
    let projects = this.projectStore.projects();

    // Filter by search query
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      projects = projects.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query)
      );
    }

    // Filter by status
    if (this.selectedStatus) {
      projects = projects.filter(p => p.status === this.selectedStatus);
    }

    // Filter by tag
    if (this.selectedTag) {
      projects = projects.filter(p =>
        p.tags?.includes(this.selectedTag)
      );
    }

    return projects;
  });

  statusOptions = ['PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETED'];

  constructor(public projectService: ProjectService) {
  }

  ngOnInit() {
    // this.projectService.getProjects().subscribe();
  }

  deleteProject(projectId: number) {
    this.projectStore.deleteProject(projectId);
    this.deleteConfirm = null;
  }

  logout() {
    this.authService.logout().subscribe();
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      'PLANNING': '#f97316',
      'ACTIVE': '#22c55e',
      'ON_HOLD': '#eab308',
      'COMPLETED': '#6b7280'
    };
    return colors[status] || '#9ca3af';
  }

  getStatusLabel(status: string): string {
    return status.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ');
  }
}
