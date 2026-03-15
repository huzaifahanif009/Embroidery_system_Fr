import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { Department } from './api.models';

@Injectable({ providedIn: 'root' })
export class DepartmentsService extends BaseApiService<Department> {
  protected override endpoint = 'departments';
}
