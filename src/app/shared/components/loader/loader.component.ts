import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'erp-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="visible" style="position:fixed;inset:0;background:rgba(245,244,239,.7);display:flex;align-items:center;justify-content:center;z-index:9999">
      <div style="display:flex;flex-direction:column;align-items:center;gap:10px">
        <i class="pi pi-spin pi-spinner" style="font-size:28px;color:#2d3a2e"></i>
        <span *ngIf="message" style="font-size:13px;color:#6b7060">{{ message }}</span>
      </div>
    </div>
  `
})
export class LoaderComponent {
  @Input() visible = false;
  @Input() message = '';
}
