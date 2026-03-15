import { Component } from '@angular/core';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
@Component({
  selector: 'erp-confirm',
  standalone: true,
  imports: [ConfirmDialogModule],
  template: `<p-confirmDialog [style]="{width:'380px'}" rejectButtonStyleClass="tw-btn tw-btn-outline tw-btn-sm" acceptButtonStyleClass="tw-btn tw-btn-danger tw-btn-sm"></p-confirmDialog>`
})
export class ConfirmDialogComponent {}
