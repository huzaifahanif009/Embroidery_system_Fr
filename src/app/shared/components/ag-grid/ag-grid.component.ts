import {
  Component, Input, Output, EventEmitter,
  OnChanges, ViewChild, ElementRef, AfterViewInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import {
  ColDef, GridReadyEvent, GridApi,
  themeQuartz, colorSchemeLightWarm, RowSelectionOptions
} from 'ag-grid-community';

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
  // rowBorder: '#f0ede6',
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
  imports: [CommonModule, FormsModule, AgGridAngular],
  template: `
    <div style="display:flex;flex-direction:column;gap:8px">
      <!-- Toolbar -->
      <div style="display:flex;align-items:center;justify-content:space-between;gap:8px" *ngIf="showSearch">
        <div style="position:relative;flex:1;max-width:280px">
          <i class="pi pi-search" style="position:absolute;left:8px;top:50%;transform:translateY(-50%);color:#9a9688;font-size:12px"></i>
          <input [(ngModel)]="quickFilter" (ngModelChange)="onQuickFilter($event)"
            placeholder="Search..." style="width:100%;padding:5px 8px 5px 28px;border:1px solid #e8e6df;border-radius:6px;font-size:12px;font-family:inherit;outline:none;background:white;color:#1c2420"
            (focus)="$any($event.target).style.borderColor='#c8b560'"
            (blur)="$any($event.target).style.borderColor='#e8e6df'" />
        </div>
        <span style="font-size:12px;color:#9a9688">{{ totalRows | number }} records</span>
      </div>

      <!-- Grid -->
      <ag-grid-angular
        [theme]="theme"
        [style.height]="height"
        [rowData]="rowData"
        [columnDefs]="columnDefs"
        [defaultColDef]="defaultColDef"
        [pagination]="pagination"
        [paginationPageSize]="pageSize"
        [paginationPageSizeSelector]="[10,15,25,50]"
        [animateRows]="true"
        [rowSelection]="rowSelection"
        (gridReady)="onGridReady($event)">
      </ag-grid-angular>
    </div>
  `
})
export class ErpGridComponent implements OnChanges {
  @Input() rowData: unknown[] = [];
  @Input() columnDefs: ColDef[] = [];
  @Input() height = '480px';
  @Input() pagination = true;
  @Input() pageSize = 15;
  @Input() showSearch = true;

  @Output() rowAction = new EventEmitter<{ action: string; data: unknown }>();

  theme = myTheme;
  quickFilter = '';
  totalRows = 0;
  rowSelection: RowSelectionOptions = {
    mode: 'multiRow',
    headerCheckbox: false,
    enableClickSelection: false,
  };
  private gridApi!: GridApi;

  defaultColDef: ColDef = {
    sortable: true, filter: true, resizable: true, minWidth: 70,
    suppressHeaderMenuButton: false,
  };

  ngOnChanges(): void { this.totalRows = this.rowData?.length ?? 0; }

  onGridReady(p: GridReadyEvent): void {
    this.gridApi = p.api;
    this.totalRows = this.rowData?.length ?? 0;
  }

  onQuickFilter(val: string): void {
    this.gridApi?.setGridOption('quickFilterText', val);
  }

  emit(action: string, data: unknown): void {
    this.rowAction.emit({ action, data });
  }
}
