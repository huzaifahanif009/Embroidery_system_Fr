import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { FiscalYear } from './api.models';

@Injectable({ providedIn: 'root' })
export class FiscalYearsService extends BaseApiService<FiscalYear> {
  protected override endpoint = 'fiscal-years';
}
