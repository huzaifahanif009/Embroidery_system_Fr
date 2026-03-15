import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
// import { environment } from '../../environments/environment';
import { ApiResponse, AuthResponse, User } from '../models';
import { StorageService } from './storage.service';
import { USER_KEY } from '../constants';
import { environment } from '@env/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private user$ = new BehaviorSubject<User | null>(null);
  currentUser$ = this.user$.asObservable();

  constructor(private http: HttpClient, private storage: StorageService, private router: Router) {
    const u = this.storage.get<User>(USER_KEY);
    if (u) this.user$.next(u);
  }

  login(email: string, password: string, tenant = 'system-admin'): Observable<AuthResponse> {
    return this.http.post<ApiResponse<AuthResponse>>(`${environment.apiUrl}/auth/login`, { email, password, tenant }).pipe(
      map(r => r.data),
      tap(d => { this.storage.setToken(d.accessToken); this.storage.set(USER_KEY, d.user); this.user$.next(d.user); })
    );
  }

  logout(): void { this.storage.clear(); this.user$.next(null); this.router.navigate(['/auth/login']); }
  isAuthenticated(): boolean { return !!this.storage.getToken(); }
  getToken(): string | null { return this.storage.getToken(); }
  getUser(): User | null { return this.user$.value; }
}
