import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProjectStore } from '../../store/project.store';

@Component({
  selector: 'app-project-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './project-create.html',
  styleUrl: './project-create.css',
})
export class ProjectCreate {
  projectForm: any;
  projectStore = inject(ProjectStore)

  // Color options for project
  projectColors = [
    '#3b82f6', '#8b5cf6', '#ec4899', '#f97316',
    '#22c55e', '#06b6d4', '#14b8a6', '#f59e0b'
  ];

  constructor(private fb: FormBuilder, private router: Router) {
    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      status: ['PLANNING', Validators.required],
      startDate: ['', Validators.required],
      endDate: [''],
      budget: ['', Validators.required],
      teamLead: ['', Validators.required],
      tags: [''],
      color: ['#3b82f6', Validators.required]
    });
  }

  async createProject() {
    if (this.projectForm.valid) {
      const formValue = this.projectForm.value;
      const newProject = {
        name: formValue.name,
        description: formValue.description,
        status: formValue.status,
        startDate: formValue.startDate ? new Date(formValue.startDate) : undefined,
        endDate: formValue.endDate ? new Date(formValue.endDate) : undefined,
        budget: parseInt(formValue.budget) || 0,
        teamLead: formValue.teamLead,
        tags: formValue.tags
          ? formValue.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t.length > 0)
          : [],
        color: formValue.color
      };

      try {
        await this.projectStore.addProject(newProject);
        this.projectForm.reset();
        this.router.navigate(['/']);
      } catch (error) {
        console.error('Unable to create project', error);
      }
    }
  }

  resetForm() {
    this.projectForm.reset({
      status: 'PLANNING',
      color: '#3b82f6'
    });
  }
}
