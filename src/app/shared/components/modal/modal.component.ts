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
      [closable]="true"
      [draggable]="true"
      [resizable]="false"
      [style]="{ width: width, maxHeight: '90vh' }"
      styleClass="studio-modal"
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
      /* Styling the Modal Overlay and Container */
      .studio-modal.p-dialog {
        background: #fdfcf8; /* Creamy White */
        border-radius: 20px;
        border: 1px solid #e8e6df;
        box-shadow: 0 25px 50px -12px rgba(26, 46, 38, 0.25);
      }

      /* Header Styling */
      .studio-modal .p-dialog-header {
        background: #fdfcf8;
        color: #1a2e26; /* Dark Green */
        padding: 24px 24px 16px;
        border-top-left-radius: 20px;
        border-top-right-radius: 20px;
        font-weight: 800;
        font-size: 1.25rem;
        letter-spacing: -0.02em;
      }

      .studio-modal .p-dialog-header-icons .p-dialog-header-icon {
        color: #2d4a3e;
        transition: all 0.2s;
      }

      .studio-modal .p-dialog-header-icons .p-dialog-header-icon:hover {
        background: #f0eee4;
        color: #1a2e26;
        border-radius: 8px;
      }

      /* Body Content Styling */
      .studio-modal .p-dialog-content {
        background: #fdfcf8;
        padding: 0 24px 24px;
        color: #2c3330;
      }

      .modal-body-content {
        padding-top: 8px;
        font-size: 14px;
        line-height: 1.6;
      }

      /* Footer Styling */
      .studio-modal .p-dialog-footer {
        background: #fdfcf8;
        padding: 16px 24px 24px;
        border-bottom-left-radius: 20px;
        border-bottom-right-radius: 20px;
        border-top: 1px solid #f0eee4;
      }

      .modal-footer-actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
      }

      /* Button System for Modal */
      .modal-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 10px;
        border-radius: 6px;
        font-weight: 600;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.2s;
        border: 1.5px solid transparent;
      }

      .btn-outline {
        background: transparent;
        border-color: #e8e6df;
        color: #2d4a3e;
      }

      .btn-outline:hover {
        background: #f0eee4;
        color: #1a2e26;
      }

      .btn-primary {
        background: #1a2e26; /* Deep Green */
        color: #fdfcf8;
        box-shadow: 0 4px 12px rgba(26, 46, 38, 0.15);
      }

      .btn-primary:hover:not(:disabled) {
        background: #2d4a3e;
        transform: translateY(-1px);
        box-shadow: 0 6px 15px rgba(26, 46, 38, 0.2);
      }

      .btn-primary:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .modal-btn i {
        font-size: 11px;
      }

      /* Shadow Backdrop Styling */
      .p-component-overlay {
        background-color: rgba(26, 46, 38, 0.4) !important;
        backdrop-filter: blur(4px);
      }
    `,
  ],
})
export class ModalComponent {
  @Input() visible = false;
  @Input() header = "";
  @Input() mode: ModalMode = "create";
  @Input() saving = false;
  @Input() width = "580px";
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}

// [maximizable]="true"
// [breakpoints]="{ '1199px': '75vw', '575px': '90vw' }"
// maskStyleClass="backdrop-blur-sm"