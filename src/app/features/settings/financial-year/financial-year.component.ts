
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ColDef } from 'ag-grid-community';
import { BaseComponent } from '../../../shared/components/base/base.component';
import { ToastService } from '../../../core/services/toast.service';
import { ModalMode } from '../../../core/models';
import { FiscalYearsService } from '@core/services/api/fiscal-years.service';
import { SharedModule } from '@shared/gerenal/shared.module';
import { EmbTabsetComponent } from '@shared/components/tab/tabset.component';
import { EmbGridCustomButton } from '@shared/components/ag-grid/ag-grid.component';
@Component({
  selector: 'emb-financial-year', standalone: true,
  imports: [SharedModule, EmbTabsetComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
  modalSize="lg" [showExport]="true"
  exportPrefix="financial-years"
  (gridRefresh)="onRefresh()">
  
  <form [formGroup]="form" class="fg">
    <emb-textbox formControlName="yearCode" label="Code *" [readonly]="mode==='view'"></emb-textbox>
    <emb-textbox formControlName="yearName" label="Name *" [readonly]="mode==='view'"></emb-textbox>
    <emb-textbox type="date" formControlName="startDate" label="Start Date *" [readonly]="mode==='view'"></emb-textbox>
    <emb-textbox type="date" formControlName="endDate" label="End Date *" [readonly]="mode==='view'"></emb-textbox>
    <emb-dropdown formControlName="status" label="Status" [options]="listOptions" [readonly]="mode==='view'"></emb-dropdown>
  </form>
  <emb-tabs>
    <emb-tabset tabTitle="Periods" tabIcon="pi-calendar">
      <erp-grid [rowData]="periodRows" [showRefresh]="false" [columnDefs]="periodsCols" 
      [pagination]="false" [customButtons]="customButtons" 
      (customButtonClick)="onBtnClick($event)"
      [gridType]="1"></erp-grid>
    </emb-tabset>
    <emb-tabset tabTitle="Periods" tabIcon="pi-calendar">
      <erp-grid [rowData]="periodRows" [showRefresh]="false" [columnDefs]="periodsCols" 
      [pagination]="false" [customButtons]="customButtons" 
      (customButtonClick)="onBtnClick($event)"
      [gridType]="1"></erp-grid>
    </emb-tabset>
    <emb-tabset tabTitle="Periods" tabIcon="pi-calendar">
      <erp-grid [rowData]="periodRows" [showRefresh]="false" [columnDefs]="periodsCols" 
      [pagination]="false" [customButtons]="customButtons" 
      (customButtonClick)="onBtnClick($event)"
      [gridType]="1"></erp-grid>
    </emb-tabset>
  </emb-tabs>
  
</erp-grid>`,
  styles: ['.fg{display:grid;grid-template-columns:1fr 1fr;gap:12px;}.fc{grid-column:1/-1;}']
})
export class FinancialYearComponent extends BaseComponent implements OnInit {
  listOptions = [{ name: 'open', value: 'open' }, { name: 'closed', value: 'closed' }, { name: 'archived', value: 'archived' }];
  customButtons: EmbGridCustomButton[] = [
    { name: 'Periods', caption: 'Periods', icon: 'pi pi-calendar', type: 0 },
  ];
  rows: any[] = [];
  periodRows: any[] = [];
  showModal = false;
  mode: ModalMode = 'create';
  form!: FormGroup;
  selected: Record<string, unknown> | null = null;

  get modalTitle() { return ({ create: 'New', edit: 'Edit', view: 'View' } as Record<string, string>)[this.mode] + ' Financial Year'; }
  cols: ColDef[] = [
    { field: 'yearCode', headerName: 'Code', width: 100 },
    { field: 'yearName', headerName: 'Financial Year', flex: 1 },
    { field: 'startDate', headerName: 'Start Date', flex: 1 },
    { field: 'endDate', headerName: 'End Date', flex: 1 },
    {
      field: 'status', headerName: 'Status', width: 80,
      cellRenderer: (p: any) => `<span class="tw-badge ${p.value === 'open' ? 'tw-badge-green' : 'tw-badge-slate'}">${p.value}</span>`
    },
  ];
  periodsCols: ColDef[] = [
    { field: 'periodNo', headerName: 'periodNo', width: 100, hide: true },
    { field: 'periodName', headerName: 'Period Name', flex: 1 },
    { field: 'startDate', headerName: 'Start', flex: 1 },
    { field: 'endDate', headerName: 'End', flex: 1 },
    {
      field: 'status',
      headerName: 'Status',
      width: 100,
      cellRenderer: (p: any) => `<span class="tw-badge ${p.value === 'open' ? 'tw-badge-green' : 'tw-badge-slate'}">${p.value}</span>`
    },
  ];
  constructor(
    private toast: ToastService,
    private fb: FormBuilder,
    private financialYearService: FiscalYearsService
  ) { super(); }
  ngOnInit(): void {
    this.loadData();
  }
  protected override loadData(): void {
    this.financialYearService.getAll().subscribe({
      next: (res) => {
        this.rows = [...(res.data.data as unknown[])];
      },
      error: (err) => {
        console.error(err);
      }
    });
    this.form = this.fb.group(
      {
        yearCode: ['', Validators.required],
        yearName: ['', Validators.required],
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
        status: [''],
        details: [[]]
      });
  }

  onBtnClick(e: EmbGridCustomButton): void {
    if (e.name === 'Periods') {
      let startDate = this.form.get('startDate')?.value;
      let endDate = this.form.get('endDate')?.value;
      if (!startDate || !endDate) {
        this.toast.error('Please select start and end date first');
        return;
      }
      this.periodRows = [];
      let start = new Date(startDate);
      let end = new Date(endDate);
      while (start <= end) {
        this.periodRows.push({
          periodNo: this.periodRows.length + 1,
          periodName: start.toISOString().split('T')[0],
          startDate: start.toISOString().split('T')[0],
          endDate: start.toISOString().split('T')[0],
          status: 'open'
        });
        start.setMonth(start.getMonth() + 1);
      }
    }
  }
  openCreate(): void {
    this.mode = 'create';
    this.form.reset();
    this.form.enable();
    this.periodRows = [];
    this.showModal = true;
  }
  onAction(e: any): void {
    const row = e.data;
    if (e.action === 'create') {
      this.openCreate();
      return;
    }

    if (!row) return;
    if (e.action === 'delete') {
      this.financialYearService.delete(row['id'] as number).subscribe({
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
      const details = row['details'];
      this.periodRows = Array.isArray(details) ? [...details] : [];
      if (e.action === 'view') this.form.disable();
      else this.form.enable();
      this.showModal = true;
    }
  }

  onSave(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    const val = {
      ...this.form.getRawValue(),
      details: this.periodRows
    };

    if (this.mode === 'create') {
      this.financialYearService.create(val).subscribe({
        next: (res) => {
          this.rows = [...this.rows, res.data];
          this.saving = false;
          this.showModal = false;
          this.toast.success('Financial Year created');
        },
        error: (err) => {
          this.saving = false;
          this.toast.error('Failed to create Financial Year');
          console.error(err);
        }
      });
    } else if (this.selected) {
      this.financialYearService.update(this.selected['id'] as number, val).subscribe({
        next: (res) => {
          const idx = this.rows.findIndex(x => (x as any).id === this.selected!['id']);
          if (idx > -1) {
            this.rows[idx] = res.data;
            this.rows = [...this.rows];
          }
          this.saving = false;
          this.showModal = false;
          this.toast.success('Financial Year updated');
        },
        error: (err) => {
          this.saving = false;
          this.toast.error('Failed to update Financial Year');
          console.error(err);
        }
      });
    }
  }
  close(): void { this.showModal = false; this.form.enable(); }

  protected override beforeSave(): void {

  }
}