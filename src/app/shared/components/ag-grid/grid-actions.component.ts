import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'erp-grid-actions',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="display:flex;align-items:center;gap:2px">
      <button class="action-btn view-btn" title="View" (click)="onView()">
        <i class="pi pi-eye"></i>
      </button>
      <button class="action-btn edit-btn" title="Edit" (click)="onEdit()">
        <i class="pi pi-pencil"></i>
      </button>
      <button class="action-btn del-btn" title="Delete" (click)="onDelete()">
        <i class="pi pi-trash"></i>
      </button>
    </div>
  `,
  styles: [`
    .action-btn {
      display:inline-flex; align-items:center; justify-content:center;
      width:26px; height:26px; border-radius:5px;
      border:1px solid transparent; cursor:pointer;
      transition:all .12s; font-size:12px; background:transparent;
    }
    .view-btn { color:#2563a8; }
    .view-btn:hover { background:#e8f0fb; border-color:#c8d9f2; }
    .edit-btn { color:#2d7a4f; }
    .edit-btn:hover { background:#e8f5ee; border-color:#b8dfc9; }
    .del-btn  { color:#b83232; }
    .del-btn:hover  { background:#fde8e8; border-color:#f5c5c5; }
  `]
})
export class GridActionsComponent implements ICellRendererAngularComp {
  private params!: ICellRendererParams & {
    onView?: (d: unknown) => void;
    onEdit?: (d: unknown) => void;
    onDelete?: (d: unknown) => void;
  };

  agInit(p: ICellRendererParams): void { this.params = p as typeof this.params; }
  refresh(): boolean { return false; }
  onView()   { this.params?.onView?.(this.params.data); }
  onEdit()   { this.params?.onEdit?.(this.params.data); }
  onDelete() { this.params?.onDelete?.(this.params.data); }
}
