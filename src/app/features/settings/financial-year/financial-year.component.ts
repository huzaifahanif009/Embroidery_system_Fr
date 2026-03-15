import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ColDef } from 'ag-grid-community';
import { ConfirmationService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { BaseComponent } from '../../../shared/components/base/base.component';
import { ErpGridComponent } from '../../../shared/components/ag-grid/ag-grid.component';
import { GridActionsComponent } from '../../../shared/components/ag-grid/grid-actions.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ToastService } from '../../../core/services/toast.service';
import { ModalMode } from '../../../core/models';
@Component({
  selector:'erp-financial-year',standalone:true,
  imports:[CommonModule,ReactiveFormsModule,ErpGridComponent,ModalComponent,PageHeaderComponent,ConfirmDialogComponent,DialogModule],
  template:`<erp-confirm></erp-confirm>
    <erp-page-header title="Financial Year" (newClick)="openCreate()"></erp-page-header>
    <erp-grid [rowData]="rows" [columnDefs]="cols" (rowAction)="onAction($event)"></erp-grid>
    <erp-modal [(visible)]="showModal" [header]="mt" [mode]="mode" [saving]="saving" (save)="onSave()" (cancel)="close()">
      <form [formGroup]="form" style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div class="tw-form-group" style="grid-column:1/-1"><label class="tw-label-field">Year Name *</label><input formControlName="yearName" class="tw-input" [readonly]="mode==='view'" placeholder="FY-2025-26" /></div>
        <div class="tw-form-group"><label class="tw-label-field">Start Date *</label><input type="date" formControlName="startDate" class="tw-input" [readonly]="mode==='view'" /></div>
        <div class="tw-form-group"><label class="tw-label-field">End Date *</label><input type="date" formControlName="endDate" class="tw-input" [readonly]="mode==='view'" /></div>
        <div class="tw-form-group"><label class="tw-label-field">Status *</label><select formControlName="status" class="tw-select" [attr.disabled]="mode==='view'?true:null"><option value="open">Open</option><option value="closed">Closed</option><option value="archived">Archived</option></select></div>
      </form>
    </erp-modal>`,styles:[]
})
export class FinancialYearComponent extends BaseComponent implements OnInit {
  rows:unknown[]=[]; showModal=false; mode:ModalMode='create'; form!:FormGroup; selected:Record<string,unknown>|null=null;
  get mt(){return ({create:'New Year',edit:'Edit Year',view:'Year Details'} as Record<string,string>)[this.mode];}
  mockData=[{id:'1',yearName:'FY-2023-24',startDate:'2023-07-01',endDate:'2024-06-30',status:'closed'},{id:'2',yearName:'FY-2024-25',startDate:'2024-07-01',endDate:'2025-06-30',status:'open'},{id:'3',yearName:'FY-2025-26',startDate:'2025-07-01',endDate:'2026-06-30',status:'open'}];
  cols:ColDef[]=[{field:'yearName',headerName:'Year',flex:1},{field:'startDate',headerName:'Start',width:120},{field:'endDate',headerName:'End',width:120},{field:'status',headerName:'Status',width:100,cellRenderer:(p:any)=>{const m:any={open:'tw-badge-green',closed:'tw-badge-slate',archived:'tw-badge-amber'};return`<span class="tw-badge ${m[p.value]||'tw-badge-slate'}">${p.value}</span>`;}},{headerName:'Actions',width:110,pinned:'right',sortable:false,filter:false,cellRenderer:GridActionsComponent,cellRendererParams:{onView:(d:unknown)=>this.onAction({action:'view',data:d}),onEdit:(d:unknown)=>this.onAction({action:'edit',data:d}),onDelete:(d:unknown)=>this.onAction({action:'delete',data:d})}}];
  constructor(private toast:ToastService,private fb:FormBuilder,private confirm:ConfirmationService){super();}
  ngOnInit():void{this.rows=[...this.mockData];this.form=this.fb.group({yearName:['',Validators.required],startDate:['',Validators.required],endDate:['',Validators.required],status:['open',Validators.required]});}
  openCreate():void{this.mode='create';this.form.reset({status:'open'});this.form.enable();this.showModal=true;}
  onAction(e:{action:string;data:unknown}):void{const row=e.data as Record<string,unknown>;if(e.action==='delete'){this.confirm.confirm({message:'Delete?',header:'Confirm',icon:'pi pi-exclamation-triangle',accept:()=>{this.mockData=this.mockData.filter(x=>x.id!==row['id'] as string);this.rows=[...this.mockData];this.toast.success('Deleted');}});}else{this.selected=row;this.mode=e.action as ModalMode;this.form.patchValue(row);if(e.action==='view')this.form.disable();else this.form.enable();this.showModal=true;}}
  onSave():void{if(this.form.invalid){this.form.markAllAsTouched();return;}this.saving=true;setTimeout(()=>{const v=this.form.getRawValue();if(this.mode==='create')this.mockData.push({...v,id:Date.now().toString()});else if(this.selected){const i=this.mockData.findIndex(x=>x.id===this.selected!['id'] as string);if(i>-1)this.mockData[i]={...this.mockData[i],...v};}this.rows=[...this.mockData];this.saving=false;this.showModal=false;this.toast.success('Saved');},500);}
  close():void{this.showModal=false;this.form.enable();}
}
