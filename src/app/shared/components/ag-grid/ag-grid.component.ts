import {
  Component, Input, Output, EventEmitter,
  OnChanges, HostListener
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { AgGridAngular } from 'ag-grid-angular';
import {
  ColDef, GridReadyEvent, GridApi, RowDoubleClickedEvent,
  themeQuartz, colorSchemeLightWarm, RowSelectionOptions
} from 'ag-grid-community';
import { GridActionsComponent } from './grid-actions.component';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ModalComponent } from '../modal/modal.component';
import { ModalMode } from '../../../core/models';

// ── Custom Button Interface ───────────────────────────────────────────────────
export interface EmbGridCustomButton {
  name: string;
  caption: string;
  icon?: string;         // fa icon e.g. 'fa-plus'
  type?: 0 | 1 | 2 | 3 | 4 | 6 | 7; // 0=button,1=dropdown,2=text,3=number,4=checkbox,6=date,7=time
  value?: any;
  disabled?: boolean;
  hideCaption?: boolean;
  placeHolder?: string;
  dropDownData?: any[];
  displayMember?: string;
  valueMember?: string;
}

// ── Theme ─────────────────────────────────────────────────────────────────────
const myTheme = themeQuartz.withPart(colorSchemeLightWarm).withParams({
  fontFamily: "'Inter', sans-serif",
  fontSize: 13,
  headerHeight: 34,
  rowHeight: 36,
  headerFontSize: 11,
  headerFontWeight: 600,
  headerTextColor: '#6b7060',
  headerBackgroundColor: '#f5f4ef',
  borderColor: '#e8e6df',
  rowHoverColor: '#f9f8f3',
  oddRowBackgroundColor: '#ffffff',
  cellHorizontalPadding: 10,
  wrapperBorderRadius: 8,
  checkboxCheckedBorderColor: '#c8b560',
  checkboxCheckedBackgroundColor: '#c8b560',
  rangeSelectionBorderColor: '#c8b560',
});

