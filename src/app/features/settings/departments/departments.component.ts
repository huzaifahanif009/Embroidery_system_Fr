import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ColDef } from 'ag-grid-community';
import { BaseComponent } from '../../../shared/components/base/base.component';
import { ErpGridComponent } from '../../../shared/components/ag-grid/ag-grid.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { ToastService } from '../../../core/services/toast.service';
import { ModalMode } from '../../../core/models';
import { DepartmentsService } from '@core/services/api/departments.service';
@Component({
  selector: 'erp-departments', standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ErpGridComponent, ModalComponent, PageHeaderComponent],
  template: `
<erp-page-header title="Departments" (newClick)="openCreate()"></erp-page-header>
<erp-grid [rowData]="rows" [columnDefs]="cols" gridType="type1" (rowAction)="onAction($event)"></erp-grid>
<erp-modal [(visible)]="showModal" [header]="modalTitle" [mode]="mode" [saving]="saving" (save)="onSave()" (cancel)="close()" width="580px">
  <form [formGroup]="form" class="fg">
    <div class="tw-form-group"><label class="tw-label-field">Code *</label><input formControlName="code" class="tw-input" [readonly]="mode==='view'" /></div>
        <div class="tw-form-group"><label class="tw-label-field">Name *</label><input formControlName="name" class="tw-input" [readonly]="mode==='view'" /></div>
        <div class="tw-form-group"><label class="tw-label-field">Status</label><select formControlName="isActive" class="tw-select" [attr.disabled]="mode==='view'?true:null"><option [ngValue]="true">Active</option><option [ngValue]="false">Inactive</option></select></div>
  </form>
</erp-modal>`,
  styles: ['.fg{display:grid;grid-template-columns:1fr 1fr;gap:12px;}.fc{grid-column:1/-1;}']
})
export class DepartmentsComponent extends BaseComponent implements OnInit {
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
  openCreate(): void { this.mode = 'create'; this.form.reset(); this.form.enable(); this.showModal = true; }
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
      this.form.patchValue(row);
      if (e.action === 'view') this.form.disable(); else this.form.enable();
      this.showModal = true;
    }
  }

  onSave(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    const val = this.form.getRawValue();

    if (this.mode === 'create') {
      this.departmentService.create(val).subscribe({
        next: (res) => {
          this.rows = [...this.rows, res.data];
          this.saving = false;
          this.showModal = false;
          this.toast.success('Department created');
        },
        error: (err) => {
          this.saving = false;
          this.toast.error('Failed to create department');
          console.error(err);
        }
      });
    } else if (this.selected) {
      this.departmentService.update(this.selected['id'] as number, val).subscribe({
        next: (res) => {
          const idx = this.rows.findIndex(x => (x as any).id === this.selected!['id']);
          if (idx > -1) {
            this.rows[idx] = res.data;
            this.rows = [...this.rows];
          }
          this.saving = false;
          this.showModal = false;
          this.toast.success('Department updated');
        },
        error: (err) => {
          this.saving = false;
          this.toast.error('Failed to update department');
          console.error(err);
        }
      });
    }
  }
  close(): void { this.showModal = false; this.form.enable(); }
}