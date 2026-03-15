import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface NavItem {
  label: string;
  icon: string;
  route?: string;
  badge?: number;
  children?: NavItem[];
  expanded?: boolean;
}

@Component({
  selector: 'erp-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="sidebar" [class.collapsed]="collapsed">
      <div class="sidebar-logo">
        <div class="logo-pin-container">
          <i class="pi pi-map-marker"></i>
        </div>
        <div *ngIf="!collapsed" class="logo-text">
          <span class="logo-brand">Threadwork</span>
          <span class="logo-sub">STUDIO ERP</span>
        </div>
      </div>

      <div class="sidebar-scroll">
        <ng-container *ngFor="let item of navItems">
          
          <div *ngIf="item.children && !collapsed" class="nav-section">
            {{ item.label }}
          </div>

          <a *ngIf="!item.children && item.route"
            class="nav-item" [routerLink]="item.route"
            routerLinkActive="nav-active"
            [routerLinkActiveOptions]="{exact: item.route==='/dashboard'}">
            <div class="nav-icon-wrapper">
              <i [class]="'pi ' + item.icon"></i>
            </div>
            <span *ngIf="!collapsed" class="nav-label">{{ item.label }}</span>
            <span *ngIf="item.badge && !collapsed" class="nav-badge">{{ item.badge }}</span>
          </a>

          <ng-container *ngIf="item.children">
            <div class="nav-group-container">
               <a *ngFor="let child of item.children"
                class="nav-item nav-child" [routerLink]="child.route"
                routerLinkActive="nav-active">
                <div class="nav-icon-wrapper">
                  <i [class]="'pi ' + child.icon"></i>
                </div>
                <span *ngIf="!collapsed" class="nav-label">{{ child.label }}</span>
                <span *ngIf="child.badge && !collapsed" 
                      class="nav-badge" 
                      [class.badge-alert]="child.badge > 10">
                  {{ child.badge }}
                </span>
              </a>
            </div>
          </ng-container>

        </ng-container>
      </div>
    </nav>
  `,
  styles: [`
    .sidebar {
      width: 260px; height: 100vh;
      background: #24342a; /* Dark Forest Green */
      display: flex; flex-direction: column;
      flex-shrink: 0; transition: width .2s ease;
      color: #9fb1a3;
    }
    .sidebar.collapsed { width: 68px; }

    /* Logo Styling */
    .sidebar-logo {
      display: flex; align-items: center; gap: 12px;
      padding: 24px 18px;
    }
    .logo-pin-container {
      width: 38px; height: 38px; border-radius: 50% 50% 50% 10%;
      background: #d4bc6e; color: #24342a;
      display: flex; align-items: center; justify-content: center;
      font-size: 18px; transform: rotate(-10deg);
    }
    .logo-text { display: flex; flex-direction: column; line-height: 1.2; }
    .logo-brand { color: #ffffff; font-weight: 700; font-size: 16px; }
    .logo-sub { color: #9a8e63; font-size: 9px; font-weight: 700; letter-spacing: 1.5px; }

    /* Nav Scroll Area */
    .sidebar-scroll { flex: 1; overflow-y: auto; padding: 0 12px; }
    .sidebar-scroll::-webkit-scrollbar { width: 0; }

    .nav-section {
      color: #4a5a4e; font-size: 10px; font-weight: 800;
      text-transform: uppercase; letter-spacing: 1.2px;
      padding: 10px 12px 6px;
    }

    .nav-item {
      display: flex; align-items: center; gap: 12px;
      padding: 8px 10px; margin: 4px 0;
      border-radius: 10px; color: #9fb1a3;
      text-decoration: none; transition: all 0.2s;
      position: relative;
    }
    .nav-item:hover { background: rgba(255,255,255,0.05); color: #ffffff; }

    .nav-icon-wrapper { width: 20px; text-align: center; font-size: 14px; opacity: 0.8; }

    /* Active State (The Gold Pill Look) */
    .nav-active {
      background: #34443a !important; 
      color: #d4bc6e !important;
    }
    .nav-active::before {
      content: ""; position: absolute; left: -12px; top: 20%; bottom: 20%;
      width: 4px; background: #d4bc6e; border-radius: 0 4px 4px 0;
    }

    .nav-badge {
      background: #3d4d43; color: #9fb1a3;
      font-size: 10px; font-weight: 700;
      padding: 2px 8px; border-radius: 10px;
    }
    .badge-alert { background: #5a3a3a; color: #ff8a8a; }

    .sidebar.collapsed .nav-section, 
    .sidebar.collapsed .nav-label, 
    .sidebar.collapsed .nav-badge { display: none; }
  `]
})
export class SidebarComponent {
  @Input() collapsed = false;

  navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'pi-home', route: '/dashboard' },
    {
      label: 'Entity & System Setup', icon: '', children: [
        { label: 'Tenants', icon: 'pi-building', route: '/settings/tenants' },
        { label: 'Company', icon: 'pi-building', route: '/settings/company' },
        { label: 'Departments', icon: 'pi-sitemap', route: '/settings/departments' },
        { label: 'Designations', icon: 'pi-sitemap', route: '/settings/designations' },
        { label: 'Financial Year', icon: 'pi-calendar-plus', route: '/settings/financial-year' },
      ]
    },
    {
      label: 'Order & Production', icon: '', children: [
        { label: 'Orders', icon: 'pi-file', route: '/orders/work-orders', badge: 14 },
        { label: 'Production', icon: 'pi-wrench', route: '/orders/production', badge: 3 },
        { label: 'Designs & Files', icon: 'pi-images', route: '/orders/quotations' },
      ]
    },
    {
      label: 'Accounts Receivable (AR)', icon: '', children: [
        { label: 'Customers', icon: 'pi-users', route: '/finance/ar/customers' },
        { label: 'Invoices', icon: 'pi-receipt', route: '/finance/ar/invoices', badge: 7 },
        { label: 'Quotations', icon: 'pi-file-edit', route: '/orders/quotations' },
        { label: 'Reports', icon: 'pi-chart-bar', route: '/finance/ar/aging' },
      ]
    },
    {
      label: 'Inventory & Materials', icon: '', children: [
        { label: 'Thread Stock', icon: 'pi-box', route: '/inventory/items' },
        { label: 'Suppliers', icon: 'pi-building', route: '/finance/ap/vendors' },
        { label: 'Stock Receive', icon: 'pi-download', route: '/inventory/receive' },
        { label: 'Reorder', icon: 'pi-bell', route: '/inventory/reorder' },
      ]
    },
    {
      label: 'HR Management', icon: '', children: [
        { label: 'Employees', icon: 'pi-id-card', route: '/hr/employees' },
        { label: 'Attendance', icon: 'pi-calendar', route: '/hr/attendance' },
        { label: 'Leaves', icon: 'pi-calendar-times', route: '/hr/leaves' },
      ]
    },
    {
      label: 'Machine Management', icon: '', children: [
        { label: 'Machine Registry', icon: 'pi-cog', route: '/machines/registry' },
        { label: 'Maintenance', icon: 'pi-wrench', route: '/machines/maintenance' },
        { label: 'OEE Dashboard', icon: 'pi-chart-line', route: '/machines/oee' },
      ]
    },
    {
      label: 'Accounts Payable (AP)', icon: '', children: [
        { label: 'Purchase Orders', icon: 'pi-shopping-cart', route: '/finance/ap/purchase-orders' },
        { label: 'AP Bills', icon: 'pi-file-pdf', route: '/finance/ap/bills' },
      ]
    },

  ];
}