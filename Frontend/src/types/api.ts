export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  message?: string;
}

export interface ApiErrorPayload {
  success?: boolean;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  page: number;
  pageSize: number;
  totalItems: number;
  items: T[];
}

