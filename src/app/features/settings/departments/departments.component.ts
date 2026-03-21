import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { ColDef } from 'ag-grid-community';
import { BaseComponent } from '../../../shared/components/base/base.component';
import { ToastService } from '../../../core/services/toast.service';
import { ModalMode } from '../../../core/models';
import { DepartmentsService } from '@core/services/api/departments.service';
import { SharedModule } from '@shared/gerenal/shared.module';
@Component({
  selector: 'emb-departments', standalone: true,
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
  modalWidth="580px" [showExport]="true"
  exportPrefix="departments"
  (gridRefresh)="onRefresh()">
  
  <form [formGroup]="form" class="fg">
    <emb-textbox formControlName="code" label="Code *" [readonly]="mode==='view'"></emb-textbox>
    <emb-textbox formControlName="name" label="Name *" [readonly]="mode==='view'"></emb-textbox>
    <emb-dropdown formControlName="isActive" label="Status" [options]="listOptions" [readonly]="mode==='view'"></emb-dropdown>
  </form>
  
</erp-grid>`,
  styles: ['.fg{display:grid;grid-template-columns:1fr 1fr;gap:12px;}.fc{grid-column:1/-1;}']
})
export class DepartmentsComponent extends BaseComponent implements OnInit {
  listOptions = [{ name: 'Active', value: true }, { name: 'Inactive', value: false }];
  rows: unknown[] = []; showModal = false; mode: ModalMode = 'create';
  form!: FormGroup;
  selected: Record<string, unknown> | null = null;

  get modalTitle() { return ({ create: 'New', edit: 'Edit', view: 'View' } as Record<string, string>)[this.mode] + ' Departments'; }
  cols: ColDef[] = [
    { field: 'code', headerName: 'Code', width: 100 },
    { field: 'name', headerName: 'Department', flex: 1 },
    {
      field: 'isActive', headerName: 'Status', width: 80,
      cellRenderer: (p: any) => `<span class="tw-badge ${p.value === true ? 'tw-badge-green' : 'tw-badge-slate'}">${p.value}</span>`
    }
  ];
  constructor(
    private toast: ToastService,
    private fb: FormBuilder,
    private departmentService: DepartmentsService
  ) { super(); }
  ngOnInit(): void {
    this.loadData();
  }
  protected override loadData(): void {
    this.departmentService.getAll().subscribe({
      next: (res) => {
        this.rows = [...(res.data.data as unknown[])];
      },
      error: (err) => {
        console.error(err);
      }
    });
    this.form = this.fb.group(
      {
        code: ['', Validators.required],
        name: ['', Validators.required],
        isActive: [true]
      });
  }
  onAction(e: { action: string; data: unknown }): void {
    const row = e.data as Record<string, unknown>;
    if (e.action === 'delete') {
      this.departmentService.delete(row['id'] as number).subscribe({
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
      if (this.mode === 'create') {
        this.form.reset({ isActive: true });
        this.form.enable();
      } else {
        this.form.patchValue(row);
        if (this.mode === 'view') this.form.disable(); else this.form.enable();
      }
      setTimeout(() => this.showModal = true, 50);
    }
  }

  onSave(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    const val = this.form.getRawValue();

    if (this.mode === 'create') {
      this.departmentService.create(val)
        .pipe(finalize(() => this.saving = false))
        .subscribe({
          next: (res) => {
            if (res.success) {
              this.rows = [...this.rows, res.data];
              this.showModal = false;
              this.toast.success('Department created');
            }
          },
          error: (err) => {
            this.toast.error('Failed to create department');
            console.error(err);
          }
        });
    } else if (this.selected) {
      this.departmentService.update(this.selected['id'] as number, val)
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
              this.toast.success('Department updated');
            }
          },
          error: (err) => {
            this.toast.error('Failed to update department');
            console.error(err);
          }
        });
    }
  }
  close(): void { this.showModal = false; this.form.enable(); }
}