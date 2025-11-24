import {
  AuthResponse,
  LoginRequest,
  SignupRequest,
  ApiError,
  ApiErrorResponse,
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

/**
 * Cliente HTTP genérico com tratamento de erro centralizado
 * Segue princípios SOLID:
 * - Single Responsibility: cada método tem uma responsabilidade
 * - Open/Closed: extensível para novos métodos
 * - Liskov Substitution: retorna tipos esperados
 * - Interface Segregation: métodos focados
 * - Dependency Inversion: configurável via env
 */
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Realiza uma requisição HTTP genérica
   * @param endpoint - URL relativa
   * @param options - Opções do fetch
   * @returns Resposta parseada
   * @throws ApiError em caso de erro
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      // Parse da resposta
      const data = await response.json().catch(() => null);

      // Tratamento de erro HTTP
      if (!response.ok) {
        this.handleError(response.status, data);
      }

      return data as T;
    } catch (error) {
      // Se for ApiError já tratado, relança
      if (ApiError.isApiError(error)) {
        throw error;
      }

      // Converte outros erros
      throw new ApiError(
        500,
        'Erro de conexão com o servidor',
        error
      );
    }
  }

  /**
   * Realiza requisição com autenticação Bearer
   * @param endpoint - URL relativa
   * @param token - JWT token
   * @param options - Opções adicionais
   * @returns Resposta parseada
   */
  private async authenticatedRequest<T>(
    endpoint: string,
    token: string,
    options: RequestInit = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });
  }

  /**
   * Trata erros HTTP e lança ApiError com mensagem apropriada
   * @param status - Status HTTP
   * @param data - Dados da resposta
   * @throws ApiError sempre
   */
  private handleError(status: number, data: any): never {
    const errorResponse = data as ApiErrorResponse;

    // Mapeamento de erros comuns
    const errorMessages: Record<number, string> = {
      400: 'Email ou senha incorretos',
      401: 'Não autenticado. Faça login novamente',
      403: 'Você não tem permissão',
      404: 'Recurso não encontrado',
      409: 'Este email já está cadastrado',
      500: 'Erro interno do servidor',
    };

    const message =
      errorResponse?.message ||
      (Array.isArray(errorResponse?.message) 
        ? errorResponse?.message?.join(', ')
        : null) ||
      errorMessages[status] ||
      'Erro desconhecido';

    throw new ApiError(status, message, data);
  }

  // ===== Métodos públicos de autenticação =====

  /**
   * Realiza login do usuário
   * @param credentials - Email e senha
   * @returns Resposta com token e dados do usuário
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  /**
   * Cria nova conta de usuário
   * @param userData - Nome, email e senha
   * @returns Resposta com usuário criado
   */
  async signup(userData: SignupRequest): Promise<any> {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  /**
   * Obtém dados do usuário autenticado
   * @param token - JWT token
   * @returns Dados do usuário
   */
  async getMe(token: string): Promise<any> {
    return this.authenticatedRequest('/auth/me', token);
  }

  /**
   * Template para adicionar novas requisições autenticadas
   * @param endpoint - URL relativa
   * @param token - JWT token
   * @param method - Método HTTP
   * @param body - Corpo da requisição
   * @returns Resposta parseada
   */
  async authenticatedCall<T>(
    endpoint: string,
    token: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: any
  ): Promise<T> {
    return this.authenticatedRequest<T>(endpoint, token, {
      method,
      body: body ? JSON.stringify(body) : undefined,
    });
  }
}

// Exporta singleton do cliente
export const apiClient = new ApiClient();

// Exporta métodos individuais para compatibilidade
export const loginRequest = (email: string, password: string) =>
  apiClient.login({ email, password });

export const signupRequest = (data: SignupRequest) =>
  apiClient.signup(data);

export const getMeRequest = (token: string) =>
  apiClient.getMe(token);

