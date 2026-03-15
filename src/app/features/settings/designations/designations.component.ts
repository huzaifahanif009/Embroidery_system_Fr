import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ColDef } from 'ag-grid-community';
import { BaseComponent } from '../../../shared/components/base/base.component';
import { ToastService } from '../../../core/services/toast.service';
import { ModalMode } from '../../../core/models';
import { DesignationsService } from '@core/services/api/designations.service';
import { SharedModule } from '@shared/gerenal/shared.module';
@Component({
  selector: 'emb-designations', standalone: true,
  imports: [SharedModule],
  template: `
<erp-page-header title="Designations" (newClick)="openCreate()"></erp-page-header>
<erp-grid [rowData]="rows" [columnDefs]="cols" gridType="type1" (rowAction)="onAction($event)"></erp-grid>
<erp-modal [(visible)]="showModal" [header]="modalTitle" [mode]="mode" [saving]="saving" (save)="onSave()" (cancel)="close()" width="580px">
  <form [formGroup]="form" class="fg">
    <emb-textbox formControlName="code" label="Code *" [readonly]="mode==='view'"></emb-textbox>
    <emb-textbox formControlName="name" label="Name *" [readonly]="mode==='view'"></emb-textbox>
    <emb-dropdown formControlName="isActive" label="Status" [options]="listOptions" [readonly]="mode==='view'"></emb-dropdown>
  </form>
</erp-modal>`,
  styles: ['.fg{display:grid;grid-template-columns:1fr 1fr;gap:12px;}.fc{grid-column:1/-1;}']
})
export class DesignationsComponent extends BaseComponent implements OnInit {
  listOptions = [{ name: 'Active', value: true }, { name: 'Inactive', value: false }];

  rows: unknown[] = []; showModal = false; mode: ModalMode = 'create';
  form!: FormGroup;
  selected: Record<string, unknown> | null = null;

  get modalTitle() { return ({ create: 'New', edit: 'Edit', view: 'View' } as Record<string, string>)[this.mode] + ' Designations'; }
  cols: ColDef[] = [
    { field: 'code', headerName: 'Code', width: 100 },
    { field: 'name', headerName: 'Designation', flex: 1 },
    {
      field: 'isActive', headerName: 'Status', width: 80,
      cellRenderer: (p: any) => `<span class="tw-badge ${p.value === true ? 'tw-badge-green' : 'tw-badge-slate'}">${p.value}</span>`
    }
  ];
  constructor(
    private toast: ToastService,
    private fb: FormBuilder,
    private designationService: DesignationsService
  ) { super(); }
  ngOnInit(): void {
    this.designationService.getAll().subscribe({
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
      this.designationService.delete(row['id'] as number).subscribe({
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
      this.designationService.create(val).subscribe({
        next: (res) => {
          this.rows = [...this.rows, res.data];
          this.saving = false;
          this.showModal = false;
          this.toast.success('Designation created');
        },
        error: (err) => {
          this.saving = false;
          this.toast.error('Failed to create designation');
          console.error(err);
        }
      });
    } else if (this.selected) {
      this.designationService.update(this.selected['id'] as number, val).subscribe({
        next: (res) => {
          const idx = this.rows.findIndex(x => (x as any).id === this.selected!['id']);
          if (idx > -1) {
            this.rows[idx] = res.data;
            this.rows = [...this.rows];
          }
          this.saving = false;
          this.showModal = false;
          this.toast.success('Designation updated');
        },
        error: (err) => {
          this.saving = false;
          this.toast.error('Failed to update designation');
          console.error(err);
        }
      });
    }
  }
  close(): void { this.showModal = false; this.form.enable(); }
}