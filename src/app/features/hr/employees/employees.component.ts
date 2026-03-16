import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { ColDef } from 'ag-grid-community';
import { BaseComponent } from '../../../shared/components/base/base.component';
import { ToastService } from '../../../core/services/toast.service';
import { ModalMode } from '../../../core/models';
import { EmployeesService } from '../../../core/services/api/employees.service';
import { SharedModule } from '../../../shared/gerenal/shared.module';

@Component({
  selector: 'erp-employees',
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
      modalSize="lg">
      
      <form [formGroup]="form" class="fg">
        <emb-textbox formControlName="empCode" label="Employee Code *" [readonly]="mode==='view'" placeholder="EMP-001"></emb-textbox>
        <emb-dropdown formControlName="departmentId" label="Department *" [options]="deptOpts" [readonly]="mode==='view'"></emb-dropdown>
        <emb-textbox formControlName="firstName" label="First Name *" [readonly]="mode==='view'"></emb-textbox>
        <emb-textbox formControlName="lastName" label="Last Name *" [readonly]="mode==='view'"></emb-textbox>
        <emb-textbox formControlName="phone" label="Phone" [readonly]="mode==='view'"></emb-textbox>
        <emb-textbox formControlName="email" label="Email" type="email" [readonly]="mode==='view'"></emb-textbox>
        <emb-textbox formControlName="designation" label="Designation *" [readonly]="mode==='view'"></emb-textbox>
        <emb-dropdown formControlName="employmentType" label="Employment Type *" [options]="empTypeOpts" [readonly]="mode==='view'"></emb-dropdown>
        <emb-textbox formControlName="joiningDate" label="Joining Date *" type="date" [readonly]="mode==='view'"></emb-textbox>
        <emb-textbox formControlName="baseSalary" label="Base Salary (PKR) *" type="number" [readonly]="mode==='view'"></emb-textbox>
        <emb-dropdown formControlName="status" label="Status" [options]="statusOpts" [readonly]="mode==='view'"></emb-dropdown>
      </form>
      
    </erp-grid>
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
  deptOpts: any[] = [];

  empTypeOpts = [
    { name: 'Full Time', value: 'full_time' },
    { name: 'Part Time', value: 'part_time' },
    { name: 'Contract', value: 'contract' },
    { name: 'Intern', value: 'intern' }
  ];
  statusOpts = [
    { name: 'Active', value: 'active' },
    { name: 'Inactive', value: 'inactive' }
  ];

  get modalTitle(): string {
    return ({ create: 'New Employee', edit: 'Edit Employee', view: 'Employee Details' } as Record<string, string>)[this.mode];
  }

  cols: ColDef[] = [
    { field: 'empCode', headerName: 'Code', width: 100, },
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
    private toast: ToastService,
    private fb: FormBuilder,
    private employeeService: EmployeesService,
  ) { super(); }

  ngOnInit(): void {
    this.loadEmployees();
    // In a real app, you'd load departments from a service here if needed
    // For now assuming deptOpts are provided or loaded elsewhere
    this.form = this.fb.group({
      empCode: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      departmentId: [null, Validators.required],
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

  loadEmployees(): void {
    this.employeeService.getAll().subscribe({
      next: (res) => {
        this.rows = [...res.data.data];
      },
      error: (err) => console.error(err)
    });
  }

  openCreate(): void {
    this.mode = 'create';
    this.form.reset({ employmentType: 'full_time', status: 'active', baseSalary: 0, gender: 'M' });
    this.form.enable();
    setTimeout(() => this.showModal = true, 50);
  }

  onAction(e: { action: string; data: unknown }): void {
    const row = e.data as Record<string, unknown>;
    if (e.action === 'delete') {
      this.employeeService.delete(row['id'] as number).subscribe({
        next: () => {
          this.rows = this.rows.filter(x => (x as any).id !== row['id']);
          this.toast.success('Deleted');
        },
        error: (err) => {
          this.toast.error('Failed to delete');
          console.error(err);
        }
      });
    } else {
      this.selected = row;
      this.mode = e.action as ModalMode;
      this.form.patchValue(row);
      if (e.action === 'view') this.form.disable(); else this.form.enable();
      setTimeout(() => this.showModal = true, 50);
    }
  }

  onSave(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    const val = this.form.getRawValue();

    if (this.mode === 'create') {
      this.employeeService.create(val)
        .pipe(finalize(() => this.saving = false))
        .subscribe({
          next: (res) => {
            if (res.success) {
              this.rows = [...this.rows, res.data];
              this.showModal = false;
              this.toast.success('Saved', 'Employee created');
            }
          },
          error: (err) => {
            this.toast.error('Failed to create');
            console.error(err);
          }
        });
    } else if (this.selected) {
      this.employeeService.update(this.selected['id'] as number, val)
        .pipe(finalize(() => this.saving = false))
        .subscribe({
          next: (res) => {
            if (res.success) {
              const idx = this.rows.findIndex(x => (x as any).id === this.selected!['id']);
              if (idx > -1) {
                this.rows[idx] = res.data;
                this.rows = [...this.rows];
              }
              this.showModal = false;
              this.toast.success('Saved', 'Employee updated');
            }
          },
          error: (err) => {
            this.toast.error('Failed to update');
            console.error(err);
          }
        });
    }
  }

  close(): void { this.showModal = false; this.form.enable(); }
}
