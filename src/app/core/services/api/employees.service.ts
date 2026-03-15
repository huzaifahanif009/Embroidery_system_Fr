import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { Employee } from './api.models';

@Injectable({ providedIn: 'root' })
export class EmployeesService extends BaseApiService<Employee> {
  protected override endpoint = 'employees';
}
