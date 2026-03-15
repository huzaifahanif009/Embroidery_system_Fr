import { Directive, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
@Directive()
export abstract class BaseComponent implements OnDestroy {
  protected destroy$ = new Subject<void>();
  loading = false;
  saving  = false;
  protected setLoading(v: boolean) { this.loading = v; }
  protected setSaving(v: boolean)  { this.saving = v; }
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}
