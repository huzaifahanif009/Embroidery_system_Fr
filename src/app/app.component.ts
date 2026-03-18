import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogComponent } from './shared/components/confirm-dialog/confirm-dialog.component';
@Component({
  selector: 'erp-root',
  standalone: true,
  imports: [RouterOutlet, ToastModule, ConfirmDialogComponent],
  template: `<p-toast position="top-right"></p-toast><erp-confirm></erp-confirm><router-outlet></router-outlet>`
})
export class AppComponent { }
