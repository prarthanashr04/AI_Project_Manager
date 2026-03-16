import { Routes } from '@angular/router';
import { ProjectList } from './features/projects/pages/project-list/project-list';
import { ProjectCreate } from './features/projects/pages/project-create/project-create';

export const routes: Routes = [
    { path: '', component: ProjectList },
    { path: 'create-project', component: ProjectCreate }
];
