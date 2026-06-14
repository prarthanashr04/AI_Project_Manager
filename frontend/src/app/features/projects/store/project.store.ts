import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { Project } from "../models/project.model"

type ProjectState = {
    projects: Project[]
}

const initialState: ProjectState = {
    projects: [
        {
            id: 1,
            name: 'AI Project Manager',
            description: 'Modern Angular 21 project management application with real-time collaboration',
            status: 'ACTIVE',
            startDate: new Date('2026-01-15'),
            endDate: new Date('2026-12-31'),
            budget: 50000,
            teamLead: 'John Doe',
            tags: ['Angular', 'TypeScript', 'Dashboard'],
            color: '#3b82f6'
        },
        {
            id: 2,
            name: 'E-Commerce Dashboard',
            description: 'Admin dashboard for e-commerce platform with analytics',
            status: 'ACTIVE',
            startDate: new Date('2026-02-01'),
            endDate: new Date('2026-11-30'),
            budget: 75000,
            teamLead: 'Jane Smith',
            tags: ['E-Commerce', 'Analytics', 'Dashboard'],
            color: '#8b5cf6'
        },
        {
            id: 3,
            name: 'Mobile App Redesign',
            description: 'Complete UI/UX redesign of the mobile application',
            status: 'PLANNING',
            startDate: new Date('2026-06-01'),
            endDate: new Date('2026-12-15'),
            budget: 45000,
            teamLead: 'Bob Johnson',
            tags: ['Mobile', 'UI/UX', 'Design'],
            color: '#ec4899'
        }
    ]
};

export const ProjectStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withComputed((store) => ({
        projectCount: computed(
            () => store.projects().length
        ),
        activeProjects: computed(() =>
            store.projects().filter(p => p.status === 'ACTIVE')
        ),
        completedProjects: computed(() =>
            store.projects().filter(p => p.status === 'COMPLETED')
        ),
        planningProjects: computed(() =>
            store.projects().filter(p => p.status === 'PLANNING')
        ),
        projectsByTeamLead: computed(() => {
            const projects = store.projects();
            return projects.reduce((acc, project) => {
                const lead = project.teamLead || 'Unassigned';
                if (!acc[lead]) acc[lead] = [];
                acc[lead].push(project);
                return acc;
            }, {} as Record<string, Project[]>);
        }),
        totalBudget: computed(() =>
            store.projects().reduce((sum, p) => sum + (p.budget || 0), 0)
        ),
        uniqueTags: computed(() => {
            const tags = new Set<string>();
            store.projects().forEach(p => {
                p.tags?.forEach(tag => tags.add(tag));
            });
            return Array.from(tags).sort();
        })
    })),
    withMethods((store) => ({
        addProject(project: Project) {
            patchState(store, {
                projects: [
                    ...store.projects(),
                    project
                ]
            })
        },
        updateProject(projectId: number, updates: Partial<Project>) {
            patchState(store, {
                projects: store.projects().map(p =>
                    p.id === projectId ? { ...p, ...updates } : p
                )
            });
        },
        deleteProject(projectId: number) {
            patchState(store, {
                projects: store.projects().filter(p => p.id !== projectId)
            });
        },
        getProjectById(projectId: number) {
            return store.projects().find(p => p.id === projectId);
        }
    }))
);