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
  selector: 'erp-maintenance',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ErpGridComponent, ModalComponent,
    PageHeaderComponent, ConfirmDialogComponent, DialogModule],
  template: `
    <erp-confirm></erp-confirm>
    <erp-page-header title="Maintenance Calendar" (newClick)="openCreate()"></erp-page-header>
    <erp-grid [rowData]="rows" [columnDefs]="cols" (rowAction)="onAction($event)"></erp-grid>
    <erp-modal [(visible)]="showModal" [header]="mt" [mode]="mode" [saving]="saving" (save)="onSave()" (cancel)="close()">
      <form [formGroup]="form" style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div class="tw-form-group"><label class="tw-label-field">Machine *</label><select formControlName="machine" class="tw-select" [attr.disabled]="mode==='view'?true:null"><option value="EMB-001">EMB-001</option><option value="EMB-002">EMB-002</option><option value="CUT-001">CUT-001</option></select></div>
        <div class="tw-form-group"><label class="tw-label-field">Task Name *</label><input formControlName="taskName" class="tw-input" [readonly]="mode==='view'" /></div>
        <div class="tw-form-group"><label class="tw-label-field">Frequency (days)</label><input type="number" formControlName="frequencyDays" class="tw-input" [readonly]="mode==='view'" /></div>
        <div class="tw-form-group"><label class="tw-label-field">Next Due Date</label><input type="date" formControlName="nextDueDate" class="tw-input" [readonly]="mode==='view'" /></div>
        <div class="tw-form-group"><label class="tw-label-field">Assigned To</label><select formControlName="assignedTo" class="tw-select" [attr.disabled]="mode==='view'?true:null"><option value="Ali Hassan">Ali Hassan</option><option value="Ahmed Raza">Ahmed Raza</option></select></div>
        <div class="tw-form-group"><label class="tw-label-field">Status</label><select formControlName="status" class="tw-select" [attr.disabled]="mode==='view'?true:null"><option value="pending">Pending</option><option value="done">Done</option><option value="overdue">Overdue</option></select></div>
      </form>
    </erp-modal>
  `
})
export class MaintenanceComponent extends BaseComponent implements OnInit {
  rows: unknown[] = [];
  showModal = false; mode: ModalMode = 'create'; form!: FormGroup; selected: Record<string,unknown>|null = null;
  get mt() { return ({create:'New Task',edit:'Edit Task',view:'Task Details'} as Record<string,string>)[this.mode]; }
  mockData = [
    {id:'1',machine:'EMB-001',taskName:'Oil Lubrication',frequencyDays:30,nextDueDate:'2025-03-12',assignedTo:'Ali Hassan',status:'overdue'},
    {id:'2',machine:'EMB-002',taskName:'Needle Replacement',frequencyDays:7,nextDueDate:'2025-03-15',assignedTo:'Ahmed Raza',status:'pending'},
    {id:'3',machine:'CUT-001',taskName:'Blade Sharpening',frequencyDays:14,nextDueDate:'2025-03-20',assignedTo:'Ahmed Raza',status:'pending'},
  ];
  cols: ColDef[] = [
    {field:'machine',headerName:'Machine',width:110},
    {field:'taskName',headerName:'Task',flex:1},
    {field:'frequencyDays',headerName:'Every (days)',width:120},
    {field:'nextDueDate',headerName:'Next Due',width:120},
    {field:'assignedTo',headerName:'Assigned To',flex:1},
    {field:'status',headerName:'Status',width:100,cellRenderer:(p:any)=>{const m:any={done:'tw-badge-green',pending:'tw-badge-amber',overdue:'tw-badge-red'};return`<span class="tw-badge ${m[p.value]||'tw-badge-slate'}">${p.value}</span>`;}},
    {headerName:'Actions',width:110,pinned:'right',sortable:false,filter:false,cellRenderer:GridActionsComponent,cellRendererParams:{onView:(d:unknown)=>this.onAction({action:'view',data:d}),onEdit:(d:unknown)=>this.onAction({action:'edit',data:d}),onDelete:(d:unknown)=>this.onAction({action:'delete',data:d})}},
  ];
  constructor(private toast:ToastService,private fb:FormBuilder,private confirm:ConfirmationService){super();}
  ngOnInit():void{this.rows=[...this.mockData];this.form=this.fb.group({machine:['',Validators.required],taskName:['',Validators.required],frequencyDays:[30],nextDueDate:['',Validators.required],assignedTo:[''],status:['pending']});}
  openCreate():void{this.mode='create';this.form.reset({frequencyDays:30,status:'pending'});this.form.enable();this.showModal=true;}
  onAction(e:{action:string;data:unknown}):void{
    const row=e.data as Record<string,unknown>;
    if(e.action==='delete'){this.confirm.confirm({message:'Delete?',header:'Confirm',icon:'pi pi-exclamation-triangle',accept:()=>{this.mockData=this.mockData.filter(x=>x.id!==row['id'] as string);this.rows=[...this.mockData];this.toast.success('Deleted');}});
    }else{this.selected=row;this.mode=e.action as ModalMode;this.form.patchValue(row);if(e.action==='view')this.form.disable();else this.form.enable();this.showModal=true;}
  }
  onSave():void{if(this.form.invalid){this.form.markAllAsTouched();return;}this.saving=true;setTimeout(()=>{const v=this.form.getRawValue();if(this.mode==='create')this.mockData.push({...v,id:Date.now().toString()});else if(this.selected){const i=this.mockData.findIndex(x=>x.id===this.selected!['id'] as string);if(i>-1)this.mockData[i]={...this.mockData[i],...v};}this.rows=[...this.mockData];this.saving=false;this.showModal=false;this.toast.success('Saved');},500);}
  close():void{this.showModal=false;this.form.enable();}
}
