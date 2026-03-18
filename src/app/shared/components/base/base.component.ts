import { Directive, OnDestroy, inject } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
@Directive()
export abstract class BaseComponent implements OnDestroy {
  // ── Form lifecycle hooks ──────────────────────────────────
  // Override any of these in your component — all are optional

  protected beforeDisplay(): void { }   // runs before form data is shown
  protected afterDisplay(): void { }   // runs after form data is shown

  protected beforeClear(): void { }   // runs before form is reset
  protected afterClear(): void { }   // runs after form is reset

  protected beforeSave(): void { }   // runs before save API call
  protected afterSave(): void { }   // runs after successful save
  // ── Core state ────────────────────────────────────────────
  protected destroy$ = new Subject<void>();
  loading = false;
  saving = false;

  // ── Injected services (no constructor needed) ─────────────
  private router = inject(Router);
  private messageService = inject(MessageService);

  // ── Shared data objects (mirrors reference) ───────────────
  LookupData: any = {};
  SharedData: any = {};

  // ── Loading / Saving helpers ──────────────────────────────
  protected setLoading(v: boolean) { this.loading = v; }
  protected setSaving(v: boolean) { this.saving = v; }
  // ── Grid refresh ──────────────────────────────────────────
  // Override this in your component to reload data on grid refresh
  protected loadData(): void { }

  onRefresh(): void {
    this.loadData();
  }
  // ── Navigation ────────────────────────────────────────────
  navigate(url: string): void {
    this.router.navigate([url]);
  }

  navigateWithParams(url: string, params: any): void {
    this.router.navigate([url], { queryParams: params });
  }

  // ── Toast helpers ─────────────────────────────────────────
  showSuccess(message: string, title: string = 'Success'): void {
    this.messageService.add({
      severity: 'success',
      summary: title,
      detail: message,
      life: 3000,
    });
  }

  showErrors(message: string, title: string = 'Error'): void {
    this.messageService.add({
      severity: 'error',
      summary: title,
      detail: message,
      life: 4000,
    });
  }

  showWarnings(message: string, title: string = 'Warning'): void {
    this.messageService.add({
      severity: 'warn',
      summary: title,
      detail: message,
      life: 3500,
    });
  }

  showInfo(message: string, title: string = 'Info'): void {
    this.messageService.add({
      severity: 'info',
      summary: title,
      detail: message,
      life: 3000,
    });
  }

  // ── makeDropDownData ──────────────────────────────────────
  // Converts any array into [{ value, label }] format
  makeDropDownData(
    data: any[],
    valueField: string,
    labelField: string
  ): { value: any; label: string }[] {
    return (data || []).map(x => ({
      value: x[valueField],
      label: x[labelField],
    }));
  }

  // ── Cleanup ───────────────────────────────────────────────
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}


// Usage in component

// Navigation
// this.navigate('/dashboard');
// this.navigateWithParams('/students', { classId: 5 });

// // Toasts
// this.showSuccess('Department created successfully');
// this.showErrors('Failed to save. Please try again.');
// this.showWarnings('Record already exists.');
// this.showInfo('Changes saved to draft.');

// // Convert array for dropdown
// this.branchOptions = this.makeDropDownData(
//   this.branches,    // raw array
//   'id',             // value field
//   'name'            // label field
// );

// // Shared data between parent/child
// this.SharedData['selectedBranch'] = branch;
// this.LookupData['students']       = students;


// ..........
// async onSave(): void {
//   this.beforeSave();              // hook fires first
//   this.saving = true;

//   this.service.create(val).subscribe({
//     next: () => {
//       this.saving = false;
//       this.showSuccess('Saved');
//       this.afterSave();           // hook fires after success
//     }
//   });
// }

// close(): void {
//   this.beforeClear();             // hook fires first
//   this.form.reset();
//   this.selected = null;
//   this.showModal = false;
//   this.afterClear();              // hook fires after reset
// }