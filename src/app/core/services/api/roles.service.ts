import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { Role } from './api.models';

@Injectable({ providedIn: 'root' })
export class RolesService extends BaseApiService<Role> {
  protected override endpoint = 'roles';

  // Add any role-specific endpoints here
}
