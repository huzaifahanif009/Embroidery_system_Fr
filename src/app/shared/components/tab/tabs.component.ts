import { Component, ContentChildren, QueryList, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'primeng/tabs';
import { EmbTabsetComponent } from './tabset.component';

@Component({
  selector: 'emb-tabs',
  standalone: true,
  imports: [CommonModule, TabsModule],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="studio-tabs-container">
      <p-tabs value="0">
        <p-tablist>
          <p-tab *ngFor="let tab of tabs; let i = index" [value]="i.toString()">
             <div class="flex items-center gap-2">
                <i *ngIf="tab.tabIcon" [class]="'pi ' + tab.tabIcon"></i>
                <span>{{ tab.tabTitle }}</span>
             </div>
          </p-tab>
        </p-tablist>
        <p-tabpanels>
          <p-tabpanel *ngFor="let tab of tabs; let i = index" [value]="i.toString()">
             <div class="pt-4">
               <ng-container *ngTemplateOutlet="tab.content"></ng-container>
             </div>
          </p-tabpanel>
        </p-tabpanels>
      </p-tabs>
    </div>
  `,
  styles: [`
    .studio-tabs-container .p-tablist-tab-list {
      background: transparent;
      border-bottom: 1px solid #e8e6df;
      gap: 8px;
      margin-top: 12px;
    }

    .studio-tabs-container .p-tab {
      background: transparent !important;
      border: none !important;
      color: #536358 !important;
      font-weight: 600 !important;
      font-size: 14px !important;
      padding: 8px 12px !important;
      transition: all 0.2s !important;
      box-shadow: none !important;
      border-bottom: 2px solid transparent !important;
    }

    .studio-tabs-container .p-tab.p-tab-active {
      color: #1a2e26 !important;
      border-bottom: 2px solid #c5a059 !important; /* Gold line */
    }

    .studio-tabs-container .p-tabpanels {
       background: transparent !important;
       padding: 0 !important;
    }

    .studio-tabs-container .pi {
       font-size: 14px;
       color: #c5a059;
    }
  `]
})
export class EmbTabsComponent {
  @ContentChildren(EmbTabsetComponent) tabs!: QueryList<EmbTabsetComponent>;
}