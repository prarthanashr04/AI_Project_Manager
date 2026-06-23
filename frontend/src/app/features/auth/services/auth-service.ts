import { HttpClient } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:3000/auth';
  private readonly accessTokenKey = 'accessToken';
  private readonly refreshTokenKey = 'refreshToken';
  private readonly userKey = 'authUser';
  private refreshRequest$: Observable<string | null> | null = null;

  private userSignal = signal<AuthUser | null>(this.loadUser());
  user = this.userSignal.asReadonly();
  isAuthenticated = computed(() => !!this.userSignal() && !!this.getRefreshToken());

  constructor(private http: HttpClient, private router: Router) {}

  signUp(payload: { name: string; email: string; password: string }) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/signup`, payload).pipe(
      tap((response) => this.storeSession(response))
    );
  }

  signIn(payload: { email: string; password: string }) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/signin`, payload).pipe(
      tap((response) => this.storeSession(response))
    );
  }

  logout() {
    return this.http.post(`${this.apiUrl}/logout`, {}).pipe(
      catchError(() => of(null)),
      tap(() => this.clearSession())
    );
  }

  logoutLocal() {
    this.clearSession();
  }

  getAccessToken() {
    return localStorage.getItem(this.accessTokenKey);
  }

  getRefreshToken() {
    return localStorage.getItem(this.refreshTokenKey);
  }

  ensureValidAccessToken(): Observable<string | null> {
    const accessToken = this.getAccessToken();

    if (accessToken && !this.isTokenExpiringSoon(accessToken)) {
      return of(accessToken);
    }

    return this.refreshAccessToken();
  }

  refreshAccessToken(): Observable<string | null> {
    if (this.refreshRequest$) {
      return this.refreshRequest$;
    }

    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      this.clearSession();
      return of(null);
    }

    this.refreshRequest$ = this.http
      .post<AuthResponse>(`${this.apiUrl}/refresh`, { refreshToken })
      .pipe(
        tap((response) => this.storeSession(response)),
        map((response) => response.accessToken),
        catchError((error) => {
          this.clearSession();
          return throwError(() => error);
        }),
        tap({
          next: () => (this.refreshRequest$ = null),
          error: () => (this.refreshRequest$ = null),
        })
      );

    return this.refreshRequest$;
  }

  redirectToSignIn() {
    this.router.navigate(['/signin']);
  }

  private storeSession(response: AuthResponse) {
    localStorage.setItem(this.accessTokenKey, response.accessToken);
    localStorage.setItem(this.refreshTokenKey, response.refreshToken);
    localStorage.setItem(this.userKey, JSON.stringify(response.user));
    this.userSignal.set(response.user);
  }

  private clearSession() {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem(this.userKey);
    this.userSignal.set(null);
    this.router.navigate(['/signin']);
  }

  private loadUser(): AuthUser | null {
    const rawUser = localStorage.getItem(this.userKey);
    if (!rawUser) {
      return null;
    }

    try {
      return JSON.parse(rawUser) as AuthUser;
    } catch {
      localStorage.removeItem(this.userKey);
      return null;
    }
  }

  private isTokenExpiringSoon(token: string) {
    const expiry = this.getTokenExpiry(token);
    if (!expiry) {
      return true;
    }

    const refreshBufferMs = 60 * 1000;
    return expiry - Date.now() <= refreshBufferMs;
  }

  private getTokenExpiry(token: string) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return typeof payload.exp === 'number' ? payload.exp * 1000 : null;
    } catch {
      return null;
    }
  }
}
