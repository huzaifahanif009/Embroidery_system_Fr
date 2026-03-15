import {Component,OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule,FormBuilder,FormGroup,Validators} from '@angular/forms';
import {ColDef} from 'ag-grid-community';
import {ConfirmationService} from 'primeng/api';
import {DialogModule} from 'primeng/dialog';
import {BaseComponent} from '../../../../shared/components/base/base.component';
import {ErpGridComponent} from '../../../../shared/components/ag-grid/ag-grid.component';
import {GridActionsComponent} from '../../../../shared/components/ag-grid/grid-actions.component';
import {ModalComponent} from '../../../../shared/components/modal/modal.component';
import {PageHeaderComponent} from '../../../../shared/components/page-header/page-header.component';
import {ConfirmDialogComponent} from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import {MockService} from '../../../../shared/services/mock.service';
import {ToastService} from '../../../../core/services/toast.service';
import {ModalMode} from '../../../../core/models';
@Component({selector:'erp-customers',standalone:true,
  imports:[CommonModule,ReactiveFormsModule,ErpGridComponent,ModalComponent,PageHeaderComponent,ConfirmDialogComponent,DialogModule],
  template:`<erp-confirm></erp-confirm>
<erp-page-header title="Customers" (newClick)="openCreate()"></erp-page-header>
<erp-grid [rowData]="rows" [columnDefs]="cols" (rowAction)="onAction($event)"></erp-grid>
<erp-modal [(visible)]="showModal" [header]="modalTitle" [mode]="mode" [saving]="saving" (save)="onSave()" (cancel)="close()" width="580px">
  <form [formGroup]="form" class="fg">
    <div class="tw-form-group"><label class="tw-label-field">Code *</label><input formControlName="code" class="tw-input" [readonly]="mode==='view'" /></div>
        <div class="tw-form-group"><label class="tw-label-field">Name *</label><input formControlName="name" class="tw-input" [readonly]="mode==='view'" /></div>
        <div class="tw-form-group"><label class="tw-label-field">Contact Person</label><input formControlName="contactPerson" class="tw-input" [readonly]="mode==='view'" /></div>
        <div class="tw-form-group"><label class="tw-label-field">Phone</label><input formControlName="phone" class="tw-input" [readonly]="mode==='view'" /></div>
        <div class="tw-form-group"><label class="tw-label-field">Email</label><input formControlName="email" class="tw-input" [readonly]="mode==='view'" /></div>
        <div class="tw-form-group"><label class="tw-label-field">Payment Terms (days)</label><input type="number" formControlName="paymentTerms" class="tw-input" [readonly]="mode==='view'" /></div>
        <div class="tw-form-group"><label class="tw-label-field">Credit Limit (PKR)</label><input type="number" formControlName="creditLimit" class="tw-input" [readonly]="mode==='view'" /></div>
        <div class="tw-form-group"><label class="tw-label-field">Status</label><select formControlName="status" class="tw-select" [attr.disabled]="mode==='view'?true:null"><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
  </form>
</erp-modal>`,
  styles:['.fg{display:grid;grid-template-columns:1fr 1fr;gap:12px;}.fc{grid-column:1/-1;}']
})
export class CustomersComponent extends BaseComponent implements OnInit {
  rows:unknown[]=[]; showModal=false; mode:ModalMode='create';
  form!:FormGroup; selected:Record<string,unknown>|null=null;
  
  get modalTitle(){return ({create:'New',edit:'Edit',view:'View'} as Record<string,string>)[this.mode]+' Customers';}
  cols:ColDef[]=[{field:'code',headerName:'Code',width:110},{field:'name',headerName:'Customer',flex:1},{field:'contactPerson',headerName:'Contact',flex:1},{field:'phone',headerName:'Phone',width:140},{field:'paymentTerms',headerName:'Terms',width:90,valueFormatter:(p:any)=>`Net ${p.value}`},{field:'creditLimit',headerName:'Credit Limit',width:130,valueFormatter:(p:any)=>`PKR ${Number(p.value).toLocaleString()}`},{field:'outstanding',headerName:'Outstanding',width:130,valueFormatter:(p:any)=>`PKR ${Number(p.value).toLocaleString()}`},{field:'status',headerName:'Status',width:80,cellRenderer:(p:any)=>`<span class="tw-badge ${p.value==='active'?'tw-badge-green':'tw-badge-slate'}">${p.value}</span>`},{headerName:'Actions',width:110,pinned:'right',sortable:false,filter:false,cellRenderer:GridActionsComponent,cellRendererParams:{onView:(d:unknown)=>this.onAction({action:'view',data:d}),onEdit:(d:unknown)=>this.onAction({action:'edit',data:d}),onDelete:(d:unknown)=>this.onAction({action:'delete',data:d})}}];
  constructor(private mock:MockService,private toast:ToastService,private fb:FormBuilder,private confirm:ConfirmationService){super();}
  ngOnInit():void{
    this.rows=[...(this.mock.customers as unknown[])];
    this.form=this.fb.group({code:['',Validators.required],name:['',Validators.required],contactPerson:[''],phone:[''],email:[''],paymentTerms:[30],creditLimit:[100000],status:['active']});
  }
  openCreate():void{this.mode='create';this.form.reset();this.form.enable();this.showModal=true;}
  onAction(e:{action:string;data:unknown}):void{
    const row=e.data as Record<string,unknown>;
    if(e.action==='delete'){
      this.confirm.confirm({
        message:'Delete this record?',header:'Confirm',icon:'pi pi-exclamation-triangle',
        accept:()=>{
          (this.mock.customers as Record<string,unknown>[])=(this.mock.customers as Record<string,unknown>[]).filter(x=>x['id']!==row['id']);
          this.rows=[...(this.mock.customers as unknown[])];
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
      if(this.mode==='create') (this.mock.customers as Record<string,unknown>[]).push({...val,id:Date.now().toString()});
      else if(this.selected){
        const i=(this.mock.customers as Record<string,unknown>[]).findIndex(x=>x['id']===this.selected!['id']);
        if(i>-1) (this.mock.customers as Record<string,unknown>[])[i]={...(this.mock.customers as Record<string,unknown>[])[i],...val};
      }
      this.rows=[...(this.mock.customers as unknown[])];
      this.saving=false;this.showModal=false;this.toast.success('Saved');
    },500);
  }
  close():void{this.showModal=false;this.form.enable();}
}