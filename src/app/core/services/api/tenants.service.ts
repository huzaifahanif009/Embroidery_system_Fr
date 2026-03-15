import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { Tenant } from './api.models';

@Injectable({ providedIn: 'root' })
export class TenantsService extends BaseApiService<Tenant> {
  protected override endpoint = 'tenants';

  // Add any tenant-specific endpoints here
}