@Component({
  selector: 'erp-grid',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridAngular, ModalComponent,],
  template: `
    <div style="display:flex;flex-direction:column;gap:8px">

      <!-- ═══════════════════════════════════════════
           TOOLBAR
           ═══════════════════════════════════════════ -->
      <div *ngIf="showToolBar" style="display:flex;align-items:center;flex-wrap:wrap;gap:6px;
                  padding:6px 8px;background:#f5f4ef;
                  border:1px solid #e8e6df;border-radius:8px 8px 0 0">

        <!-- Type 0 INPUT — Add / Delete row -->
        <ng-container *ngIf="gridType === 0">
          <button *ngIf="!hideAdd"
            style="display:inline-flex;align-items:center;gap:5px;padding:5px 12px;
                   font-size:12px;font-family:inherit;background:#fff;
                   border:1px solid #d0cdc3;border-radius:5px;cursor:pointer;color:#3d3d3a"
            (click)="addRow()">
            <i class="fa fa-plus"></i> New Row
          </button>
          <button *ngIf="!hideDelete"
            style="display:inline-flex;align-items:center;gap:5px;padding:5px 12px;
                   font-size:12px;font-family:inherit;background:#fff;
                   border:1px solid #e8b4af;border-radius:5px;cursor:pointer;color:#c0392b"
            (click)="deleteRow()">
            <i class="fa fa-times"></i> Delete
          </button>
        </ng-container>

        <!-- Type 2 SELECTION — Select All / Unselect All -->
        <ng-container *ngIf="gridType === 2">
          <button *ngIf="!hideSelect"
            style="display:inline-flex;align-items:center;gap:5px;padding:5px 12px;
                   font-size:12px;font-family:inherit;background:#fff;
                   border:1px solid #d0cdc3;border-radius:5px;cursor:pointer;color:#3d3d3a"
            (click)="selectAll()">
            <i class="fa fa-check-square-o"></i> Select All
          </button>
          <button *ngIf="!hideUnselect"
            style="display:inline-flex;align-items:center;gap:5px;padding:5px 12px;
                   font-size:12px;font-family:inherit;background:#fff;
                   border:1px solid #d0cdc3;border-radius:5px;cursor:pointer;color:#3d3d3a"
            (click)="unselectAll()">
            <i class="fa fa-square-o"></i> Unselect All
          </button>
        </ng-container>

        <!-- Type 3 ACTIONS — New modal button -->
        <button *ngIf="gridType === 3 && !hideNewBtn"
          style="display:inline-flex;align-items:center;gap:5px;padding:5px 12px;
                 font-size:12px;font-family:inherit;background: #24342a;
                 border: 1px solid #24342a;border-radius:5px;cursor:pointer;color:#f5f4ef;
                 box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);"
          (click)="openNewModal()">
          <i class="fa fa-plus"></i> {{ newBtnCaption }}
        </button>

        <!-- ── CUSTOM BUTTONS ── -->
        <ng-container *ngFor="let btn of customButtons">

          <!-- type 0 — plain button (default) -->
          <button *ngIf="btn.type === 0 || btn.type === undefined"
            style="display:inline-flex;align-items:center;gap:5px;padding:5px 12px;
                   font-size:12px;font-family:inherit;background:#fff;
                   border:1px solid #d0cdc3;border-radius:5px;cursor:pointer;color:#3d3d3a"
            [disabled]="btn.disabled"
            (click)="onCustomButtonClick(btn)">
            <i *ngIf="btn.icon" [class]="'pi ' + btn.icon"></i>
            {{ btn.caption }}
          </button>

          <!-- type 1 — dropdown -->
          <span *ngIf="btn.type === 1"
            style="display:inline-flex;align-items:center;gap:5px">
            <span *ngIf="!btn.hideCaption"
              style="font-size:11px;color:#6b7060">{{ btn.caption }}:</span>
            <select
              style="padding:4px 6px;font-size:12px;border:1px solid #d0cdc3;border-radius:5px"
              [(ngModel)]="btn.value"
              [disabled]="btn.disabled ?? false"
              (ngModelChange)="onCustomButtonChange(btn)">
              <option *ngFor="let d of btn.dropDownData"
                [value]="d[btn.valueMember ?? 'value']">
                {{ d[btn.displayMember ?? 'label'] }}
              </option>
            </select>
          </span>

          <!-- type 2 — text input -->
          <span *ngIf="btn.type === 2"
            style="display:inline-flex;align-items:center;gap:5px">
            <span *ngIf="!btn.hideCaption"
              style="font-size:11px;color:#6b7060">{{ btn.caption }}:</span>
            <input type="text"
              style="padding:4px 8px;font-size:12px;border:1px solid #d0cdc3;
                     border-radius:5px;width:130px"
              [(ngModel)]="btn.value"
              [placeholder]="btn.placeHolder ?? ''"
              [disabled]="btn.disabled ?? false"
              (ngModelChange)="onCustomButtonChange(btn)"
              (keyup.enter)="onCustomButtonClick(btn)" />
          </span>

          <!-- type 3 — number input -->
          <span *ngIf="btn.type === 3"
            style="display:inline-flex;align-items:center;gap:5px">
            <span *ngIf="!btn.hideCaption"
              style="font-size:11px;color:#6b7060">{{ btn.caption }}:</span>
            <input type="number"
              style="padding:4px 8px;font-size:12px;border:1px solid #d0cdc3;
                     border-radius:5px;width:80px"
              [(ngModel)]="btn.value"
              [disabled]="btn.disabled ?? false"
              (ngModelChange)="onCustomButtonChange(btn)" />
          </span>

          <!-- type 4 — checkbox -->
          <span *ngIf="btn.type === 4"
            style="display:inline-flex;align-items:center;gap:5px">
            <input type="checkbox"
              [id]="btn.name"
              [(ngModel)]="btn.value"
              [disabled]="btn.disabled ?? false"
              (ngModelChange)="onCustomButtonChange(btn)" />
            <label [for]="btn.name"
              style="font-size:12px;cursor:pointer;color:#3d3d3a">
              {{ btn.caption }}
            </label>
          </span>

          <!-- type 6 — date -->
          <span *ngIf="btn.type === 6"
            style="display:inline-flex;align-items:center;gap:5px">
            <span *ngIf="!btn.hideCaption"
              style="font-size:11px;color:#6b7060">{{ btn.caption }}:</span>
            <input type="date"
              style="padding:4px 8px;font-size:12px;border:1px solid #d0cdc3;border-radius:5px"
              [(ngModel)]="btn.value"
              [disabled]="btn.disabled ?? false"
              (ngModelChange)="onCustomButtonChange(btn)" />
          </span>

          <!-- type 7 — time -->
          <span *ngIf="btn.type === 7"
            style="display:inline-flex;align-items:center;gap:5px">
            <span *ngIf="!btn.hideCaption"
              style="font-size:11px;color:#6b7060">{{ btn.caption }}:</span>
            <input type="time"
              style="padding:4px 8px;font-size:12px;border:1px solid #d0cdc3;border-radius:5px"
              [(ngModel)]="btn.value"
              [disabled]="btn.disabled ?? false"
              (ngModelChange)="onCustomButtonChange(btn)" />
          </span>

        </ng-container>
        <!-- END CUSTOM BUTTONS -->

        <!-- ── RIGHT SIDE: search + record count ── -->
        <!-- ── RIGHT SIDE ── -->
<div style="margin-left:auto;display:flex;align-items:center;gap:6px">
<!-- Search -->
  <div *ngIf="showSearch" style="position:relative">
    <i class="pi pi-search"
      style="position:absolute;left:8px;top:50%;transform:translateY(-50%);
             color:#9a9688;font-size:12px"></i>
    <input
      [(ngModel)]="quickFilter"
      (ngModelChange)="onQuickFilter($event)"
      placeholder="Search..."
      style="width:200px;padding:5px 8px 5px 28px;border:1px solid #e8e6df;
             border-radius:6px;font-size:12px;font-family:inherit;
             outline:none;background:white;color:#1c2420"
      (focus)="$any($event.target).style.borderColor='#c8b560'"
      (blur)="$any($event.target).style.borderColor='#e8e6df'" />
  </div>
  <!-- Export menu -->
  <div *ngIf="showExport" style="position:relative">
    <button
      style="display:inline-flex;align-items:center;gap:5px;padding:5px 6px;
             font-size:12px;font-family:inherit;background:#fff;
             border:1px solid #d0cdc3;border-radius:5px;cursor:pointer;color:#3d3d3a"
      (click)="toggleExportMenu($event)">
      <i class="pi pi-download"></i>
    </button>
    <div *ngIf="exportMenuOpen"
      style="position:absolute;right:0;top:calc(100% + 4px);z-index:1000;
             background:#fff;border:1px solid #e8e6df;border-radius:8px;
             box-shadow:0 4px 16px rgba(0,0,0,.12);min-width:120px;overflow:hidden"
      (click)="$event.stopPropagation()">
      <button (click)="exportExcel()"
        style="display:flex;align-items:center;gap:8px;width:100%;padding:8px 14px;
               font-size:12px;font-family:inherit;background:transparent;
               border:none;cursor:pointer;color:#3d3d3a;border-bottom:1px solid #f0eee4">
        <i class="pi pi-file-excel" style="color:#1d7044"></i> Excel
      </button>
      <button (click)="exportCSV()"
        style="display:flex;align-items:center;gap:8px;width:100%;padding:8px 14px;
               font-size:12px;font-family:inherit;background:transparent;
               border:none;cursor:pointer;color:#3d3d3a;border-bottom:1px solid #f0eee4">
        <i class="pi pi-file" style="color:#5a7a2b"></i> CSV
      </button>
      <button (click)="exportPDF()"
        style="display:flex;align-items:center;gap:8px;width:100%;padding:8px 14px;
               font-size:12px;font-family:inherit;background:transparent;
               border:none;cursor:pointer;color:#3d3d3a">
        <i class="pi pi-file-pdf" style="color:#df4f4f"></i> PDF
      </button>
    </div>
  </div>

  <!-- Floating Filter Toggle -->
<button *ngIf="showFilterToggle"
  style="display:inline-flex;align-items:center;justify-content:center;
         width:28px;height:28px;background:#fff;border:1px solid #d0cdc3;
         border-radius:5px;cursor:pointer;font-size:12px"
  [style.color]="floatingFilterOn ? '#c8b560' : '#5f6368'"
  [style.border-color]="floatingFilterOn ? '#c8b560' : '#d0cdc3'"
  title="Toggle Column Filters"
  (click)="toggleFloatingFilter($event)">
  <i class="pi pi-filter"></i>
</button>
<!-- Column Panel -->
<div *ngIf="showColumnPanel" style="position:relative">
  <button
    style="display:inline-flex;align-items:center;justify-content:center;
           width:28px;height:28px;background:#fff;border:1px solid #d0cdc3;
           border-radius:5px;cursor:pointer;color:#5f6368;font-size:12px"
    title="Show/Hide Columns"
    (click)="toggleColumnPanel($event)">
    <i class="pi pi-table"></i>
  </button>
  <div *ngIf="columnPanelOpen"
    style="position:absolute;right:0;top:calc(100% + 4px);z-index:1000;
           background:#fff;border:1px solid #e8e6df;border-radius:8px;
           box-shadow:0 4px 16px rgba(0,0,0,.12);min-width:180px;overflow:hidden"
    (click)="$event.stopPropagation()">
    <div style="padding:8px 12px 6px;font-size:11px;font-weight:600;
                color:#6b7060;border-bottom:1px solid #e8e6df;
                text-transform:uppercase;letter-spacing:.6px">
      Columns
    </div>
    <div style="max-height:260px;overflow-y:auto;padding:4px 0">
      <label *ngFor="let col of visibleColumns"
        style="display:flex;align-items:center;gap:8px;padding:6px 12px;
               font-size:12px;color:#3d3d3a;cursor:pointer"
        (mouseenter)="$any($event.target).style.background='#f5f4ef'"
        (mouseleave)="$any($event.target).style.background='transparent'">
        <input
          type="checkbox"
          [checked]="col.visible"
          (change)="toggleColumnVisibility(col.field)" />
        {{ col.headerName }}
      </label>
    </div>
  </div>
</div>
  <!-- Refresh -->
  <button *ngIf="showRefresh"
    style="display:inline-flex;align-items:center;justify-content:center;
           width:28px;height:28px;background:#fff;border:1px solid #d0cdc3;
           border-radius:5px;cursor:pointer;color:#5f6368;font-size:12px"
    title="Refresh"
    (click)="refreshGrid()">
    <i class="pi pi-sync" [class.pi-spin]="isRefreshing"></i>
  </button>

  <!-- Pagination -->
  <div *ngIf="pagination"
    style="display:inline-flex;align-items:center;border:1px solid #d0cdc3;
           border-radius:5px;overflow:hidden;background:#fff">
    <button
      style="width:26px;height:26px;border:none;background:transparent;
             cursor:pointer;color:#5f6368;font-size:11px;
             display:flex;align-items:center;justify-content:center"
      title="First" (click)="firstPage()">
      <i class="pi pi-angle-double-left"></i>
    </button>
    <button
      style="width:26px;height:26px;border:none;background:transparent;
             cursor:pointer;color:#5f6368;font-size:11px;
             display:flex;align-items:center;justify-content:center;
             border-left:1px solid #e8e6df"
      title="Previous" (click)="prevPage()">
      <i class="pi pi-arrow-left"></i>
    </button>
    <span
      style="padding:0 8px;font-size:11px;color:#5f6368;white-space:nowrap;
             border-left:1px solid #e8e6df;border-right:1px solid #e8e6df;
             line-height:26px">
      {{ currentPage }} of {{ totalPages }}
    </span>
    <button
      style="width:26px;height:26px;border:none;background:transparent;
             cursor:pointer;color:#5f6368;font-size:11px;
             display:flex;align-items:center;justify-content:center;
             border-right:1px solid #e8e6df"
      title="Next" (click)="nextPage()">
      <i class="pi pi-arrow-right"></i>
    </button>
    <button
      style="width:26px;height:26px;border:none;background:transparent;
             cursor:pointer;color:#5f6368;font-size:11px;
             display:flex;align-items:center;justify-content:center"
      title="Last" (click)="lastPage()">
      <i class="pi pi-angle-double-right"></i>
    </button>
    <select
      [(ngModel)]="pageSize"
      (ngModelChange)="onPageSizeChange()"
      style="height:26px;border:none;border-left:1px solid #e8e6df;
             font-size:11px;font-family:inherit;background:#fff;
             color:#5f6368;padding:0 4px;cursor:pointer;outline:none">
      <option *ngFor="let s of pageSizeOptions" [value]="s">{{ s }}</option>
    </select>
  </div>

</div>
      </div>

      <!-- END TOOLBAR -->

      <!-- ═══════════════════════════════════════════
           AG-GRID
           ═══════════════════════════════════════════ -->
      <ag-grid-angular
        [theme]="theme"
        [style.height]="height"
        [rowData]="rowData"
        [columnDefs]="processedColumnDefs"
        [defaultColDef]="defaultColDef"
        [pagination]="pagination"
        [paginationPageSize]="pageSize"
        [paginationPageSizeSelector]="false"
        [suppressPaginationPanel]="true"
        [animateRows]="true"
        [rowSelection]="rowSelection"
        [getRowStyle]="getRowStyle"
        (gridReady)="onGridReady($event)"
        (rowDoubleClicked)="onRowDoubleClicked($event)"
        (paginationChanged)="onPaginationChanged()">
      </ag-grid-angular>

    </div>

    <!-- Consolidated Modal within Grid -->
    <erp-modal 
      [visible]="showModal" 
      (visibleChange)="onModalVisibleChange($event)"
      [header]="modalHeader" 
      [mode]="modalMode" 
      [saving]="saving" 
      [size]="modalSize"
      [width]="modalWidth"
      (save)="save.emit()" 
      (cancel)="cancel.emit()">
      <ng-content></ng-content>
    </erp-modal>
  `
})
export class ErpGridComponent implements OnChanges {

