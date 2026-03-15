import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { Designation } from './api.models';

@Injectable({ providedIn: 'root' })
export class DesignationsService extends BaseApiService<Designation> {
  protected override endpoint = 'designations';
}
