import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ColDef } from 'ag-grid-community';
import { ConfirmationService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { BaseComponent } from '../../../shared/components/base/base.component';
import { ErpGridComponent } from '../../../shared/components/ag-grid/ag-grid.component';
import { GridActionsComponent } from '../../../shared/components/ag-grid/grid-actions.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { MockService } from '../../../shared/services/mock.service';
import { ToastService } from '../../../core/services/toast.service';
import { ModalMode } from '../../../core/models';

@Component({
  selector: 'erp-leaves', standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ErpGridComponent, ModalComponent,
    PageHeaderComponent, ConfirmDialogComponent, DialogModule],
  template: `
    <erp-confirm></erp-confirm>
    <erp-page-header title="Leave Management" subtitle="Employee leave requests" (newClick)="openCreate()"></erp-page-header>
    <erp-grid [rowData]="rows" [columnDefs]="cols" (rowAction)="onAction($event)"></erp-grid>
    <erp-modal [(visible)]="showModal" [header]="modalTitle" [mode]="mode" [saving]="saving" (save)="onSave()" (cancel)="close()">
      <form [formGroup]="form" style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div class="tw-form-group">
          <label class="tw-label-field">Employee</label>
          <select formControlName="employeeName" class="tw-select" [attr.disabled]="mode==='view'?true:null">
            <option value="Ali Hassan">Ali Hassan</option>
            <option value="Sara Khan">Sara Khan</option>
            <option value="Ahmed Raza">Ahmed Raza</option>
            <option value="Fatima Malik">Fatima Malik</option>
          </select>
        </div>
        <div class="tw-form-group">
          <label class="tw-label-field">Leave Type</label>
          <select formControlName="leaveType" class="tw-select" [attr.disabled]="mode==='view'?true:null">
            <option value="annual">Annual</option>
            <option value="sick">Sick</option>
            <option value="unpaid">Unpaid</option>
            <option value="maternity">Maternity</option>
          </select>
        </div>
        <div class="tw-form-group">
          <label class="tw-label-field">From Date</label>
          <input type="date" formControlName="fromDate" class="tw-input" [readonly]="mode==='view'" />
        </div>
        <div class="tw-form-group">
          <label class="tw-label-field">To Date</label>
          <input type="date" formControlName="toDate" class="tw-input" [readonly]="mode==='view'" />
        </div>
        <div class="tw-form-group">
          <label class="tw-label-field">Days Count</label>
          <input type="number" formControlName="daysCount" class="tw-input" [readonly]="mode==='view'" />
        </div>
        <div class="tw-form-group">
          <label class="tw-label-field">Status</label>
          <select formControlName="status" class="tw-select" [attr.disabled]="mode==='view'?true:null">
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div class="tw-form-group" style="grid-column:1/-1">
          <label class="tw-label-field">Reason</label>
          <input formControlName="reason" class="tw-input" [readonly]="mode==='view'" />
        </div>
      </form>
    </erp-modal>
  `
})
export class LeavesComponent extends BaseComponent implements OnInit {
  rows: unknown[] = [];
  showModal = false; mode: ModalMode = 'create';
  form!: FormGroup; selected: Record<string, unknown> | null = null;

  get modalTitle(): string {
    return ({ create: 'New Leave Request', edit: 'Edit Request', view: 'Leave Details' } as Record<string, string>)[this.mode];
  }

  cols: ColDef[] = [
    { field: 'empCode', headerName: 'Code', width: 100 },
    { field: 'employeeName', headerName: 'Employee', flex: 1 },
    { field: 'leaveType', headerName: 'Type', width: 100 },
    { field: 'fromDate', headerName: 'From', width: 110 },
    { field: 'toDate', headerName: 'To', width: 110 },
    { field: 'daysCount', headerName: 'Days', width: 70 },
    { field: 'status', headerName: 'Status', width: 100,
      cellRenderer: (p: { value: string }) => {
        const m: Record<string, string> = { approved: 'tw-badge-green', pending: 'tw-badge-amber', rejected: 'tw-badge-red' };
        return `<span class="tw-badge ${m[p.value] || 'tw-badge-slate'}">${p.value}</span>`;
      }
    },
    { headerName: 'Actions', width: 110, pinned: 'right', sortable: false, filter: false,
      cellRenderer: GridActionsComponent,
      cellRendererParams: {
        onView:   (d: unknown) => this.onAction({ action: 'view',   data: d }),
        onEdit:   (d: unknown) => this.onAction({ action: 'edit',   data: d }),
        onDelete: (d: unknown) => this.onAction({ action: 'delete', data: d }),
      }},
  ];

  constructor(private mock: MockService, private toast: ToastService, private fb: FormBuilder, private confirm: ConfirmationService) { super(); }

  ngOnInit(): void {
    this.rows = [...this.mock.leaves];
    this.form = this.fb.group({
      employeeName: ['', Validators.required], empCode: [''],
      leaveType: ['annual', Validators.required], fromDate: ['', Validators.required],
      toDate: ['', Validators.required], daysCount: [1], status: ['pending'], reason: ['']
    });
  }

  openCreate(): void { this.mode = 'create'; this.form.reset({ leaveType: 'annual', daysCount: 1, status: 'pending' }); this.form.enable(); this.showModal = true; }

  onAction(e: { action: string; data: unknown }): void {
    const row = e.data as Record<string, unknown>;
    if (e.action === 'delete') {
      this.confirm.confirm({ message: 'Delete this leave request?', header: 'Confirm', icon: 'pi pi-exclamation-triangle',
        accept: () => { this.mock.leaves = this.mock.leaves.filter(x => x.id !== row['id']); this.rows = [...this.mock.leaves]; this.toast.success('Deleted'); }
      });
    } else {
      this.selected = row; this.mode = e.action as ModalMode; this.form.patchValue(row);
      if (e.action === 'view') this.form.disable(); else this.form.enable(); this.showModal = true;
    }
  }

  onSave(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    setTimeout(() => {
      const val = this.form.getRawValue();
      if (this.mode === 'create') this.mock.leaves.push({ ...val, id: Date.now().toString() } as typeof this.mock.leaves[0]);
      else if (this.selected) { const idx = this.mock.leaves.findIndex(x => x.id === this.selected!['id']); if (idx > -1) this.mock.leaves[idx] = { ...this.mock.leaves[idx], ...val }; }
      this.rows = [...this.mock.leaves]; this.saving = false; this.showModal = false; this.toast.success('Saved');
    }, 500);
  }
  close(): void { this.showModal = false; this.form.enable(); }
}
