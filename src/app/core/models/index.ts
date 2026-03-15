export interface ApiResponse<T> {
  success: boolean; statusCode: number; data: T; timestamp: string; message?: string;
}
export interface PaginationMeta {
  total: number; page: number; limit: number; totalPages: number; hasNextPage: boolean; hasPrevPage: boolean;
}
export interface PaginatedResult<T> { data: T[]; meta: PaginationMeta; }
export interface User { id: string; email: string; firstName: string; lastName: string; roles: string[]; tenantId: string; }
export interface AuthResponse { accessToken: string; tokenType: string; expiresIn: string; user: User; }
export type ModalMode = 'create' | 'edit' | 'view';
export interface SelectOption { label: string; value: string | number | boolean; }
