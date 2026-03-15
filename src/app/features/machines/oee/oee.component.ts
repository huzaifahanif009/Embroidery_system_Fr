import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
@Component({
  selector: 'erp-oee',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  template: `
    <erp-page-header title="OEE Dashboard" subtitle="Overall Equipment Effectiveness" [showNew]="false"></erp-page-header>
    <div class="tw-grid-4 tw-mb-4">
      <div class="stat-c" *ngFor="let m of metrics">
        <div class="stat-val" [style.color]="m.color">{{ m.value }}</div>
        <div class="stat-lbl">{{ m.label }}</div>
        <div class="stat-sub">{{ m.desc }}</div>
      </div>
    </div>
    <div class="tw-card tw-p-4">
      <div class="tw-section-title tw-mb-3">Machine Performance</div>
      <table class="tw-table">
        <thead><tr><th *ngFor="let h of headers">{{ h }}</th></tr></thead>
        <tbody>
          <tr *ngFor="let r of machineRows">
            <td style="color:#2d3a2e;font-weight:600">{{ r.code }}</td>
            <td>{{ r.name }}</td>
            <td><span class="tw-badge" [class.tw-badge-green]="r.status==='active'" [class.tw-badge-amber]="r.status==='maintenance'" [class.tw-badge-slate]="r.status==='idle'">{{ r.status }}</span></td>
            <td style="font-weight:600">{{ r.oee }}%</td>
            <td>{{ r.availability }}%</td>
            <td>{{ r.performance }}%</td>
            <td>{{ r.quality }}%</td>
            <td>{{ r.runHours | number }}h</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles:[`.stat-c{background:white;border:1px solid #e8e6df;border-radius:8px;padding:16px;text-align:center;box-shadow:0 1px 3px rgba(0,0,0,.04)}.stat-val{font-size:28px;font-weight:700;margin-bottom:4px}.stat-lbl{font-size:13px;font-weight:600;color:#1c2420}.stat-sub{font-size:11px;color:#9a9688;margin-top:2px}`]
})
export class OeeComponent {
  headers = ['Code','Machine','Status','OEE','Availability','Performance','Quality','Run Hrs'];
  metrics = [
    {label:'Overall OEE',value:'76.4%',color:'#2d3a2e',desc:'Plant average'},
    {label:'Availability',value:'89.2%',color:'#2d7a4f',desc:'Uptime ratio'},
    {label:'Performance',value:'85.7%',color:'#2563a8',desc:'Speed efficiency'},
    {label:'Quality Rate',value:'96.8%',color:'#c8b560',desc:'Good parts ratio'},
  ];
  machineRows = [
    {code:'EMB-001',name:'Tajima TMEF-H1504',status:'active',oee:82,availability:94,performance:88,quality:98,runHours:4250},
    {code:'EMB-002',name:'Brother PR1050X',status:'active',oee:79,availability:91,performance:86,quality:97,runHours:3100},
    {code:'EMB-003',name:'Barudan BEXT-S1501C',status:'maintenance',oee:45,availability:52,performance:88,quality:97,runHours:7800},
    {code:'CUT-001',name:'Gerber Cutter GX7000',status:'active',oee:88,availability:96,performance:92,quality:99,runHours:1200},
  ];
}
