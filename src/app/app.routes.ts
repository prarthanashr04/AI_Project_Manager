import { Routes } from '@angular/router';
import { ProjectList } from './features/projects/pages/project-list/project-list';
import { ProjectCreate } from './features/projects/pages/project-create/project-create';
import { TaskBoard } from './features/tasks/pages/task-board/task-board';

export const routes: Routes = [
    { path: '', component: ProjectList },
    { path: 'create-project', component: ProjectCreate },
    { path: 'tasks', component: TaskBoard },
    {
        path: 'projects/:id/tasks',
        loadComponent: () => import('./features/tasks/pages/task-board/task-board').then(m => m.TaskBoard)
    }
];
