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
  selector:'erp-production',standalone:true,
  imports:[CommonModule,ReactiveFormsModule,ErpGridComponent,ModalComponent,PageHeaderComponent,ConfirmDialogComponent,DialogModule],
  template:`<erp-confirm></erp-confirm>
    <erp-page-header title="Production Planning" (newClick)="openCreate()"></erp-page-header>
    <erp-grid [rowData]="rows" [columnDefs]="cols" (rowAction)="onAction($event)"></erp-grid>
    <erp-modal [(visible)]="showModal" [header]="mt" [mode]="mode" [saving]="saving" (save)="onSave()" (cancel)="close()">
      <form [formGroup]="form" style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div class="tw-form-group"><label class="tw-label-field">Work Order *</label><select formControlName="workOrder" class="tw-select" [attr.disabled]="mode==='view'?true:null"><option value="WO-2025-001">WO-2025-001</option><option value="WO-2025-002">WO-2025-002</option></select></div>
        <div class="tw-form-group"><label class="tw-label-field">Machine *</label><select formControlName="machine" class="tw-select" [attr.disabled]="mode==='view'?true:null"><option value="EMB-001">EMB-001 Tajima</option><option value="EMB-002">EMB-002 Brother</option></select></div>
        <div class="tw-form-group"><label class="tw-label-field">Operator *</label><select formControlName="operator" class="tw-select" [attr.disabled]="mode==='view'?true:null"><option value="Ali Hassan">Ali Hassan</option><option value="Ahmed Raza">Ahmed Raza</option></select></div>
        <div class="tw-form-group"><label class="tw-label-field">Priority</label><select formControlName="priority" class="tw-select" [attr.disabled]="mode==='view'?true:null"><option value="low">Low</option><option value="normal">Normal</option><option value="high">High</option><option value="urgent">Urgent</option></select></div>
        <div class="tw-form-group"><label class="tw-label-field">Planned Start *</label><input type="date" formControlName="plannedStart" class="tw-input" [readonly]="mode==='view'" /></div>
        <div class="tw-form-group"><label class="tw-label-field">Planned End *</label><input type="date" formControlName="plannedEnd" class="tw-input" [readonly]="mode==='view'" /></div>
        <div class="tw-form-group"><label class="tw-label-field">Qty Assigned *</label><input type="number" formControlName="quantityAssigned" class="tw-input" [readonly]="mode==='view'" /></div>
        <div class="tw-form-group"><label class="tw-label-field">Status</label><select formControlName="status" class="tw-select" [attr.disabled]="mode==='view'?true:null"><option value="pending">Pending</option><option value="running">Running</option><option value="completed">Completed</option></select></div>
      </form>
    </erp-modal>`,
  styles:[]
})
export class ProductionComponent extends BaseComponent implements OnInit {
  rows:unknown[]=[]; showModal=false; mode:ModalMode='create'; form!:FormGroup; selected:Record<string,unknown>|null=null;
  get mt(){return ({create:'New Job',edit:'Edit Job',view:'Job Details'} as Record<string,string>)[this.mode];}
  mockData=[
    {id:'1',workOrder:'WO-2025-001',machine:'EMB-001',operator:'Ali Hassan',plannedStart:'2025-03-10',plannedEnd:'2025-03-18',quantityAssigned:500,priority:'high',status:'running'},
    {id:'2',workOrder:'WO-2025-002',machine:'EMB-002',operator:'Ahmed Raza',plannedStart:'2025-03-12',plannedEnd:'2025-03-17',quantityAssigned:200,priority:'normal',status:'running'},
  ];
  cols:ColDef[]=[
    {field:'workOrder',headerName:'Work Order',width:140,cellRenderer:(p:any)=>`<span style="color:#2d3a2e;font-weight:600">${p.value}</span>`},
    {field:'machine',headerName:'Machine',width:100},
    {field:'operator',headerName:'Operator',flex:1},
    {field:'plannedStart',headerName:'Start',width:110},
    {field:'plannedEnd',headerName:'End',width:110},
    {field:'quantityAssigned',headerName:'Qty',width:80},
    {field:'priority',headerName:'Priority',width:90,cellRenderer:(p:any)=>{const m:any={urgent:'tw-badge-red',high:'tw-badge-amber',normal:'tw-badge-blue',low:'tw-badge-slate'};return`<span class="tw-badge ${m[p.value]||'tw-badge-slate'}">${p.value}</span>`;}},
    {field:'status',headerName:'Status',width:100,cellRenderer:(p:any)=>{const m:any={running:'tw-badge-green',pending:'tw-badge-slate',completed:'tw-badge-blue'};return`<span class="tw-badge ${m[p.value]||'tw-badge-slate'}">${p.value}</span>`;}},
    {headerName:'Actions',width:110,pinned:'right',sortable:false,filter:false,cellRenderer:GridActionsComponent,cellRendererParams:{onView:(d:unknown)=>this.onAction({action:'view',data:d}),onEdit:(d:unknown)=>this.onAction({action:'edit',data:d}),onDelete:(d:unknown)=>this.onAction({action:'delete',data:d})}},
  ];
  constructor(private toast:ToastService,private fb:FormBuilder,private confirm:ConfirmationService){super();}
  ngOnInit():void{this.rows=[...this.mockData];this.form=this.fb.group({workOrder:['',Validators.required],machine:['',Validators.required],operator:['',Validators.required],priority:['normal'],plannedStart:['',Validators.required],plannedEnd:['',Validators.required],quantityAssigned:[1,Validators.required],status:['pending']});}
  openCreate():void{this.mode='create';this.form.reset({priority:'normal',status:'pending',quantityAssigned:1});this.form.enable();this.showModal=true;}
  onAction(e:{action:string;data:unknown}):void{const row=e.data as Record<string,unknown>;if(e.action==='delete'){this.confirm.confirm({message:'Delete?',header:'Confirm',icon:'pi pi-exclamation-triangle',accept:()=>{this.mockData=this.mockData.filter(x=>x.id!==row['id'] as string);this.rows=[...this.mockData];this.toast.success('Deleted');}});}else{this.selected=row;this.mode=e.action as ModalMode;this.form.patchValue(row);if(e.action==='view')this.form.disable();else this.form.enable();this.showModal=true;}}
  onSave():void{if(this.form.invalid){this.form.markAllAsTouched();return;}this.saving=true;setTimeout(()=>{const v=this.form.getRawValue();if(this.mode==='create')this.mockData.push({...v,id:Date.now().toString()});else if(this.selected){const i=this.mockData.findIndex(x=>x.id===this.selected!['id'] as string);if(i>-1)this.mockData[i]={...this.mockData[i],...v};}this.rows=[...this.mockData];this.saving=false;this.showModal=false;this.toast.success('Saved');},500);}
  close():void{this.showModal=false;this.form.enable();}
}
