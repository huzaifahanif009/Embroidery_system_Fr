import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService, ApiResponse } from './base-api.service';
import { User } from './api.models';
import { catchError, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UsersService extends BaseApiService<User> {
  protected override endpoint = 'users';

  changePassword(id: string | number, payload: any): Observable<ApiResponse<any>> {
    this.log(`Changing password for user ${id}`);
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/${id}/change-password`, payload, { headers: this.headers })
      .pipe(
        tap(res => this.log(`Changed password for user ${id}`, res)),
        catchError(err => this.handleError(err))
      );
  }
}