  // ── Inputs ────────────────────────────────────────────────────────────────
  @Input() rowData: unknown[] = [];
  @Input() columnDefs: ColDef[] = [];
  @Input() height = '480px';
  @Input() pagination = true;
  @Input() pageSize = 15;
  @Input() showSearch = true;
  @Input() showToolBar = true;

  // 0=INPUT 1=LOOKUP 2=SELECTION 3=ACTIONS 4=EXPORT 5=LIST
  @Input() gridType: 0 | 1 | 2 | 3 | 4 | 5 = 3;

  // Grid type flags
  @Input() hideAdd: boolean = false;
  @Input() hideDelete: boolean = false;
  @Input() hideSelect: boolean = false;
  @Input() hideUnselect: boolean = false;
  @Input() hideNewBtn: boolean = false;
  @Input() newBtnCaption: string = 'New';
  @Input() showExport: boolean = false;
  @Input() exportPrefix: string = 'export';
  @Input() showRefresh: boolean = true;
  @Input() autoRefresh: boolean = false;
  @Input() showColumnPanel: boolean = true;
  @Input() showFilterToggle: boolean = true;
  @Input() getRowStyle: (params: any) => any = () => null;
  // Custom buttons
  @Input() customButtons: EmbGridCustomButton[] = [];

  // ── Outputs ───────────────────────────────────────────────────────────────
  @Output() rowAction = new EventEmitter<{ action: string; data: unknown }>();
  @Output() customButtonClick = new EventEmitter<EmbGridCustomButton>();
  @Output() gridRefresh = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  // Modal Control Inputs
  @Input() showModal = false;
  @Output() showModalChange = new EventEmitter<boolean>();
  @Input() modalHeader = '';
  @Input() modalMode: ModalMode = 'create';
  @Input() saving = false;
  @Input() modalSize: 'sm' | 'md' | 'lg' | 'xl' | 'full' = 'md';
  @Input() modalWidth?: string;

