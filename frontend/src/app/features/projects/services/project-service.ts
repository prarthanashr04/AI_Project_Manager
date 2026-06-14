// import { Injectable, signal, computed } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';
// import { Project } from '../models/project.model';

// @Injectable({
//   providedIn: 'root',
// })
// export class ProjectService {

//   // 🔹 Signal-based state (modern Angular)
//   private projectsSignal = signal<Project[]>([]);
//   projects = this.projectsSignal.asReadonly();

//   // 🔹 Derived state
//   projectCount = computed(() => this.projects().length);

//   // 🔹 RxJS stream (for async/API scenarios)
//   private projectSubject = new BehaviorSubject<Project[]>([]);
//   projectList$ = this.projectSubject.asObservable();

//   constructor(private http: HttpClient) { }

//   // ✅ GET API
//   getProjects(): Observable<Project[]> {
//     return this.http.get<Project[]>('https://jsonplaceholder.typicode.com/posts')
//       .pipe(
//         tap((data) => {
//           // update signal
//           this.projectsSignal.set(data);

//           // update RxJS stream
//           this.projectSubject.next(data);
//         }),
//         catchError(error => {
//           console.error('Error fetching projects:', error);
//           return of([]);
//         })
//       );
//   }

//   // ✅ ADD PROJECT (local state)
//   addProject(project: Project) {
//     this.projectsSignal.update(list => [...list, project]);
//     this.projectSubject.next([...this.projectSubject.value, project]);
//   }

//   // ✅ OPTIONAL: create project via API
//   createProjectApi(project: Project): Observable<any> {
//     return this.http.post('https://jsonplaceholder.typicode.com/posts', project)
//       .pipe(
//         catchError(error => {
//           console.error('Error creating project:', error);
//           return of(null);
//         })
//       );
//   }
// }

import { Injectable, signal, computed } from '@angular/core';
import { Project } from '../models/project.model';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {

  // Signal State
  private projectsSignal = signal<Project[]>([
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
      description: 'Admin dashboard for e-commerce platform with analytics and reporting',
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
      name: 'Chat Application',
      description: 'Realtime messaging app with WebSocket integration and notifications',
      status: 'PLANNING',
      startDate: new Date('2026-03-01'),
      endDate: new Date('2026-09-30'),
      budget: 35000,
      teamLead: 'Alice Johnson',
      tags: ['WebSocket', 'Real-time', 'Chat'],
      color: '#ec4899'
    }
  ]);

  // Readonly Signal
  projects = this.projectsSignal.asReadonly();

  // Computed Signal
  projectCount = computed(() => this.projects().length);

  // Add Project
  addProject(project: Project) {
    this.projectsSignal.update(list => [...list, project]);
  }
}