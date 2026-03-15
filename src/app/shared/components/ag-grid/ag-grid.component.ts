import {
  Component, Input, Output, EventEmitter,
  OnChanges, ViewChild, ElementRef, AfterViewInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { AgGridAngular } from 'ag-grid-angular';
import {
  ColDef, GridReadyEvent, GridApi, RowDoubleClickedEvent,
  themeQuartz, colorSchemeLightWarm, RowSelectionOptions
} from 'ag-grid-community';
import { GridActionsComponent } from './grid-actions.component';

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
  imports: [CommonModule, FormsModule, AgGridAngular, ConfirmDialogComponent],
  template: `
    <erp-confirm></erp-confirm>
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
        [columnDefs]="processedColumnDefs"
        [defaultColDef]="defaultColDef"
        [pagination]="pagination"
        [paginationPageSize]="pageSize"
        [paginationPageSizeSelector]="[10,15,25,50]"
        [animateRows]="true"
        [rowSelection]="rowSelection"
        (gridReady)="onGridReady($event)"
        (rowDoubleClicked)="onRowDoubleClicked($event)">
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
  @Input() gridType: 'type1' | 'type2' | 'type3' = 'type1';

  @Output() rowAction = new EventEmitter<{ action: string; data: unknown }>();

  theme = myTheme;
  quickFilter = '';
  totalRows = 0;
  processedColumnDefs: ColDef[] = [];
  // Initialize dynamically in ngOnChanges instead of statically
  rowSelection!: RowSelectionOptions | undefined;
  private gridApi!: GridApi;

  defaultColDef: ColDef = {
    sortable: true, filter: true, resizable: true, minWidth: 70,
    suppressHeaderMenuButton: false,
  };

  constructor(private confirmationService: ConfirmationService) {}

  ngOnChanges(): void {
    this.totalRows = this.rowData?.length ?? 0;
    this.buildColumns();
  }

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

  onRowDoubleClicked(event: RowDoubleClickedEvent): void {
    // When double clicked, default behavior is to open in edit mode
    // Emit 'edit' action and let the parent handle it
    this.emit('edit', event.data);
  }

  confirmDelete(data: unknown): void {
    this.confirmationService.confirm({
      message: 'do you want to delete this record?',
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.emit('delete', data)
    });
  }

  private buildColumns(): void {
    const baseCols = this.columnDefs || [];
    const newCols: ColDef[] = [];

    // All grids get S.No by default
    const snoCol: ColDef = {
      headerName: 'S.No',
      valueGetter: 'node.rowIndex + 1',
      width: 60,
      suppressSizeToFit: true,
      // pinned: 'left',
      sortable: false,
      filter: false
    };

    if (this.gridType === 'type1') {
      // type1: S.No + Action + User Cols
      const actionCol: ColDef = {
        headerName: 'Actions', width: 110, pinned: 'left', sortable: false, filter: false,
        cellRenderer: GridActionsComponent,
        cellRendererParams: {
          onView: (d: unknown) => this.emit('view', d),
          onEdit: (d: unknown) => this.emit('edit', d),
          onDelete: (d: unknown) => this.confirmDelete(d)
        }
      };
      newCols.push(snoCol, actionCol, ...baseCols);
    } else if (this.gridType === 'type2') {
      // type2: Selection checkbox column + S.No + User Cols
      newCols.push(snoCol, ...baseCols);
      // Row selection is handled by grid config (multiRow mode is already on)
    } else {
      // type3: Just S.No + Listing
      newCols.push(snoCol, ...baseCols);
    }

    this.processedColumnDefs = newCols;

    // Configure row selection
    if (this.gridType === 'type2') {
      this.rowSelection = {
        mode: 'multiRow',
        headerCheckbox: true, // Typically selection grids want header checkboxes too
        enableClickSelection: true,
      };
    } else {
      // type1 and type3 have no row selection
      this.rowSelection = undefined;
    }
  }
}
