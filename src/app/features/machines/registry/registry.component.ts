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

@Component({ selector:'erp-machine-registry', standalone:true,
  imports:[CommonModule,ReactiveFormsModule,ErpGridComponent,ModalComponent,PageHeaderComponent,ConfirmDialogComponent,DialogModule],
  template:`
    <erp-confirm></erp-confirm>
    <erp-page-header title='Machine Registry' (newClick)='openCreate()'></erp-page-header>
    <erp-grid [rowData]='rows' [columnDefs]='cols' (rowAction)='onAction($event)'></erp-grid>
    <erp-modal [(visible)]='showModal' [header]='modalTitle' [mode]='mode' [saving]='saving' (save)='onSave()' (cancel)='close()' width='580px'>
      <form [formGroup]='form' class='fg'>
<div class="tw-form-group"><label class="tw-label-field">Code *</label><input formControlName="machineCode" class="tw-input" [readonly]="mode==='view'" /></div>
        <div class="tw-form-group"><label class="tw-label-field">Name *</label><input formControlName="name" class="tw-input" [readonly]="mode==='view'" /></div>
        <div class="tw-form-group"><label class="tw-label-field">Type *</label><select formControlName="type" class="tw-select" [attr.disabled]="mode==='view'?true:null"><option value="embroidery">Embroidery</option><option value="cutting">Cutting</option><option value="finishing">Finishing</option></select></div>
        <div class="tw-form-group"><label class="tw-label-field">Brand</label><input formControlName="brand" class="tw-input" [readonly]="mode==='view'" /></div>
        <div class="tw-form-group"><label class="tw-label-field">Heads</label><input type="number" formControlName="heads" class="tw-input" [readonly]="mode==='view'" /></div>
        <div class="tw-form-group"><label class="tw-label-field">Location</label><input formControlName="location" class="tw-input" [readonly]="mode==='view'" /></div>
        <div class="tw-form-group"><label class="tw-label-field">Purchase Date</label><input type="date" formControlName="purchaseDate" class="tw-input" [readonly]="mode==='view'" /></div>
        <div class="tw-form-group"><label class="tw-label-field">Warranty Expiry</label><input type="date" formControlName="warrantyExpiry" class="tw-input" [readonly]="mode==='view'" /></div>
        <div class="tw-form-group"><label class="tw-label-field">Status *</label><select formControlName="status" class="tw-select" [attr.disabled]="mode==='view'?true:null"><option value="active">Active</option><option value="maintenance">Maintenance</option><option value="idle">Idle</option><option value="retired">Retired</option></select></div>
        <div class="tw-form-group"><label class="tw-label-field">Run Hours</label><input type="number" formControlName="totalRunHours" class="tw-input" [readonly]="mode==='view'" /></div>
      </form>
    </erp-modal>
  `,
  styles:[`.fg{display:grid;grid-template-columns:1fr 1fr;gap:12px;}.fc{grid-column:1/-1;}`]
})
export class MachineRegistryComponent extends BaseComponent implements OnInit {
  rows:unknown[]=[]; showModal=false; mode:ModalMode='create';
  form!:FormGroup; selected:Record<string,unknown>|null=null;

  get modalTitle(){ return ({create:'New',edit:'Edit',view:'View'})[this.mode]+' Machine'; }
  cols:ColDef[]=[{field:'machineCode',headerName:'Code',width:100,pinned:'left'},{field:'name',headerName:'Name',flex:1,minWidth:150},{field:'type',headerName:'Type',width:110},{field:'brand',headerName:'Brand',width:100},{field:'heads',headerName:'Heads',width:70},{field:'location',headerName:'Location',width:90},{field:'totalRunHours',headerName:'Run Hrs',width:100},{field:'status',headerName:'Status',width:110,cellRenderer:(p:any)=>{const m:any={active:'tw-badge-green',maintenance:'tw-badge-amber',idle:'tw-badge-slate',retired:'tw-badge-red'};return`<span class="tw-badge ${m[p.value]||'tw-badge-slate'}">${p.value}</span>`;}},{headerName:'Actions',width:110,pinned:'right',sortable:false,filter:false,cellRenderer:GridActionsComponent,cellRendererParams:{onView:(d:unknown)=>this.onAction({action:'view',data:d}),onEdit:(d:unknown)=>this.onAction({action:'edit',data:d}),onDelete:(d:unknown)=>this.onAction({action:'delete',data:d})}}];
  constructor(private mock:MockService,private toast:ToastService,private fb:FormBuilder,private confirm:ConfirmationService){super();}
  ngOnInit():void{ this.rows=[...(this.mock.machines as unknown[])]; this.form=this.fb.group({machineCode:['',Validators.required],name:['',Validators.required],type:['embroidery'],brand:[''],heads:[1],purchaseDate:[''],warrantyExpiry:[''],location:[''],totalRunHours:[0],status:['active',Validators.required]}); }
  openCreate():void{ this.mode='create'; this.form.reset(); this.form.enable(); this.showModal=true; }
  onAction(e:{action:string;data:unknown}):void{
    const row=e.data as Record<string,unknown>;
    if(e.action==='delete'){
      this.confirm.confirm({message:'Delete this record?',header:'Confirm',icon:'pi pi-exclamation-triangle',
        accept:()=>{ (this.mock.machines as Record<string,unknown>[])=(this.mock.machines as Record<string,unknown>[]).filter(x=>x['id']!==row['id']); this.rows=[...(this.mock.machines as unknown[])]; this.toast.success('Deleted'); }
      });
    } else {
      this.selected=row; this.mode=e.action as ModalMode; this.form.patchValue(row);
      if(e.action==='view') this.form.disable(); else this.form.enable();
      this.showModal=true;
    }
  }
  onSave():void{
    if(this.form.invalid){ this.form.markAllAsTouched(); return; }
    this.saving=true;
    setTimeout(()=>{
      const val=this.form.getRawValue();
      if(this.mode==='create') (this.mock.machines as Record<string,unknown>[]).push({...val,id:Date.now().toString()});
      else if(this.selected){
        const i=(this.mock.machines as Record<string,unknown>[]).findIndex(x=>x['id']===this.selected!['id']);
        if(i>-1) (this.mock.machines as Record<string,unknown>[])[i]={...(this.mock.machines as Record<string,unknown>[])[i],...val};
      }
      this.rows=[...(this.mock.machines as unknown[])]; this.saving=false; this.showModal=false; this.toast.success('Saved');
    },500);
  }
  close():void{ this.showModal=false; this.form.enable(); }
}