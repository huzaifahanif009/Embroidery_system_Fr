import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ModalMode } from '../../../core/models';

@Component({
  selector: 'erp-modal',
  standalone: true,
  imports: [CommonModule, DialogModule],
  template: `
    <p-dialog [(visible)]="visible" [header]="header" [modal]="true"
      [closable]="true" [draggable]="false" [resizable]="false"
      [style]="{ width: width, maxHeight: '90vh' }"
      (onHide)="visibleChange.emit(false); cancel.emit()">

      <ng-content></ng-content>

      <ng-template pTemplate="footer">
        <div style="display:flex;justify-content:flex-end;gap:8px">
          <button class="tw-btn tw-btn-outline tw-btn-sm" (click)="cancel.emit(); visibleChange.emit(false)">
            <i class="pi pi-times" style="font-size:11px"></i> {{ mode === 'view' ? 'Close' : 'Cancel' }}
          </button>
          <button *ngIf="mode !== 'view'" class="tw-btn tw-btn-primary tw-btn-sm" [disabled]="saving" (click)="save.emit()">
            <i class="pi" [class.pi-check]="!saving" [class.pi-spin]="saving" [class.pi-spinner]="saving" style="font-size:11px"></i>
            {{ saving ? 'Saving...' : 'Save' }}
          </button>
        </div>
      </ng-template>
    </p-dialog>
  `
})
export class ModalComponent {
  @Input() visible = false;
  @Input() header  = '';
  @Input() mode: ModalMode = 'create';
  @Input() saving  = false;
  @Input() width   = '580px';
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save   = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}
