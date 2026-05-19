import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProjectService } from '../../services/project-service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-project-create',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './project-create.html',
  styleUrl: './project-create.css',
})
export class ProjectCreate {
  projectForm: any;

  constructor(private fb: FormBuilder, private projectService: ProjectService, private router: Router) {
    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });
  }

  createProject() {
    if (this.projectForm.valid) {
      const newProject = {
        id: Date.now(),
        ...this.projectForm.value
      }
      // this.projectService.addProject(newProject);
      // this.projectForm.reset();
      // this.router.navigate(['/'])
      // this.projectService.createProjectApi(newProject).subscribe(response => {
      // console.log('Project created successfully:', response);
      this.projectService.addProject(newProject);
      this.projectForm.reset();
      this.router.navigate(['/']);
      // }, error => console.error(error))
    }
  }
}
