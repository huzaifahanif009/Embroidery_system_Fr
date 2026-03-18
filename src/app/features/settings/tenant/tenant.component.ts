import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ColDef } from 'ag-grid-community';
import { BaseComponent } from '../../../shared/components/base/base.component';
import { ToastService } from '../../../core/services/toast.service';
import { ModalMode } from '../../../core/models';
import { SharedModule } from '@shared/gerenal/shared.module';
import { TenantsService } from '@core/services/api/tenants.service';
import { finalize } from 'rxjs';

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
    [showExport]="true"
    (gridRefresh)="onRefresh()"
    exportPrefix="designations"
    modalWidth="580px">
    
    <form [formGroup]="form" class="fg">
      <emb-textbox formControlName="name" label="Name *" [readonly]="mode==='view'"></emb-textbox>
      <emb-textbox formControlName="slug" label="Slug *" [readonly]="mode==='view'"></emb-textbox>
      <emb-dropdown formControlName="planId" label="Plan *" [options]="listOptions" [readonly]="mode==='view'"></emb-dropdown>
      <emb-textbox formControlName="dbSchema" label="DB Schema *" [readonly]="mode==='view'"></emb-textbox>
      <emb-textbox formControlName="settings" label="Settings *" [readonly]="mode==='view'"></emb-textbox>
      <emb-dropdown formControlName="isActive" label="Status" [options]="listOptions" [readonly]="mode==='view'"></emb-dropdown>
    </form>
    
  </erp-grid>`,
  styles: ['.fg{display:grid;grid-template-columns:1fr 1fr;gap:12px;}.fc{grid-column:1/-1;}']
})
export class TenantComponent extends BaseComponent implements OnInit {
  listOptions = [{ name: 'Active', value: true }, { name: 'Inactive', value: false }];

  rows: unknown[] = []; showModal = false; mode: ModalMode = 'create';
  form!: FormGroup;
  selected: Record<string, unknown> | null = null;

  get modalTitle() { return ({ create: 'New', edit: 'Edit', view: 'View' } as Record<string, string>)[this.mode] + ' Designations'; }
  cols: ColDef[] = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'slug', headerName: 'Slug', flex: 1 },
    { field: 'planId', headerName: 'Plan', flex: 1 },
    { field: 'dbSchema', headerName: 'DB Schema', flex: 1 },
    {
      field: 'isActive', headerName: 'Status', width: 80,
      cellRenderer: (p: any) => `<span class="tw-badge ${p.value === true ? 'tw-badge-green' : 'tw-badge-slate'}">${p.value}</span>`
    }
  ];
  constructor(
    private toast: ToastService,
    private fb: FormBuilder,
    private tenantService: TenantsService
  ) { super(); }
  ngOnInit(): void {
    this.loadData();
    this.form = this.fb.group(
      {
        name: ['', Validators.required],
        slug: ['', Validators.required],
        planId: ['', Validators.required],
        dbSchema: ['', Validators.required],
        settings: ['', Validators.required],
        isActive: [true]
      });
  }
  protected override loadData(): void {
    this.tenantService.getAll().subscribe({
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
  openCreate(): void {
    this.mode = 'create'; this.form.reset({ isActive: true }); this.form.enable();
    setTimeout(() => this.showModal = true, 50);
  }
  onAction(e: { action: string; data: unknown }): void {
    const row = e.data as Record<string, unknown>;
    if (e.action === 'delete') {
      this.tenantService.delete(row['id'] as number).subscribe({
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
      this.tenantService.create(val)
        .pipe(finalize(() => this.saving = false))
        .subscribe({
          next: (res: any) => {
            if (res.success) {
              this.rows = [...this.rows, res.data];
              this.showModal = false;
              this.toast.success('Tenant created');
            }
          },
          error: (err) => {
            this.toast.error('Failed to create tenant');
            console.error(err);
          }
        });
    } else if (this.selected) {
      this.tenantService.update(this.selected['id'] as number, val)
        .pipe(finalize(() => this.saving = false))
        .subscribe({
          next: (res: any) => {
            if (res.success) {
              const idx = this.rows.findIndex(x => (x as any).id === this.selected!['id']);
              if (idx > -1) {
                this.rows[idx] = res.data;
                this.rows = [...this.rows];
              }
              this.showModal = false;
              this.toast.success('Tenant updated');
            }
          },
          error: (err) => {
            this.toast.error('Failed to update tenant');
            console.error(err);
          }
        });
    }
  }
  close(): void { this.showModal = false; this.form.enable(); }
}