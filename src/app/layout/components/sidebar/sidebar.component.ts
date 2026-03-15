import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface NavItem {
  label: string; icon: string; route?: string;
  badge?: number; children?: NavItem[]; expanded?: boolean;
}

@Component({
  selector: 'erp-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="sidebar" [class.collapsed]="collapsed">
      <!-- Logo -->
      <div class="sidebar-logo">
        <div class="logo-pin">📍</div>
        <div *ngIf="!collapsed" class="logo-text">
          <span class="logo-brand">Threadwork</span>
          <span class="logo-sub">STUDIO ERP</span>
        </div>
      </div>

      <!-- Scroll area -->
      <div class="sidebar-scroll">
        <ng-container *ngFor="let item of navItems">
          <!-- Section label -->
          <div *ngIf="item.children && !collapsed" class="nav-section">{{ item.label }}</div>

          <!-- Direct link -->
          <a *ngIf="!item.children && item.route"
            class="nav-item" [routerLink]="item.route"
            routerLinkActive="nav-active"
            [routerLinkActiveOptions]="{exact: item.route==='/dashboard'}">
            <i [class]="'pi ' + item.icon + ' nav-icon'"></i>
            <span *ngIf="!collapsed" class="nav-label">{{ item.label }}</span>
            <span *ngIf="item.badge && !collapsed" class="nav-badge">{{ item.badge }}</span>
          </a>

          <!-- Group -->
          <ng-container *ngIf="item.children">
            <button *ngIf="!collapsed" class="nav-item nav-group" (click)="item.expanded=!item.expanded">
              <span class="nav-label" style="flex:1">{{ item.label }}</span>
              <i class="pi nav-icon" [class.pi-chevron-up]="item.expanded" [class.pi-chevron-down]="!item.expanded" style="font-size:10px"></i>
            </button>
            <div class="nav-children" *ngIf="item.expanded && !collapsed">
              <a *ngFor="let child of item.children"
                class="nav-item nav-child" [routerLink]="child.route"
                routerLinkActive="nav-active">
                <i [class]="'pi ' + child.icon + ' nav-icon'"></i>
                <span class="nav-label">{{ child.label }}</span>
                <span *ngIf="child.badge" class="nav-badge">{{ child.badge }}</span>
              </a>
            </div>
          </ng-container>
        </ng-container>
      </div>
    </nav>
  `,
  styles: [`
    .sidebar {
      width: 248px; min-height: 100vh;
      background: #2d3a2e;
      display: flex; flex-direction: column;
      flex-shrink: 0; transition: width .25s ease;
      border-right: 1px solid #3a4a3b;
    }
    .sidebar.collapsed { width: 56px; }

    .sidebar-logo {
      display: flex; align-items: center; gap: 10px;
      padding: 14px 14px 12px;
      border-bottom: 1px solid #3a4a3b;
      flex-shrink: 0;
    }
    .logo-pin { font-size: 20px; flex-shrink: 0; filter: hue-rotate(0deg); }
    .logo-text { display: flex; flex-direction: column; line-height: 1.1; }
    .logo-brand { color: #e8e0c8; font-weight: 700; font-size: 14px; letter-spacing: .01em; }
    .logo-sub { color: #c8b560; font-size: 9px; font-weight: 600; letter-spacing: .12em; }

    .sidebar-scroll { flex: 1; overflow-y: auto; padding: 8px 0; }
    .sidebar-scroll::-webkit-scrollbar { width: 3px; }
    .sidebar-scroll::-webkit-scrollbar-thumb { background: #3a4a3b; border-radius: 2px; }

    .nav-section {
      color: #5a6b5c; font-size: 10px; font-weight: 600;
      text-transform: uppercase; letter-spacing: .08em;
      padding: 10px 14px 4px;
    }
    .nav-item {
      display: flex; align-items: center; gap: 8px;
      padding: 7px 10px 7px 12px; margin: 1px 6px;
      border-radius: 6px; border: none; background: transparent;
      color: #a8b89a; text-decoration: none; cursor: pointer;
      font-size: 13px; font-family: inherit;
      transition: all .12s; width: calc(100% - 12px);
    }
    .nav-item:hover { background: #3a4a3b; color: #d4e8c8; }
    .nav-active { background: rgba(200,181,96,.12) !important; color: #c8b560 !important; border-left: 2px solid #c8b560; padding-left: 10px !important; }
    .nav-icon { font-size: 13px; flex-shrink: 0; width: 16px; text-align: center; }
    .nav-label { flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .nav-badge {
      background: #c8b560; color: #2d3a2e;
      font-size: 10px; font-weight: 700;
      padding: 1px 6px; border-radius: 10px;
    }
    .nav-group { width: calc(100% - 12px); }
    .nav-children { padding-left: 4px; }
    .nav-child { padding-left: 30px !important; font-size: 12.5px; }
  `]
})
export class SidebarComponent {
  @Input() collapsed = false;

  navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'pi-home', route: '/dashboard' },
    { label: 'MAIN', icon: '', children: [
      { label: 'Orders', icon: 'pi-file', route: '/orders/work-orders', badge: 14 },
      { label: 'Production', icon: 'pi-wrench', route: '/orders/production', badge: 3 },
      { label: 'Designs & Files', icon: 'pi-images', route: '/orders/quotations' },
    ]},
    { label: 'BUSINESS', icon: '', children: [
      { label: 'Customers', icon: 'pi-users', route: '/finance/ar/customers' },
      { label: 'Invoices', icon: 'pi-receipt', route: '/finance/ar/invoices', badge: 7 },
      { label: 'Quotations', icon: 'pi-file-edit', route: '/orders/quotations' },
      { label: 'Reports', icon: 'pi-chart-bar', route: '/finance/ar/aging' },
    ]},
    { label: 'INVENTORY', icon: '', children: [
      { label: 'Thread Stock', icon: 'pi-box', route: '/inventory/items' },
      { label: 'Suppliers', icon: 'pi-building', route: '/finance/ap/vendors' },
      { label: 'Stock Receive', icon: 'pi-download', route: '/inventory/receive' },
      { label: 'Reorder', icon: 'pi-bell', route: '/inventory/reorder' },
    ]},
    { label: 'HR', icon: '', children: [
      { label: 'Employees', icon: 'pi-id-card', route: '/hr/employees' },
      { label: 'Attendance', icon: 'pi-calendar', route: '/hr/attendance' },
      { label: 'Leaves', icon: 'pi-calendar-times', route: '/hr/leaves' },
    ]},
    { label: 'MACHINES', icon: '', children: [
      { label: 'Machine Registry', icon: 'pi-cog', route: '/machines/registry' },
      { label: 'Maintenance', icon: 'pi-wrench', route: '/machines/maintenance' },
      { label: 'OEE Dashboard', icon: 'pi-chart-line', route: '/machines/oee' },
    ]},
    { label: 'FINANCE', icon: '', children: [
      { label: 'Purchase Orders', icon: 'pi-shopping-cart', route: '/finance/ap/purchase-orders' },
      { label: 'AP Bills', icon: 'pi-file-pdf', route: '/finance/ap/bills' },
    ]},
    { label: 'SETTINGS', icon: '', children: [
      { label: 'Company', icon: 'pi-building', route: '/settings/company' },
      { label: 'Departments', icon: 'pi-sitemap', route: '/settings/departments' },
      { label: 'Financial Year', icon: 'pi-calendar-plus', route: '/settings/financial-year' },
    ]},
  ];
}
