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
  selector: 'erp-employees',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ErpGridComponent, ModalComponent,
    PageHeaderComponent, ConfirmDialogComponent, DialogModule],
  template: `
    <erp-confirm></erp-confirm>
    <erp-page-header title="Employee Master" subtitle="HR employee records" (newClick)="openCreate()"></erp-page-header>
    <erp-grid [rowData]="rows" [columnDefs]="cols" (rowAction)="onAction($event)"></erp-grid>
    <erp-modal [(visible)]="showModal" [header]="modalTitle" [mode]="mode" [saving]="saving"
      (save)="onSave()" (cancel)="close()">
      <form [formGroup]="form" class="fg">
        <div class="tw-form-group">
          <label class="tw-label-field">Employee Code *</label>
          <input formControlName="empCode" class="tw-input" [readonly]="mode==='view'" placeholder="EMP-001" />
        </div>
        <div class="tw-form-group">
          <label class="tw-label-field">Department *</label>
          <select formControlName="department" class="tw-select" [attr.disabled]="mode==='view'?true:null">
            <option value="">Select...</option>
            <option *ngFor="let d of deptOpts" [value]="d">{{ d }}</option>
          </select>
        </div>
        <div class="tw-form-group">
          <label class="tw-label-field">First Name *</label>
          <input formControlName="firstName" class="tw-input" [readonly]="mode==='view'" />
        </div>
        <div class="tw-form-group">
          <label class="tw-label-field">Last Name *</label>
          <input formControlName="lastName" class="tw-input" [readonly]="mode==='view'" />
        </div>
        <div class="tw-form-group">
          <label class="tw-label-field">Phone</label>
          <input formControlName="phone" class="tw-input" [readonly]="mode==='view'" />
        </div>
        <div class="tw-form-group">
          <label class="tw-label-field">Email</label>
          <input formControlName="email" class="tw-input" [readonly]="mode==='view'" />
        </div>
        <div class="tw-form-group">
          <label class="tw-label-field">Designation *</label>
          <input formControlName="designation" class="tw-input" [readonly]="mode==='view'" />
        </div>
        <div class="tw-form-group">
          <label class="tw-label-field">Employment Type *</label>
          <select formControlName="employmentType" class="tw-select" [attr.disabled]="mode==='view'?true:null">
            <option value="full_time">Full Time</option>
            <option value="part_time">Part Time</option>
            <option value="contract">Contract</option>
            <option value="intern">Intern</option>
          </select>
        </div>
        <div class="tw-form-group">
          <label class="tw-label-field">Joining Date *</label>
          <input type="date" formControlName="joiningDate" class="tw-input" [readonly]="mode==='view'" />
        </div>
        <div class="tw-form-group">
          <label class="tw-label-field">Base Salary (PKR) *</label>
          <input type="number" formControlName="baseSalary" class="tw-input" [readonly]="mode==='view'" />
        </div>
        <div class="tw-form-group">
          <label class="tw-label-field">Status</label>
          <select formControlName="status" class="tw-select" [attr.disabled]="mode==='view'?true:null">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </form>
    </erp-modal>
  `,
  styles: [`.fg { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .fc { grid-column: 1 / -1; }`]
})
export class EmployeesComponent extends BaseComponent implements OnInit {
  rows: unknown[] = [];
  showModal = false;
  mode: ModalMode = 'create';
  form!: FormGroup;
  selected: Record<string, unknown> | null = null;
  deptOpts = ['Production', 'HR', 'Finance', 'QC', 'IT'];

  get modalTitle(): string {
    return ({ create: 'New Employee', edit: 'Edit Employee', view: 'Employee Details' } as Record<string, string>)[this.mode];
  }

  cols: ColDef[] = [
    { field: 'empCode', headerName: 'Code', width: 100, pinned: 'left' },
    { field: 'firstName', headerName: 'First Name', flex: 1 },
    { field: 'lastName', headerName: 'Last Name', flex: 1 },
    { field: 'department', headerName: 'Dept', width: 110 },
    { field: 'designation', headerName: 'Designation', flex: 1 },
    { field: 'employmentType', headerName: 'Type', width: 110,
      valueFormatter: (p: { value: string }) => ({ full_time: 'Full Time', part_time: 'Part Time', contract: 'Contract', intern: 'Intern' })[p.value] ?? p.value },
    { field: 'baseSalary', headerName: 'Salary', width: 120,
      valueFormatter: (p: { value: number }) => `PKR ${Number(p.value).toLocaleString()}` },
    { field: 'status', headerName: 'Status', width: 90,
      cellRenderer: (p: { value: string }) => `<span class="tw-badge ${p.value === 'active' ? 'tw-badge-green' : 'tw-badge-slate'}">${p.value}</span>` },
    { headerName: 'Actions', width: 110, pinned: 'right', sortable: false, filter: false,
      cellRenderer: GridActionsComponent,
      cellRendererParams: {
        onView:   (d: unknown) => this.onAction({ action: 'view',   data: d }),
        onEdit:   (d: unknown) => this.onAction({ action: 'edit',   data: d }),
        onDelete: (d: unknown) => this.onAction({ action: 'delete', data: d }),
      }},
  ];

  constructor(
    private mock: MockService,
    private toast: ToastService,
    private fb: FormBuilder,
    private confirm: ConfirmationService,
  ) { super(); }

  ngOnInit(): void {
    this.rows = [...this.mock.employees];
    this.form = this.fb.group({
      empCode: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      department: ['', Validators.required],
      phone: [''],
      email: [''],
      designation: ['', Validators.required],
      employmentType: ['full_time', Validators.required],
      joiningDate: ['', Validators.required],
      baseSalary: [0, [Validators.required, Validators.min(0)]],
      status: ['active'],
      gender: ['M'],
    });
  }

  openCreate(): void {
    this.mode = 'create';
    this.form.reset({ employmentType: 'full_time', status: 'active', baseSalary: 0, gender: 'M' });
    this.form.enable();
    this.showModal = true;
  }

  onAction(e: { action: string; data: unknown }): void {
    const row = e.data as Record<string, unknown>;
    if (e.action === 'delete') {
      this.confirm.confirm({
        message: `Delete employee ${row['empCode']}?`, header: 'Confirm Delete',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.mock.employees = this.mock.employees.filter(x => x.id !== row['id']);
          this.rows = [...this.mock.employees];
          this.toast.success('Deleted');
        }
      });
    } else {
      this.selected = row;
      this.mode = e.action as ModalMode;
      this.form.patchValue(row);
      if (e.action === 'view') this.form.disable(); else this.form.enable();
      this.showModal = true;
    }
  }

  onSave(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    setTimeout(() => {
      const val = this.form.getRawValue();
      if (this.mode === 'create') {
        this.mock.employees.push({ ...val, id: Date.now().toString() } as typeof this.mock.employees[0]);
      } else if (this.selected) {
        const idx = this.mock.employees.findIndex(x => x.id === this.selected!['id']);
        if (idx > -1) this.mock.employees[idx] = { ...this.mock.employees[idx], ...val };
      }
      this.rows = [...this.mock.employees];
      this.saving = false;
      this.showModal = false;
      this.toast.success('Saved', `Employee ${this.mode === 'create' ? 'created' : 'updated'}`);
    }, 500);
  }

  close(): void { this.showModal = false; this.form.enable(); }
}
