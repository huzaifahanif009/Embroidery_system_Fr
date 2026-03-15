import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService, ApiResponse } from './base-api.service';
import { Lov } from './api.models';
import { catchError, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class LovService extends BaseApiService<Lov> {
  protected override endpoint = 'lov';

  getByType(type: string): Observable<ApiResponse<Lov[]>> {
    this.log(`Fetching LOVs by type: ${type}`);
    return this.http.get<ApiResponse<Lov[]>>(`${this.baseUrl}/type/${type}`, { headers: this.headers })
      .pipe(
        tap(res => this.log(`Fetched LOVs by type: ${type}`, res)),
        catchError(err => this.handleError(err))
      );
  }
}
