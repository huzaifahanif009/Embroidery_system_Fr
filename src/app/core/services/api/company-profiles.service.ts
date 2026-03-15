import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { CompanyProfile } from './api.models';

@Injectable({ providedIn: 'root' })
export class CompanyProfilesService extends BaseApiService<CompanyProfile> {
  protected override endpoint = 'company-profiles';
}
