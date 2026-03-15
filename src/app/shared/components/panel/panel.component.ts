import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';

@Component({
    selector: 'emb-panel',
    standalone: true,
    imports: [CommonModule, AccordionModule],
    encapsulation: ViewEncapsulation.None,
    template: `
    <p-accordion [value]="defaultCollapsed ? '' : '0'" styleClass="studio-accordion">
      <p-accordion-panel value="0">
        <p-accordion-header>
          <div class="header-content">
            <span class="title-box">
              <i *ngIf="icon" [class]="'pi ' + icon"></i>
              {{ title }}
            </span>
            
            <div *ngIf="showStatus" class="status-badge" [style.background]="statusColor">
               <i [class]="'pi ' + statusIcon"></i>
            </div>
          </div>
        </p-accordion-header>

        <p-accordion-content>
          <div class="accordion-body">
            <ng-content></ng-content>
          </div>
        </p-accordion-content>
      </p-accordion-panel>
    </p-accordion>
  `,
    styles: [`
    .studio-accordion.p-accordion {
      border: 1px solid #e8e6df;
      border-radius: 12px;
      overflow: hidden;
      background: #fdfcf8;
    }

    .studio-accordion .p-accordion-panel {
      border: none;
    }

    .studio-accordion .p-accordion-header {
      background: transparent !important;
      border: none !important;
      color: #1a2e26 !important;
      padding: 16px 20px !important;
      font-size: 14px !important;
      font-weight: 700 !important;
      transition: all 0.2s !important;
    }

    .studio-accordion .p-accordion-header:hover {
      background: #f0eee4 !important;
    }

    .header-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding-right: 10px;
    }

    .title-box { display: flex; align-items: center; gap: 10px; }
    .title-box i { color: #c5a059; font-size: 16px; }

    .status-badge {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 10px;
    }

    .studio-accordion .p-accordion-content {
      background: #ffffff !important;
      border: none !important;
      border-top: 1px solid #f0eee4 !important;
      padding: 24px !important;
    }
  `]
})
export class EmbPanelComponent {
    @Input() title: string = '';
    @Input() icon: string = ''; // e.g., 'pi-map-marker'
    @Input() defaultCollapsed: boolean = false;
    @Input() set header(v: string) { this.title = v; }

    // Status Badge Inputs
    @Input() showStatus: boolean = false;
    @Input() statusIcon: string = 'pi-check';
    @Input() statusColor: string = '#2d4a3e'; // Default Forest Green
}