import { Component, Input, ContentChild, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
    selector: 'emb-tabset',
    standalone: true,
    imports: [CommonModule],
    template: `
    <ng-template #content>
      <ng-content></ng-content>
    </ng-template>
  `
})
export class EmbTabsetComponent {
    @Input() tabTitle: string = '';
    @Input() tabIcon: string = '';
    @ViewChild('content', { static: true }) content!: TemplateRef<any>;
}