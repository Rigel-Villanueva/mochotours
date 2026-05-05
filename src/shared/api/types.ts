/**
 * Tipos genéricos para las respuestas de la API del backend.
 * Coinciden con la estructura documentada en Documentacion.txt
 */

// ── Respuestas base ─────────────────────────────────────────────────

/** Respuesta exitosa con datos */
export type ApiResponse<T> = {
  success: true;
  data: T;
};

/** Respuesta exitosa con listado paginado */
export type ApiResponsePaginated<T> = {
  success: true;
  data: T[];
  meta: PaginationMeta;
};

/** Respuesta de error genérico */
export type ApiError = {
  success: false;
  error: string;
};

/** Respuesta de error de validación (400) */
export type ApiValidationError = {
  success: false;
  errors: ValidationFieldError[];
};

// ── Paginación ──────────────────────────────────────────────────────

export type PaginationMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export type PaginationParams = {
  page?: number;
  limit?: number;
};

// ── Errores ─────────────────────────────────────────────────────────

export type ValidationFieldError = {
  field: string;
  message: string;
};

// ── Utilidad para discriminar respuestas ─────────────────────────────

export type ApiResult<T> = ApiResponse<T> | ApiError;
export type ApiResultPaginated<T> = ApiResponsePaginated<T> | ApiError;

// ── Excepciones tipadas que lanza el apiClient ──────────────────────

export class ApiException extends Error {
  status: number;
  fieldErrors?: ValidationFieldError[];

  constructor(
    message: string,
    status: number,
    fieldErrors?: ValidationFieldError[]
  ) {
    super(message);
    this.name = 'ApiException';
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}
