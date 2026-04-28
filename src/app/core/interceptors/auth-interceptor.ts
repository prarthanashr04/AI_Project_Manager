import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const modifiedReq = req.clone({
    setHeaders: {
      'Authorization': 'ghvhgv1311jhvhjv',
      'Content-Type': 'application/json'
    }
  })
  return next(modifiedReq);
};
