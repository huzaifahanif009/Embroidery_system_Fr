export interface Tenant {
  id?: number;
  name: string;
  slug: string;
  plan: 'starter' | 'pro' | 'enterprise';
  dbSchema: string;
  isActive: boolean;
  settings?: {
    currency?: string;
    timezone?: string;
    dateFormat?: string;
    fiscalYearStart?: string;
    maxUsers?: number;
    modules?: string[];
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface RolePermission {
  module: string;
  actions: string[];
}

export interface Role {
  id?: number;
  tenantId: number;
  name: string;
  description?: string;
  permissions: RolePermission[];
  isSystem?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
export interface User {
  id?: number;
  tenantId: number;
  roleId: number;
  email: string;
  firstName: string;
  lastName: string;
  status?: 'active' | 'inactive' | 'suspended';
  createdAt?: string;
  updatedAt?: string;
}
export interface Employee {
  id?: number;
  tenantId: number;
  empCode: string;
  firstName: string;
  lastName: string;
  departmentId?: number;
  designation?: number;
  email?: string;
  phone?: string;
  joiningDate?: string | Date;
  status?: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

export interface Department {
  id?: number;
  tenantId: number;
  name: string;
  code: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Designation {
  id?: number;
  tenantId: number;
  name: string;
  code: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CompanyProfile {
  id?: number;
  tenantId: number;
  legalName: string;
  code: string;
  establishmentDate?: string | Date;
  address?: string;
  countryId?: number;
  cityId?: number;
  postalCode?: string;
  phone?: string;
  email?: string;
  website?: string;
  businessType?: number;
  fiscalYearStart?: string;
  isActive?: boolean;
}

export interface FiscalYear {
  id?: number;
  tenantId: number;
  yearCode: string;
  yearName: string;
  startDate: string | Date;
  endDate: string | Date;
  status: 'open' | 'closed';
}
export interface FiscalYearPeriod {
  id?: number;
  tenantId: number;
  fiscalYearId: number;
  periodNo: number;
  periodName: string;
  startDate: string | Date;
  endDate: string | Date;
  status: 'open' | 'closed';
}

export interface Lov {
  id?: number;
  vtype: string;
  code: string;
  name?: string;
  description?: string;
}

export interface NumberSeries {
  id?: number;
  module: string;
  prefix?: string;
  startingNo: number;
  padding: number;
  currentNo: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}