import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'erp-shell',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, HeaderComponent],
  template: `
    <div style="display:flex;height:100vh;overflow:hidden">
      <erp-sidebar [collapsed]="sidebarCollapsed"></erp-sidebar>
      <div style="flex:1;display:flex;flex-direction:column;min-width:0;overflow:hidden">
        <erp-header (toggle)="sidebarCollapsed=!sidebarCollapsed"></erp-header>
        <main style="flex:1;overflow-y:auto;padding:20px;background:#f5f4ef">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `
})
export class ShellComponent {
  sidebarCollapsed = false;
}
