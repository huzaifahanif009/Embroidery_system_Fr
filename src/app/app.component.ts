import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
@Component({
  selector: 'erp-root',
  standalone: true,
  imports: [RouterOutlet, ToastModule],
  template: `<p-toast position="top-right"></p-toast><router-outlet></router-outlet>`
})
export class AppComponent {}
