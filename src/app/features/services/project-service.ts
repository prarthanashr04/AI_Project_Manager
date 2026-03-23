import { Injectable, signal } from '@angular/core';
import { Project } from '../projects/project.model';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private projectsSignal = signal<Project[]>([]);
  projects = this.projectsSignal.asReadonly()

  addProject(project: Project) {
    this.projectsSignal.update((list) => [...list, project]);
  }
}
