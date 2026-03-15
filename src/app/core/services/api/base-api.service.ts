import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { StorageService } from '../storage.service';
import { environment } from '../../../../environments/environment';

export interface PaginatedData<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  data: T;
  message?: string;
  timestamp: string;
}

export abstract class BaseApiService<T> {
  protected http = inject(HttpClient);
  protected storage = inject(StorageService);
  protected abstract endpoint: string;

  protected get baseUrl(): string {
    return `${environment.apiUrl}/${this.endpoint}`;
  }

  protected get headers(): HttpHeaders {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const token = this.storage.getToken();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  protected handleError(error: HttpErrorResponse): Observable<never> {
    console.error(`[BaseApiService] Error in ${this.endpoint}`, error);
    return throwError(() => error);
  }

  protected log(message: string, data?: any): void {
    if (!environment.production) {
      console.log(`[BaseApiService - ${this.endpoint}] ${message}`, data || '');
    }
  }

  getAll(params?: any): Observable<ApiResponse<PaginatedData<T>>> {
    this.log('Fetching all records', params);
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    return this.http.get<ApiResponse<PaginatedData<T>>>(this.baseUrl, { headers: this.headers, params: httpParams })
      .pipe(
        tap(res => this.log('Fetched all', res)),
        catchError(err => this.handleError(err))
      );
  }

  getById(id: string | number): Observable<ApiResponse<T>> {
    this.log(`Fetching record ${id}`);
    return this.http.get<ApiResponse<T>>(`${this.baseUrl}/${id}`, { headers: this.headers })
      .pipe(
        tap(res => this.log(`Fetched record ${id}`, res)),
        catchError(err => this.handleError(err))
      );
  }

  create(data: Partial<T>): Observable<ApiResponse<T>> {
    this.log('Creating record', data);
    return this.http.post<ApiResponse<T>>(this.baseUrl, data, { headers: this.headers })
      .pipe(
        tap(res => this.log('Created record', res)),
        catchError(err => this.handleError(err))
      );
  }

  update(id: string | number, data: Partial<T>): Observable<ApiResponse<T>> {
    this.log(`Updating record ${id}`, data);
    // NestJS commonly uses PATCH for partial updates, but PUT is also common. We use PATCH here.
    return this.http.patch<ApiResponse<T>>(`${this.baseUrl}/${id}`, data, { headers: this.headers })
      .pipe(
        tap(res => this.log(`Updated record ${id}`, res)),
        catchError(err => this.handleError(err))
      );
  }

  delete(id: string | number): Observable<ApiResponse<void>> {
    this.log(`Deleting record ${id}`);
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`, { headers: this.headers })
      .pipe(
        tap(res => this.log(`Deleted record ${id}`, res)),
        catchError(err => this.handleError(err))
      );
  }

  // Extra common routes
  restore(id: string | number): Observable<ApiResponse<T>> {
    this.log(`Restoring record ${id}`);
    return this.http.patch<ApiResponse<T>>(`${this.baseUrl}/${id}/restore`, {}, { headers: this.headers })
      .pipe(
        tap(res => this.log(`Restored record ${id}`, res)),
        catchError(err => this.handleError(err))
      );
  }
}
