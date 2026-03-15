import {Component,OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule,FormBuilder,FormGroup,Validators} from '@angular/forms';
import {ColDef} from 'ag-grid-community';
import {ConfirmationService} from 'primeng/api';
import {DialogModule} from 'primeng/dialog';
import {BaseComponent} from '../../../shared/components/base/base.component';
import {ErpGridComponent} from '../../../shared/components/ag-grid/ag-grid.component';
import {GridActionsComponent} from '../../../shared/components/ag-grid/grid-actions.component';
import {ModalComponent} from '../../../shared/components/modal/modal.component';
import {PageHeaderComponent} from '../../../shared/components/page-header/page-header.component';
import {ConfirmDialogComponent} from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import {MockService} from '../../../shared/services/mock.service';
import {ToastService} from '../../../core/services/toast.service';
import {ModalMode} from '../../../core/models';
@Component({selector:'erp-quotations',standalone:true,
  imports:[CommonModule,ReactiveFormsModule,ErpGridComponent,ModalComponent,PageHeaderComponent,ConfirmDialogComponent,DialogModule],
  template:`<erp-confirm></erp-confirm>
<erp-page-header title="Quotations" (newClick)="openCreate()"></erp-page-header>
<erp-grid [rowData]="rows" [columnDefs]="cols" (rowAction)="onAction($event)"></erp-grid>
<erp-modal [(visible)]="showModal" [header]="modalTitle" [mode]="mode" [saving]="saving" (save)="onSave()" (cancel)="close()" width="580px">
  <form [formGroup]="form" class="fg">
    <div class="tw-form-group"><label class="tw-label-field">Customer *</label><select formControlName="customer" class="tw-select" [attr.disabled]="mode==='view'?true:null"><option *ngFor="let c of custOpts" [value]="c">{{ c }}</option></select></div>
        <div class="tw-form-group"><label class="tw-label-field">Design</label><input formControlName="design" class="tw-input" [readonly]="mode==='view'" /></div>
        <div class="tw-form-group"><label class="tw-label-field">Stitch Count (AI)</label><input type="number" formControlName="stitchCount" class="tw-input" [readonly]="mode==='view'" /></div>
        <div class="tw-form-group"><label class="tw-label-field">Quantity *</label><input type="number" formControlName="quantity" class="tw-input" [readonly]="mode==='view'" /></div>
        <div class="tw-form-group"><label class="tw-label-field">Unit Price (PKR) *</label><input type="number" formControlName="unitPrice" class="tw-input" [readonly]="mode==='view'" /></div>
        <div class="tw-form-group"><label class="tw-label-field">Valid Until</label><input type="date" formControlName="validUntil" class="tw-input" [readonly]="mode==='view'" /></div>
        <div class="tw-form-group"><label class="tw-label-field">Status</label><select formControlName="status" class="tw-select" [attr.disabled]="mode==='view'?true:null"><option value="draft">Draft</option><option value="sent">Sent</option><option value="accepted">Accepted</option><option value="rejected">Rejected</option></select></div>
  </form>
</erp-modal>`,
  styles:['.fg{display:grid;grid-template-columns:1fr 1fr;gap:12px;}.fc{grid-column:1/-1;}']
})
export class QuotationsComponent extends BaseComponent implements OnInit {
  rows:unknown[]=[]; showModal=false; mode:ModalMode='create';
  form!:FormGroup; selected:Record<string,unknown>|null=null;
  custOpts=['Al-Noor Uniforms','Royal Sports Club','Crescent School','Galaxy Corp'];
  get modalTitle(){return ({create:'New',edit:'Edit',view:'View'} as Record<string,string>)[this.mode]+' Quotations';}
  cols:ColDef[]=[{field:'quoteNumber',headerName:'Quote #',width:140,pinned:'left'},{field:'customer',headerName:'Customer',flex:1},{field:'stitchCount',headerName:'Stitches',width:100,valueFormatter:(p:any)=>Number(p.value).toLocaleString()},{field:'quantity',headerName:'Qty',width:70},{field:'totalAmount',headerName:'Total',width:130,valueFormatter:(p:any)=>`PKR ${Number(p.value).toLocaleString()}`},{field:'validUntil',headerName:'Valid Until',width:110},{field:'status',headerName:'Status',width:100,cellRenderer:(p:any)=>{const m:any={draft:'tw-badge-slate',sent:'tw-badge-amber',accepted:'tw-badge-green',rejected:'tw-badge-red',expired:'tw-badge-slate'};return`<span class="tw-badge ${m[p.value]||'tw-badge-slate'}">${p.value}</span>`;}},{headerName:'Actions',width:110,pinned:'right',sortable:false,filter:false,cellRenderer:GridActionsComponent,cellRendererParams:{onView:(d:unknown)=>this.onAction({action:'view',data:d}),onEdit:(d:unknown)=>this.onAction({action:'edit',data:d}),onDelete:(d:unknown)=>this.onAction({action:'delete',data:d})}}];
  constructor(private mock:MockService,private toast:ToastService,private fb:FormBuilder,private confirm:ConfirmationService){super();}
  ngOnInit():void{
    this.rows=[...(this.mock.quotations as unknown[])];
    this.form=this.fb.group({customer:['',Validators.required],design:[''],stitchCount:[0],quantity:[1,Validators.required],unitPrice:[0,Validators.required],validUntil:[''],status:['draft']});
  }
  openCreate():void{this.mode='create';this.form.reset();this.form.enable();this.showModal=true;}
  onAction(e:{action:string;data:unknown}):void{
    const row=e.data as Record<string,unknown>;
    if(e.action==='delete'){
      this.confirm.confirm({
        message:'Delete this record?',header:'Confirm',icon:'pi pi-exclamation-triangle',
        accept:()=>{
          (this.mock.quotations as Record<string,unknown>[])=(this.mock.quotations as Record<string,unknown>[]).filter(x=>x['id']!==row['id']);
          this.rows=[...(this.mock.quotations as unknown[])];
          this.toast.success('Deleted');
        }
      });
    } else {
      this.selected=row; this.mode=e.action as ModalMode;
      this.form.patchValue(row);
      if(e.action==='view') this.form.disable(); else this.form.enable();
      this.showModal=true;
    }
  }
  onSave():void{
    if(this.form.invalid){this.form.markAllAsTouched();return;}
    this.saving=true;
    setTimeout(()=>{
      const val=this.form.getRawValue();
      if(this.mode==='create') (this.mock.quotations as Record<string,unknown>[]).push({...val,id:Date.now().toString()});
      else if(this.selected){
        const i=(this.mock.quotations as Record<string,unknown>[]).findIndex(x=>x['id']===this.selected!['id']);
        if(i>-1) (this.mock.quotations as Record<string,unknown>[])[i]={...(this.mock.quotations as Record<string,unknown>[])[i],...val};
      }
      this.rows=[...(this.mock.quotations as unknown[])];
      this.saving=false;this.showModal=false;this.toast.success('Saved');
    },500);
  }
  close():void{this.showModal=false;this.form.enable();}
}