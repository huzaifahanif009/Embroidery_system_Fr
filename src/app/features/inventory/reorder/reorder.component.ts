import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { MockService } from '../../../shared/services/mock.service';
import { ToastService } from '../../../core/services/toast.service';
interface StockItem { id:string;sku:string;name:string;category:string;currentStock:number;reorderLevel:number;unit:string;unitCost:number; }
@Component({
  selector: 'erp-reorder',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  template: `
    <erp-page-header title="Reorder Dashboard" subtitle="Items below reorder level" [showNew]="false">
      <button class="tw-btn tw-btn-outline tw-btn-sm" (click)="generateAll()"><i class="pi pi-shopping-cart" style="font-size:11px"></i> Generate All POs</button>
    </erp-page-header>
    <div class="tw-grid-4 tw-mb-4">
      <div class="tw-stat-card" *ngFor="let s of summary">
        <div style="font-size:22px;font-weight:700;color:#2d3a2e">{{ s.value }}</div>
        <div style="font-size:12px;color:#9a9688;margin-top:2px">{{ s.label }}</div>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px">
      <div class="item-card" *ngFor="let item of lowItems" [style.borderLeftColor]="getColor(item)">
        <div class="tw-flex tw-items-center tw-justify-between tw-mb-3">
          <div>
            <div style="font-weight:600;font-size:13px">{{ item.name }}</div>
            <div class="tw-text-xs tw-text-subtle tw-mt-1">{{ item.sku }}</div>
          </div>
          <span class="tw-badge" [ngClass]="getUrgencyBadge(item)">{{ getUrgency(item) }}</span>
        </div>
        <div class="prog-wrap">
          <div class="prog-bar-bg">
            <div class="prog-bar-fill" [style.width]="getPct(item)+'%'" [style.background]="getColor(item)"></div>
          </div>
          <div class="tw-flex tw-justify-between tw-mt-1">
            <span class="tw-text-xs tw-text-muted">Stock: <strong>{{ item.currentStock }} {{ item.unit }}</strong></span>
            <span class="tw-text-xs tw-text-subtle">Min: {{ item.reorderLevel }}</span>
          </div>
        </div>
        <button class="tw-btn tw-btn-outline tw-btn-xs tw-mt-3 tw-w-full" (click)="createPO(item)"><i class="pi pi-plus" style="font-size:10px"></i> Create PO</button>
      </div>
    </div>
  `,
  styles:[`.item-card{background:white;border:1px solid #e8e6df;border-left:3px solid;border-radius:8px;padding:14px;}.prog-bar-bg{height:4px;background:#f0ede6;border-radius:2px;overflow:hidden;}.prog-bar-fill{height:100%;border-radius:2px;transition:width .4s;}`]
})
export class ReorderComponent implements OnInit {
  lowItems: StockItem[] = [];
  summary = [{label:'Critical',value:0},{label:'Low Stock Alerts',value:0},{label:'Est. Reorder Value',value:'PKR 0'},{label:'AI Suggested POs',value:0}];
  constructor(private mock:MockService,private toast:ToastService){}
  ngOnInit():void{
    this.lowItems=this.mock.stockItems.filter(i=>i.currentStock<=i.reorderLevel);
    this.summary[0].value=this.lowItems.filter(i=>i.currentStock===0).length;
    this.summary[1].value=this.lowItems.length;
    this.summary[2].value=`PKR ${this.lowItems.reduce((s,i)=>(s+(i.reorderLevel-i.currentStock)*i.unitCost),0).toLocaleString()}` as unknown as number;
    this.summary[3].value=this.lowItems.length;
  }
  getUrgency(i:StockItem):string{return i.currentStock===0?'Critical':i.currentStock<i.reorderLevel*.5?'High':'Low';}
  getColor(i:StockItem):string{{const m:Record<string,string>={Critical:'#b83232',High:'#b07d2a',Low:'#2563a8'};return m[this.getUrgency(i)]||'#94a3b8';}}
  getUrgencyBadge(i:StockItem):string{{const m:Record<string,string>={Critical:'tw-badge-red',High:'tw-badge-amber',Low:'tw-badge-blue'};return m[this.getUrgency(i)]||'tw-badge-slate';}}
  getPct(i:StockItem):number{return Math.min(100,Math.round(i.currentStock/i.reorderLevel*100));}
  createPO(i:StockItem):void{this.toast.success('Draft PO Created',i.name);}
  generateAll():void{this.toast.success('Generated',`${this.lowItems.length} draft POs created`);}
}
