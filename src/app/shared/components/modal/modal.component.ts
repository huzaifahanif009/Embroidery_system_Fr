import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { DialogModule } from "primeng/dialog";
import { ModalMode } from "../../../core/models";

// Define the available sizes
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

@Component({
  selector: "erp-modal",
  standalone: true,
  imports: [CommonModule, DialogModule],
  encapsulation: ViewEncapsulation.None,
  template: `
    <p-dialog
      [(visible)]="visible"
      [header]="header"
      [modal]="true"
      position="top"
      [closable]="true"
      [focusOnShow]="false"
      [autofocus]="false"
      [draggable]="true"
      [resizable]="false"
      [maximizable]="true"
      [style]="{ width: modalWidth, maxHeight: '90vh' }"
      [breakpoints]="{ '1199px': '75vw', '991px': '85vw', '575px': '95vw' }"
      [appendTo]="'body'"
      styleClass="studio-modal"
      maskStyleClass="backdrop-blur-sm"
      (onHide)="visibleChange.emit(false); cancel.emit()"
    >
      <div class="modal-body-content">
        <ng-content></ng-content>
      </div>

      <ng-template pTemplate="footer">
        <div class="modal-footer-actions">
          <button
            class="modal-btn btn-outline"
            (click)="cancel.emit(); visibleChange.emit(false)"
          >
            <i class="pi pi-times"></i>
            {{ mode === "view" ? "Close" : "Cancel" }}
          </button>

          <button
            *ngIf="mode !== 'view'"
            class="modal-btn btn-primary"
            [disabled]="saving"
            (click)="save.emit()"
          >
            <i
              class="pi"
              [class.pi-check]="!saving"
              [class.pi-spin]="saving"
              [class.pi-spinner]="saving"
            ></i>
            {{ saving ? "Saving..." : "Save Changes" }}
          </button>
        </div>
      </ng-template>
    </p-dialog>
  `,
  styles: [
    `
      .backdrop-blur-sm {
        background-color: rgba(26, 46, 38, 0.4) !important;
        backdrop-filter: blur(1px);
      }

      .studio-modal.p-dialog {
        background: #fdfcf8;
        border-radius: 16px;
        border: 1px solid #e8e6df;
        box-shadow: 0 25px 50px -12px rgba(26, 46, 38, 0.25);
      }

      .studio-modal .p-dialog-header {
        background: #fdfcf8;
        color: #1a2e26;
        padding: 20px 24px;
        border-top-left-radius: 16px;
        border-top-right-radius: 16px;
        border-bottom: 1px solid #f0eee4;
      }

      .studio-modal .p-dialog-content {
        background: #fdfcf8;
        padding: 24px;
        color: #2c3330;
      }

      .studio-modal .p-dialog-footer {
        background: #fdfcf8;
        padding: 16px 24px;
        border-bottom-left-radius: 16px;
        border-bottom-right-radius: 16px;
        border-top: 1px solid #f0eee4;
      }

      .modal-footer-actions { display: flex; justify-content: flex-end; gap: 12px; }

      .modal-btn {
        display: inline-flex; align-items: center; gap: 8px;
        padding: 8px 16px; border-radius: 8px;
        font-weight: 600; font-size: 13px;
        cursor: pointer; transition: all 0.2s;
        border: 1.5px solid transparent;
      }

      .btn-outline { background: transparent; border-color: #e8e6df; color: #2d4a3e; }
      .btn-primary { background: #1a2e26; color: #fdfcf8; }
      .btn-primary:disabled { opacity: 0.6; }
    `,
  ],
})
export class ModalComponent {
  @Input() visible = false;
  @Input() header = "";
  @Input() mode: ModalMode = "create";
  @Input() saving = false;

  // New size input
  @Input() size: ModalSize = 'md';

  // Keep manual width as an override
  @Input() width?: string;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  /**
   * Logic to map Bootstrap sizes to Pixel widths
   */
  get modalWidth(): string {
    if (this.width) return this.width; // Priority to manual width

    switch (this.size) {
      case 'sm': return '400px';
      case 'md': return '600px';
      case 'lg': return '850px';
      case 'xl': return '1140px';
      case 'full': return '95vw';
      default: return '600px';
    }
  }
}