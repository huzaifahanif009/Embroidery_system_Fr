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
  imports: [CommonModule, FormsModule, AgGridAngular, ModalComponent],
  template: `
    <div style="display:flex;flex-direction:column;gap:8px">

      <!-- ═══════════════════════════════════════════
           TOOLBAR
           ═══════════════════════════════════════════ -->
      <div style="display:flex;align-items:center;flex-wrap:wrap;gap:6px;
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
            <i *ngIf="btn.icon" [class]="'fa ' + btn.icon"></i>
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
        <div style="margin-left:auto;display:flex;align-items:center;gap:8px">
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
          <span style="font-size:12px;color:#9a9688;white-space:nowrap">
            {{ totalRows | number }} records
          </span>
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
        [paginationPageSizeSelector]="[10,15,25,50]"
        [animateRows]="true"
        [rowSelection]="rowSelection"
        (gridReady)="onGridReady($event)"
        (rowDoubleClicked)="onRowDoubleClicked($event)">
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

  // 0=INPUT 1=LOOKUP 2=SELECTION 3=ACTIONS 4=EXPORT 5=LIST
  @Input() gridType: 0 | 1 | 2 | 3 | 4 | 5 = 3;

  // Grid type flags
  @Input() hideAdd: boolean = false;
  @Input() hideDelete: boolean = false;
  @Input() hideSelect: boolean = false;
  @Input() hideUnselect: boolean = false;
  @Input() hideNewBtn: boolean = false;
  @Input() newBtnCaption: string = 'New';

  // Custom buttons
  @Input() customButtons: EmbGridCustomButton[] = [];

  // ── Outputs ───────────────────────────────────────────────────────────────
  @Output() rowAction = new EventEmitter<{ action: string; data: unknown }>();
  @Output() customButtonClick = new EventEmitter<EmbGridCustomButton>();
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
  totalRows = 0;
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