/**
 * Tipos de autenticação e respostas da API
 * Mantém a tipagem sincronizada entre frontend e backend
 */

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface ApiErrorResponse {
  message: string;
  error?: string;
  statusCode?: number;
  details?: any;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiErrorResponse;
  isSuccess: boolean;
}

/**
 * Classe para tratamento de erros da API
 */
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }

  static isApiError(error: unknown): error is ApiError {
    return error instanceof ApiError;
  }
}
