import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { ColDef } from 'ag-grid-community';
import { BaseComponent } from '../../../shared/components/base/base.component';
import { ModalMode } from '../../../core/models';
import { EmployeesService } from '../../../core/services/api/employees.service';
import { SharedModule } from '../../../shared/gerenal/shared.module';
import { DepartmentsService } from '@core/services/api/departments.service';
import { DesignationsService } from '@core/services/api/designations.service';

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
      modalSize="lg"
      (gridRefresh)="onRefresh()">
      
      <form [formGroup]="form" class="fg">
        <emb-textbox formControlName="empCode" label="Employee Code *" [readonly]="mode==='view'" placeholder="EMP-001"></emb-textbox>
        <emb-dropdown formControlName="departmentId" label="Department *" [options]="deptOpts" [readonly]="mode==='view'"></emb-dropdown>
        <emb-textbox formControlName="firstName" label="First Name *" [readonly]="mode==='view'"></emb-textbox>
        <emb-textbox formControlName="lastName" label="Last Name *" [readonly]="mode==='view'"></emb-textbox>
        <emb-textbox formControlName="phone" label="Phone" [readonly]="mode==='view'"></emb-textbox>
        <emb-textbox formControlName="email" label="Email" type="email" [readonly]="mode==='view'"></emb-textbox>
        <emb-dropdown formControlName="designationId" label="Designation *" [options]="designationOpts" [readonly]="mode==='view'"></emb-dropdown>
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
  designationOpts: any[] = [];

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
    { field: 'departmentName', headerName: 'Dept', width: 110 },
    { field: 'designationName', headerName: 'Designation', flex: 1 },
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
    private fb: FormBuilder,
    private employeeService: EmployeesService,
    private departmentsService: DepartmentsService,
    private designationsService: DesignationsService,
  ) { super(); }

  ngOnInit(): void {
    this.loadData();
    this.form = this.fb.group({
      empCode: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      departmentId: [null, Validators.required],
      phone: [''],
      email: [''],
      designationId: ['', Validators.required],
      employmentType: ['full_time', Validators.required],
      joiningDate: ['', Validators.required],
      baseSalary: [0, [Validators.required, Validators.min(0)]],
      status: ['active'],
      gender: ['M'],
    });
  }

  protected override loadData(): void {
    this.employeeService.getAll().subscribe({
      next: (res) => {
        this.rows = [...res.data.data];
      },
      error: (err) => console.error(err)
    });
  }

  loadDepartments() {
    this.departmentsService.getAll().subscribe({
      next: (res) => {
        this.deptOpts = res.data.data.map((x: any) => ({ name: x.name, value: x.id }));
      },
      error: (err) => console.error(err)
    });
  }

  loadDesignations() {
    this.designationsService.getAll().subscribe({
      next: (res) => {
        this.designationOpts = res.data.data.map((x: any) => ({ name: x.name, value: x.id }));
      },
      error: (err) => console.error(err)
    });
  }



  onAction(e: { action: string; data: unknown }): void {
    const row = e.data as Record<string, unknown>;
    if (e.action === 'delete') {
      this.employeeService.delete(row['id'] as number).subscribe({
        next: () => {
          this.rows = this.rows.filter(x => (x as any).id !== row['id']);
          this.showSuccess('Deleted');
        },
        error: (err) => {
          this.showErrors('Failed to delete');
          console.error(err);
        }
      });
    } else {
      this.selected = row;
      this.mode = e.action as ModalMode;
      if (this.mode === 'create') {
        this.form.reset(
          { employmentType: 'full_time', status: 'active', baseSalary: 0, gender: 'M' });
        this.loadDepartments();
        this.loadDesignations();
        this.form.enable();
      } else {
        this.loadDepartments();
        this.loadDesignations();
        this.form.patchValue(row);
        if (this.mode === 'view') this.form.disable(); else this.form.enable();
      }
      setTimeout(() => this.showModal = true, 50);
    }
  }

  onSave(): void {
    debugger
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    const val = {
      ...this.form.getRawValue(),
      baseSalary: Number(this.form.get('baseSalary')?.value)
    };
    if (this.mode === 'create') {
      this.employeeService.create(val)
        .pipe(finalize(() => this.saving = false))
        .subscribe({
          next: (res) => {
            if (res.success) {
              this.rows = [...this.rows, res.data];
              this.showModal = false;
              this.loadData();
              this.showSuccess('Saved', 'Employee created');
            }
          },
          error: (err) => {
            this.showErrors('Failed to create');
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
              this.loadData();
              this.showSuccess('Saved', 'Employee updated');
            }
          },
          error: (err) => {
            this.showErrors('Failed to update');
            console.error(err);
          }
        });
    }
  }

  close(): void { this.showModal = false; this.form.enable(); }
}
