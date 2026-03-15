import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { ShellComponent } from './layout/components/shell/shell.component';

export const routes: Routes = [
  {
    path: 'auth',
    children: [
      { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ]
  },
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'hr/employees', loadComponent: () => import('./features/hr/employees/employees.component').then(m => m.EmployeesComponent) },
      { path: 'hr/attendance', loadComponent: () => import('./features/hr/attendance/attendance.component').then(m => m.AttendanceComponent) },
      { path: 'hr/leaves', loadComponent: () => import('./features/hr/leaves/leaves.component').then(m => m.LeavesComponent) },
      { path: 'machines/registry', loadComponent: () => import('./features/machines/registry/registry.component').then(m => m.MachineRegistryComponent) },
      { path: 'machines/maintenance', loadComponent: () => import('./features/machines/maintenance/maintenance.component').then(m => m.MaintenanceComponent) },
      { path: 'machines/oee', loadComponent: () => import('./features/machines/oee/oee.component').then(m => m.OeeComponent) },
      { path: 'inventory/items', loadComponent: () => import('./features/inventory/items/items.component').then(m => m.ItemsComponent) },
      { path: 'inventory/receive', loadComponent: () => import('./features/inventory/items/items.component').then(m => m.ItemsComponent) },
      { path: 'inventory/reorder', loadComponent: () => import('./features/inventory/reorder/reorder.component').then(m => m.ReorderComponent) },
      { path: 'orders/work-orders', loadComponent: () => import('./features/orders/work-orders/work-orders.component').then(m => m.WorkOrdersComponent) },
      { path: 'orders/quotations', loadComponent: () => import('./features/orders/quotations/quotations.component').then(m => m.QuotationsComponent) },
      { path: 'orders/production', loadComponent: () => import('./features/orders/production/production.component').then(m => m.ProductionComponent) },
      { path: 'finance/ap/vendors', loadComponent: () => import('./features/finance/ap/vendors/vendors.component').then(m => m.VendorsComponent) },
      { path: 'finance/ap/purchase-orders', loadComponent: () => import('./features/finance/ap/vendors/vendors.component').then(m => m.VendorsComponent) },
      { path: 'finance/ap/bills', loadComponent: () => import('./features/finance/ap/vendors/vendors.component').then(m => m.VendorsComponent) },
      { path: 'finance/ar/customers', loadComponent: () => import('./features/finance/ar/customers/customers.component').then(m => m.CustomersComponent) },
      { path: 'finance/ar/invoices', loadComponent: () => import('./features/finance/ar/customers/customers.component').then(m => m.CustomersComponent) },
      { path: 'finance/ar/aging', loadComponent: () => import('./features/finance/ar/customers/customers.component').then(m => m.CustomersComponent) },
      { path: 'settings/tenants', loadComponent: () => import('./features/settings/tenant/tenant.component').then(m => m.TenantComponent) },
      { path: 'settings/company', loadComponent: () => import('./features/settings/company/company.component').then(m => m.CompanyComponent) },
      { path: 'settings/departments', loadComponent: () => import('./features/settings/departments/departments.component').then(m => m.DepartmentsComponent) },
      { path: 'settings/designations', loadComponent: () => import('./features/settings/designations/designations.component').then(m => m.DesignationsComponent) },
      { path: 'settings/financial-year', loadComponent: () => import('./features/settings/financial-year/financial-year.component').then(m => m.FinancialYearComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ]
  },
  { path: '**', redirectTo: '/dashboard' }
];
