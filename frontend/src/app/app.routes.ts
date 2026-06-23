import { Routes } from '@angular/router';
import { ProjectList } from './features/projects/pages/project-list/project-list';
import { ProjectCreate } from './features/projects/pages/project-create/project-create';
import { ProjectEdit } from './features/projects/pages/project-edit/project-edit';
import { TaskBoard } from './features/tasks/pages/task-board/task-board';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: 'signin',
        loadComponent: () => import('./features/auth/pages/sign-in/sign-in').then(m => m.SignIn)
    },
    {
        path: 'signup',
        loadComponent: () => import('./features/auth/pages/sign-up/sign-up').then(m => m.SignUp)
    },
    { path: '', component: ProjectList, canActivate: [authGuard] },
    { path: 'create-project', component: ProjectCreate, canActivate: [authGuard] },
    { path: 'edit-project', component: ProjectEdit, canActivate: [authGuard] },
    { path: 'tasks', component: TaskBoard, canActivate: [authGuard] },
    {
        path: 'projects/:id/tasks',
        canActivate: [authGuard],
        loadComponent: () => import('./features/tasks/pages/task-board/task-board').then(m => m.TaskBoard)
    },
    { path: '**', redirectTo: '' }
];
