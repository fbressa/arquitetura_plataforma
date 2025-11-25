import {
  AuthResponse,
  LoginRequest,
  SignupRequest,
  ApiError,
  ApiErrorResponse,
} from './types';
import { User, CreateUserRequest, UpdateUserRequest } from './types/user';

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
      
      // Garantir que headers estão corretos
      const headers = new Headers(options.headers || {});
      if (!headers.has('Content-Type') && options.body) {
        headers.set('Content-Type', 'application/json');
      }
      
      console.log('=== REQUEST DEBUG ===');
      console.log('Full URL:', url);
      console.log('Method:', options.method || 'GET');
      console.log('Headers:', Object.fromEntries(headers.entries()));
      console.log('Body:', options.body);
      console.log('Body type:', typeof options.body);
      console.log('====================');
      
      const response = await fetch(url, {
        ...options,
        headers,
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
   * Requisição autenticada com token JWT
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
    const headers = new Headers(options.headers || {});
    headers.set('Authorization', `Bearer ${token}`);
    if (!headers.has('Content-Type') && options.body) {
      headers.set('Content-Type', 'application/json');
    }
    
    return this.request<T>(endpoint, {
      ...options,
      headers,
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

  // ===== Métodos públicos de Dashboard =====

  /**
   * Obtém resumo do dashboard
   * @param token - JWT token
   * @returns Resumo com estatísticas
   */
  async getDashboardSummary(token: string): Promise<any> {
    return this.authenticatedRequest('/dashboard/summary', token);
  }

  /**
   * Obtém relatório de reembolsos com filtro opcional
   * @param token - JWT token
   * @param status - Status opcional para filtrar
   * @returns Lista de reembolsos
   */
  async getRefundsReport(token: string, status?: string): Promise<any[]> {
    const endpoint = status 
      ? `/dashboard/refunds/report?status=${status}`
      : '/dashboard/refunds/report';
    return this.authenticatedRequest(endpoint, token);
  }

  // ===== Métodos públicos de Clientes =====

  /**
   * Lista todos os clientes
   * @param token - JWT token
   * @returns Lista de clientes
   */
  async getClients(token: string): Promise<any[]> {
    return this.authenticatedRequest('/clients', token);
  }

  /**
   * Obtém um cliente por ID
   * @param token - JWT token
   * @param clientId - ID do cliente
   * @returns Dados do cliente
   */
  async getClientById(token: string, clientId: string): Promise<any> {
    return this.authenticatedRequest(`/clients/${clientId}`, token);
  }

  /**
   * Cria um novo cliente
   * @param token - JWT token
   * @param clientData - Dados do cliente
   * @returns Cliente criado
   */
  async createClient(token: string, clientData: any): Promise<any> {
    return this.authenticatedRequest('/clients', token, {
      method: 'POST',
      body: JSON.stringify(clientData),
    });
  }

  /**
   * Atualiza um cliente existente
   * @param token - JWT token
   * @param clientId - ID do cliente
   * @param clientData - Dados a atualizar
   * @returns Cliente atualizado
   */
  async updateClient(token: string, clientId: string, clientData: any): Promise<any> {
    return this.authenticatedRequest(`/clients/${clientId}`, token, {
      method: 'PUT',
      body: JSON.stringify(clientData),
    });
  }

  /**
   * Deleta um cliente
   * @param token - JWT token
   * @param clientId - ID do cliente
   * @returns Void
   */
  async deleteClient(token: string, clientId: string): Promise<void> {
    return this.authenticatedRequest(`/clients/${clientId}`, token, {
      method: 'DELETE',
    });
  }

  // ===== Métodos públicos de Reembolsos =====

  /**
   * Lista todos os reembolsos
   * @param token - JWT token
   * @returns Lista de reembolsos
   */
  async getRefunds(token: string): Promise<any[]> {
    return this.authenticatedRequest('/refunds', token);
  }

  /**
   * Obtém um reembolso por ID
   * @param token - JWT token
   * @param refundId - ID do reembolso
   * @returns Dados do reembolso
   */
  async getRefundById(token: string, refundId: string): Promise<any> {
    return this.authenticatedRequest(`/refunds/${refundId}`, token);
  }

  /**
   * Lista reembolsos de um usuário específico
   * @param token - JWT token
   * @param userId - ID do usuário
   * @returns Lista de reembolsos do usuário
   */
  async getRefundsByUserId(token: string, userId: string): Promise<any[]> {
    return this.authenticatedRequest(`/refunds/user/${userId}`, token);
  }

  /**
   * Cria um novo reembolso
   * @param token - JWT token
   * @param refundData - Dados do reembolso
   * @returns Reembolso criado
   */
  async createRefund(token: string, refundData: any): Promise<any> {
    // Garantir que amount é número
    const payload = {
      description: String(refundData.description),
      amount: Number(refundData.amount),
      userId: String(refundData.userId),
    }
    
    const bodyString = JSON.stringify(payload);
    
    console.log('=== API CLIENT DEBUG ===');
    console.log('Token:', token ? 'Present' : 'Missing');
    console.log('Endpoint: /refunds');
    console.log('Method: POST');
    console.log('Payload:', payload);
    console.log('Body string:', bodyString);
    console.log('Body length:', bodyString.length);
    console.log('Base URL:', this.baseUrl);
    console.log('Full URL:', `${this.baseUrl}/refunds`);
    console.log('=======================');
    
    return this.authenticatedRequest('/refunds', token, {
      method: 'POST',
      body: bodyString,
    });
  }

  /**
   * Atualiza um reembolso existente
   * @param token - JWT token
   * @param refundId - ID do reembolso
   * @param refundData - Dados a atualizar
   * @returns Reembolso atualizado
   */
  async updateRefund(token: string, refundId: string, refundData: any): Promise<any> {
    return this.authenticatedRequest(`/refunds/${refundId}`, token, {
      method: 'PUT',
      body: JSON.stringify(refundData),
    });
  }

  // ==================== User Management ====================

  /**
   * Lista todos os usuários
   * @param token - JWT token
   * @returns Lista de usuários
   */
  async getUsers(token: string): Promise<User[]> {
    return this.authenticatedRequest<User[]>('/users', token);
  }

  /**
   * Obtém um usuário por ID
   * @param token - JWT token
   * @param userId - ID do usuário
   * @returns Dados do usuário
   */
  async getUserById(token: string, userId: string): Promise<User> {
    return this.authenticatedRequest<User>(`/users/${userId}`, token);
  }

  /**
   * Cria um novo usuário
   * @param token - JWT token
   * @param userData - Dados do usuário
   * @returns Usuário criado
   */
  async createUser(token: string, userData: CreateUserRequest): Promise<User> {
    return this.authenticatedRequest<User>('/users', token, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  /**
   * Atualiza um usuário existente
   * @param token - JWT token
   * @param userId - ID do usuário
   * @param userData - Dados a atualizar
   * @returns Usuário atualizado
   */
  async updateUser(token: string, userId: string, userData: UpdateUserRequest): Promise<User> {
    return this.authenticatedRequest<User>(`/users/${userId}`, token, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  /**
   * Deleta um usuário
   * @param token - JWT token
   * @param userId - ID do usuário
   */
  async deleteUser(token: string, userId: string): Promise<void> {
    return this.authenticatedRequest<void>(`/users/${userId}`, token, {
      method: 'DELETE',
    });
  }

  /**
   * Deleta um reembolso
   * @param token - JWT token
   * @param refundId - ID do reembolso
   * @returns Void
   */
  async deleteRefund(token: string, refundId: string): Promise<void> {
    return this.authenticatedRequest(`/refunds/${refundId}`, token, {
      method: 'DELETE',
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

export const getDashboardSummaryRequest = (token: string) =>
  apiClient.getDashboardSummary(token);

export const getRefundsReportRequest = (token: string, status?: string) =>
  apiClient.getRefundsReport(token, status);

export const getClientsRequest = (token: string) =>
  apiClient.getClients(token);

export const getClientByIdRequest = (token: string, clientId: string) =>
  apiClient.getClientById(token, clientId);

export const createClientRequest = (token: string, clientData: any) =>
  apiClient.createClient(token, clientData);

export const updateClientRequest = (token: string, clientId: string, clientData: any) =>
  apiClient.updateClient(token, clientId, clientData);

export const deleteClientRequest = (token: string, clientId: string) =>
  apiClient.deleteClient(token, clientId);

export const getRefundsRequest = (token: string) =>
  apiClient.getRefunds(token);

export const getRefundByIdRequest = (token: string, refundId: string) =>
  apiClient.getRefundById(token, refundId);

export const getRefundsByUserIdRequest = (token: string, userId: string) =>
  apiClient.getRefundsByUserId(token, userId);

export const createRefundRequest = (token: string, refundData: any) =>
  apiClient.createRefund(token, refundData);

export const updateRefundRequest = (token: string, refundId: string, refundData: any) =>
  apiClient.updateRefund(token, refundId, refundData);

export const deleteRefundRequest = (token: string, refundId: string) =>
  apiClient.deleteRefund(token, refundId);

export const getUsersRequest = (token: string) =>
  apiClient.getUsers(token);

export const getUserByIdRequest = (token: string, userId: string) =>
  apiClient.getUserById(token, userId);

export const createUserRequest = (token: string, userData: CreateUserRequest) =>
  apiClient.createUser(token, userData);

export const updateUserRequest = (token: string, userId: string, userData: UpdateUserRequest) =>
  apiClient.updateUser(token, userId, userData);

export const deleteUserRequest = (token: string, userId: string) =>
  apiClient.deleteUser(token, userId);
