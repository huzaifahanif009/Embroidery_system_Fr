import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ColDef } from "ag-grid-community";
import { ConfirmationService } from "primeng/api";
import { DialogModule } from "primeng/dialog";
import { BaseComponent } from "../../../shared/components/base/base.component";
import { ErpGridComponent } from "../../../shared/components/ag-grid/ag-grid.component";
import { GridActionsComponent } from "../../../shared/components/ag-grid/grid-actions.component";
import { ModalComponent } from "../../../shared/components/modal/modal.component";
import { PageHeaderComponent } from "../../../shared/components/page-header/page-header.component";
import { ConfirmDialogComponent } from "../../../shared/components/confirm-dialog/confirm-dialog.component";
import { MockService } from "../../../shared/services/mock.service";
import { ToastService } from "../../../core/services/toast.service";
import { ModalMode } from "../../../core/models";

@Component({
  selector: "erp-work-orders",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ErpGridComponent,
    ModalComponent,
    PageHeaderComponent,
    ConfirmDialogComponent,
    DialogModule,
  ],
  template: `
    <erp-confirm></erp-confirm>
    <erp-page-header
      title="Work Orders"
      (newClick)="openCreate()"
    ></erp-page-header>
    <erp-grid
      [rowData]="rows"
      [columnDefs]="cols"
      (rowAction)="onAction($event)"
    ></erp-grid>
    <erp-modal
      [(visible)]="showModal"
      [header]="modalTitle"
      [mode]="mode"
      [saving]="saving"
      (save)="onSave()"
      (cancel)="close()"
      width="580px"
    >
      <form [formGroup]="form" class="fg">
        <div class="tw-form-group">
          <label class="tw-label-field">Customer *</label
          ><select
            formControlName="customer"
            class="tw-select"
            [attr.disabled]="mode === 'view' ? true : null"
          >
            <option *ngFor="let c of custOpts" [value]="c">{{ c }}</option>
          </select>
        </div>
        <div class="tw-form-group">
          <label class="tw-label-field">Design Reference</label
          ><input
            formControlName="design"
            class="tw-input"
            [readonly]="mode === 'view'"
          />
        </div>
        <div class="tw-form-group">
          <label class="tw-label-field">Order Date *</label
          ><input
            type="date"
            formControlName="orderDate"
            class="tw-input"
            [readonly]="mode === 'view'"
          />
        </div>
        <div class="tw-form-group">
          <label class="tw-label-field">Delivery Date *</label
          ><input
            type="date"
            formControlName="deliveryDate"
            class="tw-input"
            [readonly]="mode === 'view'"
          />
        </div>
        <div class="tw-form-group">
          <label class="tw-label-field">Total Qty *</label
          ><input
            type="number"
            formControlName="totalQty"
            class="tw-input"
            [readonly]="mode === 'view'"
          />
        </div>
        <div class="tw-form-group">
          <label class="tw-label-field">Unit Price (PKR) *</label
          ><input
            type="number"
            formControlName="unitPrice"
            class="tw-input"
            [readonly]="mode === 'view'"
          />
        </div>
        <div class="tw-form-group">
          <label class="tw-label-field">Status *</label
          ><select
            formControlName="status"
            class="tw-select"
            [attr.disabled]="mode === 'view' ? true : null"
          >
            <option value="draft">Draft</option>
            <option value="confirmed">Confirmed</option>
            <option value="in_production">In Production</option>
            <option value="qc">QC</option>
            <option value="dispatched">Dispatched</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div class="tw-form-group fc">
          <label class="tw-label-field">Notes</label
          ><textarea
            formControlName="notes"
            class="tw-textarea"
            [readonly]="mode === 'view'"
          ></textarea>
        </div>
      </form>
    </erp-modal>
  `,
  styles: [
    `
      .fg {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
      }
      .fc {
        grid-column: 1/-1;
      }
    `,
  ],
})
export class WorkOrdersComponent extends BaseComponent implements OnInit {
  rows: unknown[] = [];
  showModal = false;
  mode: ModalMode = "create";
  form!: FormGroup;
  selected: Record<string, unknown> | null = null;
  custOpts = [
    "Al-Noor Uniforms",
    "Royal Sports Club",
    "Crescent School",
    "Galaxy Corp",
    "Hafeez & Sons",
  ];
  get modalTitle() {
    return { create: "New", edit: "Edit", view: "View" }[this.mode] + " Work";
  }
  cols: ColDef[] = [
    {
      field: "woNumber",
      headerName: "WO #",
      width: 140,
      pinned: "left",
      cellRenderer: (p: any) =>
        `<span style="color:#2d3a2e;font-weight:600">${p.value}</span>`,
    },
    { field: "customer", headerName: "Customer", flex: 1 },
    { field: "orderDate", headerName: "Order Date", width: 110 },
    { field: "deliveryDate", headerName: "Delivery", width: 110 },
    { field: "totalQty", headerName: "Qty", width: 80 },
    {
      field: "totalAmount",
      headerName: "Amount",
      width: 130,
      valueFormatter: (p: any) => `PKR ${Number(p.value).toLocaleString()}`,
    },
    {
      field: "status",
      headerName: "Status",
      width: 130,
      cellRenderer: (p: any) => {
        const m: any = {
          draft: "tw-badge-slate",
          confirmed: "tw-badge-blue",
          in_production: "tw-badge-amber",
          qc: "tw-badge-purple",
          dispatched: "tw-badge-blue",
          completed: "tw-badge-green",
        };
        return `<span class="tw-badge ${m[p.value] || "tw-badge-slate"}">${(p.value || "").replace("_", " ")}</span>`;
      },
    },
    {
      headerName: "Actions",
      width: 110,
      pinned: "right",
      sortable: false,
      filter: false,
      cellRenderer: GridActionsComponent,
      cellRendererParams: {
        onView: (d: unknown) => this.onAction({ action: "view", data: d }),
        onEdit: (d: unknown) => this.onAction({ action: "edit", data: d }),
        onDelete: (d: unknown) => this.onAction({ action: "delete", data: d }),
      },
    },
  ];
  constructor(
    private mock: MockService,
    private toast: ToastService,
    private fb: FormBuilder,
    private confirm: ConfirmationService,
  ) {
    super();
  }
  ngOnInit(): void {
    this.rows = [...(this.mock.workOrders as unknown[])];
    this.form = this.fb.group({
      customer: ["", Validators.required],
      design: [""],
      orderDate: ["", Validators.required],
      deliveryDate: ["", Validators.required],
      totalQty: [0, Validators.required],
      unitPrice: [0, Validators.required],
      status: ["draft", Validators.required],
      notes: [""],
    });
  }
  openCreate(): void {
    this.mode = "create";
    this.form.reset();
    this.form.enable();
    this.showModal = true;
  }
  onAction(e: { action: string; data: unknown }): void {
    const row = e.data as Record<string, unknown>;
    if (e.action === "delete") {
      this.confirm.confirm({
        message: "Delete this record?",
        header: "Confirm",
        icon: "pi pi-exclamation-triangle",
        accept: () => {
          (this.mock.workOrders as Record<string, unknown>[]) = (
            this.mock.workOrders as Record<string, unknown>[]
          ).filter((x) => x["id"] !== row["id"]);
          this.rows = [...(this.mock.workOrders as unknown[])];
          this.toast.success("Deleted");
        },
      });
    } else {
      this.selected = row;
      this.mode = e.action as ModalMode;
      this.form.patchValue(row);
      if (e.action === "view") this.form.disable();
      else this.form.enable();
      this.showModal = true;
    }
  }
  onSave(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving = true;
    setTimeout(() => {
      const val = this.form.getRawValue();
      if (this.mode === "create")
        (this.mock.workOrders as Record<string, unknown>[]).push({
          ...val,
          id: Date.now().toString(),
        });
      else if (this.selected) {
        const i = (this.mock.workOrders as Record<string, unknown>[]).findIndex(
          (x) => x["id"] === this.selected!["id"],
        );
        if (i > -1)
          (this.mock.workOrders as Record<string, unknown>[])[i] = {
            ...(this.mock.workOrders as Record<string, unknown>[])[i],
            ...val,
          };
      }
      this.rows = [...(this.mock.workOrders as unknown[])];
      this.saving = false;
      this.showModal = false;
      this.toast.success("Saved");
    }, 500);
  }
  close(): void {
    this.showModal = false;
    this.form.enable();
  }
}
