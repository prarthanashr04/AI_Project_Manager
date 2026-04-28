import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';
import { Project } from '../models/project.model';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {

  // 🔹 Signal-based state (modern Angular)
  private projectsSignal = signal<Project[]>([]);
  projects = this.projectsSignal.asReadonly();

  // 🔹 Derived state
  projectCount = computed(() => this.projects().length);

  // 🔹 RxJS stream (for async/API scenarios)
  private projectSubject = new BehaviorSubject<Project[]>([]);
  projectList$ = this.projectSubject.asObservable();

  constructor(private http: HttpClient) { }

  // ✅ GET API
  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>('https://jsonplaceholder.typicode.com/posts')
      .pipe(
        tap((data) => {
          // update signal
          this.projectsSignal.set(data);

          // update RxJS stream
          this.projectSubject.next(data);
        }),
        catchError(error => {
          console.error('Error fetching projects:', error);
          return of([]);
        })
      );
  }

  // ✅ ADD PROJECT (local state)
  addProject(project: Project) {
    this.projectsSignal.update(list => [...list, project]);
    this.projectSubject.next([...this.projectSubject.value, project]);
  }

  // ✅ OPTIONAL: create project via API
  createProjectApi(project: Project): Observable<any> {
    return this.http.post('https://jsonplaceholder.typicode.com/posts', project)
      .pipe(
        catchError(error => {
          console.error('Error creating project:', error);
          return of(null);
        })
      );
  }
}