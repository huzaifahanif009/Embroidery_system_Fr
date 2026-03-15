import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'erp-page-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
      <div>
        <h1 class="tw-page-title">{{ title }}</h1>
        <p *ngIf="subtitle" class="tw-page-sub tw-mt-1">{{ subtitle }}</p>
      </div>
      <div style="display:flex;gap:8px;align-items:center">
        <ng-content></ng-content>
        <button *ngIf="showNew" class="tw-btn tw-btn-primary tw-btn-sm" (click)="newClick.emit()">
          <i class="pi pi-plus" style="font-size:11px"></i> New
        </button>
      </div>
    </div>
  `
})
export class PageHeaderComponent {
  @Input() title    = '';
  @Input() subtitle = '';
  @Input() showNew  = true;
  @Output() newClick = new EventEmitter<void>();
}
