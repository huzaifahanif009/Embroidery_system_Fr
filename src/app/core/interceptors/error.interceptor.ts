import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';
import { AuthService } from '../services/auth.service';
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService); const auth = inject(AuthService);
  return next(req).pipe(catchError(e => {
    switch (e.status) {
      case 401:
        auth.logout();
        toast.error('Session Expired', 'Please log in again.');
        break;
      case 403:
        toast.error('Access Denied', 'You do not have permission.');
        break;
      case 404:
        toast.warn('Not Found', 'The requested resource was not found.');
        break;
      case 500:
        toast.error('Server Error', 'Something went wrong. Try again later.');
        break;
      case 0:
        toast.error('No Connection', 'Cannot reach server. Check your internet.');
        break;
      default:
        if (e.status >= 400)
          toast.error(`Error ${e.status}`, e.error?.message || 'Unexpected error.');
        break;
    }
    return throwError(() => e);
  }));
};
