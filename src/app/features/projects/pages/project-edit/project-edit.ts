import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProjectStore } from '../../store/project.store';
import { Project } from '../../models/project.model';

@Component({
    selector: 'app-project-edit',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    templateUrl: './project-edit.html',
    styleUrl: './project-edit.css',
})
export class ProjectEdit implements OnInit {
    projectForm: any;
    projectStore = inject(ProjectStore);
    projectId: number | null = null;
    project: Project | undefined;

    projectColors = [
        '#3b82f6', '#8b5cf6', '#ec4899', '#f97316',
        '#22c55e', '#06b6d4', '#14b8a6', '#f59e0b'
    ];

    statusOptions = ['PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETED'];

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router
    ) {
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

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            const id = params['id'];
            if (id) {
                this.projectId = parseInt(id);
                this.project = this.projectStore.getProjectById(this.projectId);
                if (this.project) {
                    this.populateForm(this.project);
                }
            }
        });
    }

    populateForm(project: Project) {
        this.projectForm.patchValue({
            name: project.name,
            description: project.description,
            status: project.status,
            startDate: project.startDate ? this.formatDateForInput(project.startDate) : '',
            endDate: project.endDate ? this.formatDateForInput(project.endDate) : '',
            budget: project.budget,
            teamLead: project.teamLead,
            tags: project.tags?.join(', ') || '',
            color: project.color
        });
    }

    formatDateForInput(date: Date): string {
        const d = new Date(date);
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const year = d.getFullYear();
        return `${year}-${month}-${day}`;
    }

    updateProject() {
        if (this.projectForm.valid && this.projectId) {
            const formValue = this.projectForm.value;
            const updates = {
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

            this.projectStore.updateProject(this.projectId, updates);
            this.router.navigate(['/']);
        }
    }

    resetForm() {
        if (this.project) {
            this.populateForm(this.project);
        }
    }
}
