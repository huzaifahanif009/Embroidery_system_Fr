import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ColDef } from 'ag-grid-community';
import { DialogModule } from 'primeng/dialog';
import { BaseComponent } from '../../../shared/components/base/base.component';
import { ErpGridComponent } from '../../../shared/components/ag-grid/ag-grid.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { MockService } from '../../../shared/services/mock.service';
import { ToastService } from '../../../core/services/toast.service';
import { ModalMode } from '../../../core/models';
import { ConfirmationService } from 'primeng/api';
import { SharedModule } from '@shared/gerenal/shared.module';

@Component({
  selector: 'erp-tenants',
  standalone: true,
  imports: [SharedModule],
  template: `
    <erp-grid 
  [rowData]="rows" 
  [columnDefs]="cols" 
  [gridType]="3" 
  (rowAction)="onAction($event)"
  [(showModal)]="showModal"
  [modalHeader]="modalTitle"
  [modalMode]="mode"
  [saving]="saving"
  (save)="onSave()"
  (cancel)="close()"
  modalWidth="580px">
  
  <form [formGroup]="form" class="fg">
    <emb-textbox formControlName="tenantCode" label="Tenant Code *" [readonly]="mode==='view'"></emb-textbox>
    <emb-textbox formControlName="firstName" label="First Name *" [readonly]="mode==='view'"></emb-textbox>
    <emb-textbox formControlName="lastName" label="Last Name *" [readonly]="mode==='view'"></emb-textbox>
    
  </form>
  
</erp-grid>
  `,
  styles: [`.fg { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .fc { grid-column: 1 / -1; }`]
})
export class TenantComponent extends BaseComponent implements OnInit {
  rows: unknown[] = [];
  showModal = false;
  mode: ModalMode = 'create';
  form!: FormGroup;
  selected: Record<string, unknown> | null = null;
  deptOpts = ['Production', 'HR', 'Finance', 'QC', 'IT'];

  get modalTitle(): string {
    return ({ create: 'New Tenant', edit: 'Edit Tenant', view: 'Tenant Details' } as Record<string, string>)[this.mode];
  }

  cols: ColDef[] = [
    { field: 'tenantCode', headerName: 'Code', width: 100, },
    { field: 'firstName', headerName: 'First Name', flex: 1 },
    { field: 'lastName', headerName: 'Last Name', flex: 1 },
    { field: 'department', headerName: 'Dept', width: 110 },
    { field: 'designation', headerName: 'Designation', flex: 1 },
    {
      field: 'employmentType', headerName: 'Type', width: 110,
      valueFormatter: (p: { value: string }) => ({ full_time: 'Full Time', part_time: 'Part Time', contract: 'Contract', intern: 'Intern' })[p.value] ?? p.value
    },
    {
      field: 'baseSalary', headerName: 'Salary', width: 120,
      valueFormatter: (p: { value: number }) => `PKR ${Number(p.value).toLocaleString()}`
    },
    {
      field: 'status', headerName: 'Status', width: 90,
      cellRenderer: (p: { value: string }) => `<span class="tw-badge ${p.value === 'active' ? 'tw-badge-green' : 'tw-badge-slate'}">${p.value}</span>`
    },
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
