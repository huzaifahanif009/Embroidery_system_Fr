import { Component, ViewEncapsulation } from "@angular/core";
import { ConfirmDialogModule } from "primeng/confirmdialog";

@Component({
  selector: "erp-confirm",
  standalone: true,
  imports: [ConfirmDialogModule],
  encapsulation: ViewEncapsulation.None,
  template: `
    <p-confirmDialog
      [style]="{ width: '400px' }"
      styleClass="studio-confirm"
      rejectButtonStyleClass="modal-btn"
      acceptButtonStyleClass="modal-btn"
      maskStyleClass="studio-mask"
    >
    </p-confirmDialog>
  `,
  styles: [
    `
      .studio-confirm.p-dialog {
        background: #fdfcf8;
        border-radius: 16px;
      }
      .studio-confirm .p-dialog-header,
      .studio-confirm .p-dialog-content,
      .studio-confirm .p-dialog-footer {
        background: #fdfcf8;
        border: none;
      }

      .studio-confirm .p-confirm-dialog-icon {
        color: #c5a059;
        font-size: 2rem;
      }

      .studio-confirm .modal-btn {
        background-color: #2d3a2e !important;
        color: #f5f4ef !important;
        border: none !important;
        padding: 5px 10px !important;
        border-radius: 5px !important;
        font-weight: 500;
        transition: opacity 0.2s;
        font-size: 12px !important;
      }

      .studio-confirm .modal-btn:hover {
        opacity: 0.9;
      }

      .studio-mask {
        backdrop-filter: blur(2px);
        background-color: rgba(26, 46, 38, 0.3) !important;
      }
    `,
  ],
})
export class ConfirmDialogComponent {}
