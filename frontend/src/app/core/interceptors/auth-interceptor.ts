import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../../features/auth/services/auth-service';

const AUTH_ENDPOINTS = ['/auth/signup', '/auth/signin', '/auth/refresh'];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const isAuthEndpoint = AUTH_ENDPOINTS.some((endpoint) => req.url.includes(endpoint));

  if (isAuthEndpoint) {
    return next(req);
  }

  return authService.ensureValidAccessToken().pipe(
    switchMap((token) => {
      const authReq = token
        ? req.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`,
            },
          })
        : req;

      return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status !== 401) {
            return throwError(() => error);
          }

          return authService.refreshAccessToken().pipe(
            switchMap((newToken) => {
              if (!newToken) {
                authService.logoutLocal();
                return throwError(() => error);
              }

              return next(
                req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${newToken}`,
                  },
                })
              );
            }),
            catchError(() => {
              authService.logoutLocal();
              return throwError(() => error);
            })
          );
        })
      );
    })
  );
};
