import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from '../../features/auth/services/auth-service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.getRefreshToken()) {
    return router.createUrlTree(['/signin']);
  }

  return authService.ensureValidAccessToken().pipe(
    map((token) => (token ? true : router.createUrlTree(['/signin']))),
    catchError(() => of(router.createUrlTree(['/signin'])))
  );
};
