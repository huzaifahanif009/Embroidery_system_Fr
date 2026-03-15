import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'erp-badge',
  standalone: true,
  imports: [CommonModule],
  template: `<span class="tw-badge" [ngClass]="cls">{{ label || status }}</span>`
})
export class StatusBadgeComponent {
  @Input() status = '';
  @Input() label  = '';
  get cls(): string {
    const m: Record<string,string> = {
      active:'tw-badge-green', approved:'tw-badge-green', completed:'tw-badge-green', paid:'tw-badge-green', received:'tw-badge-green',
      pending:'tw-badge-amber', in_production:'tw-badge-amber', maintenance:'tw-badge-amber', sent:'tw-badge-amber',
      inactive:'tw-badge-slate', retired:'tw-badge-slate', idle:'tw-badge-slate', expired:'tw-badge-slate',
      rejected:'tw-badge-red', terminated:'tw-badge-red', overdue:'tw-badge-red',
      draft:'tw-badge-slate', confirmed:'tw-badge-blue', dispatched:'tw-badge-blue', qc:'tw-badge-purple',
      late:'tw-badge-amber', absent:'tw-badge-red', present:'tw-badge-green',
      open:'tw-badge-green', closed:'tw-badge-slate', posted:'tw-badge-blue',
    };
    return m[this.status?.toLowerCase()] ?? 'tw-badge-slate';
  }
}
