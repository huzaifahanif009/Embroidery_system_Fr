import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'erp-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <!-- Page title row -->
      <div class="tw-flex tw-items-center tw-justify-between tw-mb-4">
        <div>
          <h1 class="tw-page-title">Dashboard</h1>
          <p class="tw-page-sub">{{ today }}</p>
        </div>
        <div class="tw-flex tw-gap-2">
          <div class="tab-group">
            <button class="tab-btn tab-active">Overview</button>
            <button class="tab-btn">Orders</button>
            <button class="tab-btn">Production</button>
            <button class="tab-btn">Analytics</button>
          </div>
          <button class="tw-btn tw-btn-outline tw-btn-sm">
            <i class="pi pi-filter" style="font-size:11px"></i> Filter
          </button>
          <button class="tw-btn tw-btn-outline tw-btn-sm">
            <i class="pi pi-calendar" style="font-size:11px"></i> This Month
          </button>
          <button class="tw-btn tw-btn-outline tw-btn-sm">
            <i class="pi pi-download" style="font-size:11px"></i> Export
          </button>
          <button class="tw-btn tw-btn-primary tw-btn-sm">
            <i class="pi pi-plus" style="font-size:11px"></i> New Order
          </button>
        </div>
      </div>

      <!-- Stat cards -->
      <div class="tw-grid-4 tw-mb-4">
        <div class="stat-card" *ngFor="let s of stats">
          <div class="stat-label">{{ s.label }}</div>
          <div class="stat-value">{{ s.value }}</div>
          <div class="stat-sub" [class.stat-up]="s.up" [class.stat-down]="!s.up">
            <i class="pi" [class.pi-arrow-up]="s.up" [class.pi-arrow-down]="!s.up"></i>
            {{ s.sub }}
          </div>
        </div>
      </div>

      <!-- Main content row -->
      <div style="display:grid;grid-template-columns:1fr 340px;gap:16px">

        <!-- Recent Orders -->
        <div class="tw-card tw-p-4">
          <div class="tw-flex tw-items-center tw-justify-between tw-mb-3">
            <span class="tw-section-title">Recent Orders</span>
            <span class="tw-text-xs tw-text-subtle">Last 7 days</span>
          </div>
          <table class="tw-table">
            <thead>
              <tr>
                <th>Order</th><th>Customer</th><th>Status</th><th style="text-align:right">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let o of recentOrders">
                <td style="color:#2d3a2e;font-weight:500;font-size:12px">{{ o.number }}</td>
                <td style="font-size:13px">{{ o.customer }}</td>
                <td>
                  <span class="tw-badge" [ngClass]="getBadge(o.status)">{{ o.status }}</span>
                </td>
                <td style="text-align:right;font-weight:600;font-size:13px">{{ o.amount }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Today's Tasks -->
        <div class="tw-card tw-p-4">
          <div class="tw-flex tw-items-center tw-justify-between tw-mb-3">
            <span class="tw-section-title">Today's Tasks</span>
            <span class="tw-text-xs tw-text-subtle">4 pending</span>
          </div>
          <div class="task-list">
            <div class="task-row" *ngFor="let t of tasks">
              <div class="task-dot" [style.background]="t.dotColor"></div>
              <div style="flex:1">
                <div style="font-size:13px">{{ t.label }}</div>
              </div>
              <span class="task-time" [class.task-overdue]="t.overdue">{{ t.time }}</span>
            </div>
          </div>

          <div style="margin-top:20px;border-top:1px solid #f0ede6;padding-top:14px">
            <div class="prog-row">
              <span class="tw-text-xs tw-text-subtle">Monthly Production Target</span>
              <span class="tw-text-xs tw-font-semibold">74%</span>
            </div>
            <div class="prog-bar"><div class="prog-fill" style="width:74%;background:#2d3a2e"></div></div>
            <div class="prog-row tw-mt-2">
              <span class="tw-text-xs tw-text-subtle">Thread Inventory</span>
              <span class="tw-text-xs tw-font-semibold" style="color:var(--tw-red)">31%</span>
            </div>
            <div class="prog-bar"><div class="prog-fill" style="width:31%;background:var(--tw-red)"></div></div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .tab-group { display: flex; background: #f5f4ef; border: 1px solid #e8e6df; border-radius: 7px; padding: 2px; gap: 1px; }
    .tab-btn { padding: 5px 12px; border-radius: 5px; border: none; background: transparent; font-size: 13px; font-family: inherit; color: #6b7060; cursor: pointer; transition: all .12s; }
    .tab-active { background: #2d3a2e !important; color: #e8e4d8 !important; font-weight: 500; }
    .tab-btn:not(.tab-active):hover { background: white; color: #1c2420; }

    .stat-card { background: white; border: 1px solid #e8e6df; border-radius: 8px; padding: 16px 18px; box-shadow: 0 1px 3px rgba(0,0,0,.04); }
    .stat-label { font-size: 12px; color: #9a9688; margin-bottom: 6px; }
    .stat-value { font-size: 28px; font-weight: 700; color: #1c2420; line-height: 1.1; margin-bottom: 6px; }
    .stat-sub { display: flex; align-items: center; gap: 4px; font-size: 12px; }
    .stat-up   { color: #2d7a4f; } .stat-down { color: #b83232; }

    .task-list { display: flex; flex-direction: column; gap: 0; }
    .task-row  { display: flex; align-items: center; gap: 10px; padding: 8px 0; border-bottom: 1px solid #f5f4ef; }
    .task-dot  { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
    .task-time { font-size: 12px; color: #9a9688; white-space: nowrap; flex-shrink: 0; }
    .task-overdue { color: var(--tw-red) !important; }

    .prog-row  { display: flex; justify-content: space-between; align-items: center; }
    .prog-bar  { height: 4px; background: #f0ede6; border-radius: 2px; margin-top: 4px; overflow: hidden; }
    .prog-fill { height: 100%; border-radius: 2px; transition: width .5s; }
  `]
})
export class DashboardComponent {
  today = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date());

  stats = [
    { label: 'Active Orders',      value: '47',      sub: '12% from last week', up: true  },
    { label: 'Revenue (Month)',    value: '$18,420',  sub: '8.3%',               up: true  },
    { label: 'Pending Delivery',   value: '11',       sub: '2 overdue',          up: false },
    { label: 'Machines Active',    value: '6 / 8',    sub: '2 under maintenance', up: false },
  ];

  recentOrders = [
    { number: '#ORD-841', customer: 'Al-Noor Uniforms',  status: 'In Progress', amount: '$1,200' },
    { number: '#ORD-840', customer: 'Royal Sports Club', status: 'Completed',   amount: '$3,500' },
    { number: '#ORD-839', customer: 'Crescent School',   status: 'Dispatched',  amount: '$880'   },
    { number: '#ORD-838', customer: 'Galaxy Corp',       status: 'On Hold',     amount: '$2,100' },
    { number: '#ORD-837', customer: 'Hafeez & Sons',     status: 'In Progress', amount: '$640'   },
  ];

  tasks = [
    { label: 'Logo patch — Al-Noor (300 pcs)', dotColor: '#c8b560', time: '5 pm',    overdue: false },
    { label: 'Jersey print — Royal Sports',    dotColor: '#2d7a4f', time: 'Tomorrow', overdue: false },
    { label: 'School crest samples — Crescent',dotColor: '#2563a8', time: 'Mar 16',   overdue: false },
    { label: 'Digitizing approval — Galaxy Corp',dotColor:'#b83232',time: 'Overdue',  overdue: true  },
  ];

  getBadge(status: string): string {
    const m: Record<string,string> = {
      'In Progress': 'tw-badge-amber', 'Completed': 'tw-badge-green',
      'Dispatched': 'tw-badge-blue', 'On Hold': 'tw-badge-red',
    };
    return m[status] ?? 'tw-badge-slate';
  }
}
