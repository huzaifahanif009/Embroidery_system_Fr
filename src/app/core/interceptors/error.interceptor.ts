import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';
import { AuthService } from '../services/auth.service';
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService); const auth = inject(AuthService);
  return next(req).pipe(catchError(e => {
    if (e.status === 401) auth.logout();
    else if (e.status >= 500) toast.error('Server Error', 'Please try again');
    return throwError(() => e);
  }));
};
