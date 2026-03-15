import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'grid-actions',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid-actions-wrapper">
      <button class="action-btn view-btn" title="View" (click)="onView()">
        <i class="pi pi-eye"></i>
      </button>
      <div class="action-divider"></div>
      <button class="action-btn edit-btn" title="Edit" (click)="onEdit()">
        <i class="pi pi-pencil"></i>
      </button>
      <div class="action-divider"></div>
      <button class="action-btn del-btn" title="Delete" (click)="onDelete()">
        <i class="pi pi-trash"></i>
      </button>
    </div>
  `,
  styles: [`
    /* Using your Studio Palette */
    :host {
      --dark-green: #1a2e26;
      --forest-green: #2d4a3e;
      --cream-hover: #f0eee4;
      --accent-gold: #c5a059;
      --studio-red: #9f1239;
    }

    .grid-actions-wrapper {
      display: flex;
      align-items: center;
      // gap: 4px;
      height: 100%;
      // padding: 0 4px;
    }

    .action-btn {
      display: inline-flex; 
      align-items: center; 
      justify-content: center;
      width: 28px; 
      height: 28px; 
      border-radius: 8px;
      border: 1px solid transparent; 
      cursor: pointer;
      transition: all .2s cubic-bezier(0.4, 0, 0.2, 1); 
      font-size: 13px; 
      background: transparent;
    }

    /* Primary Actions (View/Edit) in Forest Green */
    .view-btn { color: var(--forest-green); }
    .edit-btn { color: var(--forest-green); }
    
    .view-btn:hover, .edit-btn:hover { 
      background: var(--cream-hover); 
      border-color: #e8e6df; 
      color: var(--dark-green);
      transform: translateY(-1px);
    }

    /* Delete Action in Studio Red */
    .del-btn { color: var(--studio-red); opacity: 0.7; }
    .del-btn:hover { 
      background: #fff1f2; 
      border-color: #ffe4e6; 
      color: #e11d48; 
      opacity: 1;
      transform: translateY(-1px);
    }

    .action-divider {
      width: 1px;
      height: 14px;
      background: #6e8078ff;
      margin: 0 2px;
    }

    /* Accessibility focus state */
    .action-btn:focus {
      outline: none;
      box-shadow: 0 0 0 2px rgba(45, 74, 62, 0.2);
    }
  `]
})
export class GridActionsComponent implements ICellRendererAngularComp {
  private params!: ICellRendererParams & {
    onView?: (d: unknown) => void;
    onEdit?: (d: unknown) => void;
    onDelete?: (d: unknown) => void;
  };

  agInit(p: ICellRendererParams): void {
    this.params = p as typeof this.params;
  }

  refresh(): boolean { return false; }

  onView() { this.params?.onView?.(this.params.data); }
  onEdit() { this.params?.onEdit?.(this.params.data); }
  onDelete() { this.params?.onDelete?.(this.params.data); }
}