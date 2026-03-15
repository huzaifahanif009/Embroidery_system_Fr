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
  selector: 'erp-attendance', standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ErpGridComponent, ModalComponent,
    PageHeaderComponent, ConfirmDialogComponent, DialogModule],
  template: `
    <erp-confirm></erp-confirm>
    <erp-page-header title="Attendance" subtitle="Daily attendance records" (newClick)="openCreate()"></erp-page-header>
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
            <option value="Usman Sheikh">Usman Sheikh</option>
          </select>
        </div>
        <div class="tw-form-group">
          <label class="tw-label-field">Date</label>
          <input type="date" formControlName="date" class="tw-input" [readonly]="mode==='view'" />
        </div>
        <div class="tw-form-group">
          <label class="tw-label-field">Check In</label>
          <input type="time" formControlName="checkIn" class="tw-input" [readonly]="mode==='view'" />
        </div>
        <div class="tw-form-group">
          <label class="tw-label-field">Check Out</label>
          <input type="time" formControlName="checkOut" class="tw-input" [readonly]="mode==='view'" />
        </div>
        <div class="tw-form-group">
          <label class="tw-label-field">Status</label>
          <select formControlName="status" class="tw-select" [attr.disabled]="mode==='view'?true:null">
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="late">Late</option>
            <option value="half_day">Half Day</option>
          </select>
        </div>
        <div class="tw-form-group">
          <label class="tw-label-field">Source</label>
          <select formControlName="source" class="tw-select" [attr.disabled]="mode==='view'?true:null">
            <option value="biometric">Biometric</option>
            <option value="manual">Manual</option>
            <option value="mobile">Mobile</option>
          </select>
        </div>
      </form>
    </erp-modal>
  `
})
export class AttendanceComponent extends BaseComponent implements OnInit {
  rows: unknown[] = [];
  showModal = false; mode: ModalMode = 'create';
  form!: FormGroup; selected: Record<string, unknown> | null = null;

  get modalTitle(): string {
    return ({ create: 'New Entry', edit: 'Edit Entry', view: 'Attendance Details' } as Record<string, string>)[this.mode];
  }

  cols: ColDef[] = [
    { field: 'empCode', headerName: 'Code', width: 100 },
    { field: 'employeeName', headerName: 'Employee', flex: 1 },
    { field: 'date', headerName: 'Date', width: 110 },
    { field: 'checkIn', headerName: 'In', width: 90 },
    { field: 'checkOut', headerName: 'Out', width: 90 },
    { field: 'status', headerName: 'Status', width: 100,
      cellRenderer: (p: { value: string }) => {
        const m: Record<string, string> = { present: 'tw-badge-green', absent: 'tw-badge-red', late: 'tw-badge-amber', half_day: 'tw-badge-amber' };
        return `<span class="tw-badge ${m[p.value] || 'tw-badge-slate'}">${p.value}</span>`;
      }
    },
    { field: 'overtimeHrs', headerName: 'OT Hrs', width: 80 },
    { field: 'source', headerName: 'Source', width: 100 },
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
    this.rows = [...this.mock.attendance];
    this.form = this.fb.group({
      employeeName: ['', Validators.required], empCode: [''],
      date: ['', Validators.required], checkIn: [''], checkOut: [''],
      status: ['present', Validators.required], overtimeHrs: [0], source: ['manual', Validators.required]
    });
  }

  openCreate(): void { this.mode = 'create'; this.form.reset({ status: 'present', source: 'manual', overtimeHrs: 0 }); this.form.enable(); this.showModal = true; }

  onAction(e: { action: string; data: unknown }): void {
    const row = e.data as Record<string, unknown>;
    if (e.action === 'delete') {
      this.confirm.confirm({ message: 'Delete this record?', header: 'Confirm', icon: 'pi pi-exclamation-triangle',
        accept: () => { this.mock.attendance = this.mock.attendance.filter(x => x.id !== row['id']); this.rows = [...this.mock.attendance]; this.toast.success('Deleted'); }
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
      if (this.mode === 'create') this.mock.attendance.push({ ...val, id: Date.now().toString() } as typeof this.mock.attendance[0]);
      else if (this.selected) { const idx = this.mock.attendance.findIndex(x => x.id === this.selected!['id']); if (idx > -1) this.mock.attendance[idx] = { ...this.mock.attendance[idx], ...val }; }
      this.rows = [...this.mock.attendance]; this.saving = false; this.showModal = false; this.toast.success('Saved');
    }, 500);
  }
  close(): void { this.showModal = false; this.form.enable(); }
}