  // ── Internal state ────────────────────────────────────────────────────────
  theme = myTheme;
  quickFilter = '';
  exportMenuOpen = false;
  columnPanelOpen = false;
  floatingFilterOn = false;
  visibleColumns: { field: string; headerName: string; visible: boolean }[] = [];
  isRefreshing = false;
  totalRows = 0;
  currentPage = 1;
  totalPages = 1;
  pageSizeOptions = [10, 15, 25, 50, 100];
  processedColumnDefs: ColDef[] = [];
  rowSelection!: RowSelectionOptions | undefined;
  private gridApi!: GridApi;

  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    minWidth: 70,
    suppressHeaderMenuButton: false,
  };

  onModalVisibleChange(val: boolean): void {
    this.showModal = val;
    this.showModalChange.emit(val);
  }
  @HostListener('window:click')
  onWindowClick(): void {
    this.exportMenuOpen = false;
    this.columnPanelOpen = false;
  }
  constructor(private confirmationService: ConfirmationService) { }

  // ── Lifecycle ─────────────────────────────────────────────────────────────
  ngOnChanges(): void {
    this.totalRows = this.rowData?.length ?? 0;
    this.buildColumns();
  }

  // ── Grid ready ────────────────────────────────────────────────────────────
  onGridReady(p: GridReadyEvent): void {
    this.gridApi = p.api;
    this.totalRows = this.rowData?.length ?? 0;
    this.updatePaginationInfo();
  }

  // ── Search ────────────────────────────────────────────────────────────────
  onQuickFilter(val: string): void {
    this.gridApi?.setGridOption('quickFilterText', val);
  }

  // ── Row events ────────────────────────────────────────────────────────────
  onRowDoubleClicked(event: RowDoubleClickedEvent): void {
    this.emit('edit', event.data);
  }

  // ── Emit helper ───────────────────────────────────────────────────────────
  emit(action: string, data: unknown): void {
    this.rowAction.emit({ action, data });
  }

  // ── Custom button handlers ────────────────────────────────────────────────
  onCustomButtonClick(btn: EmbGridCustomButton): void {
    this.customButtonClick.emit(btn);
  }
  onCustomButtonChange(btn: EmbGridCustomButton): void {
    this.customButtonClick.emit(btn);
  }

  // ── Type 0 INPUT — row add / delete ───────────────────────────────────────
  addRow(): void {
    const newRow: any = { lineindex: (this.rowData?.length ?? 0) + 1 };
    (this.rowData as any[]).push(newRow);
    this.gridApi?.applyTransaction({ add: [newRow] });
    this.totalRows = this.rowData.length;
  }

  deleteRow(): void {
    const selected = this.gridApi?.getSelectedRows() ?? [];
    if (!selected.length) return;
    this.gridApi?.applyTransaction({ remove: selected });
    selected.forEach(row => {
      const idx = (this.rowData as any[]).indexOf(row);
      if (idx > -1) (this.rowData as any[]).splice(idx, 1);
    });
    this.totalRows = this.rowData.length;
  }

  // ── Type 2 SELECTION ─────────────────────────────────────────────────────
  selectAll(): void { this.gridApi?.selectAll(); }
  unselectAll(): void { this.gridApi?.deselectAll(); }

  // ── Type 3 ACTIONS ───────────────────────────────────────────────────────
  openNewModal(): void { this.emit('create', null); }

  // ── Confirm delete ────────────────────────────────────────────────────────
  confirmDelete(data: unknown): void {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.emit('delete', data),
    });
  }

  // ── Public API (call via ViewChild) ───────────────────────────────────────
  getSelectedRows(): unknown[] {
    return this.gridApi?.getSelectedRows() ?? [];
  }
  // ── Refresh ───────────────────────────────────────────────
  refreshGrid(): void {
    this.isRefreshing = true;
    this.gridRefresh.emit();
    setTimeout(() => (this.isRefreshing = false), 600);
  }

  // ── Pagination ────────────────────────────────────────────
  firstPage(): void {
    this.gridApi?.paginationGoToFirstPage();
    this.updatePaginationInfo();
  }
  prevPage(): void {
    this.gridApi?.paginationGoToPreviousPage();
    this.updatePaginationInfo();
  }
  nextPage(): void {
    this.gridApi?.paginationGoToNextPage();
    this.updatePaginationInfo();
  }
  lastPage(): void {
    this.gridApi?.paginationGoToLastPage();
    this.updatePaginationInfo();
  }
  onPageSizeChange(): void {
    this.gridApi?.setGridOption('paginationPageSize', this.pageSize);
    this.gridApi?.paginationGoToFirstPage();
    this.updatePaginationInfo();
  }
  onPaginationChanged(): void {
    this.updatePaginationInfo();
  }
  private updatePaginationInfo(): void {
    if (!this.gridApi) return;
    this.currentPage = (this.gridApi.paginationGetCurrentPage() ?? 0) + 1;
    this.totalPages = this.gridApi.paginationGetTotalPages() ?? 1;
  }
  // ── Floating Filter Toggle ────────────────────────────────
  toggleFloatingFilter(e: Event): void {
    e.stopPropagation();
    this.floatingFilterOn = !this.floatingFilterOn;
    const updatedCols = this.processedColumnDefs.map(col => ({
      ...col,
      floatingFilter: this.floatingFilterOn,
    }));
    this.processedColumnDefs = updatedCols;
    this.gridApi?.setGridOption('columnDefs', updatedCols);
    this.gridApi?.refreshHeader();
  }
  // ── Column Panel ──────────────────────────────────────────
  toggleColumnPanel(e: Event): void {
    e.stopPropagation();
    this.columnPanelOpen = !this.columnPanelOpen;
    this.exportMenuOpen = false;
    if (this.columnPanelOpen) this.buildVisibleColumnsList();
  }

  private buildVisibleColumnsList(): void {
    if (!this.gridApi) return;
    const allCols = this.gridApi.getColumns() ?? [];
    this.visibleColumns = allCols
      .filter((c: any) => !['lineindex', 'actionid', 'selectedCol']
        .includes(c.getColId()))
      .map((c: any) => ({
        field: c.getColId(),
        headerName: c.getColDef().headerName ?? c.getColId(),
        visible: c.isVisible(),
      }));
  }

  toggleColumnVisibility(field: string): void {
    const col = this.visibleColumns.find(c => c.field === field);
    if (!col) return;
    col.visible = !col.visible;
    this.gridApi?.setColumnsVisible([field], col.visible);
  }
  toggleExportMenu(e: Event): void {
    e.stopPropagation();
    this.exportMenuOpen = !this.exportMenuOpen;
  }

  private getExportData(): any[] {
    const result: any[] = [];
    this.gridApi?.forEachNodeAfterFilter((node: any) => {
      const obj: any = {};
      (this.columnDefs || []).forEach(col => {
        if (col.field && col.field !== 'actionid' && col.field !== 'selectedCol') {
          obj[col.headerName ?? col.field] = node.data[col.field];
        }
      });
      result.push(obj);
    });
    return result;
  }

  exportExcel(): void {
    const data = this.getExportData();
    if (!data.length) return;
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `${this.exportPrefix}.xlsx`);
    this.exportMenuOpen = false;
  }

  exportCSV(): void {
    this.gridApi?.exportDataAsCsv({ fileName: this.exportPrefix });
    this.exportMenuOpen = false;
  }

  exportPDF(): void {
    const data = this.getExportData();
    if (!data.length) return;
    const doc = new jsPDF('l');
    const cols = Object.keys(data[0]);
    const rows = data.map((r: any) => cols.map(c => r[c]));
    autoTable(doc, {
      head: [cols],
      body: rows,
      styles: { fontSize: 9, overflow: 'linebreak' },
      margin: { top: 14, bottom: 14 },
    });
    doc.save(`${this.exportPrefix}.pdf`);
    this.exportMenuOpen = false;
  }
  // ── Build columns ─────────────────────────────────────────────────────────
  private buildColumns(): void {
    const baseCols = this.columnDefs || [];
    const newCols: ColDef[] = [];

    const snoCol: ColDef = {
      headerName: 'S.No',
      valueGetter: 'node.rowIndex + 1',
      width: 60,
      suppressSizeToFit: true,
      sortable: false,
      filter: false,
    };

    const actionCol: ColDef = {
      headerName: 'Actions',
      width: 110,
      pinned: 'left',
      sortable: false,
      filter: false,
      cellRenderer: GridActionsComponent,
      cellRendererParams: {
        onView: (d: unknown) => this.emit('view', d),
        onEdit: (d: unknown) => this.emit('edit', d),
        onDelete: (d: unknown) => this.confirmDelete(d),
      },
    };

    switch (this.gridType) {
      case 0: // INPUT — inline editable rows
        newCols.push(snoCol, ...baseCols);
        this.rowSelection = { mode: 'multiRow', enableClickSelection: true };
        break;

      case 1: // LOOKUP — read-only paginated list
      case 4: // EXPORT — export only
      case 5: // LIST   — full list, no pagination
        newCols.push(snoCol, ...baseCols);
        this.rowSelection = undefined;
        break;

      case 2: // SELECTION — checkbox multi-select
        newCols.push(snoCol, ...baseCols);
        this.rowSelection = {
          mode: 'multiRow',
          headerCheckbox: true,
          enableClickSelection: true,
        };
        break;

      case 3: // ACTIONS — view / edit / delete column
      default:
        newCols.push(snoCol, actionCol, ...baseCols);
        this.rowSelection = undefined;
        break;
    }

    this.processedColumnDefs = newCols;
  }
}