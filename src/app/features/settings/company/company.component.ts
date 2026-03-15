import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { ToastService } from '../../../core/services/toast.service';
import { CompanyProfilesService } from '@core/services/api/company-profiles.service';
@Component({
  selector: 'erp-company', standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PageHeaderComponent],
  template: `
    <erp-page-header title="Company Profile" subtitle="Organisation identity" [showNew]="false"></erp-page-header>
    <div class="tw-card tw-p-4" style="max-width:680px">
      <form [formGroup]="form">
        <div class="tw-section-title tw-mb-3">Legal Information</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div class="tw-form-group"><label class="tw-label-field">Company Name *</label><input formControlName="companyName" class="tw-input" /></div>
          <div class="tw-form-group"><label class="tw-label-field">Trade Name</label><input formControlName="tradeName" class="tw-input" /></div>
          <div class="tw-form-group"><label class="tw-label-field">Registration No</label><input formControlName="regNumber" class="tw-input" /></div>
          <div class="tw-form-group"><label class="tw-label-field">NTN / Tax No</label><input formControlName="taxNumber" class="tw-input" /></div>
          <div class="tw-form-group" style="grid-column:1/-1"><label class="tw-label-field">Address *</label><textarea formControlName="address" class="tw-textarea"></textarea></div>
          <div class="tw-form-group"><label class="tw-label-field">Phone *</label><input formControlName="phone" class="tw-input" /></div>
          <div class="tw-form-group"><label class="tw-label-field">Email *</label><input type="email" formControlName="email" class="tw-input" /></div>
          <div class="tw-form-group"><label class="tw-label-field">Default Currency *</label><select formControlName="currency" class="tw-select"><option value="PKR">PKR – Pakistani Rupee</option><option value="USD">USD – US Dollar</option></select></div>
          <div class="tw-form-group"><label class="tw-label-field">Timezone *</label><select formControlName="timezone" class="tw-select"><option value="Asia/Karachi">Asia/Karachi (UTC+5)</option><option value="UTC">UTC</option></select></div>
        </div>
        <div class="tw-flex tw-justify-end tw-gap-2 tw-mt-4">
          <button type="button" class="tw-btn tw-btn-outline tw-btn-sm" (click)="ngOnInit()">Reset</button>
          <button type="button" class="tw-btn tw-btn-primary tw-btn-sm" [disabled]="saving" (click)="save()">
            <i class="pi" [class.pi-check]="!saving" [class.pi-spinner]="saving" [class.pi-spin]="saving" style="font-size:11px"></i>
            {{ saving ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </form>
    </div>`, styles: []
})
export class CompanyComponent implements OnInit {
  form!: FormGroup; saving = false;
  constructor(private fb: FormBuilder, private toast: ToastService, private companyService: CompanyProfilesService) { }
  ngOnInit(): void {
    this.form = this.fb.group({ companyName: ['Threadwork Studio Ltd', Validators.required], tradeName: ['Threadwork'], regNumber: ['1234567'], taxNumber: ['1234567-8'], address: ['123 Industrial Area, Karachi, Pakistan', Validators.required], phone: ['021-1234567', Validators.required], email: ['info@threadwork.pk', [Validators.required, Validators.email]], currency: ['PKR', Validators.required], timezone: ['Asia/Karachi', Validators.required] });
    this.companyService.getById(1).subscribe({
      next: (res) => {
        console.log('Company Profile', res);
        this.form.patchValue(res);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; } this.saving = true;
    this.companyService.update(1, this.form.value).subscribe({
      next: () => {
        this.saving = false;
        this.toast.success('Saved', 'Company profile updated');
      },
      error: (err) => {
        this.saving = false;
        this.toast.error('Failed', 'Failed to update company profile');
        console.error(err);
      }
    });
  }
}
