import { Injectable } from '@angular/core';
import { TOKEN_KEY, USER_KEY } from '../constants';
@Injectable({ providedIn: 'root' })
export class StorageService {
  get<T>(key: string): T | null {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) as T : null; } catch { return null; }
  }
  set(k: string, v: unknown): void { localStorage.setItem(k, JSON.stringify(v)); }
  remove(k: string): void { localStorage.removeItem(k); }
  getToken(): string | null { return localStorage.getItem(TOKEN_KEY); }
  setToken(t: string): void { localStorage.setItem(TOKEN_KEY, t); }
  clear(): void { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY); }
}
