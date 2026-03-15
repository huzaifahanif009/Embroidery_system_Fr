import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'erp-header',
  standalone: true,
  imports: [CommonModule, FormsModule, MenuModule],
  template: `
    <header class="header">
      <div class="header-left">
        <button class="toggle-btn" (click)="toggle.emit()">
          <i class="pi pi-bars"></i>
        </button>
      </div>

      <!-- Search -->
      <div class="header-search">
        <div class="search-wrap">
          <i class="pi pi-search search-icon"></i>
          <input [(ngModel)]="searchVal" placeholder="Search orders, customers..." class="search-input" />
          <span class="search-kbd">⌘K</span>
        </div>
      </div>

      <div class="header-right">
        <button class="hdr-btn"><i class="pi pi-calendar"></i></button>
        <button class="hdr-btn"><i class="pi pi-bell"></i></button>
        <button class="hdr-btn"><i class="pi pi-comments"></i></button>
        <button class="hdr-btn"><i class="pi pi-question-circle"></i></button>
        <div class="user-avatar" (click)="menu.toggle($event)">
          {{ initials }}
        </div>
        <p-menu #menu [model]="menuItems" [popup]="true" appendTo="body"></p-menu>
      </div>
    </header>
  `,
  styles: [`
    .header {
      height: 52px; background: white; border-bottom: 1px solid #e8e6df;
      display: flex; align-items: center; gap: 12px;
      padding: 0 16px; position: sticky; top: 0; z-index: 100; flex-shrink: 0;
    }
    .header-left { display: flex; align-items: center; }
    .toggle-btn {
      width: 32px; height: 32px; border-radius: 6px; border: none;
      background: transparent; color: #6b7060; cursor: pointer;
      display: flex; align-items: center; justify-content: center; font-size: 14px;
      transition: background .12s;
    }
    .toggle-btn:hover { background: #f5f4ef; color: #1c2420; }
    .header-search { flex: 1; max-width: 380px; margin: 0 auto; }
    .search-wrap {
      display: flex; align-items: center; gap: 8px;
      background: #f5f4ef; border: 1px solid #e8e6df; border-radius: 8px;
      padding: 6px 10px;
    }
    .search-icon { font-size: 12px; color: #9a9688; }
    .search-input {
      flex: 1; border: none; background: transparent; outline: none;
      font-size: 13px; font-family: inherit; color: #1c2420;
    }
    .search-input::placeholder { color: #bbb8b0; }
    .search-kbd {
      font-size: 11px; color: #9a9688; background: white;
      border: 1px solid #e8e6df; border-radius: 4px;
      padding: 1px 5px; font-family: monospace;
    }
    .header-right { display: flex; align-items: center; gap: 4px; margin-left: auto; }
    .hdr-btn {
      width: 32px; height: 32px; border-radius: 6px; border: none;
      background: transparent; color: #6b7060; cursor: pointer;
      display: flex; align-items: center; justify-content: center; font-size: 14px;
      transition: background .12s;
    }
    .hdr-btn:hover { background: #f5f4ef; color: #1c2420; }
    .user-avatar {
      width: 32px; height: 32px; border-radius: 8px;
      background: #2d3a2e; color: #c8b560;
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 13px; cursor: pointer;
      letter-spacing: .03em;
    }
  `]
})
export class HeaderComponent {
  @Output() toggle = new EventEmitter<void>();
  searchVal = '';

  constructor(private auth: AuthService) {}

  get initials(): string {
    const u = this.auth.getUser();
    if (!u) return 'AK';
    return `${u.firstName?.[0]??''}${u.lastName?.[0]??''}`.toUpperCase();
  }

  menuItems: MenuItem[] = [
    { label: 'Profile', icon: 'pi pi-user' },
    { separator: true },
    { label: 'Logout', icon: 'pi pi-sign-out', command: () => this.auth.logout() }
  ];
}
